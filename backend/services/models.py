from pydantic import BaseModel, Field


MAX_TEXT_LENGTH = 2000
MAX_IMAGE_BASE64_LENGTH = 5_000_000  # ~3.7MB raw image


class ClassifyRequest(BaseModel):
    text: str = Field(default="", max_length=MAX_TEXT_LENGTH)
    image_base64: str | None = Field(default=None, max_length=MAX_IMAGE_BASE64_LENGTH)
    city_hint: str | None = Field(default=None, max_length=100)


class DepartmentResponse(BaseModel):
    name: str
    reason: str
    portal: str | None = None
    helpline: str | None = None
    emergency_helpline: str | None = None
    app: str | None = None
    email: str | None = None
    office: str | None = None
    hours: str | None = None
    whatsapp: str | None = None
    maps_link: str | None = None
    official_website: str | None = None
    verification_status: str | None = None


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


class CityItem(BaseModel):
    id: str
    name: str
    issue_count: int


class IssueItem(BaseModel):
    issue_id: str
    display_name: str
    department_id: str
