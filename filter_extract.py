#!/usr/bin/env python3
"""
filter_extract.py
=================
Step 1 (FREE):   Scan every page → label it text-only / embedded-image / drawn-figure
Step 2 (FREE):   Extract embedded images directly (no API)
Step 3 (CHEAP):  Render only the drawn-figure pages → batch through Haiku
                 (typically < 10% of pages, sent 4-per-call = very few API calls)

Usage:
    # Just scan and extract embedded (zero cost):
    python filter_extract.py --pdf "Toronto Notes 2025.pdf"

    # Full run with Haiku for drawn figures:
    python filter_extract.py --pdf "Toronto Notes 2025.pdf" --api-key sk-ant-...
"""

import argparse, base64, io, json, os, re, sys, time
from pathlib import Path
from collections import defaultdict

def _install(pkg):
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])

for _pkg, _imp in [("pymupdf","fitz"),("pillow","PIL"),("tqdm","tqdm")]:
    try: __import__(_imp)
    except ImportError: print(f"Installing {_pkg}..."); _install(_pkg)

import fitz
from PIL import Image
from tqdm import tqdm

# ── tunables ───────────────────────────────────────────────────────────────────
MIN_IMAGE_W    = 80    # px — below this = logo/bullet, ignore
MIN_IMAGE_H    = 80
DRAWING_AREA_THRESHOLD = 5_000   # pt² — min total drawing area to flag as figure page
RENDER_DPI     = 150             # for figure page rendering
HAIKU_BATCH    = 4               # images per API call
HAIKU_MODEL    = "claude-haiku-4-5"

CHAPTER_SLUGS = {
    "Ethical, Legal, and Organizational Medicine": "ethics",
    "Anesthesia":               "anesthesia",
    "Cardiology and Cardiac Surgery": "cardiology",
    "Clinical Pharmacology":    "pharmacology",
    "Dermatology":              "dermatology",
    "Emergency Medicine":       "emergency_medicine",
    "Endocrinology":            "endocrinology",
    "Family Medicine":          "family_medicine",
    "Gastroenterology":         "gastroenterology",
    "General and Thoracic Surgery": "general_surgery",
    "Geriatric Medicine":       "geriatrics",
    "Gynecology":               "gynecology",
    "Hematology":               "hematology",
    "Infectious Diseases":      "infectious_diseases",
    "Medical Genetics":         "medical_genetics",
    "Medical Imaging":          "medical_imaging",
    "Nephrology":               "nephrology",
    "Neurology":                "neurology",
    "Neurosurgery":             "neurosurgery",
    "Obstetrics":               "obstetrics",
    "Ophthalmology":            "ophthalmology",
    "Orthopedic Surgery":       "orthopedics",
    "Otolaryngology":           "otolaryngology",
    "Pediatrics":               "pediatrics",
    "Palliative Medicine":      "palliative_medicine",
    "Plastic Surgery":          "plastic_surgery",
    "Psychiatry":               "psychiatry",
    "Public Health and Preventive Medicine": "public_health",
    "Respirology":              "respirology",
    "Rheumatology":             "rheumatology",
    "Urology":                  "urology",
    "Vascular Surgery":         "vascular_surgery",
}


# ── helpers ────────────────────────────────────────────────────────────────────
def slug_for(chapter):
    return CHAPTER_SLUGS.get(chapter, re.sub(r'[^a-z0-9]', '_', chapter.lower()))

def img_to_b64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.standard_b64encode(buf.getvalue()).decode()

def page_chapter(page_map, page_num):
    return page_map.get(page_num + 1, "General Medicine")


# ── OCR cache → page-to-chapter map (reused from extract_images.py) ────────────
def build_page_map(cache_path, total_pages):
    if not cache_path or not os.path.exists(cache_path):
        return {p: "General Medicine" for p in range(1, total_pages + 1)}
    with open(cache_path, encoding="utf-8") as f:
        lines = f.readlines()
    total_lines = len(lines)
    pattern = re.compile(r'^[A-Za-z]{1,6}\d+\s+(.+?)\s+Toronto Notes 2025', re.IGNORECASE)
    line_to_ch = {}
    for i, line in enumerate(lines):
        m = pattern.match(line.strip())
        if m:
            raw = m.group(1).strip()
            for canon in CHAPTER_SLUGS:
                if canon.lower() == raw.lower():
                    line_to_ch[i] = canon
                    break
    page_to_ch = {}
    for ln, ch in line_to_ch.items():
        pg = max(1, int((ln / total_lines) * total_pages))
        page_to_ch[pg] = ch
    result, cur = {}, "General Medicine"
    for p in range(1, total_pages + 1):
        if p in page_to_ch: cur = page_to_ch[p]
        result[p] = cur
    return result


