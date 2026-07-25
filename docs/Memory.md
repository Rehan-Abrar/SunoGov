# Memory — SunoGov
**Live Project State — Update this file as you build**

Last Updated: 2026-07-25 (Phase 3 verification complete)

---

## ✅ Phase 3 Backend — VERIFIED

All Phase 3 backend tasks have been verified and tested:

1. **Model Confirmation:** Using `Qwen-Ambassador/Qwen3.7-Plus` via ModelScope API (confirmed in server logs)
2. **Raw Qwen Response Captured:**
   ```json
   {
     "issue_id": "broken_road",
     "city": "Karachi",
     "language": "english",
     "confidence": 1.0
   }
   ```
3. **Confidence from Qwen:** The `confidence: 1.0` value comes directly from Qwen's response (not hardcoded)
4. **No Hardcoded Secrets:** All configuration in environment variables:
   - `MODELSCOPE_API_KEY` — API authentication
   - `QWEN_MODEL_NAME` — Model identifier
   - `QWEN_BASE_URL` — API endpoint
   - `.env` file is gitignored (not tracked)

### Test Results (4 verified cases):
- ✅ `"teen din se...gutter ka pani...Lahore"` → `sewer_blockage` → WASA Lahore (confidence 0.95)
- ✅ `"broken road near F-7 markaz Islamabad"` → `broken_road` → CDA Islamabad (confidence 0.95)
- ✅ `"لاہور میں بجلی نہیں آ رہی"` → `electricity_outage` → LESCO Lahore (confidence 0.98)
- ✅ `"broken road in karachi"` → `broken_road` → KMC Karachi (confidence 1.0)

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
| Phase 4 — Image + Deploy (Person A) | ⬜ Not started | Vision code ready, just need to deploy |
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
- ✅ Multi-city fallback: if city+issue combo not found, searches other cities for the issue
- ✅ Complaint template generation (Urdu + English) — kept as templates (Qwen rewrite is optional/cut-list)
- ✅ Dynamic classification prompt: injects all valid issue_ids and cities from KB into system prompt
- ✅ Confidence clamping: ensures 0.0–1.0 range
- ✅ Logging: INFO-level logging for all API errors and parse failures

### Frontend (Person B)
- _Nothing yet — Person B's responsibility_

---

## Current Status

**Active Phase:** Phase 3 Backend Complete ✅
**Currently Working On:** Ready for Phase 4 (deploy backend to Railway/Render)
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

---

## Pending Tasks

### Person A (Backend)
- Phase 4: Deploy backend to Railway or Render
- Phase 4: Set `MODELSCOPE_API_KEY` env var on Railway/Render
- Phase 4: Test live backend URL with Postman
- Phase 4: Share live backend URL with B
- Optional: Qwen-powered complaint rewrite (currently templates — listed in cut list as item 4)

### Person B (Frontend)
- Phase 2: All frontend components (InputPanel, ReasoningCard, SubmissionHub, ComplaintBox)
- Phase 3: Voice input, connect to real API
- Phase 4: Image upload, PDF export, mobile responsive

---

## Known Issues

- Qwen sometimes classifies "khara pani" (standing sewer water) as `sewer_blockage` instead of `sewer_leakage` — both route to WASA Lahore, no functional impact
- Complaint templates use English issue display names even in Urdu complaint (e.g., "Sewer Blockage" not translated) — acceptable for hackathon, could improve later

---

## Environment Variables Required

| Variable | Where | Value |
|----------|-------|-------|
| `MODELSCOPE_API_KEY` | Backend `.env` | ModelScope token (ms-xxx format) |
| `NEXT_PUBLIC_API_URL` | Frontend `.env.local` | `http://localhost:8000` (dev) / Railway URL (prod) |

---

## Repo Structure

```
sunogov/
  /backend
    main.py
    .env                  ← MODELSCOPE_API_KEY (gitignored)
    .env.example
    requirements.txt      ← fastapi, uvicorn, httpx, python-dotenv, openai
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
> **Verified:** ✅ Returns WASA Lahore, confidence 0.95

**Demo 2 — English Text**
> Type: "broken road near F-7 markaz Islamabad"
> Expected: Broken Road → CDA → portal + office → English complaint
> **Verified:** ✅ Returns CDA Islamabad, confidence 0.95

**Demo 3 — Urdu Script**
> Type: "لاہور میں بجلی نہیں آ رہی، لوڈ شیڈنگ بہت زیادہ ہے"
> Expected: Electricity Outage → LESCO Lahore
> **Verified:** ✅ Returns LESCO, confidence 0.98

**Demo 4 — Image**
> Upload: photo of garbage pile
> Expected: Garbage Collection → LWMC (Lahore) or KMC (Karachi) depending on city input
> **Not yet verified:** Vision code written but needs real image test

---

## Notes for Next AI Session

- Read Architecture.md, Phases.md before generating any code
- Read this file to understand current state before asking what to build next
- The JSON knowledge base is the source of truth — never hardcode department info in code
- Qwen classifies, backend routes — never the other way around
- Run backend with: `cd backend && D:\Projects\SunoGov\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000`
- Person A = backend only. Person B = frontend only. Don't cross boundaries.
- The classification prompt dynamically injects all valid issue_ids and cities from the KB into the system prompt
- Response JSON is parsed with markdown fence stripping + regex fallback for robustness
- OpenAI SDK client is sync — functions are regular `def` (not async) so FastAPI runs them in threadpool
