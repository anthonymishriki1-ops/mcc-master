"""
Classify Toronto Notes page images: text-only vs contains-diagrams/figures/tables.
V3 - Crops out headers/footers to avoid false positives from colored section bars.
     Better detection of small figures (ECG tracings, small diagrams).
"""

import cv2
import numpy as np
import json
from pathlib import Path

IMAGES_DIR = Path(r"C:\Users\antho\Desktop\MCC\images")

def analyze_page(image_path):
    """Detect actual visual content vs text, ignoring headers/footers."""
    img = cv2.imread(str(image_path))
    if img is None:
        return None

    h, w = img.shape[:2]

    # Crop out top 10% (headers) and bottom 5% (footers/page numbers)
    top_crop = int(h * 0.10)
    bot_crop = int(h * 0.05)
    img = img[top_crop:h - bot_crop, :, :]
    h, w = img.shape[:2]
    total_pixels = h * w

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    sat = hsv[:, :, 1]
    val = hsv[:, :, 2]

    # === 1. COLORED CONTENT (blocks + lines) ===
    # Colored = saturated, not too dark or bright
    color_mask = (sat > 50) & (val > 40) & (val < 245)
    total_color_pixels = np.sum(color_mask)
    raw_color_ratio = total_color_pixels / total_pixels

    # Find connected colored regions (blocks)
    color_u8 = (color_mask * 255).astype(np.uint8)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (8, 8))
    color_dilated = cv2.dilate(color_u8, kernel, iterations=2)
    contours, _ = cv2.findContours(color_dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    color_block_area = 0
    color_block_count = 0
    min_block = total_pixels * 0.003  # 0.3% of page (catches small figures)

    for c in contours:
        area = cv2.contourArea(c)
        if area > min_block:
            x, y, cw, ch = cv2.boundingRect(c)
            # Skip if it spans full width and is very thin (colored divider line)
            if cw > w * 0.85 and ch < 20:
                continue
            roi_color = color_mask[y:y+ch, x:x+cw]
            actual_density = np.sum(roi_color) / max(cw * ch, 1)
            if actual_density > 0.03:
                color_block_area += area
                color_block_count += 1

    color_block_ratio = color_block_area / total_pixels

    # === 2. SMOOTH/GRADIENT REGIONS (photos, drawings, shaded areas) ===
    block_size = 24
    smooth_blocks = 0
    content_blocks = 0

    for by in range(0, h - block_size, block_size):
        for bx in range(0, w - block_size, block_size):
            block = gray[by:by+block_size, bx:bx+block_size]
            mean_val = np.mean(block)
            if mean_val > 248:  # whitespace
                continue
            content_blocks += 1
            std_val = np.std(block)
            if 5 < std_val < 35 and mean_val < 230:
                smooth_blocks += 1

    smooth_ratio = smooth_blocks / max(content_blocks, 1)

    # === 3. TABLE/FIGURE BORDER DETECTION ===
    _, binary = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY_INV)
    h_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (80, 1))
    v_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 80))
    h_lines = cv2.morphologyEx(binary, cv2.MORPH_OPEN, h_kernel)
    v_lines = cv2.morphologyEx(binary, cv2.MORPH_OPEN, v_kernel)
    lines_combined = cv2.add(h_lines, v_lines)

    line_contours, _ = cv2.findContours(lines_combined, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    box_count = 0
    for c in line_contours:
        area = cv2.contourArea(c)
        if area > total_pixels * 0.01:
            x, y, cw, ch = cv2.boundingRect(c)
            if cw > 60 and ch > 60:
                box_count += 1

    # === 4. MID-TONE CONTENT ===
    mid_tone = (gray > 60) & (gray < 210)
    mid_tone_ratio = np.sum(mid_tone) / total_pixels

    return {
        'raw_color_ratio': round(raw_color_ratio, 4),
        'color_block_ratio': round(color_block_ratio, 4),
        'color_block_count': color_block_count,
        'smooth_ratio': round(smooth_ratio, 4),
        'box_count': box_count,
        'mid_tone_ratio': round(mid_tone_ratio, 4),
    }


def classify(features):
    if features is None:
        return False, 0, ['unreadable']

    score = 0
    reasons = []

    # Color blocks (strong signal for diagrams after header removal)
    if features['color_block_ratio'] > 0.015:
        score += 4
        reasons.append(f"color_blocks={features['color_block_ratio']:.3f}({features['color_block_count']})")
    elif features['color_block_ratio'] > 0.005:
        score += 2
        reasons.append(f"some_color={features['color_block_ratio']:.3f}({features['color_block_count']})")

    # Raw color ratio catches thin colored lines (ECG tracings etc)
    if features['raw_color_ratio'] > 0.01 and features['color_block_count'] >= 1:
        score += 1
        reasons.append(f"color_spread={features['raw_color_ratio']:.3f}")

    # Smooth regions (photos, drawings)
    if features['smooth_ratio'] > 0.12:
        score += 3
        reasons.append(f"smooth={features['smooth_ratio']:.3f}")
    elif features['smooth_ratio'] > 0.06:
        score += 1
        reasons.append(f"some_smooth={features['smooth_ratio']:.3f}")

    # Bordered boxes (tables, figures)
    if features['box_count'] >= 2:
        score += 2
        reasons.append(f"boxes={features['box_count']}")
    elif features['box_count'] >= 1:
        score += 1
        reasons.append(f"box={features['box_count']}")

    # Mid-tone (images)
    if features['mid_tone_ratio'] > 0.08:
        score += 2
        reasons.append(f"midtone={features['mid_tone_ratio']:.3f}")

    has_diagram = score >= 4
    confidence = min(score / 10.0, 1.0)
    return has_diagram, confidence, reasons


def main():
    image_files = sorted(IMAGES_DIR.glob("*.png"))
    total = len(image_files)
    print(f"Analyzing {total} pages (v3 - header/footer cropped)...")

    results = {'total': total, 'has_diagram': 0, 'text_only': 0, 'pages': []}

    for i, img_path in enumerate(image_files):
        if (i + 1) % 100 == 0 or i == 0:
            print(f"  [{i+1}/{total}] {img_path.name}")

        features = analyze_page(img_path)
        has_diagram, confidence, reasons = classify(features)
        results['pages'].append({
            'filename': img_path.name,
            'has_diagram': has_diagram,
            'confidence': round(confidence, 2),
            'reasons': reasons,
            'features': features
        })
        if has_diagram:
            results['has_diagram'] += 1
        else:
            results['text_only'] += 1

    output_file = Path(r"C:\Users\antho\Desktop\MCC\page_classification_v3.json")
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)

    print(f"\nResults:")
    print(f"  Diagram pages: {results['has_diagram']}")
    print(f"  Text only:     {results['text_only']}")
    print(f"  Saved: {output_file}")

    # Verify known pages
    known = {
        'cardiology_p0086_img01.png': 'DIAGRAM (ACLS flowchart)',
        'cardiology_p0100_img01.png': 'DIAGRAM (ECG tracings)',
        'cardiology_p0090_img01.png': 'TEXT (references)',
        'anesthesia_p0053_img01.png': 'TEXT (references)',
        'cardiology_p0106_img01.png': 'TEXT (bullet points)',
        'anesthesia_p0050_img01.png': 'TEXT (colored header, text body)',
        'urology_p1565_img01.png': 'TEXT (colored header, text body)',
    }

    print(f"\nValidation against known pages:")
    for fname, expected in known.items():
        p = next((x for x in results['pages'] if x['filename'] == fname), None)
        if p:
            result = 'DIAGRAM' if p['has_diagram'] else 'TEXT'
            match = 'OK' if expected.startswith(result) else 'WRONG'
            print(f"  {match} {fname}: classified={result} conf={p['confidence']} expected={expected}")
            print(f"       {p['reasons']}")

    # Distribution
    from collections import Counter
    conf_dist = Counter()
    for p in results['pages']:
        bucket = round(p['confidence'] * 5) / 5
        conf_dist[bucket] += 1
    print(f"\nConfidence distribution:")
    for k in sorted(conf_dist.keys()):
        bar = '#' * (conf_dist[k] // 10)
        label = 'KEEP' if k >= 0.4 else 'SKIP'
        print(f"  {k:.1f}: {conf_dist[k]:>5}  {bar}  [{label}]")


if __name__ == '__main__':
    main()