# ── Step 1: scan pages ─────────────────────────────────────────────────────────
def scan_pages(doc) -> dict:
    """
    Returns dict: page_num (0-based) → 'text' | 'embedded' | 'figure'
    """
    labels = {}
    print("  Scanning pages...")
    for i in tqdm(range(len(doc)), desc="  Scan"):
        page = doc[i]

        # Check for real embedded images
        has_real_image = False
        for img_info in page.get_images(full=True):
            xref = img_info[0]
            try:
                base = doc.extract_image(xref)
                if base["width"] >= MIN_IMAGE_W and base["height"] >= MIN_IMAGE_H:
                    has_real_image = True
                    break
            except Exception:
                continue

        if has_real_image:
            labels[i] = "embedded"
            continue

        # Check for meaningful drawing commands (vector figures)
        try:
            drawings = page.get_drawings()
            total_area = sum(
                d["rect"].width * d["rect"].height
                for d in drawings
                if d.get("rect") and d["rect"].width > 5 and d["rect"].height > 5
            )
        except Exception:
            total_area = 0

        if total_area >= DRAWING_AREA_THRESHOLD:
            labels[i] = "figure"
        else:
            labels[i] = "text"

    counts = defaultdict(int)
    for v in labels.values():
        counts[v] += 1
    print(f"\n  Page breakdown:")
    print(f"    Text-only pages  : {counts['text']:>5}")
    print(f"    Embedded images  : {counts['embedded']:>5}")
    print(f"    Drawn figures    : {counts['figure']:>5}")
    print(f"    Total            : {len(labels):>5}")
    return labels


# ── Step 2: extract embedded images (FREE) ─────────────────────────────────────
def extract_embedded_pages(doc, labels, page_map, out_dir: Path) -> list:
    embedded_pages = [i for i, t in labels.items() if t == "embedded"]
    print(f"\n  Extracting embedded images from {len(embedded_pages)} pages (free)...")
    results = []
    seen_xrefs = set()

    for i in tqdm(embedded_pages, desc="  Embedded"):
        page    = doc[i]
        chapter = page_chapter(page_map, i)
        slug    = slug_for(chapter)

        for img_info in page.get_images(full=True):
            xref = img_info[0]
            if xref in seen_xrefs:
                continue
            seen_xrefs.add(xref)
            try:
                base = doc.extract_image(xref)
                w, h = base["width"], base["height"]
                if w < MIN_IMAGE_W or h < MIN_IMAGE_H:
                    continue
                img = Image.open(io.BytesIO(base["image"]))
                if img.mode not in ("RGB", "RGBA", "L"):
                    img = img.convert("RGB")
                fname = f"{slug}_p{i+1:04d}_emb_{xref}.png"
                img.save(out_dir / fname)
                results.append({
                    "filename": fname, "page": i + 1,
                    "chapter": chapter, "source": "embedded",
                    "w": w, "h": h,
                })
            except Exception:
                continue

    print(f"  Saved {len(results)} embedded images")
    return results


