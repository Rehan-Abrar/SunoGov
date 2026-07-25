from pydantic import BaseModel, Field


class ClassifyRequest(BaseModel):
    text: str = ""
    image_base64: str | None = None
    city_hint: str | None = None


class DepartmentResponse(BaseModel):
    name: str
    reason: str
    portal: str | None = None
    helpline: str | None = None
    app: str | None = None
    email: str | None = None
    office: str | None = None
    hours: str | None = None


class ComplaintResponse(BaseModel):
    urdu: str
    english: str


class ClassifyResponse(BaseModel):
    issue_id: str
    issue_display: str
    city: str
    language: str = Field(default="english")
    confidence: float = Field(ge=0.0, le=1.0)
    department: DepartmentResponse
    requirements: list[str] = Field(default_factory=list)
    priority: str = "Medium"
    tracking: bool = False
    escalation: str | None = None
    complaint: ComplaintResponse
