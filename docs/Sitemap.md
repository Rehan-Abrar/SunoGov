# Sitemap — SunoGov
**Frontend Page Structure & Screen Content**

---

## Site Structure

```
sunogov.vercel.app/
│
├── /                  → Home (Input Page)
├── /results           → Results Page (after classification)
└── /about             → About Page
    
404                    → Not Found (catch-all)
```

> Single domain, 3 real pages + 404. No auth, no dashboard, no user accounts.

---

## Page 1 — Home `/`

**Purpose:** Entry point. User describes their civic issue.

---

### TopBar
- SunoGov logo/wordmark (Pakistan Green)
- Nav link: "About" → `/about`
- Dark mode toggle (sun/moon icon)

---

### Hero Section
- Headline: **"Apni Baat, Sahi Jagah"** (36px semibold)
- Subheadline: "Your Voice, Right Place — describe any civic issue and we'll find the right government department instantly." (16px, neutral-500)
- Fade-in animation on load

---

### Input Panel *(main interaction)*
- **Textarea**
  - Placeholder rotates: "Describe your civic issue..." / "اپنا مسئلہ بیان کریں..."
  - Min-height 120px, auto-resize, max-height 200px
  - Auto-focused on page load
- **Input Mode Buttons** (below textarea)
  - 🎤 Voice (English) — `lang: en-US`
  - 🎤 Voice (Urdu) — `lang: ur-PK`, label in Nastaliq "اردو"
  - 📷 Image Upload — opens file picker or drag-and-drop
- **Image Preview** (appears after upload)
  - 96px height thumbnail, rounded-xl
  - ✕ remove button
- **Submit Button**
  - Full-width on mobile, pill-shaped
  - Pakistan Green background, white text
  - Loading spinner + disabled state during API call
  - Keyboard: Ctrl/Cmd + Enter

---

### Error States (on this page)
- Empty submit → inline message: "Please describe your issue / براہ کرم اپنا مسئلہ بیان کریں"
- API failure → toast or inline: "Something went wrong. Please try again."

---

### BottomNav *(mobile only, fixed)*
- 🏠 Home → `/`
- ℹ️ About → `/about`

---

## Page 2 — Results `/results`

**Purpose:** Show classification output — department, submission channels, and complaint.

> Reached after successful API call from Home. State passed via React context or query params. If accessed directly with no state → redirect to `/`.

---

### TopBar
- Same as Home
- Back button / "← New Complaint" link → `/`

---

### Reasoning Card
- Label: "Issue Detected"
- **Issue name** (18px semibold) e.g. "Sewer Leakage"
- **Department name** (14px) e.g. "WASA Lahore"
- **City badge** (14px) e.g. "· Lahore"
- **Confidence pill** — color-coded:
  - ≥ 80% → green background, "97% confident"
  - 50–79% → amber background, "65% confident"
  - < 50% → red background, "42% confident"
- **Why?** — reason text (14px italic, neutral-600)
  - e.g. "WASA Lahore is responsible for sewerage maintenance in Lahore."
- ⚠️ Estimated badge (if `verification_status: "Estimated"`)
  - "Details may vary — verify before submitting"
- Entrance animation: fade-in + slide-up (0.4s)

---

### Qwen Debug Panel *(small, collapsible — for judges)*
- Label: "Qwen Classification Output"
- Shows raw JSON:
  ```json
  {
    "issue_id": "sewer_leakage",
    "city": "Lahore",
    "language": "urdu",
    "confidence": 0.97
  }
  ```
- Default: collapsed. Expand chevron → slides open.
- Purpose: show judges Qwen is doing real work

---

### Submission Hub
- Section heading: "How to Submit" (18px semibold)
- 2-column grid (desktop) / 1-column (mobile)
- **6 Channel Cards:**

  | Card | Icon | Content |
  |------|------|---------|
  | Portal | 🌐 | Link button "Open Official Portal" → new tab |
  | Helpline | ☎️ | `tel:` link, large font (e.g. "15") |
  | App | 📱 | App name (e.g. "Pakistan Citizen Portal") |
  | Email | 📧 | `mailto:` link or "—" |
  | Office | 📍 | Address text, copy on hover |
  | Hours | 🕐 | Working hours text |

