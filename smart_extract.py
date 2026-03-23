#!/usr/bin/env python3
"""
Smart Toronto Notes Extractor
==============================
Extracts embedded images, vector diagrams, AND tables from PDF.
Zero API calls for extraction. Optional cheap batch Haiku pass
only for images that can't be auto-classified.

Phases (all FREE unless --api-key passed):
  1. Embedded raster images        → PyMuPDF get_images()
  2. Vector/drawn diagrams         → PyMuPDF drawing cluster detection
  3. Tables                        → pdfplumber find_tables()
  4. Smart auto-filter             → size, color, text-proximity heuristics
  5. [Optional] Batch Haiku classify → only for truly ambiguous images,
                                       4 images per API call, claude-haiku

Usage:
  # Free extraction only (no classification):
  python smart_extract.py --pdf "Toronto Notes 2025.pdf" --cache ocr_cache.txt

  # With cheap batch classification for ambiguous images:
  python smart_extract.py --pdf "Toronto Notes 2025.pdf" --cache ocr_cache.txt \\
      --api-key sk-ant-... --classify-ambiguous

  # Skip already-processed pages (resume):
  python smart_extract.py --pdf "..." --cache "..." --resume
"""

import argparse, base64, hashlib, io, json, os, re, sys, time
from collections import defaultdict
from pathlib import Path

# ── auto-install deps ──────────────────────────────────────────────────────────
def _install(pkg):
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])

for _pkg, _imp in [
    ("pymupdf", "fitz"), ("pillow", "PIL"), ("pdfplumber", "pdfplumber"),
    ("tqdm", "tqdm"), ("imagehash", "imagehash"), ("numpy", "numpy")
]:
    try:
        __import__(_imp)
    except ImportError:
        print(f"Installing {_pkg}...")
        _install(_pkg)

import fitz
import pdfplumber
import numpy as np
from PIL import Image
import imagehash
from tqdm import tqdm

# ── config ─────────────────────────────────────────────────────────────────────
MIN_W, MIN_H        = 90, 90         # skip tiny images (icons, bullets)
MIN_DIAGRAM_AREA    = 8_000          # px² — min area to keep a diagram crop
TABLE_PADDING       = 6              # px padding around table crop
RENDER_DPI          = 150            # page render DPI for diagram detection
DEDUP_THRESHOLD     = 8              # perceptual hash distance for duplicates
HAIKU_BATCH_SIZE    = 4              # images per API call when classifying
HAIKU_MODEL         = "claude-haiku-4-5"

CHAPTER_SLUGS = {
    "Ethical, Legal, and Organizational Medicine": "ethics",
    "Anesthesia":                                  "anesthesia",
    "Cardiology and Cardiac Surgery":              "cardiology",
    "Clinical Pharmacology":                       "pharmacology",
    "Dermatology":                                 "dermatology",
    "Emergency Medicine":                          "emergency_medicine",
    "Endocrinology":                               "endocrinology",
    "Family Medicine":                             "family_medicine",
    "Gastroenterology":                            "gastroenterology",
    "General and Thoracic Surgery":                "general_surgery",
    "Geriatric Medicine":                          "geriatrics",
    "Gynecology":                                  "gynecology",
    "Hematology":                                  "hematology",
    "Infectious Diseases":                         "infectious_diseases",
    "Medical Genetics":                            "medical_genetics",
    "Medical Imaging":                             "medical_imaging",
    "Nephrology":                                  "nephrology",
    "Neurology":                                   "neurology",
    "Neurosurgery":                                "neurosurgery",
    "Obstetrics":                                  "obstetrics",
    "Ophthalmology":                               "ophthalmology",
    "Orthopedic Surgery":                          "orthopedics",
    "Otolaryngology":                              "otolaryngology",
    "Pediatrics":                                  "pediatrics",
    "Palliative Medicine":                         "palliative_medicine",
    "Plastic Surgery":                             "plastic_surgery",
    "Psychiatry":                                  "psychiatry",
    "Public Health and Preventive Medicine":       "public_health",
    "Respirology":                                 "respirology",
    "Rheumatology":                                "rheumatology",
    "Urology":                                     "urology",
    "Vascular Surgery":                            "vascular_surgery",
}

