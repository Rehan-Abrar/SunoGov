# PRD — SunoGov
**AI-Powered Civic Navigator for Pakistan**
Version: 1.0 | Hackathon: Qwen Pakistan AI Buildathon 2026

---

## 1. Project Overview

SunoGov is an AI-powered civic complaint navigator that helps Pakistani citizens identify the correct government department for their issue, generate a professional complaint in Urdu or English, and access all official submission channels — in under one minute.

---

## 2. Problem Statement

Thousands of Pakistanis face daily civic issues (sewer overflows, electricity outages, garbage, broken roads) but don't know:
- Which government department is responsible
- Where and how to submit a complaint
- What information is required

The result: most complaints are never filed. SunoGov removes that friction entirely.

---

## 3. Target Users

- **Primary:** Urban Pakistani citizens with a civic complaint
- **Secondary:** Urdu-speaking citizens with limited English literacy
- **Context:** Mobile-first, low technical sophistication expected

---

## 4. Core Features

### F1 — Multi-modal Input
- Text input (English + Urdu + Roman Urdu)
- Voice input via Web Speech API
- Image input via Qwen Vision (photo of issue)

### F2 — Intelligent Classification
- Qwen extracts `issue_id`, `city`, `language`, `confidence` from user input
- Returns structured JSON only
- Falls back to alias matching if Qwen is uncertain

### F3 — Deterministic Department Routing
- Backend maps `(city, issue_id)` → department via knowledge base
- No hallucination risk — routing is never done by AI
- Returns department name, reason, and all contact channels

### F4 — Submission Hub
- Official complaint portal URL
- Government mobile app name
- Helpline number
- Email (where available)
- Office address
- Working hours

### F5 — Complaint Generation
- Template-based complaint in Urdu and English
- Qwen rewrites/personalizes only if needed
- Proper formatting, respectful tone, correct addressee

### F6 — Reasoning Card (UI)
- Shows: Detected Issue, Department, Why This Department, Confidence
- Makes AI decision transparent and trustworthy to judges and users

### F7 — PDF Export
- Download complaint as formatted PDF
- Ready to print or attach to email

---

## 5. Non-Goals

- No user accounts or authentication
- No complaint tracking after submission (we route, we don't integrate)
- No payment or form submission on behalf of user
- No coverage of private sector complaints
- No multilingual UI beyond Urdu/English

---

## 6. Knowledge Base Scope

- **Cities:** 15 (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Gujranwala, Sialkot, Bahawalpur, Peshawar, Quetta, Hyderabad, Sukkur, Abbottabad, Gilgit)
- **Issues:** 42 civic issue types
- **Files:** `departments.json`, `issues.json`, `aliases.json`
- **Verification:** All entries marked `Verified` or `Estimated`

---

## 7. Success Criteria

| Metric | Target |
|--------|--------|
| Correct department routing | ≥ 95% on test cases |
| Response time (text input) | < 3 seconds |
| Urdu voice input understood | Works on Chrome/Edge |
| Complaint generated | Both Urdu + English always |
| PDF downloadable | Yes, always |
| Mobile usable | Yes, responsive |