# SunoGov 🇵🇰
### AI-Powered Civic Navigator for Pakistan

> **"Apni Baat, Sahi Jagah"** — Your Voice, Right Place

SunoGov helps Pakistani citizens cut through government bureaucracy. Describe your civic issue through voice, text, or an image — SunoGov identifies the responsible department, generates a professional complaint in Urdu and English, and gives you every official channel to submit it. In under a minute.

Built for the **Qwen Pakistan AI Buildathon 2026**.

---

## The Problem

Every day, thousands of Pakistanis deal with sewer overflows, electricity outages, broken roads, and garbage that never gets collected. Most complaints are never filed — not because people don't care, but because the process is confusing:

- Which department is responsible?
- Is there an online portal? A helpline?
- How do I write a proper complaint?
- What if I only speak Urdu?

SunoGov answers all of that instantly.

---

## Demo

> 🎤 *User speaks:* "Teen din se hamari gali mein gutter ka pani khara hai, Johar Town Lahore"

> ✅ *SunoGov:* Issue detected: **Sewer Leakage** | Department: **WASA Lahore** | Helpline: **15** | Complaint ready in Urdu + English

---

## Features

- **Multi-modal input** — text, voice (Urdu + English), or photo of the issue
- **Intelligent classification** — Qwen AI understands natural language including Roman Urdu
- **Deterministic routing** — department selection is always from a verified knowledge base, never hallucinated
- **Submission Hub** — official portal, app, helpline, email, office address, working hours
- **Bilingual complaints** — professional Urdu and English complaint letters, ready to copy or download
- **Reasoning Card** — shows exactly why a department was chosen, with confidence score
- **PDF export** — download complaint as a formatted, print-ready PDF

---

## Coverage

| | |
|---|---|
| 🏙️ Cities | 15 major Pakistani cities |
| 📋 Issue types | 42 civic issue categories |
| 🗣️ Languages | Urdu, English, Roman Urdu |
| ✅ Verified departments | All major civic authorities |

**Cities:** Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Gujranwala, Sialkot, Bahawalpur, Peshawar, Quetta, Hyderabad, Sukkur, Abbottabad, Gilgit

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion |
| Backend | FastAPI (Python 3.11+) |
| AI | Qwen (text classification + complaint generation) |
| Vision | Qwen Vision (image-based complaint input) |
| Voice | Web Speech API (browser-native, Urdu supported) |
| Knowledge Base | Verified JSON (departments, issues, aliases) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## How It Works

```
User Input (text / voice / image)
          ↓
    Qwen AI — classifies issue_id + city
          ↓
  Backend — deterministic routing via JSON KB
          ↓
  Department + Submission Hub + Complaint
          ↓
      User submits to government
```

Qwen handles language understanding. The knowledge base handles all routing decisions. No hallucinated department names, no wrong helplines.

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Qwen API key (cloud)

### 1. Clone the repo

```bash
git clone https://github.com/your-team/sunogov.git
cd sunogov
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Add your QWEN_API_KEY to .env

uvicorn main:app --reload
# Backend running at http://localhost:8000
```

### 3. Frontend setup

```bash
cd frontend
npm install

cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
# Frontend running at http://localhost:3000
```

---

## API

### `POST /classify`

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
    "reason": "WASA handles sewerage maintenance in Lahore",
    "portal": "https://crm.punjab.gov.pk/",
    "helpline": "15",
    "app": "Pakistan Citizen Portal (PCP)",
    "office": "WASA Head Office, 7-KM Multan Road, Lahore",
    "hours": "8:00 AM – 4:00 PM (Mon–Fri)"
  },
  "requirements": ["Address", "CNIC", "Photos", "Landmark"],
  "complaint": {
    "urdu": "...",
    "english": "..."
  }
}
```

### `GET /health`
```json
{ "status": "ok" }
```

---

## Project Structure

```
sunogov/
├── /docs          # PRD, Architecture, Design, Phases, Rules, Memory
├── /backend       # FastAPI + Qwen integration + JSON knowledge base
└── /frontend      # Next.js UI
```

See [`docs/Architecture.md`](docs/Architecture.md) for the full technical breakdown.

---

## Team

Built at Qwen Pakistan AI Buildathon 2026.

| Name | Role |
|------|------|
| [Team Member 1] | Backend + AI |
| [Team Member 2] | Frontend |

---

## License

MIT