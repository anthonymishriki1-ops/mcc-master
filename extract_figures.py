#!/usr/bin/env python3
"""
MCCQE Figure Extractor
=======================
Extracts embedded figures/images from Toronto Notes PDF.
Saves cropped figures to images/figures/
Sends each figure to Claude Vision for clinical description.
Updates image_index.json with figure data.

Usage:
    python extract_figures.py \
        --pdf "Toronto Notes 2025.pdf" \
        --key YOUR_ANTHROPIC_API_KEY

Outputs:
    images/figures/     (cropped figure PNGs)
    figure_index.json   (maps each figure to specialty/topic/description)
"""

import argparse, base64, io, json, os, re, sys, time
from pathlib import Path

def install(pkg):
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])

for pkg, imp in [("anthropic","anthropic"),("pymupdf","fitz"),("pillow","PIL"),("tqdm","tqdm")]:
    try:
        __import__(imp)
    except ImportError:
        print(f"Installing {pkg}...")
        install(pkg)

import anthropic
import fitz
from PIL import Image
from tqdm import tqdm

# ── config ────────────────────────────────────────────────────────────────────
VISION_MODEL  = "claude-sonnet-4-6"
MIN_WIDTH     = 100   # ignore tiny images (icons, bullets, logos)
MIN_HEIGHT    = 100
MAX_TOKENS    = 1000
RETRY_DELAY   = 15
MAX_RETRIES   = 3

SPECIALTIES = [
    "Cardiology","Respirology","Gastroenterology","Nephrology",
    "Hematology","Oncology","Endocrinology","Neurology",
    "Rheumatology","Infectious Disease","Dermatology",
    "Ophthalmology","Otolaryngology","Psychiatry","Obstetrics",
    "Gynecology","Pediatrics","Surgery","Orthopedics",
    "Emergency Medicine","Anesthesia","Radiology",
    "Family Medicine","Geriatrics","Pharmacology"
]

# ── helpers ───────────────────────────────────────────────────────────────────
def detect_specialty(text):
    tl = text.lower()
    for s in SPECIALTIES:
        if s.lower() in tl:
            return s
    return "General Medicine"

def img_to_b64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.standard_b64encode(buf.getvalue()).decode()

def call_vision(client, b64: str) -> dict:
    for attempt in range(MAX_RETRIES):
        try:
            r = client.messages.create(
                model=VISION_MODEL,
                max_tokens=MAX_TOKENS,
                messages=[{
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": b64
                            }
                        },
                        {
                            "type": "text",
                            "text": (
                                "This is a figure from Toronto Notes 2025 (MCCQE medical study material). "
                                "Analyze this image and respond in this exact format:\n\n"
                                "SPECIALTY: [medical specialty]\n"
                                "TOPIC: [specific topic, e.g. 'Brachial Plexus Anatomy']\n"
                                "TYPE: [anatomy diagram / clinical algorithm / drug table / flowchart / pathophysiology / other]\n"
                                "DESCRIPTION: [2-3 sentence clinical description of what this shows and its exam relevance]\n"
                                "KEY_FACTS: [3-5 bullet points of the most important MCCQE-relevant facts shown]\n\n"
                                "If this is not a clinically relevant medical figure (e.g. logo, decoration, photo of person), "
                                "respond with: NOT_CLINICAL"
                            )
                        }
                    ]
                }]
            )
            return r.content[0].text
        except anthropic.RateLimitError:
            wait = RETRY_DELAY * (attempt + 1)
            print(f"\n  Rate limit. Waiting {wait}s...")
            time.sleep(wait)
        except Exception as ex:
            print(f"\n  Vision error: {ex}")
            time.sleep(RETRY_DELAY)
    return "NOT_CLINICAL"

def parse_vision_response(text: str, page_num: int) -> dict:
    if "NOT_CLINICAL" in text:
        return None

    result = {
        "specialty": "General Medicine",
        "topic": "",
        "type": "diagram",
        "description": "",
        "key_facts": []
    }

    spec  = re.search(r"SPECIALTY:\s*(.+)", text)
    topic = re.search(r"TOPIC:\s*(.+)", text)
    typ   = re.search(r"TYPE:\s*(.+)", text)
    desc  = re.search(r"DESCRIPTION:\s*(.+?)(?=KEY_FACTS:|$)", text, re.DOTALL)
    facts = re.search(r"KEY_FACTS:\s*(.+?)$", text, re.DOTALL)

    if spec  and spec.group(1).strip() in SPECIALTIES:
        result["specialty"] = spec.group(1).strip()
    elif spec:
        result["specialty"] = detect_specialty(spec.group(1))

    if topic: result["topic"]       = topic.group(1).strip()
    if typ:   result["type"]        = typ.group(1).strip()
    if desc:  result["description"] = desc.group(1).strip()
    if facts:
        raw_facts = facts.group(1).strip()
        result["key_facts"] = [
            f.strip().lstrip("-•*").strip()
            for f in raw_facts.split("\n")
            if f.strip() and len(f.strip()) > 5
        ]

    return result

