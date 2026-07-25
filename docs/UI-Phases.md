# UI/UX Phases — SunoGov
**Frontend Development Roadmap**

---

## Phase UI-1: Foundation & Design System (2 hours)

**Goal:** Set up design tokens, Tailwind config, and base layout components.

- [ ] Create `tokens.css` with all OKLCH color variables
- [ ] Update `tailwind.config.ts` with custom colors, fonts, spacing
- [ ] Build `TopBar` component (logo, search icon, theme toggle)
- [ ] Build `BottomNav` component (mobile only: Home, Recent, About)
- [ ] Implement dark mode toggle with localStorage persistence
- [ ] Add Framer Motion to `layout.tsx` for page transitions
- [ ] Test responsive breakpoints: 320px, 375px, 414px, 768px, 1024px

**Exit Criteria:** Top bar and bottom nav render correctly. Dark mode works. All breakpoints tested.

---

## Phase UI-2: Home / Input Page (3 hours)

**Goal:** Build the main input interface with text, voice, and image inputs.

### Hero Section
- [ ] Headline: "Apni Baat, Sahi Jagah" (36px, semibold, tracking-tight)
- [ ] Subheadline: "Your Voice, Right Place..." (16px, neutral-500)
- [ ] Fade-in animation on load (Framer Motion)

### Input Panel
- [ ] Textarea: min-height 120px, auto-resize, max-height 200px
- [ ] Placeholder: "Describe your civic issue..." (English/Urdu rotation)
- [ ] Voice button (English): circular 48x48px, mic icon, pulsing animation when active
- [ ] Voice button (Urdu): circular 48x48px, "اردو" text in Nastaliq
- [ ] Image upload button: circular 48x48px, image icon
- [ ] Image preview: 96px height, rounded-xl, remove button (X icon)
- [ ] Submit button: full-width on mobile, pill-shaped, accent-primary, shadow-lg
- [ ] Loading state: spinner inside button, disabled state
- [ ] Keyboard shortcut: Ctrl/Cmd + Enter to submit

### UX Details
- [ ] Auto-focus textarea on page load
- [ ] Voice recording: pulsing ring animation, auto-fill transcript
- [ ] Image upload: drag-and-drop zone (desktop), file picker (mobile)
- [ ] Error state: "Please describe your issue" if empty submit
- [ ] Success state: smooth transition to results page

**Exit Criteria:** User can type, speak, or upload image. Submit triggers API call.

---

## Phase UI-3: Results Page (4 hours)

**Goal:** Display classification results with reasoning, submission channels, and complaint.

### Reasoning Card
- [ ] Issue display: 18px semibold
- [ ] Department name: 14px, neutral-600
- [ ] City badge: 14px, neutral-500, "·" separator
- [ ] Confidence badge: pill-shaped, color-coded (success/warning/error)
  - ≥80%: green background (success/10), green text
  - 50-79%: amber background (warning/10), amber text
  - <50%: red background (error/10), red text
- [ ] Reason text: 14px italic, neutral-600, border-top separator
- [ ] Entrance animation: fade-in + slide-up (0.4s delay 0.1s)

### Submission Hub
- [ ] Section heading: "How to Submit" (18px semibold)
- [ ] Grid layout: 2 columns (desktop), 1 column (mobile)
- [ ] Channel cards: 6 types (portal, helpline, app, email, office, hours)
  - Icon: 40x40px circle, accent-light background, accent icon
  - Label: 14px semibold
  - Value: 14px neutral-600, clickable for links
  - Portal: external link icon, opens in new tab
  - Helpline: tel: link, large font
  - Email: mailto: link
  - Office/Hours: copy-to-clipboard on hover
- [ ] Hover state: scale 1.01, background change
- [ ] Entrance animation: stagger 0.1s between cards

### Complaint Box
- [ ] Section heading: "Your Complaint" (18px semibold)
- [ ] Tab switcher: pill-shaped, 2 tabs (English, اردو)
  - Active tab: white background, shadow-sm
  - Inactive tab: transparent, neutral-500
- [ ] Content area: rounded-xl, neutral-100 background, border
  - English: monospace font, LTR
  - Urdu: Nastaliq font, RTL, line-height 2.0
  - Min-height: 200px
- [ ] Copy button: top-right, 32x32px, clipboard icon, success state (checkmark)
- [ ] Download button: full-width, outlined, download icon
- [ ] Entrance animation: fade-in + slide-up (0.4s delay 0.3s)

### "File Another Complaint" Button
- [ ] Full-width, outlined, rounded-full
- [ ] Resets form and clears results
- [ ] Entrance animation: fade-in (0.4s delay 0.4s)

