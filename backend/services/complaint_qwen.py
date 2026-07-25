"""
Qwen-powered formal complaint letter generator.
Generates submission-ready formal applications in English or Urdu.
"""
import os
from openai import OpenAI
from datetime import datetime


def generate_formal_letter(
    issue_display: str,
    city: str,
    department_name: str,
    officer_title: str,
    office_address: str,
    user_name: str,
    user_address: str,
    user_phone: str,
    user_description: str,
    language: str = "english",
    additional_context: dict = None
) -> dict:
    """
    Generate a formal complaint letter using Qwen.
    
    Args:
        issue_display: The issue type (e.g., "Sewer Blockage")
        city: City name
        department_name: Department name
        officer_title: Formal officer title (e.g., "The Managing Director, WASA Lahore")
        office_address: Department office address
        user_name: Complainant's full name
        user_address: Complainant's complete address
        user_phone: Complainant's phone number
        user_description: Original user complaint text
        language: "english" or "urdu"
        additional_context: Optional dict with CNIC, landmark, previous_complaint_id, etc.
    
    Returns:
        dict with 'letter' (formatted text) and 'metadata' (for debugging)
    """
    client = OpenAI(
        api_key=os.getenv("MODELSCOPE_API_KEY"),
        base_url=os.getenv("QWEN_BASE_URL", "https://api-inference.modelscope.ai/v1")
    )
    
    model_name = os.getenv("QWEN_MODEL_NAME", "Qwen-Ambassador/Qwen3.7-Plus")
    
    # Build context from additional info
    context_parts = []
    if additional_context:
        if additional_context.get('cnic'):
            context_parts.append(f"CNIC: {additional_context['cnic']}")
        if additional_context.get('landmark'):
            context_parts.append(f"Landmark: {additional_context['landmark']}")
        if additional_context.get('previous_complaint_id'):
            context_parts.append(f"Previous Complaint ID: {additional_context['previous_complaint_id']}")
        if additional_context.get('supporting_info'):
            context_parts.append(f"Additional Information: {additional_context['supporting_info']}")
    
    context_str = "\n".join(context_parts) if context_parts else ""
    
    if language == "english":
        prompt = _build_english_prompt(
            issue_display, city, department_name, officer_title,
            office_address, user_name, user_address, user_phone,
            user_description, context_str
        )
    else:
        prompt = _build_urdu_prompt(
            issue_display, city, department_name, officer_title,
            office_address, user_name, user_address, user_phone,
            user_description, context_str
        )
    
    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are a professional government complaint letter writer for Pakistan."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=1000
    )
    
    letter_text = response.choices[0].message.content.strip()
    
    return {
        "letter": letter_text,
        "metadata": {
            "language": language,
            "issue": issue_display,
            "city": city,
            "department": department_name,
            "tokens_used": response.usage.total_tokens if response.usage else 0
        }
    }


def _build_english_prompt(
    issue_display, city, department_name, officer_title,
    office_address, user_name, user_address, user_phone,
    user_description, context_str
):
    today = datetime.now().strftime("%B %d, %Y")
    
    prompt = f"""Write a formal complaint letter to a government department in Pakistan.

RECIPIENT:
{officer_title}
{office_address}

FROM:
{user_name}
{user_address}
Phone: {user_phone}

ISSUE DETAILS:
- Issue Type: {issue_display}
- City: {city}
- Department: {department_name}

USER'S ORIGINAL COMPLAINT:
{user_description}

{f'ADDITIONAL CONTEXT:\n{context_str}\n' if context_str else ''}

INSTRUCTIONS:
1. Use formal government letter format with:
   - From address block (top left)
   - Date (today: {today})
   - To address block (officer title and department address)
   - Subject line starting with "Subject: Complaint Regarding..."
   - Salutation: "Respected Sir/Madam,"
   - Professional body (3-4 paragraphs)
   - Closing: "Yours faithfully,"
   - Signature block with name, address, phone

2. The letter must be:
   - Submission-ready (no placeholders, no "[Your Name]")
   - Professional and respectful tone
   - Specific and detailed based on the user's complaint
   - Requesting immediate action
   - Mentioning any inconvenience caused

3. Do NOT include:
   - Classification metadata (confidence, issue_id, etc.)
   - Department contact info (helpline, portal, etc.)
   - Required documents list
   - Any headers or titles like "Formal Complaint"

Write ONLY the letter text, nothing else. Make it ready to print and submit to the government office."""

    return prompt


