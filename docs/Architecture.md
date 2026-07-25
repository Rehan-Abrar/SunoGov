# Architecture — SunoGov
**AI-Powered Civic Navigator for Pakistan**

---

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion |
| Backend | FastAPI (Python 3.11+) |
| AI | Qwen (text), Qwen Vision (image) via cloud API |
| Voice | Web Speech API (browser-native, free) |
| PDF | react-pdf or browser print CSS |
| Knowledge Base | Static JSON files (departments, issues, aliases) |
| Deployment | Vercel (frontend), Railway or Render (backend) |

---

## 2. System Architecture

```
User (Browser)
     │
     ├── Text Input
     ├── Voice Input (Web Speech API → text)
     └── Image Input (base64 upload)
     │
     ▼
Next.js Frontend
     │
     └── POST /api/classify
          │
          ▼
     FastAPI Backend
          │
          ├── Step 1: Qwen API Call
          │   Input: user text/image
          │   Output: { issue_id, city, language, confidence }
          │
          ├── Step 2: Alias Fallback (if confidence < 0.7)
          │   aliases.json fuzzy match → issue_id
          │
          ├── Step 3: Deterministic Routing
          │   issues.json lookup: (city, issue_id) → issue object
          │   departments.json lookup: department_id → dept object
          │
          ├── Step 4: Complaint Generation
          │   Template fill → Qwen rewrite (optional, language-aware)
          │
          └── Step 5: Return unified response JSON
               │
               ▼
          Next.js renders:
          - Reasoning Card
          - Submission Hub
          - Complaint (Urdu + English)
          - PDF download
```

---

## 3. Knowledge Base Structure

```
/data
  departments.json   # All department contact details, keyed by department_id
  issues.json        # City → [issues], each with department_id reference
  aliases.json       # issue_id → [English, Urdu, Roman Urdu synonyms]
```

### Lookup Pattern (Python)
```python
# Preloaded at startup
lookup = {}
for city, issues in issues_data.items():
    for issue in issues:
        lookup[(city, issue["issue_id"])] = issue

# O(1) at request time
issue = lookup[(city, issue_id)]
dept = departments[issue["department_id"]]
```

---

## 4. API Endpoints

### `POST /classify`
Main endpoint. Accepts text, image (base64), or pre-transcribed voice text.

**Request:**
```json
{
  "text": "gutter ka pani khara hai johar town mein",
  "image_base64": null,
  "city_hint": null
}
```

**Response:**
```json
{
  "issue_id": "sewer_leakage",
  "issue_display": "Sewer Leakage",
  "city": "Lahore",
  "language": "urdu",
  "confidence": 0.97,
  "department": {
    "name": "WASA Lahore",
    "reason": "WASA handles sewerage in Lahore",
    "portal": "https://crm.punjab.gov.pk/",
    "helpline": "15",
    "app": "Pakistan Citizen Portal (PCP)",
    "email": "Not available",
    "office": "WASA Lahore Head Office, 7-KM Multan Road",
    "hours": "8:00 AM – 4:00 PM (Mon–Fri)"
  },
  "requirements": ["Address", "CNIC", "Photos", "Landmark"],
  "priority": "High",
  "tracking": true,
  "escalation": "Punjab Chief Minister's Office / Punjab Ombudsman",
  "complaint": {
    "urdu": "...",
    "english": "..."
  }
}
```

### `GET /health`
Returns `{ "status": "ok" }`. Used for deployment health checks.

---

## 5. Qwen Integration

### Classification Prompt
```
You are a civic complaint classifier for Pakistan.

Given a user complaint (text or image description), return ONLY this JSON:
{
  "issue_id": "<one of the 42 issue IDs>",
  "city": "<Pakistani city name>",
  "language": "urdu" | "english" | "roman_urdu",
  "confidence": <0.0 to 1.0>
}

Valid issue_ids: [sewer_leakage, sewer_blockage, electricity_outage, ...]
Valid cities: [Lahore, Karachi, Islamabad, ...]

If city is not mentioned, return "city": null.
Return ONLY valid JSON. No explanation.
```

### Complaint Generation (Qwen, only if template needs personalization)
```
Generate a formal civic complaint in {language}.
Issue: {issue_display}
Department: {dept_name}
Location: {user_location}
Tone: Professional, respectful
Length: 3-4 paragraphs
```

---

## 6. Frontend Structure

```
/app
  page.tsx              # Main single-page app
  /components
    InputPanel.tsx      # Text + Voice + Image input
    ReasoningCard.tsx   # Issue detected, dept, confidence
    SubmissionHub.tsx   # Portal, helpline, app, office
    ComplaintBox.tsx    # Urdu + English complaint tabs
    PDFExport.tsx       # Download button
  /lib
    api.ts              # POST /classify wrapper
    speech.ts           # Web Speech API wrapper
```

---

## 7. Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | Vercel | Auto-deploy from GitHub |
| Backend | Railway or Render | Free tier sufficient for demo |
| JSON files | Bundled with backend | No database needed |
| Qwen API | Cloud (Alibaba) | API key in environment variable |