# Keywords that suggest a nearby region is clinically important
CLINICAL_KEYWORDS = re.compile(
    r'\b(figure|fig\.|table|algorithm|diagram|pathway|flowchart|anatomy|'
    r'ecg|ekg|x-ray|xray|mri|ct scan|ultrasound|biopsy|histology|'
    r'classification|criteria|scoring|management|treatment|differential)\b',
    re.IGNORECASE
)

DECORATIVE_PATTERNS = re.compile(
    r'toronto notes|2025|copyright|©|\bwww\.|all rights reserved',
    re.IGNORECASE
)


# ── OCR page→chapter map ───────────────────────────────────────────────────────
def build_page_map(cache_path: str, total_pages: int) -> dict:
    print("  Mapping pages to chapters via OCR cache...")
    with open(cache_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    total_lines = len(lines)

    pattern = re.compile(r'^[A-Za-z]{1,6}\d+\s+(.+?)\s+Toronto Notes 2025', re.IGNORECASE)
    line_to_chapter = {}
    for i, line in enumerate(lines):
        m = pattern.match(line.strip())
        if m:
            raw = m.group(1).strip()
            for canonical in CHAPTER_SLUGS:
                if canonical.lower() == raw.lower():
                    line_to_chapter[i] = canonical
                    break

    page_to_chapter = {}
    for ln, ch in line_to_chapter.items():
        pg = max(1, int((ln / total_lines) * total_pages))
        page_to_chapter[pg] = ch

    result, current = {}, "General Medicine"
    for p in range(1, total_pages + 1):
        if p in page_to_chapter:
            current = page_to_chapter[p]
        result[p] = current

    counts = defaultdict(int)
    for ch in result.values():
        counts[ch] += 1
    print(f"  {len(counts)} chapters mapped across {total_pages} pages")
    return result


# ── deduplication ──────────────────────────────────────────────────────────────
class DedupTracker:
    def __init__(self):
        self.hashes = []

    def is_duplicate(self, img: Image.Image) -> bool:
        h = imagehash.phash(img)
        for seen in self.hashes:
            if abs(h - seen) <= DEDUP_THRESHOLD:
                return True
        self.hashes.append(h)
        return False


# ── smart classifier (no API) ──────────────────────────────────────────────────
def auto_classify(img: Image.Image, nearby_text: str, w: int, h: int) -> str:
    """
    Returns 'keep', 'skip', or 'ambiguous'.
    Free — no API calls.
    """
    area = w * h

    # Always skip tiny images
    if w < MIN_W or h < MIN_H:
        return 'skip'

    # Definitely skip if text nearby screams decorative
    if DECORATIVE_PATTERNS.search(nearby_text[:200]):
        return 'skip'

    # Definitely keep if text explicitly references figure/table
    if CLINICAL_KEYWORDS.search(nearby_text[:500]):
        return 'keep'

    # Large images are almost certainly clinical content
    if area > 250_000:
        return 'keep'

    # Analyse image colour profile
    try:
        arr = np.array(img.convert("RGB"))
        mean_brightness = arr.mean()
        unique_colors = len(set(map(tuple, arr.reshape(-1, 3).tolist()[::50])))

        # Very white image with some variation → likely a diagram or algorithm
        if mean_brightness > 220 and unique_colors > 10:
            return 'keep' if area > 30_000 else 'ambiguous'

        # Colourful image → likely a clinical photo or diagram
        if unique_colors > 80:
            return 'keep'

        # Mostly one colour (e.g. solid grey box) → decorative
        if unique_colors < 5:
            return 'skip'

    except Exception:
        pass

    if area > 60_000:
        return 'keep'
    if area > 20_000:
        return 'ambiguous'
    return 'skip'


def nearby_text_for_image(page, rect) -> str:
    """Get page text within 100 units of an image rect."""
    try:
        expand = fitz.Rect(
            rect.x0 - 100, rect.y0 - 100,
            rect.x1 + 100, rect.y1 + 100
        )
        return page.get_textbox(expand)
    except Exception:
        return page.get_text()[:400]


# ── Phase 1: embedded raster images ───────────────────────────────────────────
def extract_embedded(doc, page_num: int, page, slug: str,
                     out_dir: Path, dedup: DedupTracker) -> list:
    results = []
    seen_xrefs = set()

    for img_info in page.get_images(full=True):
        xref = img_info[0]
        if xref in seen_xrefs:
            continue
        seen_xrefs.add(xref)

        try:
            base = doc.extract_image(xref)
            img_bytes = base["image"]
            w, h = base["width"], base["height"]

            if w < MIN_W or h < MIN_H:
                continue

            img = Image.open(io.BytesIO(img_bytes))
            if img.mode not in ("RGB", "RGBA", "L"):
                img = img.convert("RGB")

            if dedup.is_duplicate(img):
                continue

            # Get position rect to fetch nearby text
            rects = page.get_image_rects(xref)
            rect = rects[0] if rects else fitz.Rect(0, 0, w, h)
            nearby = nearby_text_for_image(page, rect)

            decision = auto_classify(img, nearby, w, h)
            if decision == 'skip':
                continue

            fname = f"{slug}_p{page_num+1:04d}_emb_{xref}.png"
            img.save(out_dir / fname)

            results.append({
                "filename": fname,
                "page": page_num + 1,
                "source": "embedded",
                "w": w, "h": h,
                "decision": decision,
                "nearby_text": nearby[:200],
            })
        except Exception:
            continue

    return results


# ── Phase 2: vector / drawn diagram regions ────────────────────────────────────
def extract_drawings(page_num: int, page, slug: str,
                     out_dir: Path, dedup: DedupTracker) -> list:
    """
    Cluster drawing commands by proximity → render each cluster as a cropped PNG.
    No API. Works for ECG traces, flowcharts, anatomy line art, etc.
    """
    results = []
    try:
        drawings = page.get_drawings()
    except Exception:
        return results

    if not drawings:
        return results

    # Collect all drawing bounding boxes
    rects = []
    for d in drawings:
        r = d.get("rect")
        if r and r.width > 5 and r.height > 5:
            rects.append(r)

    if not rects:
        return results

    # Cluster rects that are within 30 units of each other
    clusters = []
    for r in rects:
        merged = False
        for cl in clusters:
            # Check if r is close to any rect in the cluster
            for cr in cl:
                if (abs(r.x0 - cr.x1) < 30 or abs(r.x1 - cr.x0) < 30 or
                        abs(r.y0 - cr.y1) < 30 or abs(r.y1 - cr.y0) < 30):
                    cl.append(r)
                    merged = True
                    break
            if merged:
                break
        if not merged:
            clusters.append([r])

    # For each cluster, compute bounding box + render crop
    mat = fitz.Matrix(RENDER_DPI / 72, RENDER_DPI / 72)
    page_pix = None  # lazy render

    for ci, cluster in enumerate(clusters):
        x0 = min(r.x0 for r in cluster) - 4
        y0 = min(r.y0 for r in cluster) - 4
        x1 = max(r.x1 for r in cluster) + 4
        y1 = max(r.y1 for r in cluster) + 4
        area_pts = (x1 - x0) * (y1 - y0)

        if area_pts < MIN_DIAGRAM_AREA:
            continue

        # Render full page once
        if page_pix is None:
            page_pix = page.get_pixmap(matrix=mat)

        # Scale bbox to rendered resolution
        scale = RENDER_DPI / 72
        rx0, ry0 = int(x0 * scale), int(y0 * scale)
        rx1, ry1 = int(x1 * scale), int(y1 * scale)
        rx0, ry0 = max(0, rx0), max(0, ry0)
        rx1, ry1 = min(page_pix.width, rx1), min(page_pix.height, ry1)

        if rx1 - rx0 < 40 or ry1 - ry0 < 40:
            continue

        # Crop from rendered page
        img_arr = np.frombuffer(page_pix.samples, dtype=np.uint8).reshape(
            page_pix.height, page_pix.width, page_pix.n
        )
        crop = img_arr[ry0:ry1, rx0:rx1]
        if crop.size == 0:
            continue

        img = Image.fromarray(crop[:, :, :3] if crop.shape[2] >= 3 else crop)
        w, h = img.size

        if dedup.is_duplicate(img):
            continue

        nearby = nearby_text_for_image(page, fitz.Rect(x0, y0, x1, y1))
        decision = auto_classify(img, nearby, w, h)
        if decision == 'skip':
            continue

        fname = f"{slug}_p{page_num+1:04d}_draw_{ci+1:02d}.png"
        img.save(out_dir / fname)

        results.append({
            "filename": fname,
            "page": page_num + 1,
            "source": "vector_drawing",
            "w": w, "h": h,
            "decision": decision,
            "nearby_text": nearby[:200],
        })

    return results


# ── Phase 3: tables ────────────────────────────────────────────────────────────
def extract_tables(pdf_path: str, page_num: int, page, slug: str,
                   out_dir: Path, dedup: DedupTracker) -> list:
    results = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            if page_num >= len(pdf.pages):
                return results
            pl_page = pdf.pages[page_num]
            tables = pl_page.find_tables()

            for ti, table in enumerate(tables):
                bbox = table.bbox  # (x0, y0, x1, y1) in pdfplumber coords
                if not bbox:
                    continue
                bx0, by0, bx1, by1 = bbox
                bx0 = max(0, bx0 - TABLE_PADDING)
                by0 = max(0, by0 - TABLE_PADDING)
                bx1 = bx1 + TABLE_PADDING
                by1 = by1 + TABLE_PADDING

                # Render crop via PyMuPDF at high DPI
                clip = fitz.Rect(bx0, by0, bx1, by1)
                mat = fitz.Matrix(RENDER_DPI / 72, RENDER_DPI / 72)
                pix = page.get_pixmap(matrix=mat, clip=clip)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                w, h = img.size

                if w < MIN_W or h < MIN_H:
                    continue
                if dedup.is_duplicate(img):
                    continue

                fname = f"{slug}_p{page_num+1:04d}_table_{ti+1:02d}.png"
                img.save(out_dir / fname)

                # Also extract raw table data as JSON
                raw_data = table.extract()

                results.append({
                    "filename": fname,
                    "page": page_num + 1,
                    "source": "table",
                    "w": w, "h": h,
                    "decision": "keep",  # tables always keep
                    "table_data": raw_data,
                    "nearby_text": "",
                })
    except Exception as ex:
        pass  # pdfplumber fails gracefully

    return results


# ── Phase 4 (optional): batch Haiku classification ────────────────────────────
def batch_classify_haiku(items: list, api_key: str) -> dict:
    """
    Classify ambiguous images in batches of HAIKU_BATCH_SIZE.
    Returns {filename: 'keep'|'skip'}.
    """
    if not items:
        return {}

    try:
        import anthropic
    except ImportError:
        _install("anthropic")
        import anthropic

    client = anthropic.Anthropic(api_key=api_key)
    results = {}

    def img_b64(path):
        with open(path, "rb") as f:
            return base64.standard_b64encode(f.read()).decode()

    prompt = (
        "For each image below, respond with just its number and KEEP or SKIP.\n"
        "KEEP = clinically useful medical content (diagram, flowchart, anatomy, table, ECG, imaging).\n"
        "SKIP = decorative, logo, photo of a person, or not medically educational.\n"
        "Format: 1:KEEP  2:SKIP  3:KEEP  etc."
    )

    for i in range(0, len(items), HAIKU_BATCH_SIZE):
        batch = items[i:i + HAIKU_BATCH_SIZE]
        content = []
        for j, item in enumerate(batch):
            content.append({"type": "text", "text": f"Image {j+1}:"})
            content.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": img_b64(item["_path"])
                }
            })
        content.append({"type": "text", "text": prompt})

        try:
            r = client.messages.create(
                model=HAIKU_MODEL,
                max_tokens=80,
                messages=[{"role": "user", "content": content}]
            )
            reply = r.content[0].text
            for match in re.finditer(r'(\d+):(KEEP|SKIP)', reply.upper()):
                idx = int(match.group(1)) - 1
                if 0 <= idx < len(batch):
                    results[batch[idx]["filename"]] = match.group(2).lower()
            time.sleep(0.3)
        except Exception as ex:
            print(f"\n  Haiku error: {ex}")
            for item in batch:
                results[item["filename"]] = "keep"  # keep on error

    return results