### UX Details
- [ ] Staggered card entrance (0.1s delay between each)
- [ ] Smooth scroll to top when results appear
- [ ] Copy feedback: "Copied!" tooltip for 2s
- [ ] Download feedback: file saves as `complaint-{en|ur}.txt`
- [ ] Empty state: "No complaint text available" if API fails

**Exit Criteria:** All three cards render with mock data. Tabs work. Copy/download work.

---

## Phase UI-4: About Page (1 hour)

**Goal:** Static page explaining SunoGov for judges and users.

### Content Sections
- [ ] Hero: "What is SunoGov?" (24px semibold)
- [ ] Description: 2-3 paragraphs explaining the problem and solution
- [ ] How It Works: 3-step diagram (Input → Classify → Submit)
  - Step 1: Icon + "Describe your issue"
  - Step 2: Icon + "AI finds the right department"
  - Step 3: Icon + "Submit your complaint"
- [ ] Coverage: "15 cities, 42 issue types, 3 languages"
- [ ] Team section: "Built at Qwen Pakistan AI Buildathon 2026"
- [ ] Privacy notice: "No accounts. No tracking. We route, we don't store."

### UX Details
- [ ] Accessible via bottom nav (mobile) or top bar link (desktop)
- [ ] Smooth scroll between sections
- [ ] Mobile-responsive: stack 3-step diagram vertically

**Exit Criteria:** About page renders with all sections. Mobile-responsive.

---

## Phase UI-5: 404 Page (30 min)

**Goal:** Standard Next.js catch-all page.

- [ ] Heading: "Page Not Found" (24px semibold)
- [ ] Description: "The page you're looking for doesn't exist."
- [ ] Button: "Go Home" → links to `/`
- [ ] Simple illustration or icon (lucide `AlertCircle`)

**Exit Criteria:** 404 page renders for invalid routes.

---

## Phase UI-6: Micro-Interactions & Polish (2 hours)

**Goal:** Add Framer Motion animations and polish the UI.

### Page Transitions
- [ ] Home → Results: fade-in + slide-up (0.4s)
- [ ] Results → Home: fade-out + slide-down (0.3s)
- [ ] About page: fade-in (0.3s)

### Button Hover States
- [ ] Scale: 1.0 → 1.02 (0.2s ease-out)
- [ ] Shadow: shadow-sm → shadow-md
- [ ] Background: subtle lighten/darken

### Card Entrance
- [ ] Stagger: 0.1s delay between cards
- [ ] Animation: fade-in + slide-up (y: 20 → 0)
- [ ] Duration: 0.4s, ease-out

### Voice Recording
- [ ] Pulsing ring: scale 1 → 1.2, opacity 1 → 0, repeat
- [ ] Color: accent-primary with 50% opacity
- [ ] Duration: 1.5s loop

### Loading States
- [ ] Skeleton: bg-tertiary, animate-pulse
- [ ] Shimmer: gradient sweep left → right (1.5s loop)
- [ ] Spinner: inside submit button during API call

### UX Details
- [ ] Respect `prefers-reduced-motion`: disable animations
- [ ] Focus states: 2px accent-primary ring, 2px offset
- [ ] Touch targets: minimum 44x44px
- [ ] Keyboard navigation: all interactive elements reachable

**Exit Criteria:** All animations work smoothly. Reduced motion respected. Accessibility audit passes.

---

## Phase UI-7: Mobile Optimization (1.5 hours)

**Goal:** Ensure flawless mobile experience.

### Bottom Navigation
- [ ] Fixed bottom: h-16, bg-primary, border-t
- [ ] Icons: Home, Recent, About (lucide icons)
- [ ] Active state: accent-primary color + dot indicator
- [ ] Touch targets: 44x44px minimum

### Input Panel
- [ ] Submit button: full-width on mobile
- [ ] Textarea: auto-resize, max-height 200px
- [ ] Voice button: 64x64px (larger for touch)
- [ ] Keyboard handling: submit button sticky above keyboard

### Results Cards
- [ ] Stack vertically (1 column)
- [ ] Padding: 16px (mobile) → 24px (desktop)
- [ ] Font sizes: same (responsive typography not needed)

### Submission Hub
- [ ] Grid: 1 column (mobile) → 2 columns (desktop)
- [ ] Channel cards: full-width on mobile

### UX Details
- [ ] Test on: iPhone SE (375px), iPhone 14 (390px), iPad (768px)
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch-friendly: all buttons ≥ 44x44px
- [ ] Keyboard: textarea doesn't overflow viewport

**Exit Criteria:** Mobile layout works flawlessly. No horizontal scroll. All touch targets ≥ 44px.

---

## Phase UI-8: Urdu / RTL Support (1 hour)

