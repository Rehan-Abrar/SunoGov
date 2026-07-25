from fastapi import APIRouter

from services.kb import resolve_department
from services.qwen import extract_issue
from services.complaint import generate_complaint

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/classify")
async def classify(payload: dict):
    text = payload.get("text", "")
    city = payload.get("city", "")
    image_url = payload.get("image_url")

    extraction = await extract_issue(text, image_url)

    issue_id = extraction.get("issue_id", "")
    language = extraction.get("language", "en")
    confidence = extraction.get("confidence", 0)

    department = resolve_department(city, issue_id)

    complaint_ur, complaint_en = generate_complaint(
        issue_id=issue_id,
        city=city,
        department=department,
        text=text,
    )

    return {
        "issue_id": issue_id,
        "city": city,
        "language": language,
        "confidence": confidence,
        "department": department,
        "complaint_ur": complaint_ur,
        "complaint_en": complaint_en,
    }
