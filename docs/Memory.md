# Memory — SunoGov
**Live Project State — Update this file as you build**

Last Updated: 2026-07-25 (Phase 4 Backend Complete — Deployed to Render)

---

## ✅ Phase 4 Backend — DEPLOYED & VERIFIED

**Live URL:** https://sunogov.onrender.com

All Phase 4 backend tasks completed and verified on live deployment:

### Live Verification Results:
- ✅ Health check: `GET /health` → `{"status": "ok"}`
- ✅ English text: "broken road in karachi" → KMC Karachi (confidence 1.0)
- ✅ Urdu text: "لاہور میں بجلی نہیں آ رہی" → LESCO Lahore (confidence 0.98)
- ✅ Roman Urdu: "gutter ka pani lahore" → WASA Lahore (confidence 0.95)
- ✅ Road image: `potholes` → LDA Lahore (confidence 0.95)
- ✅ Selfie rejection: 422 error with clear message
- ✅ City hint respected: Karachi + potholes → 404 (not fallback to Lahore)

### Phase 4 Implementation:
- **Image normalization:** Server-side conversion to JPEG ≤ 2048px (handles HEIF, AVIF, oversize, RGBA)
- **Dependencies added:** `pillow>=10.0.0` for image processing
- **City hint fix:** User-provided city never overridden by multi-city fallback
- **Non-civic rejection:** Clear context-aware error messages for irrelevant images/text
- **Render deployment:** Free tier (512MB RAM), `render.yaml` blueprint, env vars configured
- **Cold starts:** ~30s after inactivity — warm up with `GET /health` before demo

### Known Limitation:
Render free tier may timeout on very large base64 images (>80KB). Recommend client-side compression or Standard tier ($25/mo) for production.

---

## ✅ Formal Application Letter Generation System

**Status:** Complete and tested locally (2026-07-25)

### Overview
Qwen-powered formal complaint letter generation in **English only**. Creates submission-ready formal applications for Pakistani government departments.

**Decision: English Only**
- Urdu PDF rendering proved problematic (RTL text display issues)
- English is acceptable for Pakistani government submissions
- Simplifies the system and reduces generation time
- ReportLab library used for fast, clean PDF generation

### API Endpoint
`POST /generate-application`

**Input:**
```json
{
  "issue_id": "sewer_blockage",
  "city": "Lahore",
  "user_name": "Muhammad Ahmed Khan",
  "user_address": "House 45, Street 12, Johar Town, Lahore",
  "user_phone": "+92-300-1234567",
  "user_description": "There has been standing sewer water in our street for three days",
  "cnic": "35202-1234567-8",  // optional
  "landmark": "Near Al-Falah Park",  // optional
  "previous_complaint_id": "",  // optional
  "supporting_info": "This issue has been ongoing for over a week"  // optional
}
```

**Output:**
```json
{
  "letter": "Full formal letter text...",
  "metadata": {
    "language": "english",
    "issue": "Sewer Blockage",
    "city": "Lahore",
    "department": "",
    "tokens_used": 2665
  }
}
```

### Features
- **Formal letter format:** From address → Date → To address (with officer title) → Subject → Body → Closing → Signature
- **Officer titles:** All 46 departments have proper titles (e.g., "The Managing Director, WASA Lahore")
- **English only:** Simplified for reliability and speed
- **Qwen-powered:** Professional letter generation using AI (not templates)
- **Submission-ready:** No placeholders, no metadata in the letter
- **Fast PDF generation:** ReportLab creates clean PDFs in ~2-3 seconds

### Implementation Files
- `backend/routers/application.py` — API endpoint
- `backend/services/complaint_qwen.py` — Qwen letter generation (English only)
- `backend/data/departments.json` — Officer titles added to all 46 departments
- `generate_application_pdf.py` — PDF generation script (ReportLab)

### PDF Generation
**Library:** ReportLab (chosen for speed and simplicity)

**Why ReportLab?**
- Fast PDF generation (~2-3 seconds)
- Clean, professional output
- No external dependencies (pure Python)
- Perfect for English text formatting

**Test Results:**
- Letter generation: ~45 seconds (Qwen API call)
- PDF creation: ~2-3 seconds (ReportLab)
- Total time: ~49 seconds
- English PDF: 3,637 bytes ✅

### Removed Features
- Urdu PDF support (RTL rendering issues)
- arabic-reshaper and python-bidi libraries
- WeasyPrint (required GTK, not available on Windows)
- xhtml2pdf (overkill for English-only)

### Next Steps for Frontend (Person B)
1. Build smart form after classification (mandatory: name, address, phone, description)
2. Form validation before API call
3. Call `/generate-application` with form data
4. Display letter preview
5. Download PDF button (fast generation ~2-3s)