# ── main ───────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf",                  required=True)
    ap.add_argument("--cache",                required=True,
                    help="OCR cache .txt file")
    ap.add_argument("--out",                  default="images/extracted")
    ap.add_argument("--api-key",              default=None,
                    help="Anthropic key (only needed with --classify-ambiguous)")
    ap.add_argument("--classify-ambiguous",   action="store_true",
                    help="Use Haiku to classify ambiguous images (small fee)")
    ap.add_argument("--resume",               action="store_true",
                    help="Skip pages already in index")
    ap.add_argument("--no-tables",            action="store_true")
    ap.add_argument("--no-drawings",          action="store_true")
    args = ap.parse_args()

    for f in [args.pdf, args.cache]:
        if not os.path.exists(f):
            print(f"ERROR: not found: {f}")
            sys.exit(1)

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    index_path = Path("image_index.json")
    existing_pages = set()
    all_entries = []

    if args.resume and index_path.exists():
        with open(index_path) as f:
            prev = json.load(f)
        all_entries = prev.get("images", [])
        existing_pages = {e["page"] for e in all_entries}
        print(f"  Resuming — {len(existing_pages)} pages already processed")

    doc      = fitz.open(args.pdf)
    total_pg = len(doc)
    page_map = build_page_map(args.cache, total_pg)
    dedup    = DedupTracker()
    ambiguous = []

    counts = defaultdict(int)
    print(f"\n  Processing {total_pg} pages...\n")

    for page_num in tqdm(range(total_pg), desc="  Pages"):
        if page_num + 1 in existing_pages:
            continue

        page    = doc[page_num]
        chapter = page_map.get(page_num + 1, "General Medicine")
        slug    = CHAPTER_SLUGS.get(chapter,
                      re.sub(r'[^a-z0-9]', '_', chapter.lower()))

        page_entries = []

        # Phase 1 — embedded raster images
        page_entries += extract_embedded(doc, page_num, page, slug, out_dir, dedup)

        # Phase 2 — vector drawings
        if not args.no_drawings:
            page_entries += extract_drawings(page_num, page, slug, out_dir, dedup)

        # Phase 3 — tables
        if not args.no_tables:
            page_entries += extract_tables(args.pdf, page_num, page, slug, out_dir, dedup)

        for e in page_entries:
            e["chapter"] = chapter
            e["chapter_slug"] = slug
            if e["decision"] == "keep":
                counts[chapter] += 1
                all_entries.append(e)
            elif e["decision"] == "ambiguous":
                e["_path"] = str(out_dir / e["filename"])
                ambiguous.append(e)

        # Save partial every 50 pages
        if (page_num + 1) % 50 == 0:
            _save_index(index_path, all_entries)

    doc.close()

    # Phase 4 — batch Haiku for ambiguous (optional)
    if ambiguous:
        if args.classify_ambiguous and args.api_key:
            print(f"\n  Classifying {len(ambiguous)} ambiguous images "
                  f"({len(ambiguous)//HAIKU_BATCH_SIZE + 1} API calls)...")
            decisions = batch_classify_haiku(ambiguous, args.api_key)
            for e in ambiguous:
                d = decisions.get(e["filename"], "keep")
                if d == "keep":
                    e.pop("_path", None)
                    counts[e["chapter"]] += 1
                    all_entries.append(e)
                else:
                    try:
                        os.remove(out_dir / e["filename"])
                    except Exception:
                        pass
        else:
            # No API — keep ambiguous images (better to over-include)
            print(f"\n  {len(ambiguous)} ambiguous images kept "
                  f"(pass --classify-ambiguous --api-key to filter)")
            for e in ambiguous:
                e.pop("_path", None)
                counts[e["chapter"]] += 1
                all_entries.append(e)

    _save_index(index_path, all_entries)

    # Summary
    total = len(all_entries)
    tables = sum(1 for e in all_entries if e["source"] == "table")
    drawings = sum(1 for e in all_entries if e["source"] == "vector_drawing")
    embedded = sum(1 for e in all_entries if e["source"] == "embedded")

    print(f"\n{'='*60}")
    print(f"EXTRACTION COMPLETE  —  {total} items")
    print(f"{'='*60}")
    print(f"  Embedded images : {embedded}")
    print(f"  Vector diagrams : {drawings}")
    print(f"  Tables          : {tables}")
    print(f"  API calls made  : {'0 (free run)' if not args.classify_ambiguous else str(len(ambiguous)//HAIKU_BATCH_SIZE + 1)}")
    print(f"  Output          : {out_dir}/")
    print(f"  Index           : {index_path}")
    print(f"\nTop chapters:")
    for ch, n in sorted(counts.items(), key=lambda x: -x[1])[:12]:
        print(f"  {ch:<45} {n:>4}")
    print(f"{'='*60}")


def _save_index(path: Path, entries: list):
    clean = [{k: v for k, v in e.items() if not k.startswith("_")}
             for e in entries]
    with open(path, "w", encoding="utf-8") as f:
        json.dump({
            "total": len(clean),
            "images": clean
        }, f, indent=2)


if __name__ == "__main__":
    main()
