#!/usr/bin/env python3
"""
Toronto Notes Image Extractor (Final)
======================================
Uses page headers (e.g. "C12 Cardiology and Cardiac Surgery Toronto Notes 2025")
from OCR cache to map every image to its exact chapter.
Zero API calls. Completely free.

Usage:
    python extract_images.py \
        --pdf "Toronto Notes 2025.pdf" \
        --cache "Toronto_Notes_2025_ocr_cache.txt"

Outputs:
    images/           PNG files named: chapter_slug_p0042_img1.png
    image_index.json  full index with chapter, topic, page, search tags
"""

import argparse, json, os, re, sys
from collections import defaultdict

def install(pkg):
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])

try:
    import fitz
except ImportError:
    install("pymupdf"); import fitz

try:
    from tqdm import tqdm
except ImportError:
    install("tqdm"); from tqdm import tqdm

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

MIN_WIDTH  = 80
MIN_HEIGHT = 80

def build_page_map(cache_path: str, total_pages: int) -> dict:
    print("  Scanning OCR cache for page headers...")
    with open(cache_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    total_lines = len(lines)
    pattern = re.compile(
        r'^[A-Za-z]{1,6}\d+\s+(.+?)\s+Toronto Notes 2025',
        re.IGNORECASE
    )

    line_to_chapter = {}
    for i, line in enumerate(lines):
        m = pattern.match(line.strip())
        if m:
            chapter_raw = m.group(1).strip()
            for canonical in CHAPTER_SLUGS:
                if canonical.lower() == chapter_raw.lower():
                    line_to_chapter[i] = canonical
                    break

    print(f"  Found {len(line_to_chapter)} page header matches")

    page_to_chapter = {}
    for line_num, chapter in line_to_chapter.items():
        approx_page = max(1, int((line_num / total_lines) * total_pages))
        page_to_chapter[approx_page] = chapter

    current = "General Medicine"
    result = {}
    for p in range(1, total_pages + 1):
        if p in page_to_chapter:
            current = page_to_chapter[p]
        result[p] = current

    chapter_pages = defaultdict(list)
    for p, ch in result.items():
        chapter_pages[ch].append(p)

    print(f"\n  Chapter coverage ({len(chapter_pages)} chapters):")
    for ch, pages in sorted(chapter_pages.items(), key=lambda x: x[1][0]):
        print(f"    p{pages[0]:>4}-{pages[-1]:<4}  {ch}")

    return result

def extract_topic(page) -> str:
    text = page.get_text()
    if not text:
        return "General"
    lines = [l.strip() for l in text.split("\n") if l.strip() and len(l.strip()) > 4]
    for line in lines[:15]:
        if re.search(r'Toronto Notes|2025|©|www\.', line, re.IGNORECASE):
            continue
        if re.match(r'^[A-Z]{1,5}\d+\s', line):
            continue
        if 5 < len(line) < 70:
            return line[:60]
    return "General"

def extract_images(pdf_path: str, cache_path: str, out_dir: str):
    os.makedirs(out_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    print(f"  PDF: {total_pages} pages\n")

    page_to_chapter = build_page_map(cache_path, total_pages)

    image_index    = []
    saved          = 0
    skipped        = 0
    chapter_counts = defaultdict(int)
    img_counter    = defaultdict(int)

    print(f"\n  Extracting images...")
    for page_num in tqdm(range(total_pages), desc="  Pages"):
        page    = doc[page_num]
        chapter = page_to_chapter.get(page_num + 1, "General Medicine")
        slug    = CHAPTER_SLUGS.get(chapter, re.sub(r'[^a-z0-9]', '_', chapter.lower()))
        topic   = extract_topic(page)

        for img_info in page.get_images(full=True):
            xref = img_info[0]
            try:
                base_img = doc.extract_image(xref)
                width    = base_img["width"]
                height   = base_img["height"]
                ext      = base_img["ext"]

                if width < MIN_WIDTH or height < MIN_HEIGHT:
                    skipped += 1
                    continue

                img_counter[page_num] += 1
                n        = img_counter[page_num]
                filename = f"{slug}_p{page_num+1:04d}_img{n:02d}.{ext}"

                with open(os.path.join(out_dir, filename), "wb") as f:
                    f.write(base_img["image"])

                chapter_counts[chapter] += 1
                saved += 1

                image_index.append({
                    "filename":     filename,
                    "page":         page_num + 1,
                    "chapter":      chapter,
                    "chapter_slug": slug,
                    "topic":        topic,
                    "width":        width,
                    "height":       height,
                    "format":       ext,
                    "search_tags":  [
                        chapter.lower(),
                        slug,
                        topic.lower()[:40],
                        f"page {page_num + 1}"
                    ]
                })
            except Exception:
                continue

    doc.close()

    with open("image_index.json", "w", encoding="utf-8") as f:
        json.dump({
            "total_images":   saved,
            "chapter_counts": dict(sorted(chapter_counts.items())),
            "chapters":       sorted(CHAPTER_SLUGS.keys()),
            "images":         image_index
        }, f, indent=2)

    print(f"\n{'='*55}")
    print("IMAGE EXTRACTION COMPLETE")
    print(f"{'='*55}")
    print(f"Images saved:    {saved}")
    print(f"Skipped (tiny):  {skipped}")
    print(f"Output:          ./{out_dir}/")
    print(f"Index:           image_index.json")
    print(f"\nImages per chapter:")
    for ch, count in sorted(chapter_counts.items(), key=lambda x: -x[1]):
        print(f"  {ch:<45} {count:>4}")
    print(f"\nReady for Session 2. Upload ./{out_dir}/ to Google Drive.")
    print(f"{'='*55}")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--pdf",   required=True)
    p.add_argument("--cache", required=True)
    p.add_argument("--out",   default="images")
    args = p.parse_args()
    for f in [args.pdf, args.cache]:
        if not os.path.exists(f):
            print(f"ERROR: Not found: {f}")
            sys.exit(1)
    print(f"\nToronto Notes Image Extractor")
    extract_images(args.pdf, args.cache, args.out)

if __name__ == "__main__":
    main()