def _build_urdu_prompt(
    issue_display, city, department_name, officer_title,
    office_address, user_name, user_address, user_phone,
    user_description, context_str
):
    today = datetime.now().strftime("%d %B %Y")
    
    # Translate officer title to Urdu
    urdu_officer_title = _translate_officer_title_to_urdu(officer_title)
    
    prompt = f"""پاکستان کے ایک سرکاری محکمے کو رسمی شکایتی خط لکھیں۔

وصول کنندہ:
{urdu_officer_title}
{office_address}

بھیجنے والا:
{user_name}
{user_address}
فون: {user_phone}

مسئلے کی تفصیلات:
- مسئلے کی قسم: {issue_display}
- شہر: {city}
- محکمہ: {department_name}

صارف کی اصل شکایت:
{user_description}

{f'اضافی معلومات:\n{context_str}\n' if context_str else ''}

ہدایات:
1. رسمی سرکاری خط کی شکل استعمال کریں:
   - بھیجنے والے کا پتہ (اوپر بائیں)
   - تاریخ (آج: {today})
   - وصول کنندہ کا پتہ (افسر کا عہدہ اور محکمے کا پتہ)
   - عنوان: "عنوان: ... کے حوالے سے شکایت"
   - سلام: "محترم جناب/مدام،"
   - پیشہ ورانہ متن (3-4 پیراگراف)
   - اختتام: "آپ کا/کی مخلص،"
   - دستخط بلاک: نام، پتہ، فون

2. خط ہونا چاہیے:
   - جمع کرانے کے لیے تیار (کوئی خالی جگہ نہیں، کوئی "[آپ کا نام]" نہیں)
   - پیشہ ورانہ اور باادب لہجہ
   - صارف کی شکایت کی بنیاد پر مخصوص اور تفصیلی
   - فوری کارروائی کی درخواست
   - ہونے والی تکلیف کا ذکر

3. شامل نہ کریں:
   - درجہ بندی کی میٹا ڈیٹا (confidence، issue_id، وغیرہ)
   - محکمے کی رابطہ معلومات (ہیلپ لائن، پورٹل، وغیرہ)
   - مطلوبہ دستاویزات کی فہرست
   - کوئی ہیڈر یا ٹائٹل جیسے "رسمی شکایت"

صرف خط کا متن لکھیں، کچھ اور نہیں۔ اسے پرنٹ کر کے سرکاری دفتر میں جمع کرانے کے لیے تیار کریں۔

اہم: خط مکمل طور پر اردو میں ہونا چاہیے (نستعلیق رسم الخط)، دائیں سے بائیں (RTL) فارمیٹنگ کے لیے موزوں۔"""

    return prompt


def _translate_officer_title_to_urdu(english_title: str) -> str:
    """
    Translate common officer titles to Urdu.
    This is a simple mapping for common titles.
    """
    translations = {
        "The Managing Director": "منیجنگ ڈائریکٹر",
        "The Chief Executive Officer": "چیف ایگزیکٹو آفیسر",
        "The Director General": "ڈائریکٹر جنرل",
        "The Chairman": "چیئرمین",
        "The Secretary": "سیکرٹری",
        "The Administrator": "ایڈمنسٹریٹر",
        "The Chief Officer": "چیف آفیسر",
    }
    
    urdu_title = english_title
    for eng, urdu in translations.items():
        if eng in english_title:
            urdu_title = urdu_title.replace(eng, urdu)
    
    return urdu_title
