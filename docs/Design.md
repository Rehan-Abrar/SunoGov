# Design — SunoGov
**Visual Identity & UI/UX Guide**

---

## 1. Brand Identity

**Name:** SunoGov
**Tagline:** "Apni Baat, Sahi Jagah" (Your Voice, Right Place)
**Tone:** Trustworthy, civic, approachable — not corporate, not playful
**Audience:** Urban Pakistani citizens, mobile-first

---

## 2. Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Pakistan Green | `#01411C` | Primary brand, buttons, accents |
| Light Green | `#2D6A4F` | Hover states, secondary buttons |
| Cream White | `#F8F5F0` | Page background |
| Card White | `#FFFFFF` | Card backgrounds |
| Text Primary | `#1A1A1A` | Headings, body text |
| Text Secondary | `#6B7280` | Captions, labels |
| Border | `#E5E7EB` | Card borders, dividers |
| Success | `#059669` | Verified badge, confidence high |
| Warning | `#D97706` | Estimated badge, confidence medium |
| Error | `#DC2626` | Error states |
| Confidence High | `#059669` | ≥ 0.85 confidence |
| Confidence Med | `#D97706` | 0.7–0.84 confidence |
| Confidence Low | `#DC2626` | < 0.7 confidence |

---

## 3. Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Logo | Inter | 700 | 24px |
| Page Heading | Inter | 700 | 28px |
| Section Heading | Inter | 600 | 18px |
| Body Text | Inter | 400 | 15px |
| Urdu Text | Noto Nastaliq Urdu | 400 | 18px (larger for readability) |
| Caption / Label | Inter | 400 | 13px |
| Button | Inter | 600 | 14px |

**Urdu font import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');
```

Urdu text must be `dir="rtl"` and `font-family: 'Noto Nastaliq Urdu'`.

---

## 4. Spacing

Use Tailwind's default spacing scale. Key values:
- Page padding: `px-4 py-6` (mobile), `px-8 py-10` (desktop)
- Card padding: `p-5` or `p-6`
- Between sections: `gap-6` or `mt-6`
- Between elements in a card: `gap-3` or `mt-3`

---

## 5. Components

### Input Panel
- Large textarea: `min-h-[80px]`, placeholder in both Urdu and English
- Three input buttons below: 📝 Text | 🎤 Voice | 📷 Image
- Active/recording mic: pulsing green ring animation
- Submit button: full width, Pakistan Green, white text

### Reasoning Card
```
┌─────────────────────────────────┐
│ 🔍 Issue Detected               │
│ Sewer Leakage          [97%] ●  │
│                                 │
│ 🏢 Responsible Department       │
│ WASA Lahore                     │
│                                 │
│ ℹ️ Why?                         │
│ WASA handles sewerage in Lahore │
└─────────────────────────────────┘
```
- Confidence badge: colored dot + percentage (green/amber/red)
- Card border-left: 4px Pakistan Green

### Submission Hub
```
┌─────────────────────────────────┐
│ 📋 How to Submit                │
│                                 │
│ 🌐 [Open Official Portal] →     │
│ 📱 Pakistan Citizen Portal App  │
│ ☎️  Helpline: 15                │
│ 📧 Not available                │
│ 📍 WASA Head Office, Multan Rd  │
│ 🕐 8AM–4PM Mon–Fri              │
└─────────────────────────────────┘
```
- "Open Official Portal" is a prominent green button
- Other items are rows with icon + label
- Fields that are "Not available" show as `—`

### Complaint Box
- Two tabs: `اردو` | `English` (Urdu tab default)
- Urdu tab: RTL text, Noto Nastaliq Urdu font, larger size
- Copy button top-right of each tab
- Download PDF button below tabs: outlined green button

### Estimated Warning Badge
Small inline badge for entries with `verification_status: "Estimated"`:
```
⚠️ Details may vary — verify before submitting
```
Color: amber, small text, appears below Submission Hub.

---

## 6. Layout

```
┌────────────────────────────┐
│  SunoGov    [EN | اردو]    │  ← Header (sticky)
├────────────────────────────┤
│  Tagline / Hero text       │
│                            │
│  [ Input Panel ]           │  ← Always visible
│                            │
│  [ Reasoning Card ]        │  ← Appears after submit
│  [ Submission Hub ]        │
│  [ Complaint Box ]         │
│  [ PDF Download ]          │
└────────────────────────────┘
```

- Single page, no routing needed
- Results appear below input (no new page)
- Mobile: all sections stack vertically
- Desktop: can show Reasoning Card + Submission Hub side-by-side

---

## 7. Animations (Framer Motion)

Keep minimal — only where it adds clarity:
- Results section: `fadeIn` + `slideUp` on appear
- Mic button: pulsing ring while recording
- Loading: simple spinner or skeleton card
- Tab switch: instant, no animation needed

---

## 8. Design Principles

1. **Trust first.** Citizens need to trust the routing. Always show why a department was chosen.
2. **Urdu is primary.** Never treat Urdu as an afterthought. Default to it.
3. **One action at a time.** Don't overwhelm. Input → Result → Submit.
4. **Honest about gaps.** Show `—` for missing data. Show `⚠️` for estimated entries.
5. **Mobile over desktop.** Most users will be on phones.