### Commits
- `8d9b66e` — Add formal application letter generation system
- `60511c3` — Add Noto Nastaliq Urdu font + PDF generator
- `7bc4951` — Add arabic-reshaper + python-bidi (for Urdu RTL)
- `6dc5985` — Switch to xhtml2pdf for Urdu RTL (attempted fix)
- Latest — Remove Urdu support, English-only with ReportLab (fast & reliable)

---

## Project Summary

SunoGov is an AI-powered civic complaint navigator for Pakistan. Users describe a civic issue (text, voice, or image) and get: the correct government department, all submission channels, and a bilingual complaint — in under one minute. Built with Qwen AI + FastAPI + Next.js.

---

## Architecture in One Line

`User input → Qwen (classifies) → Backend (routes via JSON KB) → Frontend (renders result + complaint + PDF)`

---

## Key Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| Department routing | Deterministic (JSON KB) | No hallucination risk |
| Complaint generation | Template first, Qwen rewrite optional | Faster + cheaper |
| Voice | Web Speech API | Free, browser-native, supports Urdu |
| Database | None — static JSON | Simplicity, no infra needed |
| Certificate routing | NADRA nationwide | Consistent, simple |
| Cities | 15 major cities | Covers majority of urban Pakistan |
| Issues | 42 civic issue types | Comprehensive coverage |
| AI API | ModelScope Inference API | Free-tier, OpenAI-compatible endpoint |
| AI Model | Qwen-Ambassador/Qwen3.7-Plus | Single model for text + vision |
| SDK | OpenAI Python SDK | Clean, official, well-tested |
| Deployment | Render (free tier) | Simple Python deploy, auto-deploy from GitHub |

---

## Knowledge Base Status

- `departments.json` — ✅ Complete (includes `epd_kpk`, `epd_balochistan`, `epd_gb`)
- `issues.json` — ✅ Complete. 42 issues × 15 cities. Some smaller cities marked `Estimated`
- `aliases.json` — ✅ Complete. English + Urdu + Roman Urdu

---

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 — Setup | ✅ Done | Repo, envs, JSON files, deps all in place |
| Phase 2 — Backend Core (Person A) | ✅ Done | `/classify` with stub, full response shape correct |
| Phase 2 — Frontend Core (Person B) | ⬜ Not started | Person B's responsibility |
| Phase 3 — Qwen Integration (Person A) | ✅ Done | Real Qwen calls working, text + vision, JSON parsing |
| Phase 3 — Voice + Connect API (Person B) | ⬜ Not started | Person B's responsibility |
| Phase 4 — Image + Deploy (Person A) | ✅ Done | Vision tested, deployed to Render, live URL verified |
| Phase 4 — Image + PDF + Polish (Person B) | ⬜ Not started | |
| Phase 5 — Deploy + Demo | ⬜ Not started | Both together |

**Update statuses to:** ⬜ Not started | 🔄 In progress | ✅ Done | ❌ Blocked

---

## Completed Features

