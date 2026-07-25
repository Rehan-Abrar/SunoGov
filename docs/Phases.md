# Phases — SunoGov
**Development Roadmap (7-Hour Hackathon) — 2 Person Team**

---

## Team Split

| Person | Role | Owns |
|--------|------|------|
| **Person A** | Backend + AI + DevOps | FastAPI, Qwen integration, KB, deployment |
| **Person B** | Frontend | Next.js, all UI components, voice input, PDF |

> Person A and B work in parallel from Phase 2 onwards. Person B uses mock API responses until the real backend is ready.

---

## Phase 1 — Setup (30 min) — BOTH TOGETHER

**Goal:** Repo, environments, and data files in place. Do this together so you're on the same page.

- [x] **Both:** Create GitHub repo (`sunogov`), set up folder structure
- [x] **A:** Initialize FastAPI project (`/backend`), install deps: `fastapi uvicorn python-dotenv httpx pydantic`
- [x] **A:** Add `departments.json`, `issues.json`, `aliases.json` to `/backend/data/`
- [x] **A:** Add the 3 missing departments to `departments.json`: `epd_kpk`, `epd_balochistan`, `epd_gb`
- [x] **A:** Create `.env` with `QWEN_API_KEY`, add to `.gitignore`
- [x] **B:** Initialize Next.js 14 app (`/frontend`), install deps: `tailwindcss framer-motion`
- [x] **B:** Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [x] **Both:** Agree on the final API response shape (see Architecture.md) — B will mock this

**Exit Criteria:** Both servers run locally. Both have read Architecture.md. ✅

---

## Phase 2 — Parallel Work Begins (90 min)

### Person A — Backend Core

**Goal:** `/classify` endpoint working with real KB lookup (Qwen stubbed for now).

- [x] Load all 3 JSON files at startup into module-level dicts
- [x] Build `lookup[(city, issue_id)]` index at startup (`kb.py`)
- [x] Write Pydantic request model: `{ text, image_base64, city_hint }`
- [x] Write Pydantic response model (full structure per Architecture.md)
- [x] Stub Qwen: hardcode `issue_id="sewer_leakage"`, `city="Lahore"` for now
- [x] Implement department join: `issue["department_id"]` → `departments[dept_id]`
- [x] Implement alias fallback function (even if not wired to Qwen yet)
- [x] Enable CORS for `localhost:3000`
- [x] Test in Postman: verify full response shape matches what B expects

**Exit Criteria:** `/classify` returns correct full response for stubbed input. ✅

---

### Person B — Frontend Core

**Goal:** Full UI built against a mock API response.

- [ ] Create `types.ts` — define TypeScript interfaces matching the API response shape
- [ ] Create `api.ts` — `POST /classify` wrapper, but return mock data for now:
  ```ts
  // mock response hardcoded in api.ts during dev
  ```
- [ ] Build `InputPanel.tsx` — textarea + submit button
- [ ] Build `ReasoningCard.tsx` — Issue, Department, Why, Confidence badge (green/amber/red)
- [ ] Build `SubmissionHub.tsx` — portal button, helpline, app, office, hours; show `—` for unavailable fields
- [ ] Build `ComplaintBox.tsx` — Urdu / English tabs, copy button, Urdu tab default, RTL + Noto Nastaliq Urdu font
- [ ] Build `page.tsx` — wire all components, show loading spinner during call, show error state
- [ ] Flag `"Estimated"` entries with ⚠️ disclaimer

**Exit Criteria:** Full UI renders correctly with mock data. Looks polished enough to demo.

---

## Phase 3 — Qwen Integration + Connect Frontend (60 min)

### Person A — Qwen Integration

**Goal:** Replace stub with real Qwen calls.

- [x] Write `classify_with_qwen(text)` in `qwen.py` with correct classification prompt
- [x] Write `classify_with_qwen_vision(image_base64)` for image input
- [x] Parse and validate Qwen JSON response — strip markdown fences before parsing
- [x] Handle all error cases: invalid JSON, unknown `issue_id`, missing `city`, timeout
- [x] If `confidence < 0.7` or `issue_id` invalid → trigger alias fallback
- [x] Add complaint generation in `complaint.py`: template fill for Urdu + English
- [x] Optional: second Qwen call to rewrite/personalize complaint *(skipped — templates work well, listed in cut list)*
- [x] Test end-to-end: `"teen din se hamari gali mein gutter ka pani khara hai"` → WASA Lahore

**Exit Criteria:** Full pipeline live. Urdu input → correct routing → bilingual complaint. ✅

---

### Person B — Voice Input + Connect to Real API

