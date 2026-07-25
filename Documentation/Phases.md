# Phases — SunoGov
**Development Roadmap (7-Hour Hackathon)**

---

## Phase 1 — Setup (30 min)

**Goal:** Repos, environments, and data files in place.

- [ ] Create GitHub repo (`sunogov`)
- [ ] Initialize Next.js 14 app (`/frontend`)
- [ ] Initialize FastAPI project (`/backend`)
- [ ] Add `departments.json`, `issues.json`, `aliases.json` to `/backend/data/`
- [ ] Add the 3 missing departments to `departments.json`: `epd_kpk`, `epd_balochistan`, `epd_gb`
- [ ] Create `.env` with `QWEN_API_KEY`
- [ ] Add `.env` to `.gitignore`
- [ ] Install backend deps: `fastapi`, `uvicorn`, `python-dotenv`, `httpx`, `pydantic`
- [ ] Install frontend deps: `tailwindcss`, `framer-motion`

**Exit Criteria:** Both servers run locally (`uvicorn main:app` + `npm run dev`).

---

## Phase 2 — Backend Core (90 min)

**Goal:** `/classify` endpoint working end-to-end with hardcoded test input.

- [ ] Load all 3 JSON files at startup into module-level dicts
- [ ] Build `lookup[(city, issue_id)]` index at startup
- [ ] Write Pydantic request model: `{ text, image_base64, city_hint }`
- [ ] Write Pydantic response model (full structure per Architecture.md)
- [ ] Implement alias fallback: if Qwen returns unknown `issue_id`, fuzzy match against `aliases.json`
- [ ] Implement department join: `issue["department_id"]` → `departments[dept_id]`
- [ ] Enable CORS for `localhost:3000`
- [ ] Test with Postman: send `"gutter ka pani lahore mein"` → verify WASA Lahore response
- [ ] Test 4-5 more cases: electricity Karachi, garbage Islamabad, broken road Rawalpindi

**Exit Criteria:** `/classify` returns correct department + submission hub for all test cases.

---

## Phase 3 — Qwen Integration (60 min)

**Goal:** Real Qwen calls replacing any hardcoded classification.

- [ ] Write `classify_with_qwen(text)` function with correct prompt
- [ ] Write `classify_with_qwen_vision(image_base64)` for image input
- [ ] Parse and validate Qwen JSON response
- [ ] Handle: invalid JSON, unknown `issue_id`, missing `city`, API timeout
- [ ] If `confidence < 0.7` or `issue_id` invalid → trigger alias fallback
- [ ] Add complaint generation: template fill for both Urdu + English
- [ ] Optional: Qwen rewrite call for complaint personalization
- [ ] Test Urdu input end-to-end: `"teen din se hamari gali mein gutter ka pani khara hai"`

**Exit Criteria:** Full pipeline works with real Qwen API. Urdu input → correct routing → bilingual complaint.

---

## Phase 4 — Frontend Core (60 min)

**Goal:** Working UI that calls backend and renders results.

- [ ] Build `InputPanel` component: text area + submit button
- [ ] Build `/lib/api.ts`: `POST /classify` wrapper with error handling
- [ ] Build `ReasoningCard`: Issue, Department, Why, Confidence badge
- [ ] Build `SubmissionHub`: portal button, helpline, app, office, hours
- [ ] Build `ComplaintBox`: two tabs (Urdu / English), copy button
- [ ] Show loading spinner during API call
- [ ] Show error message (Urdu + English) if API fails
- [ ] Flag `"Estimated"` entries with a small disclaimer

**Exit Criteria:** Full flow works in browser: type complaint → see department + complaint.

---

## Phase 5 — Voice + Image (60 min)

**Goal:** Voice and image inputs working. Voice is priority.

**Voice (do first):**
- [ ] Build `speech.ts`: wrap `window.SpeechRecognition` with `lang: 'ur-PK'` default
- [ ] Add mic button to `InputPanel` with recording indicator (pulsing animation)
- [ ] On recognition result → auto-fill text area → auto-submit
- [ ] Test: speak `"gutter ka pani"` → verify it classifies correctly

**Image (do second):**
- [ ] Add image upload button to `InputPanel`
- [ ] Convert image to base64 in browser
- [ ] Send as `image_base64` in request body
- [ ] Backend passes to Qwen Vision for description → then classifies

**Exit Criteria:** Voice demo works in Chrome. Image upload triggers correct classification.

---

## Phase 6 — Polish + PDF (45 min)

**Goal:** Product looks and feels finished for judges.

- [ ] Add SunoGov logo/wordmark (simple SVG or text logo)
- [ ] Add "Open Official Portal" button (opens in new tab)
- [ ] PDF export: print CSS with clean complaint layout, or react-pdf
- [ ] Mobile responsive check (judges may view on phone)
- [ ] Add Reasoning Card confidence bar/badge
- [ ] Handle edge case: city not detected → ask user to specify city
- [ ] Final UI pass: spacing, typography, colors (see Design.md)

**Exit Criteria:** App looks polished. PDF downloads correctly. Mobile works.

---

## Phase 7 — Deploy + Demo Prep (45 min)

**Goal:** Live URL + rehearsed demo ready for judges.

- [ ] Deploy backend to Railway or Render, set `QWEN_API_KEY` env var
- [ ] Deploy frontend to Vercel, set `NEXT_PUBLIC_API_URL` env var
- [ ] Test live URL end-to-end (not just localhost)
- [ ] Write clean `README.md` using existing pitch content
- [ ] Push final code to GitHub
- [ ] Rehearse 3 demo flows:
  1. Urdu voice: `"gutter ka pani khara hai"` → WASA Lahore
  2. English text: `"broken road in F-7 Islamabad"` → CDA
  3. Image: photo of garbage pile → LWMC / KMC
- [ ] Time the demo: target under 90 seconds

**Exit Criteria:** Live URL works. GitHub repo is clean. Team has rehearsed demo 2+ times.

---

## Cut List (if running behind)

Cut in this order — least impact first:

1. Image/Vision input
2. PDF export
3. Coverage beyond 5 core cities
4. Complaint Qwen rewrite (use template only)
5. Framer Motion animations

**Never cut:** Voice input, Reasoning Card, Submission Hub, Urdu complaint.