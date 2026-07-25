"""
Qwen-powered formal complaint letter generator.
Generates submission-ready formal applications in English.
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
        language: "english" only (Urdu support removed)
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

    prompt = _build_english_prompt(
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
            "language": "english",
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
