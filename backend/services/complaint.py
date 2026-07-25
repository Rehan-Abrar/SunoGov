import os
from openai import OpenAI
from datetime import datetime


def generate_complaint(issue_display: str, city: str, dept_name: str, user_text: str) -> dict:
    """Generate extensive complaint letters using Qwen AI."""
    client = OpenAI(
        api_key=os.getenv("MODELSCOPE_API_KEY"),
        base_url=os.getenv("QWEN_BASE_URL", "https://api-inference.modelscope.ai/v1")
    )
    model_name = os.getenv("QWEN_MODEL_NAME", "Qwen-Ambassador/Qwen3.7-Plus")
    today = datetime.now().strftime("%B %d, %Y")

    prompt = f"""Write TWO extensive, submission-ready formal complaint letters for a government department in Pakistan.

ISSUE DETAILS:
- Issue Type: {issue_display}
- City: {city}
- Department: {dept_name}

CITIZEN'S COMPLAINT:
{user_text}

DATE: {today}

INSTRUCTIONS:
Generate TWO complete letters (English and Urdu) that are:
1. EXTENSIVE and DETAILED (minimum 400 words each)
2. Professional government letter format
3. Include specific details from the citizen's complaint
4. Elaborate on the impact and urgency
5. Request concrete action steps

ENGLISH LETTER FORMAT:
- From: [Citizen Name], [Address], {city}
- Date: {today}
- To: The concerned officer, {dept_name}
- Subject: Detailed Complaint Regarding {issue_display}
- Salutation: Respected Sir/Madam,
- Body (4-5 paragraphs):
  * Introduction: State purpose and background
  * Detailed description of the issue with specific facts
  * Impact on daily life, health, safety, or community
  * Previous attempts to resolve (if any)
  * Specific requests and expected timeline
- Closing: Request immediate attention and follow-up
- Signature: Yours faithfully, [Citizen Name]

URDU LETTER FORMAT (اردو):
- From: [شہری کا نام]، [پتہ]، {city}
- Date: {today}
- To: متعلقہ افسر، {dept_name}
- Subject: {issue_display} کے حوالے سے تفصیلی شکایت
- Salutation: محترم جناب/مدام،
- Body (4-5 paragraphs in formal Urdu):
  * تعارف: مقصد اور پس منظر
  * مسئلے کی تفصیل اور حقائق
  * روزمرہ زندگی، صحت، حفاظت پر اثرات
  * حل کی کوششیں (اگر کوئی ہوں)
  * مخصوص درخواستیں اور متوقع ٹائم لائن
- Closing: فوری توجہ اور کارروائی کی درخواست
- Signature: آپ کا مخلص، [شہری کا نام]

IMPORTANT:
- Make both letters EXTENSIVE (400+ words each)
- Use formal, respectful language
- Include specific details from the complaint
- Elaborate on consequences if not addressed
- Request specific action steps with timeline
- No placeholders except [Citizen Name] and [Address]
- Both letters must be ready to print and submit

OUTPUT FORMAT (exactly this, no markdown):
---ENGLISH---
[Full English letter here]

---URDU---
[Full Urdu letter here]"""

    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": "You are a professional government complaint letter writer for Pakistan. Write extensive, detailed, submission-ready letters."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )

        content = response.choices[0].message.content.strip()

        # Parse English and Urdu sections
        english = ""
        urdu = ""

        if "---ENGLISH---" in content and "---URDU---" in content:
            parts = content.split("---URDU---")
            english = parts[0].replace("---ENGLISH---", "").strip()
            urdu = parts[1].strip()
        else:
            # Fallback: return full content as both
            english = content
            urdu = content

        return {"urdu": urdu, "english": english}

    except Exception as e:
        # Fallback to simple template if AI fails
        english = (
            f"Subject: Complaint Regarding {issue_display}\n\n"
            f"Respected Sir/Madam,\n\n"
            f"I am a resident of {city} and wish to report an issue related to "
            f"{issue_display.lower()}. {user_text}\n\n"
            f"I request the {dept_name} to kindly look into this matter and take "
            f"appropriate action at the earliest.\n\n"
            f"Thank you for your attention.\n\n"
            f"Yours sincerely,\n"
            f"[Your Name]\n"
            f"[Your Contact Information]"
        )

        urdu = (
            f"عنوان: {issue_display} سے متعلق شکایت\n\n"
            f"محترم جناب/مدام،\n\n"
            f"میں {city} کا/کی رہائشی ہوں اور {issue_display} "
            f"سے متعلق ایک مسئلے کی اطلاع دینا چاہتا/چاہتی ہوں۔ {user_text}\n\n"
            f"میں {dept_name} سے درخواست کرتا/کرتی ہوں کہ براہ کرم اس معاملے "
            f"کی تحقیقات کریں اور جلد از جلد مناسب کارروائی فرمائیں۔\n\n"
            f"آپ کی توجہ کا شکریہ۔\n\n"
            f"آپ کا/کی مخلص،\n"
            f"[آپ کا نام]\n"
            f"[آپ کی رابطہ معلومات]"
        )

        return {"urdu": urdu, "english": english}