- Fields with no data → show `—` (never raw "Not officially available.")
- Hover: scale 1.01, background lighten
- Stagger entrance: 0.1s delay between cards

---

### Required Info Section
- Label: "What You'll Need"
- Pill tags for each required item:
  - e.g. `Address` `CNIC` `Photos` `Landmark`
- Priority badge: `🔴 High Priority` / `🟡 Medium` / `🟢 Low`
- Tracking available: `✓ Complaint tracking available` or `✗ No tracking`
- Escalation: "If unresolved: Punjab Chief Minister's Office / Punjab Ombudsman"

---

### Complaint Box
- Section heading: "Your Complaint" (18px semibold)
- **Tab Switcher** — pill-shaped:
  - `اردو` (default, active)
  - `English`
- **Content Area** per tab:
  - Urdu: `dir="rtl"`, Noto Nastaliq Urdu font, line-height 2.0, text-align right
  - English: `dir="ltr"`, monospace or serif font, LTR
  - Min-height 200px, rounded-xl, neutral-100 background
- **Copy Button** — top-right, clipboard icon
  - Success state: checkmark + "Copied!" tooltip for 2s
- **Download Button** — full-width outlined
  - Saves as `complaint-urdu.txt` or `complaint-english.txt`
  - Or: print CSS PDF via `window.print()`

---

### Action Buttons
- **"Open Official Portal"** — primary green button, full-width, new tab
- **"File Another Complaint"** — outlined, full-width
  - Clears state, scrolls to top, navigates back to `/`

---

### BottomNav *(mobile only)*
- Same as Home page

---

## Page 3 — About `/about`

**Purpose:** Explain SunoGov for judges and curious users. Static page.

---

### TopBar
- Same as other pages

---

### Hero
- Heading: "What is SunoGov?" (24px semibold)
- 2-3 sentences: the problem + the solution

---

### How It Works *(3-step diagram)*
- Step 1: 🎤 "Describe your issue" — voice, text, or image
- Step 2: 🤖 "Qwen AI classifies it" — extracts issue + city + language
- Step 3: 📋 "Get everything you need" — department, channels, complaint

> On desktop: horizontal 3-step flow. On mobile: vertical stack.

---

### Coverage Stats
- "15 cities covered"
- "42 civic issue types"
- "3 languages: Urdu, English, Roman Urdu"
- "100% deterministic routing — no hallucinated departments"

---

### How Qwen Powers It
- Short explanation: Qwen understands natural language including Roman Urdu, extracts structured data, generates bilingual complaints
- Mention: routing is deterministic (KB-based), not AI-guessed

---

### Team Section
- "Built at Qwen Pakistan AI Buildathon 2026"
- Team member names + roles

---

### Privacy Notice
- "No accounts. No login. No data stored."
- "We route your complaint — we don't store it."

---

### BottomNav *(mobile only)*
- Same

---

## 404 — Not Found

**Purpose:** Catch-all for invalid routes.

- Icon: `AlertCircle` (lucide)
- Heading: "Page Not Found" (24px semibold)
- Text: "The page you're looking for doesn't exist."
- Button: "Go Home" → `/`

---

## State Flow Between Pages

```
/  (Home)
│
│  User types / speaks / uploads
│  → Submit → POST /classify
│
├── API success → navigate to /results (pass response as state)
│
├── API failure → stay on / → show error message
│
/results
│
│  User reads result
│
├── "File Another Complaint" → back to /
├── "Open Official Portal" → external gov site (new tab)
└── Download complaint → .txt or PDF
```

---

## Component Map

| Component | Used On |
|-----------|---------|
| `TopBar` | All pages |
| `BottomNav` | All pages (mobile) |
| `InputPanel` | `/` |
| `ReasoningCard` | `/results` |
| `QwenDebugPanel` | `/results` |
| `SubmissionHub` | `/results` |
| `RequiredInfo` | `/results` |
| `ComplaintBox` | `/results` |
| `ActionButtons` | `/results` |
| `HowItWorks` | `/about` |
| `CoverageStats` | `/about` |