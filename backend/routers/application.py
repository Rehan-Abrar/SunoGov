"""
Endpoint for generating formal application letters.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.complaint_qwen import generate_formal_letter
from services.kb import resolve, get_department

router = APIRouter()


class ApplicationRequest(BaseModel):
    issue_id: str
    city: str
    user_name: str
    user_address: str
    user_phone: str
    user_description: str
    language: str = "english"  # "english" or "urdu"
    cnic: Optional[str] = None
    landmark: Optional[str] = None
    previous_complaint_id: Optional[str] = None
    supporting_info: Optional[str] = None


class ApplicationResponse(BaseModel):
    letter: str
    metadata: dict


@router.post("/generate-application", response_model=ApplicationResponse)
async def generate_application(request: ApplicationRequest):
    """
    Generate a formal complaint letter ready for submission.
    
    This endpoint:
    1. Looks up the department and officer title from KB
    2. Calls Qwen to generate a professional formal letter
    3. Returns the formatted letter text
    """
    
    # Validate language
    if request.language not in ["english", "urdu"]:
        raise HTTPException(
            status_code=400,
            detail="Language must be 'english' or 'urdu'"
        )
    
    # Look up issue in KB
    issue_data = resolve(request.city, request.issue_id)
    if not issue_data:
        raise HTTPException(
            status_code=404,
            detail=f"Issue '{request.issue_id}' not found for city '{request.city}'"
        )
    
    # Get department info
    dept_id = issue_data.get("department_id")
    if not dept_id:
        raise HTTPException(
            status_code=500,
            detail="Issue data missing department_id"
        )
    
    dept_data = get_department(dept_id)
    if not dept_data:
        raise HTTPException(
            status_code=500,
            detail=f"Department '{dept_id}' not found in knowledge base"
        )
    
    # Extract required fields
    issue_display = issue_data.get("display_name", request.issue_id)
    department_name = dept_data.get("name", "")
    officer_title = dept_data.get("officer_title", "")
    office_address = dept_data.get("office_address", "")
    
    # Fallback if officer_title not found
    if not officer_title:
        officer_title = f"The Head of Department, {department_name}"
    
    # Build additional context
    additional_context = {}
    if request.cnic:
        additional_context["cnic"] = request.cnic
    if request.landmark:
        additional_context["landmark"] = request.landmark
    if request.previous_complaint_id:
        additional_context["previous_complaint_id"] = request.previous_complaint_id
    if request.supporting_info:
        additional_context["supporting_info"] = request.supporting_info
    
    # Generate letter using Qwen
    try:
        result = generate_formal_letter(
            issue_display=issue_display,
            city=request.city,
            department_name=department_name,
            officer_title=officer_title,
            office_address=office_address,
            user_name=request.user_name,
            user_address=request.user_address,
            user_phone=request.user_phone,
            user_description=request.user_description,
            language=request.language,
            additional_context=additional_context if additional_context else None
        )
        
        return ApplicationResponse(
            letter=result["letter"],
            metadata=result["metadata"]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate application letter: {str(e)}"
        )
