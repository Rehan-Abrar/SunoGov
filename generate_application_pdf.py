"""
Generate formal application PDFs (English + Urdu) using real API data.
Uses locally downloaded Noto Nastaliq Urdu font for proper Urdu rendering.
"""
import requests
import json
import sys
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
import arabic_reshaper
from bidi.algorithm import get_display

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

# Register Urdu font from local file
FONT_PATH = Path(__file__).parent / "backend" / "data" / "NotoNastaliqUrdu.ttf"
try:
    pdfmetrics.registerFont(TTFont('NotoNastaliq', str(FONT_PATH)))
    URDU_FONT = 'NotoNastaliq'
    print(f"[OK] Urdu font loaded from {FONT_PATH.name}")
except Exception as e:
    print(f"[ERROR] Failed to load font: {e}")
    URDU_FONT = 'Helvetica'


def generate_pdf(letter_text, language, filename):
    doc = SimpleDocTemplate(
        filename, pagesize=A4,
        rightMargin=25*mm, leftMargin=25*mm,
        topMargin=25*mm, bottomMargin=25*mm
    )
    styles = getSampleStyleSheet()

    if language == "urdu":
        # Reshape Urdu text for proper RTL rendering
        lines = letter_text.split('\n')
        reshaped_lines = []
        for line in lines:
            if line.strip():  # Non-empty line
                reshaped = arabic_reshaper.reshape(line)
                bidi_text = get_display(reshaped)
                reshaped_lines.append(bidi_text)
            else:
                reshaped_lines.append('')
        formatted = '<br/>'.join(reshaped_lines)
        
        style = ParagraphStyle(
            'UrduLetter', parent=styles['Normal'],
            fontSize=13, fontName=URDU_FONT,
            textColor=colors.HexColor('#111827'),
            leading=24, alignment=TA_RIGHT, spaceAfter=4*mm
        )
    else:
        formatted = letter_text.replace('\n', '<br/>')
        style = ParagraphStyle(
            'EnglishLetter', parent=styles['Normal'],
            fontSize=11, textColor=colors.HexColor('#111827'),
            leading=16, alignment=TA_LEFT, spaceAfter=4*mm,
            fontName='Times-Roman'
        )

    doc.build([Paragraph(formatted, style)])
    size = Path(filename).stat().st_size
    print(f"[OK] {filename} ({size:,} bytes)")


def main():
    base = "http://localhost:8000"
    
    # Step 1: Classify
    print("Step 1: Classifying issue...")
    r = requests.post(f"{base}/classify", json={
        "text": "Teen din se hamari gali mein gutter ka pani khara hai, Johar Town Lahore",
        "city_hint": "Lahore"
    }, timeout=60)
    if r.status_code != 200:
        print(f"[ERROR] Classification failed: {r.status_code}")
        return
    cls = r.json()
    print(f"[OK] {cls['issue_display']} in {cls['city']} -> {cls['department']['name']}")

    payload = {
        "issue_id": cls["issue_id"],
        "city": cls["city"],
        "user_name": "Muhammad Ahmed Khan",
        "user_address": "House 45, Street 12, Johar Town, Lahore",
        "user_phone": "+92-300-1234567",
        "user_description": "Teen din se hamari gali mein gutter ka pani khara hai, Johar Town Lahore",
        "cnic": "35202-1234567-8",
        "landmark": "Near Al-Falah Park",
        "supporting_info": "This issue has been ongoing for over a week and is causing significant health hazards to residents."
    }

    # Step 2: English letter
    print("\nStep 2: Generating English application...")
    payload["language"] = "english"
    r = requests.post(f"{base}/generate-application", json=payload, timeout=120)
    if r.status_code == 200:
        data = r.json()
        generate_pdf(data["letter"], "english", "application_english.pdf")
    else:
        print(f"[ERROR] English: {r.status_code} - {r.text[:200]}")

    # Step 3: Urdu letter
    print("\nStep 3: Generating Urdu application...")
    payload["language"] = "urdu"
    r = requests.post(f"{base}/generate-application", json=payload, timeout=120)
    if r.status_code == 200:
        data = r.json()
        generate_pdf(data["letter"], "urdu", "application_urdu.pdf")
    else:
        print(f"[ERROR] Urdu: {r.status_code} - {r.text[:200]}")

    print("\n[DONE]")


if __name__ == "__main__":
    main()