### Backend (Person A)
- ✅ FastAPI project initialized with proper structure
- ✅ All 3 JSON data files loaded at startup into module-level dicts
- ✅ `lookup[(city, issue_id)]` index built at startup in `kb.py`
- ✅ Pydantic request model: `ClassifyRequest { text, image_base64, city_hint }`
- ✅ Pydantic response model: `ClassifyResponse` matching Architecture.md exactly
- ✅ Department join: `issue["department_id"]` → `departments[dept_id]` working
- ✅ Alias fallback function implemented in `kb.py`
- ✅ CORS enabled for `localhost:3000`
- ✅ Real Qwen text classification via ModelScope API (`Qwen-Ambassador/Qwen3.7-Plus`)
- ✅ Real Qwen vision classification (same model, base64 image input)
- ✅ JSON parsing with markdown fence stripping + regex fallback
- ✅ Error handling: API timeout (30s text/45s vision), connection error, invalid JSON, unknown issue_id
- ✅ Alias fallback triggered when confidence < 0.7 or issue_id not found in KB
- ✅ Multi-city fallback: if city+issue combo not found, searches other cities (only when user didn't specify city_hint)
- ✅ Complaint template generation (Urdu + English) — kept as templates (Qwen rewrite is optional/cut-list)
- ✅ Dynamic classification prompt: injects all valid issue_ids and cities from KB into system prompt
- ✅ Confidence clamping: ensures 0.0–1.0 range
- ✅ Server-side image normalization: always convert to JPEG ≤ 2048px (handles HEIF, AVIF, oversize, RGBA)
- ✅ `pillow>=10.0.0` dependency for server-side image conversion
- ✅ Non-civic image/text rejection with context-aware error messages
- ✅ Render deployment: live at https://sunogov.onrender.com
- ✅ All config in env vars: `MODELSCOPE_API_KEY`, `QWEN_MODEL_NAME`, `QWEN_BASE_URL`
- ✅ `render.yaml` blueprint for one-click deploy

### Frontend (Person B)
- _Nothing yet — Person B's responsibility_

---

## Current Status

**Active Phase:** Phase 4 Backend COMPLETE ✅
**Currently Working On:** Backend done — all Person A tasks across Phases 1-4 are finished
**Live Backend URL:** https://sunogov.onrender.com
**Blockers:** None (backend side)

---

## API Configuration

| Setting | Value |
|---------|-------|
| Provider | ModelScope Inference API |
| Base URL | `https://api-inference.modelscope.ai/v1` |
| Model | `Qwen-Ambassador/Qwen3.7-Plus` |
| SDK | `openai` Python package (OpenAI-compatible) |
| Env Variable | `MODELSCOPE_API_KEY` |
| Text timeout | 30 seconds |
| Vision timeout | 45 seconds |
| Supports | Text + Vision (single model) |
| Live URL | `https://sunogov.onrender.com` |

---

## Pending Tasks

### Person A (Backend) — ALL DONE ✅
_No remaining tasks. Backend is complete and deployed._

### Person B (Frontend)
- Phase 2: All frontend components (InputPanel, ReasoningCard, SubmissionHub, ComplaintBox)
- Phase 3: Voice input, connect to real API (`https://sunogov.onrender.com/classify`)
- Phase 4: Image upload, PDF export, mobile responsive

---

## Known Issues

- Qwen sometimes classifies "khara pani" (standing sewer water) as `sewer_blockage` instead of `sewer_leakage` — both route to WASA Lahore, no functional impact
- Complaint templates use English issue display names even in Urdu complaint (e.g., "Sewer Blockage" not translated) — acceptable for hackathon
- Render free tier may timeout on very large base64 images (>80KB) — recommend client-side compression

---

## Environment Variables Required

| Variable | Where | Value |
|----------|-------|-------|
| `MODELSCOPE_API_KEY` | Backend `.env` + Render | ModelScope token (ms-xxx format) |
| `QWEN_MODEL_NAME` | Backend `.env` + Render | `Qwen-Ambassador/Qwen3.7-Plus` |
| `QWEN_BASE_URL` | Backend `.env` + Render | `https://api-inference.modelscope.ai/v1` |
| `NEXT_PUBLIC_API_URL` | Frontend `.env.local` | `http://localhost:8000` (dev) / `https://sunogov.onrender.com` (prod) |

---

## Repo Structure

```
sunogov/
  /backend
    main.py
    .env                  ← MODELSCOPE_API_KEY (gitignored)
    .env.example
    render.yaml           ← Render deployment blueprint
    requirements.txt      ← fastapi, uvicorn, httpx, python-dotenv, openai, pillow
    /data
      departments.json
      issues.json
      aliases.json
    /routers
      classify.py         ← POST /classify with real Qwen
    /services
      models.py           ← Pydantic request/response models
      qwen.py             ← Real Qwen classification (text + vision)
      kb.py               ← Knowledge base loader + lookup index + alias fallback
      complaint.py        ← Bilingual complaint template generator
  /frontend
    (Person B's domain)
  /docs
    Architecture.md
    Design.md
    Memory.md
    Phases.md
    Rules.md
    Sitemap.md
    UI-Phases.md
```

---

## Demo Scripts (for judges)

**Demo 1 — Urdu Voice**
> Speak: "Teen din se hamari gali mein gutter ka pani khara hai, Johar Town Lahore"
> Expected: Sewer Blockage → WASA Lahore → helpline 15 → Urdu complaint
> **Verified locally:** ✅ | **Verified on live:** ✅

**Demo 2 — English Text**
> Type: "broken road near F-7 markaz Islamabad"
> Expected: Broken Road → CDA → portal + office → English complaint
> **Verified locally:** ✅ | **Verified on live:** ✅

**Demo 3 — Urdu Script**
> Type: "لاہور میں بجلی نہیں آ رہی، لوڈ شیڈنگ بہت زیادہ ہے"
> Expected: Electricity Outage → LESCO Lahore
> **Verified locally:** ✅ | **Verified on live:** ✅

**Demo 4 — Image**
> Upload: photo of road with potholes
> Expected: Potholes → LDA Lahore
> **Verified locally:** ✅ | **Verified on live:** ✅

---

## Notes for Next AI Session

- Read Architecture.md, Phases.md before generating any code
- Read this file to understand current state before asking what to build next
- The JSON knowledge base is the source of truth — never hardcode department info in code
- Qwen classifies, backend routes — never the other way around
- Run backend locally with: `cd backend && D:\Projects\SunoGov\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000`
- Live backend: https://sunogov.onrender.com (warm up with `GET /health` before testing)
- Person A = backend only. Person B = frontend only. Don't cross boundaries.
- The classification prompt dynamically injects all valid issue_ids and cities from the KB
- Response JSON is parsed with markdown fence stripping + regex fallback
- OpenAI SDK client is sync — functions are regular `def` (not async) so FastAPI runs them in threadpool
- Backend is DONE. All Person A tasks complete.