**Goal:** Swap mock for real API. Add voice.

- [ ] Update `api.ts` — remove mock, point to real `POST /classify`
- [ ] Test all UI components with real API responses
- [ ] Create `speech.ts` — wrap `window.SpeechRecognition` with `lang: 'ur-PK'`
- [ ] Add mic button to `InputPanel` with pulsing green ring animation while recording
- [ ] On recognition result → auto-fill textarea → auto-submit
- [ ] Test voice in Chrome: speak `"gutter ka pani"` → verify correct result

**Exit Criteria:** Voice works in Chrome. Real API wired. Full flow works end-to-end.

---

## Phase 4 — Image + PDF + Polish (60 min)

### Person A — Image Backend + Deploy

**Goal:** Image input wired, backend deployed.

- [x] Wire `classify_with_qwen_vision` into the `/classify` endpoint for `image_base64` input
- [x] Test image input: upload road photo → correct classification (potholes → LDA)
- [x] Non-civic image rejection: returns clear error for irrelevant images
- [x] Image format detection: jpeg, png, webp, gif
- [x] Render deployment config (`render.yaml`) ready
- [x] Deploy backend to Render ✅
- [x] Set `MODELSCOPE_API_KEY` env var on Render ✅
- [x] Test live backend URL with curl/Postman ✅
- [x] Share live backend URL with B: **https://sunogov.onrender.com**
- [x] Formal application letter generation: `/generate-application` endpoint with Qwen-powered formal letters (English-only)
- [x] PDF generation: ReportLab for fast, clean PDFs (~2-3s generation time)

**Exit Criteria:** Backend live on Render. Image input works. Formal letter generation ready. ✅

---

### Person B — Image Frontend + PDF + Polish

**Goal:** Image upload UI, PDF export, final polish.

- [ ] Add image upload button to `InputPanel` — convert to base64, send as `image_base64`
- [ ] PDF export: use print CSS (`@media print`) or `react-pdf` — clean complaint layout
- [ ] Add "Open Official Portal" button — opens in new tab
- [ ] Add SunoGov logo/wordmark (simple SVG text logo, Pakistan Green)
- [ ] Mobile responsive check — all sections stack correctly on 375px
- [ ] Handle edge case: `city: null` in response → show city input prompt to user
- [ ] Final UI pass: spacing, typography, colors per Design.md
- [ ] Update `api.ts` to point to live Railway/Render URL

**Exit Criteria:** Image upload works. PDF downloads. App looks finished. Mobile works.

---

## Phase 5 — Deploy Frontend + Demo Prep (30 min) — BOTH

**Goal:** Live URL working. Demo rehearsed.

- [ ] **B:** Deploy frontend to Vercel, set `NEXT_PUBLIC_API_URL` to Railway URL
- [ ] **Both:** Test full flow on live URL (not localhost)
- [ ] **Both:** Push clean final code to GitHub
- [ ] **Both:** Rehearse 3 demo flows (2+ times each):

  **Demo 1 — Urdu Voice** *(most impressive — do this first for judges)*
  > Speak: "Teen din se hamari gali mein gutter ka pani khara hai, Johar Town Lahore"
  > Expected: Sewer Leakage → WASA Lahore → helpline 15 → Urdu complaint

  **Demo 2 — English Text**
  > Type: "broken road near F-7 markaz Islamabad"
  > Expected: Broken Road → CDA → portal + office → English complaint

  **Demo 3 — Image**
  > Upload: photo of garbage pile
  > Expected: Garbage Collection → LWMC (Lahore) or KMC (Karachi)

- [ ] **Both:** Time the demo — target under 90 seconds total

**Exit Criteria:** Live URL works. GitHub clean. Both have rehearsed. Demo is under 90 seconds.

---

## Cut List (if running behind)

Cut in this order — least impact on score:

1. Framer Motion animations
2. Image/Vision input *(cut if Qwen Vision is flaky)*
3. PDF export *(use copy button as fallback)*
4. Complaint Qwen rewrite *(use template only — still looks great)*
5. Coverage beyond Lahore, Karachi, Islamabad

**Never cut:** Voice input, Reasoning Card, Submission Hub, Urdu complaint, Confidence badge.

---

## Sync Points

These are moments where A and B must coordinate:

| When | What |
|------|------|
| End of Phase 1 | Agree on exact API response JSON shape |
| Start of Phase 3 | B switches from mock to real API — A must have `/classify` ready |
| End of Phase 4 | A shares live backend URL so B can update `api.ts` |
| Phase 5 | Both test live URL together before demo rehearsal |