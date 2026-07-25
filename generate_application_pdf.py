"""
Generate formal application PDFs using xhtml2pdf.
Proper RTL support for Urdu text with Noto Nastaliq Urdu font.
"""
import requests
import json
from pathlib import Path
from xhtml2pdf import pisa

FONT_PATH = Path(__file__).parent / "backend" / "data" / "NotoNastaliqUrdu.ttf"

ENGLISH_HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Times New Roman; font-size: 11pt; line-height: 1.6; color: #111827;">
    <div style="margin: 2.5cm;">
        {letter_content}
    </div>
</body>
</html>
"""

URDU_HTML_TEMPLATE = """
<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: 'Noto Nastaliq Urdu', serif; font-size: 13pt; line-height: 2.0; color: #111827; direction: rtl; text-align: right;">
    <div style="margin: 2.5cm;">
        {letter_content}
    </div>
</body>
</html>
"""


def generate_pdf(letter_text, language, filename):
    """Generate PDF from letter text using xhtml2pdf."""
    
    # Convert newlines to proper HTML line breaks
    letter_content = letter_text.replace('\n', '<br/>')
    
    # Select template based on language
    if language == 'urdu':
        html_content = URDU_HTML_TEMPLATE.format(letter_content=letter_content)
    else:
        html_content = ENGLISH_HTML_TEMPLATE.format(letter_content=letter_content)
    
    # Generate PDF using xhtml2pdf
    with open(filename, 'wb') as output_file:
        pisa_status = pisa.CreatePDF(html_content, dest=output_file)
    
    if pisa_status.err:
        print(f"[ERROR] PDF generation failed for {filename}")
        return False
    
    size = Path(filename).stat().st_size
    print(f"[OK] {filename} ({size:,} bytes)")
    return True


def main():
    """Test PDF generation with sample data."""
    API_URL = "http://localhost:8000"
    
    # Test data for Urdu
    test_payload_urdu = {
        "issue_id": "sewer_blockage",
        "city": "Lahore",
        "user_name": "محمد احمد خان",
        "user_address": "مکان نمبر 45، گلی نمبر 12، جوہر ٹاؤن، لاہور",
        "user_phone": "+92-300-1234567",
        "user_description": "تین دن سے ہماری گلی میں گٹر کا پانی کھڑا ہے",
        "language": "urdu",
        "cnic": "35202-1234567-8",
        "landmark": "الفلاح پارک کے قریب",
        "previous_complaint_id": "",
        "supporting_info": "یہ مسئلہ ایک ہفتے سے زیادہ عرصے سے جاری ہے"
    }
    
    # Test data for English
    test_payload_english = {
        "issue_id": "sewer_blockage",
        "city": "Lahore",
        "user_name": "Muhammad Ahmed Khan",
        "user_address": "House 45, Street 12, Johar Town, Lahore",
        "user_phone": "+92-300-1234567",
        "user_description": "There has been standing sewer water in our street for three days",
        "language": "english",
        "cnic": "35202-1234567-8",
        "landmark": "Near Al-Falah Park",
        "previous_complaint_id": "",
        "supporting_info": "This issue has been ongoing for over a week"
    }
    
    print("Testing Urdu application generation...")
    try:
        response = requests.post(
            f"{API_URL}/generate-application",
            json=test_payload_urdu,
            timeout=120
        )
        response.raise_for_status()
        data = response.json()
        letter_text = data.get('letter', '')
        
        if not letter_text:
            print("[ERROR] No letter in response")
            return
        
        print(f"[OK] Generated Urdu letter ({len(letter_text)} chars)")
        print("\nGenerating Urdu PDF...")
        generate_pdf(letter_text, 'urdu', 'application_urdu.pdf')
        
    except Exception as e:
        print(f"[ERROR] Urdu generation failed: {e}")
    
    print("\n" + "="*60)
    print("Testing English application generation...")
    try:
        response = requests.post(
            f"{API_URL}/generate-application",
            json=test_payload_english,
            timeout=120
        )
        response.raise_for_status()
        data = response.json()
        letter_text = data.get('letter', '')
        
        if not letter_text:
            print("[ERROR] No letter in response")
            return
        
        print(f"[OK] Generated English letter ({len(letter_text)} chars)")
        print("\nGenerating English PDF...")
        generate_pdf(letter_text, 'english', 'application_english.pdf')
        
    except Exception as e:
        print(f"[ERROR] English generation failed: {e}")
    
    print("\n[DONE] PDF generation complete")


if __name__ == "__main__":
    main()