**Goal:** Full RTL support for Urdu content.

### Layout
- [ ] Auto-detect language from API response
- [ ] Add `dir="rtl"` to containers with Urdu text
- [ ] Flip icons: arrow-left → arrow-right (if used)
- [ ] Padding/margin: use logical properties (padding-inline-start)

### Typography
- [ ] Urdu text: Noto Nastaliq Urdu, line-height 2.0
- [ ] Mixed content: separate containers (don't mix LTR/RTL inline)
- [ ] Numbers: always LTR (even in Urdu text)

### Complaint Box
- [ ] Urdu tab: `dir="rtl"`, `text-align: right`
- [ ] English tab: `dir="ltr"`, `text-align: left`
- [ ] Tab switcher: smooth transition between directions

### UX Details
- [ ] Test Urdu input: voice → text → complaint
- [ ] Verify RTL layout: no broken alignment
- [ ] Copy button: works in both LTR and RTL

**Exit Criteria:** Urdu content renders correctly. RTL layout works. No broken alignment.

---

## Phase UI-9: Accessibility Audit (1 hour)

**Goal:** WCAG AA compliance.

### Contrast Ratios
- [ ] Text on background: ≥ 4.5:1
- [ ] accent-primary on white: 7.5:1 ✅
- [ ] neutral-500 on white: 4.6:1 ✅
- [ ] Success/warning/error: all ≥ 4.5:1

### Focus States
- [ ] All interactive elements: 2px accent-primary ring, 2px offset
- [ ] Keyboard navigation: visible focus ring
- [ ] Never animate focus ring (instant appearance)

### Screen Readers
- [ ] Icon buttons: `aria-label` for all icon-only buttons
- [ ] Loading states: `aria-live="polite"`, `aria-busy`
- [ ] Error messages: `role="alert"`
- [ ] Form inputs: `aria-describedby` for error text

### Keyboard Navigation
- [ ] Tab order: logical (top to bottom, left to right)
- [ ] Escape: close modals, clear focus
- [ ] Enter/Space: activate buttons
- [ ] Arrow keys: navigate tabs, command palette

### UX Details
- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (VoiceOver or NVDA)
- [ ] Verify all focus states visible
- [ ] Check all aria-labels descriptive

**Exit Criteria:** Keyboard navigation works. Screen reader announces all elements. Contrast ratios pass.

---

## Phase UI-10: Final Polish & Demo Prep (2 hours)

**Goal:** Production-ready UI for judges.

### Visual Polish
- [ ] Spacing check: consistent 8px grid
- [ ] Typography: no orphaned words, proper line breaks
- [ ] Colors: no hardcoded values (all tokens)
- [ ] Shadows: consistent depth (sm, md, lg, xl)

### Demo Scripts
- [ ] Demo 1: Urdu voice → WASA Lahore (90 seconds)
- [ ] Demo 2: English text → CDA Islamabad (60 seconds)
- [ ] Demo 3: Image upload → LWMC/KMC (60 seconds)

### Performance
- [ ] Lighthouse audit: ≥ 90 performance score
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3s
- [ ] Bundle size: < 200KB (gzipped)

### UX Details
- [ ] Rehearse demo 3x (target: under 90 seconds)
- [ ] Test on mobile (judges may view on phone)
- [ ] Verify all animations smooth (60fps)
- [ ] Check dark mode on all pages

**Exit Criteria:** Demo runs smoothly. Lighthouse passes. Mobile works. Dark mode works.

---

## Cut List (if running behind)

Cut in this order — least impact first:

1. About page (skip entirely)
2. 404 page (use default Next.js)
3. Urdu RTL polish (English-only demo)
4. Micro-interactions (remove Framer Motion)
5. Dark mode (light mode only)

**Never cut:** Input Panel, Reasoning Card, Submission Hub, Complaint Box, Voice Input.

---

## Time Estimates

| Phase | Duration | Cumulative |
|-------|----------|------------|
| UI-1: Foundation | 2 hours | 2 hours |
| UI-2: Home/Input | 3 hours | 5 hours |
| UI-3: Results | 4 hours | 9 hours |
| UI-4: About | 1 hour | 10 hours |
| UI-5: 404 | 0.5 hours | 10.5 hours |
| UI-6: Polish | 2 hours | 12.5 hours |
| UI-7: Mobile | 1.5 hours | 14 hours |
| UI-8: Urdu RTL | 1 hour | 15 hours |
| UI-9: Accessibility | 1 hour | 16 hours |
| UI-10: Final | 2 hours | 18 hours |

**Total:** 18 hours (can cut to 10 hours if phases 4-5, 8 skipped)

---

**Last Updated:** 2026-07-25
**Version:** 1.0