# ── Step 3: render figure pages → batch Haiku (CHEAP) ─────────────────────────
def extract_figure_pages(doc, labels, page_map, out_dir: Path, api_key: str | None) -> list:
    figure_pages = [i for i, t in labels.items() if t == "figure"]
    print(f"\n  {len(figure_pages)} drawn-figure pages to process...")

    if not figure_pages:
        return []

    # Render each figure page as a cropped PNG
    rendered = []
    mat = fitz.Matrix(RENDER_DPI / 72, RENDER_DPI / 72)
    render_dir = out_dir / "_figure_renders"
    render_dir.mkdir(exist_ok=True)

    print("  Rendering figure pages...")
    for i in tqdm(figure_pages, desc="  Render"):
        page    = doc[i]
        chapter = page_chapter(page_map, i)
        slug    = slug_for(chapter)
        pix     = page.get_pixmap(matrix=mat)
        fname   = f"{slug}_p{i+1:04d}_fig.png"
        path    = render_dir / fname
        pix.save(str(path))
        rendered.append({
            "page": i + 1, "chapter": chapter, "slug": slug,
            "filename": fname, "_path": str(path),
            "w": pix.width, "h": pix.height,
        })

    if not api_key:
        # No API key — copy renders straight to output, user reviews manually
        print(f"\n  No API key — {len(rendered)} figure pages saved to {render_dir}/")
        print("  Pass --api-key to auto-classify them.")
        results = []
        for r in rendered:
            import shutil
            dest = out_dir / r["filename"]
            shutil.copy(r["_path"], dest)
            results.append({k: v for k, v in r.items() if not k.startswith("_")})
            results[-1]["source"] = "figure_page"
        return results

    # Batch classify with Haiku
    try:
        import anthropic
    except ImportError:
        _install("anthropic"); import anthropic

    client = anthropic.Anthropic(api_key=api_key)
    results = []
    api_calls = 0

    print(f"\n  Classifying with Haiku in batches of {HAIKU_BATCH}...")
    for bi in tqdm(range(0, len(rendered), HAIKU_BATCH), desc="  Haiku"):
        batch = rendered[bi:bi + HAIKU_BATCH]
        content = []
        for j, item in enumerate(batch):
            content.append({"type": "text", "text": f"Image {j+1} (page {item['page']}, {item['chapter']}):"})
            with open(item["_path"], "rb") as f:
                b64 = base64.standard_b64encode(f.read()).decode()
            content.append({
                "type": "image",
                "source": {"type": "base64", "media_type": "image/png", "data": b64}
            })
        content.append({
            "type": "text",
            "text": (
                "For each image, reply with its number and one of:\n"
                "  KEEP <type> — clinically useful (diagram/flowchart/anatomy/ECG/algorithm/table)\n"
                "  SKIP         — decorative, text-only, logo, or not medically educational\n"
                "Format: 1:KEEP flowchart  2:SKIP  3:KEEP anatomy diagram\n"
                "Be brief. Just the decisions."
            )
        })

        try:
            r = client.messages.create(
                model=HAIKU_MODEL, max_tokens=120,
                messages=[{"role": "user", "content": content}]
            )
            reply = r.content[0].text
            api_calls += 1
            for match in re.finditer(r'(\d+):(KEEP|SKIP)(?:\s+([^\n0-9]+))?', reply.upper()):
                idx  = int(match.group(1)) - 1
                keep = match.group(2) == "KEEP"
                ftype = (match.group(3) or "diagram").strip().lower()
                if 0 <= idx < len(batch):
                    item = batch[idx]
                    if keep:
                        import shutil
                        dest = out_dir / item["filename"]
                        shutil.copy(item["_path"], dest)
                        results.append({
                            "filename": item["filename"],
                            "page": item["page"],
                            "chapter": item["chapter"],
                            "source": "figure_page",
                            "type": ftype,
                            "w": item["w"], "h": item["h"],
                        })
            time.sleep(0.25)
        except Exception as ex:
            print(f"\n  Haiku error: {ex} — keeping batch as-is")
            for item in batch:
                import shutil
                dest = out_dir / item["filename"]
                shutil.copy(item["_path"], dest)
                results.append({
                    "filename": item["filename"], "page": item["page"],
                    "chapter": item["chapter"], "source": "figure_page",
                    "type": "unknown", "w": item["w"], "h": item["h"],
                })

    print(f"  {len(results)} figure pages kept | {api_calls} API calls made")
    return results


# ── main ───────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf",     required=True)
    ap.add_argument("--cache",   default=None, help="OCR cache .txt for chapter mapping")
    ap.add_argument("--out",     default="images/extracted")
    ap.add_argument("--api-key", default=None, help="Anthropic key for Haiku classification")
    ap.add_argument("--scan-only", action="store_true",
                    help="Just print page breakdown, don't extract")
    args = ap.parse_args()

    if not os.path.exists(args.pdf):
        print(f"ERROR: {args.pdf} not found"); sys.exit(1)

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    doc      = fitz.open(args.pdf)
    total_pg = len(doc)
    page_map = build_page_map(args.cache, total_pg)

    # Step 1 — scan
    labels = scan_pages(doc)

    # Save scan results
    with open("page_scan.json", "w") as f:
        json.dump({str(k+1): v for k, v in labels.items()}, f)
    print(f"\n  Page scan saved to page_scan.json")

    if args.scan_only:
        doc.close()
        return

    # Step 2 — embedded (free)
    embedded = extract_embedded_pages(doc, labels, page_map, out_dir)

    # Step 3 — figures (cheap with API, manual without)
    figures = extract_figure_pages(doc, labels, page_map, out_dir, args.api_key)

    doc.close()

    # Save index
    all_items = embedded + figures
    with open("image_index.json", "w") as f:
        json.dump({"total": len(all_items), "images": all_items}, f, indent=2)

    api_calls_est = len([i for i, t in labels.items() if t == "figure"]) // HAIKU_BATCH + 1

    print(f"\n{'='*55}")
    print(f"DONE — {len(all_items)} total images")
    print(f"  Embedded : {len(embedded)}")
    print(f"  Figures  : {len(figures)}")
    print(f"  Index    : image_index.json")
    print(f"  Output   : {out_dir}/")
    if args.api_key:
        print(f"  API calls: ~{api_calls_est} Haiku calls (fractions of a cent)")
    print(f"{'='*55}")


if __name__ == "__main__":
    main()
