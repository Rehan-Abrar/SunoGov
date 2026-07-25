import logging

from fastapi import APIRouter, HTTPException
from openai import APITimeoutError, APIConnectionError, APIError

from services.models import (
    ClassifyRequest, ClassifyResponse, DepartmentResponse, ComplaintResponse,
    CityItem, IssueItem,
)
from services.qwen import classify_text, classify_image
from services.kb import (
    resolve, resolve_with_alias, get_department,
    get_all_issue_ids, get_all_cities, get_issues_for_city,
)
from services.complaint import generate_complaint

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/cities", response_model=list[CityItem])
async def list_cities():
    cities = get_all_cities()
    result = []
    for city_name in cities:
        issues = get_issues_for_city(city_name)
        result.append(CityItem(
            id=city_name.lower().replace(" ", "_"),
            name=city_name,
            issue_count=len(issues),
        ))
    return result


@router.get("/issues/{city}", response_model=list[IssueItem])
async def list_issues(city: str):
    issues = get_issues_for_city(city)
    if not issues:
        raise HTTPException(status_code=404, detail=f"No issues found for city '{city}'")
    return [
        IssueItem(
            issue_id=issue["issue_id"],
            display_name=issue["display_name"],
            department_id=issue["department_id"],
        )
        for issue in issues
    ]


@router.post("/classify", response_model=ClassifyResponse)
async def classify(req: ClassifyRequest):
    if not req.text and not req.image_base64:
        raise HTTPException(
            status_code=422,
            detail="Provide at least text or an image to classify.",
        )

    issue_ids = get_all_issue_ids()
    cities = get_all_cities()

    try:
        if req.image_base64:
            extraction = await classify_image(req.image_base64, req.text, issue_ids, cities)
        else:
            extraction = await classify_text(req.text, issue_ids, cities)
    except APITimeoutError:
        raise HTTPException(status_code=504, detail="AI classification timed out. Please try again.")
    except APIConnectionError:
        raise HTTPException(status_code=503, detail="AI service unavailable. Please try again later.")
    except (APIError, ValueError) as e:
        logger.error(f"Classification failed: {e}")
        raise HTTPException(status_code=500, detail="AI classification failed. Please try again.")

    issue_id = extraction.get("issue_id", "")
    qwen_city = extraction.get("city")
    city = qwen_city or req.city_hint or ""
    language = extraction.get("language", "english")
    confidence = extraction.get("confidence", 0.0)
    user_provided_city = bool(req.city_hint)

    if not issue_id or issue_id is None:
        if req.image_base64:
            detail = "This image does not appear to show a civic issue. Please upload a photo of a civic problem (e.g., pothole, broken road, garbage, water issue, etc.)."
        else:
            detail = "Could not identify a civic issue from your description. Please describe a specific civic problem (e.g., broken road, water supply, garbage collection, etc.)."
        raise HTTPException(status_code=422, detail=detail)

    if not city:
        raise HTTPException(
            status_code=422,
            detail="City could not be determined. Please provide a city_hint in the request.",
        )

    issue = resolve(city, issue_id)

    if not issue and confidence < 0.7:
        issue = resolve_with_alias(city, issue_id)

    if not issue and not user_provided_city:
        for other_city in cities:
            if other_city.lower() != city.lower():
                issue = resolve(other_city, issue_id)
                if issue:
                    city = other_city
                    break

    if not issue and not user_provided_city:
        for other_city in cities:
            issue = resolve_with_alias(other_city, issue_id)
            if issue:
                city = other_city
                break

    if not issue:
        raise HTTPException(
            status_code=404,
            detail=f"Issue '{issue_id}' not found for city '{city}'. Please verify the city or describe the issue differently.",
        )

    dept_data = get_department(issue["department_id"])
    if not dept_data:
        raise HTTPException(
            status_code=500,
            detail=f"Department '{issue['department_id']}' not found in knowledge base",
        )

    def _clean(val: str | None) -> str | None:
        if not val or val.lower().startswith("not "):
            return None
        return val

    department = DepartmentResponse(
        name=dept_data["department_name"],
        reason=issue.get("why_responsible", ""),
        portal=_clean(dept_data.get("portal_url")),
        helpline=_clean(dept_data.get("helpline")),
        emergency_helpline=_clean(dept_data.get("emergency_helpline")),
        app=_clean(dept_data.get("mobile_app")),
        email=_clean(dept_data.get("email")),
        office=_clean(dept_data.get("office_address")),
        hours=_clean(dept_data.get("working_hours")),
        whatsapp=_clean(dept_data.get("whatsapp")),
        maps_link=_clean(dept_data.get("maps_link")),
        official_website=_clean(dept_data.get("official_website")),
        verification_status=dept_data.get("verification_status"),
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