# ── main extraction ───────────────────────────────────────────────────────────
def extract_figures(pdf_path: str, client, out_dir: str = "images/figures") -> list:
    os.makedirs(out_dir, exist_ok=True)

    # Also ensure pages dir exists
    pages_dir = "images/pages"
    os.makedirs(pages_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    figure_index = []
    figure_count = 0
    skipped = 0

    print(f"  Scanning {total_pages} pages for embedded figures...")

    for page_num in tqdm(range(total_pages), desc="  Pages"):
        page = doc[page_num]

        # Save full page image to pages dir if not already there
        page_img_path = os.path.join(pages_dir, f"page_{page_num+1:04d}.png")
        if not os.path.exists(page_img_path):
            mat = fitz.Matrix(150/72, 150/72)
            pix = page.get_pixmap(matrix=mat)
            pix.save(page_img_path)

        # Get page text for context
        page_text = page.get_text()

        # Extract embedded images from this page
        image_list = page.get_images(full=True)

        for img_idx, img_info in enumerate(image_list):
            xref = img_info[0]

            try:
                base_image = doc.extract_image(xref)
                img_bytes  = base_image["image"]
                img_ext    = base_image["ext"]

                # Load and check size
                img = Image.open(io.BytesIO(img_bytes))
                w, h = img.size

                if w < MIN_WIDTH or h < MIN_HEIGHT:
                    skipped += 1
                    continue

                # Convert to PNG
                if img.mode not in ("RGB", "RGBA", "L"):
                    img = img.convert("RGB")

                # Save figure
                figure_count += 1
                fig_filename = f"fig_{page_num+1:04d}_{img_idx+1:02d}.png"
                fig_path = os.path.join(out_dir, fig_filename)
                img.save(fig_path, "PNG")

                # Vision analysis
                b64 = img_to_b64(img)
                vision_text = call_vision(client, b64)

                if "NOT_CLINICAL" in vision_text:
                    os.remove(fig_path)  # Delete non-clinical images
                    figure_count -= 1
                    skipped += 1
                    continue

                parsed = parse_vision_response(vision_text, page_num + 1)
                if not parsed:
                    os.remove(fig_path)
                    figure_count -= 1
                    skipped += 1
                    continue

                figure_index.append({
                    "figure_file": fig_filename,
                    "page_file": f"page_{page_num+1:04d}.png",
                    "page": page_num + 1,
                    "specialty": parsed["specialty"],
                    "topic": parsed["topic"],
                    "type": parsed["type"],
                    "description": parsed["description"],
                    "key_facts": parsed["key_facts"],
                    "width": w,
                    "height": h
                })

                time.sleep(0.5)

            except Exception as ex:
                print(f"\n  Error page {page_num+1} img {img_idx}: {ex}")
                continue

        # Save progress every 100 pages
        if (page_num + 1) % 100 == 0:
            with open("figure_index_partial.json", "w") as f:
                json.dump(figure_index, f, indent=2)
            print(f"\n  Progress: page {page_num+1}/{total_pages}, "
                  f"figures saved: {figure_count}, skipped: {skipped}")

    doc.close()
    return figure_index, figure_count, skipped

# ── main ──────────────────────────────────────────────────────────────────────
def main():
    p = argparse.ArgumentParser()
    p.add_argument("--pdf",    required=True, help="Toronto Notes 2025 PDF")
    p.add_argument("--key",    required=True, help="Anthropic API key")
    p.add_argument("--outdir", default="images/figures")
    args = p.parse_args()

    client = anthropic.Anthropic(api_key=args.key)

    print(f"\nExtracting figures from: {args.pdf}")
    print(f"Output: {args.outdir}/\n")

    figure_index, total_saved, total_skipped = extract_figures(
        args.pdf, client, args.outdir)

    # Save final index
    with open("figure_index.json", "w") as f:
        json.dump(figure_index, f, indent=2)

    # Also update main image_index if it exists
    if os.path.exists("image_index.json"):
        with open("image_index.json") as f:
            existing = json.load(f)
        if isinstance(existing, dict):
            existing["figures"] = figure_index
        else:
            existing = {"pages": existing, "figures": figure_index}
        with open("image_index.json", "w") as f:
            json.dump(existing, f, indent=2)
        print("  Updated image_index.json with figure data")

    print("\n" + "="*60)
    print("FIGURE EXTRACTION COMPLETE")
    print("="*60)
    print(f"Clinical figures saved: {total_saved}")
    print(f"Non-clinical skipped:   {total_skipped}")
    print(f"Figure index:           figure_index.json")
    print(f"Figures folder:         {args.outdir}/")
    print(f"Pages folder:           images/pages/")
    print(f"\nBreakdown by specialty:")

    from collections import Counter
    counts = Counter(f["specialty"] for f in figure_index)
    for spec, count in sorted(counts.items(), key=lambda x: -x[1])[:10]:
        print(f"  {spec:<25} {count:>4} figures")

    print("\nReady for Session 2.")
    print("="*60)

if __name__ == "__main__":
    main()
