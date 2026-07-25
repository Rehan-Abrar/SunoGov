# Memory — SunoGov
**Live Project State — Update this file as you build**

Last Updated: 2026-07-25

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
| Phase 2 — Backend Core (Person A) | ✅ Done | `/classify` working with stub, full response shape correct |
| Phase 2 — Frontend Core (Person B) | ⬜ Not started | Person B's responsibility |
| Phase 3 — Qwen Integration (Person A) | ⬜ Not started | Replace stub with real Qwen calls |
| Phase 3 — Voice + Connect API (Person B) | ⬜ Not started | Person B's responsibility |
| Phase 4 — Image + Deploy (Person A) | ⬜ Not started | |
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
- ✅ Qwen stubbed: returns hardcoded `sewer_leakage` / `Lahore`
- ✅ Department join: `issue["department_id"]` → `departments[dept_id]` working
- ✅ Alias fallback function implemented in `kb.py`
- ✅ CORS enabled for `localhost:3000`
- ✅ `/classify` tested in curl — full response shape verified correct

### Frontend (Person B)
- _Nothing yet — Person B's responsibility_

---

## Current Status

**Active Phase:** Phase 2 (Backend complete, waiting for Person B)
**Currently Working On:** Ready to start Phase 3 — Qwen Integration
**Blockers:** None (backend side)

---

## Pending Tasks

### Person A (Backend)
- Phase 3: Replace Qwen stub with real `classify_with_qwen(text)` 
- Phase 3: Add `classify_with_qwen_vision(image_base64)` for image input
- Phase 3: Parse/validate Qwen JSON (strip markdown fences)
- Phase 3: Error handling (invalid JSON, unknown issue_id, missing city, timeout)
- Phase 3: Trigger alias fallback if confidence < 0.7 or invalid issue_id
- Phase 4: Wire vision into `/classify` endpoint
- Phase 4: Deploy backend to Railway/Render

### Person B (Frontend)
- Phase 2: All frontend components (InputPanel, ReasoningCard, SubmissionHub, ComplaintBox)
- Phase 3: Voice input, connect to real API
- Phase 4: Image upload, PDF export, mobile responsive

---

## Known Bugs

_None currently._

---

## Environment Variables Required

| Variable | Where | Value |
|----------|-------|-------|
| `QWEN_API_KEY` | Backend `.env` | Your Qwen cloud API key |
| `NEXT_PUBLIC_API_URL` | Frontend `.env.local` | `http://localhost:8000` (dev) / Railway URL (prod) |

---

## Repo Structure

```
sunogov/
  /backend
    main.py
    .env.example
    requirements.txt
    /data
      departments.json
      issues.json
      aliases.json
    /routers
      classify.py
    /services
      models.py        ← Pydantic request/response models
      qwen.py          ← Qwen integration (stubbed for Phase 2)
      kb.py            ← Knowledge base loader + lookup index
      complaint.py     ← Bilingual complaint template generator
  /frontend
    (Person B's domain)
  /docs
    Architecture.md
    Design.md
    Memory.md
    Phases.md
```

---

## Demo Scripts (for judges)

**Demo 1 — Urdu Voice**
> Speak: "Teen din se hamari gali mein gutter ka pani khara hai, Johar Town Lahore"
> Expected: Sewer Leakage → WASA Lahore → helpline 15 → Urdu complaint

**Demo 2 — English Text**
> Type: "broken road near F-7 markaz Islamabad"
> Expected: Broken Road → CDA → portal + office → English complaint

**Demo 3 — Image**
> Upload: photo of garbage pile
> Expected: Garbage Collection → LWMC (Lahore) or KMC (Karachi) depending on city input

---

## Notes for Next AI Session

- Read Architecture.md, Phases.md before generating any code
- Read this file to understand current state before asking what to build next
- The JSON knowledge base is the source of truth — never hardcode department info in code
- Qwen classifies, backend routes — never the other way around
- Run backend with: `cd backend && ..\\..\\.venv\\Scripts\\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000`
- Person A = backend only. Person B = frontend only. Don't cross boundaries.
