from fastapi import APIRouter, HTTPException

from services.models import ClassifyRequest, ClassifyResponse, DepartmentResponse, ComplaintResponse
from services.qwen import classify_text
from services.kb import resolve, resolve_with_alias, get_department
from services.complaint import generate_complaint

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/classify", response_model=ClassifyResponse)
async def classify(req: ClassifyRequest):
    extraction = await classify_text(req.text, req.image_base64)

    issue_id = extraction.get("issue_id", "")
    city = extraction.get("city", "") or req.city_hint or ""
    language = extraction.get("language", "english")
    confidence = extraction.get("confidence", 0.0)

    if not city:
        raise HTTPException(status_code=422, detail="City could not be determined. Please provide a city_hint.")

    issue = resolve(city, issue_id)

    if not issue and confidence < 0.7:
        issue = resolve_with_alias(city, issue_id)

    if not issue:
        raise HTTPException(
            status_code=404,
            detail=f"Issue '{issue_id}' not found for city '{city}'",
        )

    dept_data = get_department(issue["department_id"])
    if not dept_data:
        raise HTTPException(
            status_code=500,
            detail=f"Department '{issue['department_id']}' not found in knowledge base",
        )

    department = DepartmentResponse(
        name=dept_data["department_name"],
        reason=issue.get("why_responsible", ""),
        portal=dept_data.get("portal_url"),
        helpline=dept_data.get("helpline"),
        app=dept_data.get("mobile_app"),
        email=dept_data.get("email"),
        office=dept_data.get("office_address"),
        hours=dept_data.get("working_hours"),
    )

    complaint = generate_complaint(
        issue_display=issue["display_name"],
        city=city,
        dept_name=dept_data["department_name"],
        user_text=req.text,
    )

    return ClassifyResponse(
        issue_id=issue["issue_id"],
        issue_display=issue["display_name"],
        city=city,
        language=language,
        confidence=confidence,
        department=department,
        requirements=issue.get("required_info", []),
        priority=issue.get("emergency_priority", "Medium"),
        tracking=issue.get("tracking_available", False),
        escalation=issue.get("escalation"),
        complaint=ComplaintResponse(**complaint),
    )
