"""
Generate formal application PDFs using ReportLab (English only).
Fast and clean PDF generation for demo.
"""
import requests
import json
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_LEFT


def generate_pdf(letter_text, filename):
    """Generate PDF from letter text using ReportLab (English only)."""
    
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        rightMargin=1*inch,
        leftMargin=1*inch,
        topMargin=1*inch,
        bottomMargin=1*inch
    )
    
    # Define styles
    styles = getSampleStyleSheet()
    letter_style = ParagraphStyle(
        'LetterStyle',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=11,
        leading=16,
        alignment=TA_LEFT,
        spaceAfter=6
    )
    
    # Convert newlines to paragraph breaks
    paragraphs = letter_text.split('\n\n')
    elements = []
    
    for para in paragraphs:
        if para.strip():
            # Handle single newlines within paragraphs
            para_with_breaks = para.replace('\n', '<br/>')
            elements.append(Paragraph(para_with_breaks, letter_style))
            elements.append(Spacer(1, 0.2*inch))
    
    # Build PDF
    doc.build(elements)
    
    size = Path(filename).stat().st_size
    print(f"[OK] {filename} ({size:,} bytes)")


def main():
    """Test PDF generation with sample data."""
    API_URL = "http://localhost:8000"
    
    # Test data
    test_payload = {
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
    
    print("Testing application generation...")
    try:
        response = requests.post(
            f"{API_URL}/generate-application",
            json=test_payload,
            timeout=60
        )
        response.raise_for_status()
        data = response.json()
        letter_text = data.get('letter', '')
        
        if not letter_text:
            print("[ERROR] No letter in response")
            return
        
        print(f"[OK] Generated letter ({len(letter_text)} chars)")
        print("\nGenerating PDF...")
        generate_pdf(letter_text, 'application.pdf')
        
    except Exception as e:
        print(f"[ERROR] Generation failed: {e}")
    
    print("\n[DONE] PDF generation complete")


if __name__ == "__main__":
    main()
