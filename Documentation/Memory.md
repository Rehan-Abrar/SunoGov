# Memory — SunoGov
**Live Project State — Update this file as you build**

Last Updated: Hackathon Day 1

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

- `departments.json` — ✅ Complete. Missing 3 to add: `epd_kpk`, `epd_balochistan`, `epd_gb`
- `issues.json` — ✅ Complete. 42 issues × 15 cities. Some smaller cities marked `Estimated`
- `aliases.json` — ✅ Complete. English + Urdu + Roman Urdu

---

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 — Setup | ⬜ Not started | |
| Phase 2 — Backend Core | ⬜ Not started | |
| Phase 3 — Qwen Integration | ⬜ Not started | |
| Phase 4 — Frontend Core | ⬜ Not started | |
| Phase 5 — Voice + Image | ⬜ Not started | |
| Phase 6 — Polish + PDF | ⬜ Not started | |
| Phase 7 — Deploy + Demo | ⬜ Not started | |

**Update statuses to:** ⬜ Not started | 🔄 In progress | ✅ Done | ❌ Blocked

---

## Completed Features

_None yet — update as you build._

---

## Current Status

**Active Phase:** Phase 1 — Setup
**Currently Working On:** —
**Blockers:** —

---

## Pending Tasks

- Add `epd_kpk`, `epd_balochistan`, `epd_gb` to `departments.json`
- Initialize repos and environments
- Begin FastAPI backend

---

## Known Bugs

_None yet._

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
    /data
      departments.json
      issues.json
      aliases.json
    /routers
      classify.py
    /services
      qwen.py
      kb.py
      complaint.py
    requirements.txt
    .env
  /frontend
    /app
      page.tsx
      /components
        InputPanel.tsx
        ReasoningCard.tsx
        SubmissionHub.tsx
        ComplaintBox.tsx
        PDFExport.tsx
      /lib
        api.ts
        speech.ts
    tailwind.config.ts
    .env.local
  README.md
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

- Read PRD.md, Architecture.md, Rules.md before generating any code
- Read this file to understand current state before asking what to build next
- The JSON knowledge base is the source of truth — never hardcode department info in code
- Qwen classifies, backend routes — never the other way around