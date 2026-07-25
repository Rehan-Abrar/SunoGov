# Figma Design Brief — SunoGov
**Complete Design System for Figma Implementation**

---

## Project Context

**Product:** SunoGov — AI-powered civic complaint navigator for Pakistan
**Tagline:** "Apni Baat, Sahi Jagah" (Your Voice, Right Place)
**Purpose:** Help Pakistani citizens identify the correct government department for civic issues and generate professional complaints in Urdu/English
**Target Users:** Urban Pakistani citizens, mobile-first, Urdu/English speakers
**Tone:** Professional, trustworthy, government-adjacent (not startup-playful)
**Design Inspiration:** ARC Browser (modern, fluid) + government professionalism

---

## Design Principles

1. **Soft depth** — no hard borders, use shadows + subtle gradients
2. **Pill-shaped elements** — buttons, inputs, cards use `rounded-2xl` to `rounded-full`
3. **Frosted glass effects** — `backdrop-blur` on floating elements
4. **Muted base + one accent color** — teal-700 accent, not rainbow
5. **Micro-animations** — smooth transitions, hover states
6. **Bilingual support** — English (LTR) + Urdu (RTL) with proper Nastaliq typography

---

## Color System

### Primary Accent (Pakistan Green — Refined)
```
--accent-primary: oklch(45% 0.12 175)    # Teal-700 — buttons, active states
--accent-hover: oklch(40% 0.13 175)      # Darker on hover
--accent-light: oklch(92% 0.05 175)      # Light background for badges
--accent-ink: oklch(100% 0 0)            # White text on accent
```

**Figma hex equivalents:**
- accent-primary: `#0F766E`
- accent-hover: `#0D5F58`
- accent-light: `#CCFBF1`
- accent-ink: `#FFFFFF`

### Neutral Base (Light Mode)
```
--color-paper: oklch(98% 0.005 250)      # Page background
--color-paper-2: oklch(96% 0.008 250)    # Card backgrounds
--color-paper-3: oklch(93% 0.012 250)    # Hover states
--color-surface: oklch(100% 0 0)         # White surfaces
--color-surface-hover: oklch(97% 0.005 250)
```

**Figma hex equivalents:**
- paper: `#FAFBFC`
- paper-2: `#F5F6F8`
- paper-3: `#EDEEF0`
- surface: `#FFFFFF`
- surface-hover: `#F8F9FA`

### Ink (Text Colors — Light Mode)
```
--color-ink: oklch(15% 0.02 250)         # Primary text
--color-ink-2: oklch(35% 0.025 250)      # Secondary text
--color-ink-3: oklch(55% 0.02 250)       # Tertiary text
--color-ink-4: oklch(70% 0.015 250)      # Placeholder text
```

**Figma hex equivalents:**
- ink: `#1A1D24`
- ink-2: `#4A4F5C`
- ink-3: `#7A7F8C`
- ink-4: `#A5A9B4`

### Semantic Colors
```
--color-success: oklch(65% 0.15 155)     # High confidence, verified
--color-warning: oklch(75% 0.16 80)      # Medium confidence, estimated
--color-error: oklch(60% 0.2 25)         # Low confidence, errors
--color-info: oklch(60% 0.15 250)        # Informational
```

**Figma hex equivalents:**
- success: `#10B981` (emerald-500)
- warning: `#F59E0B` (amber-500)
- error: `#EF4444` (red-500)
- info: `#3B82F6` (blue-500)

### Dark Mode (Invert paper/ink, keep accent)
```
--color-paper: oklch(15% 0.02 250)       # Dark background
--color-paper-2: oklch(18% 0.025 250)    # Dark card backgrounds
--color-paper-3: oklch(22% 0.03 250)     # Dark hover states
--color-ink: oklch(95% 0.01 250)         # Light text
--color-ink-2: oklch(80% 0.015 250)      # Light secondary text
```

**Figma hex equivalents (Dark Mode):**
- paper: `#1A1D24`
- paper-2: `#22262D`
- paper-3: `#2A2F38`
- ink: `#F0F2F5`
- ink-2: `#C8CCD5`

### Borders & Rules
```
--color-rule: oklch(88% 0.01 250)        # Light borders
--color-rule-2: oklch(82% 0.015 250)     # Stronger borders
```

**Figma hex equivalents:**
- rule: `#E1E3E8`
- rule-2: `#D0D3D9`

---

## Typography

### Font Families
```
Display/Body: 'Inter', system-ui, sans-serif
Urdu: 'Noto Nastaliq Urdu', serif
Mono: 'JetBrains Mono', 'Fira Code', monospace
```

**Figma setup:**
- Import Inter (Google Fonts) — weights: 400, 500, 600
- Import Noto Nastaliq Urdu (Google Fonts) — weights: 400, 700
- Import JetBrains Mono (Google Fonts) — weights: 400, 500

### Type Scale
```
Display (Page titles): 36px / 2.25rem, weight 600, line-height 1.2, letter-spacing -0.02em
Heading 1 (Section): 24px / 1.5rem, weight 600, line-height 1.3
Heading 2 (Card titles): 18px / 1.125rem, weight 600, line-height 1.4
Body: 16px / 1rem, weight 400, line-height 1.5
Body Small: 14px / 0.875rem, weight 400, line-height 1.4
Caption: 12px / 0.75rem, weight 400, line-height 1.4
```

### Urdu Typography
```
Font: Noto Nastaliq Urdu
Size: 18px minimum (1.125rem)
Line-height: 2.0 (Nastaliq needs more vertical space)
Direction: RTL (right-to-left)
Alignment: right
```

---

## Spacing System

**Base unit:** 4px (8px grid)

```
--space-xs: 4px (0.25rem)
--space-sm: 8px (0.5rem)
--space-md: 16px (1rem)
--space-lg: 24px (1.5rem)
--space-xl: 32px (2rem)
--space-2xl: 48px (3rem)
--space-3xl: 64px (4rem)
```

**Usage:**
- Component padding: 16px (md) or 24px (lg)
- Section spacing: 32px (xl) or 48px (2xl)
- Gap between cards: 24px (lg)
- Gap between elements in card: 16px (md)

---

## Border Radius

```
--radius-sm: 6px (0.375rem)     # Small elements (badges, tags)
--radius-md: 8px (0.5rem)       # Inputs, small cards
--radius-lg: 12px (0.75rem)     # Medium cards
--radius-xl: 16px (1rem)        # Large cards, modals
--radius-2xl: 24px (1.5rem)     # Hero cards, main containers
--radius-full: 9999px           # Pills, circular buttons
```

**Usage:**
- Buttons: `rounded-full` (9999px) for primary CTAs, `rounded-xl` (16px) for secondary
- Cards: `rounded-2xl` (24px) for main cards, `rounded-xl` (16px) for nested cards
- Inputs: `rounded-xl` (16px) for textareas, `rounded-full` (9999px) for search
- Badges: `rounded-full` (9999px)

---

## Shadows

```
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)
```

**Usage:**
- Cards: `shadow-sm` (subtle depth)
- Buttons (hover): `shadow-md` → `shadow-lg`
- Modals: `shadow-xl`
- Floating elements: `shadow-lg`

---

## Component Specifications

### 1. Top Bar (Header)
**Dimensions:**
- Height: 64px
- Max-width: 768px (3xl)
- Padding: 24px horizontal

**Elements:**
- Logo: 32x32px square, rounded-lg (8px), accent-primary background, white "S" text (14px bold)
- Title: "SunoGov" — 18px, weight 600, ink color
- Search button: 36x36px circle, paper-3 background, search icon (16px, ink-3)
- Theme toggle: 36x36px circle, paper-3 background, sun/moon icon (16px, ink-3)

**Style:**
- Background: paper with 80% opacity + backdrop-blur-xl
- Border-bottom: 1px rule color
- Position: sticky top-0, z-50

**States:**
- Default: as above
- Hover (buttons): paper-2 background

---

### 2. Input Panel (Hero Component)
**Dimensions:**
- Max-width: 768px
- Padding: 24px
- Border-radius: 24px (2xl)

**Elements:**
- **Textarea:**
  - Min-height: 120px
  - Max-height: 200px (auto-resize)
  - Font: 16px, ink color
  - Placeholder: "Describe your civic issue..." (ink-4)
  - Background: transparent
  - Border: none
  - Focus: outline-none

- **Voice Button (English):**
  - Size: 48x48px circle
  - Background: paper-3 (default), accent-primary (recording)
  - Icon: Mic (20px, ink-2 or accent-ink)
  - Animation: pulsing ring when recording

- **Voice Button (Urdu):**
  - Size: 48x48px circle
  - Background: paper-3
  - Text: "اردو" (14px, Nastaliq, ink-2)

- **Image Upload Button:**
  - Size: 48x48px circle
  - Background: paper-3
  - Icon: Image (20px, ink-2)

- **Submit Button:**
  - Padding: 12px 32px (py-3 px-8)
  - Border-radius: full (9999px)
  - Background: accent-primary
  - Text: "Submit" (16px, weight 500, accent-ink)
  - Icon: Send (16px, accent-ink)
  - Shadow: shadow-lg
  - Disabled: opacity 50%, cursor not-allowed

- **Image Preview (conditional):**
  - Height: 96px
  - Border-radius: 12px (xl)
  - Border: 1px rule
  - Remove button: 24x24px circle, error background, X icon (12px, white)

**Style:**
- Background: surface with 80% opacity + backdrop-blur-xl
- Border: 1px rule
- Shadow: shadow-sm

**Layout:**
- Top: Textarea (full width)
- Bottom: Flex row, space-between
  - Left: Voice + Image buttons (gap 8px)
  - Right: Submit button

**States:**
- Default: as above
- Recording (voice): accent-primary background, pulsing animation
- Loading (submit): spinner icon, "Classifying..." text
- Disabled (submit): opacity 50%

---

### 3. Reasoning Card
**Dimensions:**
- Max-width: 768px
- Padding: 24px
- Border-radius: 24px (2xl)

**Elements:**
- **Issue Display:**
  - Font: 18px, weight 600, ink color
  
- **Department Name:**
  - Font: 14px, weight 400, ink-3
  - City: ink-4, "·" separator

- **Confidence Badge:**
  - Padding: 6px 12px (py-1.5 px-3)
  - Border-radius: full (9999px)
  - Font: 14px, weight 500
  - Icon: CheckCircle/AlertCircle/XCircle (16px)
  - Colors:
    - ≥80%: success/10 background, success text
    - 50-79%: warning/10 background, warning text
    - <50%: error/10 background, error text

- **Reason Text (conditional):**
  - Font: 14px, italic, ink-3
  - Border-top: 1px rule
  - Margin-top: 16px
  - Padding-top: 16px

**Style:**
- Background: surface with 80% opacity + backdrop-blur-xl
- Border: 1px rule
- Shadow: shadow-sm

**Layout:**
- Top row: Flex, space-between
  - Left: Issue + Department (stacked)
  - Right: Confidence badge
- Bottom: Reason text (if present)

---

### 4. Submission Hub
**Dimensions:**
- Max-width: 768px
- Padding: 24px
- Border-radius: 24px (2xl)

**Elements:**
- **Section Heading:**
  - "How to Submit" — 18px, weight 600, ink
  - Margin-bottom: 16px

- **Channel Cards (grid 2 columns desktop, 1 column mobile):**
  - Padding: 16px
  - Border-radius: 12px (xl)
  - Background: paper-2
  - Gap: 12px between cards

  **Card Elements:**
  - **Icon Circle:**
    - Size: 40x40px circle
    - Background: accent-light
    - Icon: 20px, accent-primary
    - Icons by type:
      - Portal: Globe
      - Helpline: Phone
      - App: Smartphone
      - Email: Mail
      - Office: MapPin
      - Hours: Clock

  - **Label:**
    - Font: 14px, weight 500, ink

  - **Value:**
    - Font: 14px, weight 400, ink-3
    - Portal/Email: accent color, underline on hover, external link icon
    - Helpline: tel: link, hover accent
    - Office/Hours: copy button on hover (opacity 0 → 1)

**Style:**
- Background: surface with 80% opacity + backdrop-blur-xl
- Border: 1px rule
- Shadow: shadow-sm

**Layout:**
- Heading (full width)
- Grid: 2 columns (desktop), 1 column (mobile), gap 12px

**States:**
- Default: as above
- Hover (card): scale 1.01, paper-3 background

---

### 5. Complaint Box
**Dimensions:**
- Max-width: 768px
- Padding: 24px
- Border-radius: 24px (2xl)

**Elements:**
- **Section Heading:**
  - "Your Complaint" — 18px, weight 600, ink

- **Tab Switcher:**
  - Container: paper-3 background, rounded-full, padding 4px
  - Tabs: 2 buttons (English, اردو)
    - Padding: 6px 16px (py-1.5 px-4)
    - Border-radius: full
    - Font: 14px, weight 500
    - Active: surface background, ink text, shadow-sm
    - Inactive: transparent, ink-3 text

- **Content Area:**
  - Min-height: 200px
  - Padding: 16px
  - Border-radius: 12px (xl)
  - Background: paper-2
  - Border: 1px rule
  - English: monospace font, 14px, LTR
  - Urdu: Nastaliq font, 18px, RTL, line-height 2.0

- **Copy Button:**
  - Position: absolute, top-right (12px from edges)
  - Size: 32x32px
  - Border-radius: 8px (lg)
  - Background: surface
  - Border: 1px rule
  - Icon: Copy/Check (16px, ink-3 or success)
  - Shadow: shadow-sm

- **Download Button:**
  - Full-width
  - Padding: 12px (py-3)
  - Border-radius: full
  - Border: 1px rule
  - Font: 16px, weight 500, ink
  - Icon: Download (16px)
  - Margin-top: 16px

**Style:**
- Background: surface with 80% opacity + backdrop-blur-xl
- Border: 1px rule
- Shadow: shadow-sm

**Layout:**
- Top row: Flex, space-between
  - Left: Heading
  - Right: Tab switcher
- Middle: Content area (relative positioning for copy button)
- Bottom: Download button

**States:**
- Default: as above
- Copied: checkmark icon, success color (2s then revert)
- Hover (download): paper-3 background

---

### 6. Bottom Navigation (Mobile Only)
**Dimensions:**
- Height: 64px
- Position: fixed bottom-0
- Background: paper
- Border-top: 1px rule

**Elements:**
- **Nav Items (3):**
  - Home, Recent, About
  - Icon: 24px, ink-3 (default), accent-primary (active)
  - Label: 12px, ink-3 (default), accent-primary (active)
  - Active indicator: 4x4px circle, accent-primary, bottom-center

**Layout:**
- Flex row, space-around
- Each item: flex column, items-center, gap 4px

**States:**
- Default: ink-3
- Active: accent-primary + dot indicator
- Hover: ink-2

---

## Page Layouts

### Home / Input Page
```
┌─────────────────────────────────────────────┐
│  Top Bar (sticky)                           │
├─────────────────────────────────────────────┤
│                                             │
│  Hero Section (conditional)                 │
│  - Headline: "Apni Baat, Sahi Jagah"        │
│  - Subheadline: "Your Voice, Right Place"   │
│                                             │
│  Input Panel                                │
│  - Textarea                                 │
│  - Voice + Image buttons                    │
│  - Submit button                            │
│                                             │
│  [Bottom Nav — mobile only]                 │
└─────────────────────────────────────────────┘
```

**Spacing:**
- Top bar → Hero: 32px
- Hero → Input Panel: 24px
- Input Panel → Bottom Nav: 32px (mobile)

**Max-width:** 768px, centered

---

### Results Page
```
┌─────────────────────────────────────────────┐
│  Top Bar (sticky)                           │
├─────────────────────────────────────────────┤
│                                             │
│  Reasoning Card                             │
│  - Issue + Department + Confidence          │
│  - Reason text                              │
│                                             │
│  Submission Hub                             │
│  - 6 channel cards (2x3 grid)               │
│                                             │
│  Complaint Box                              │
│  - Tabs (English / Urdu)                    │
│  - Content area                             │
│  - Download button                          │
│                                             │
│  "File Another Complaint" button            │
│                                             │
│  [Bottom Nav — mobile only]                 │
└─────────────────────────────────────────────┘
```

**Spacing:**
- Top bar → Reasoning Card: 32px
- Between cards: 24px
- Last card → "File Another" button: 24px
- Button → Bottom Nav: 32px (mobile)

**Max-width:** 768px, centered

---

## Responsive Breakpoints

```
Mobile: < 768px
  - Single column layout
  - Bottom navigation visible
  - Input Panel: full-width submit button
  - Submission Hub: 1 column grid
  - Padding: 16px horizontal

Tablet: 768px - 1024px
  - Single column layout (max-width 768px)
  - Bottom navigation visible
  - Submission Hub: 2 column grid
  - Padding: 24px horizontal

Desktop: ≥ 1024px
  - Single column layout (max-width 768px, centered)
  - Bottom navigation hidden
  - Submission Hub: 2 column grid
  - Padding: 24px horizontal
```

---

## Interaction States

### Buttons
```
Default: as specified
Hover: scale 1.02, shadow-md, background lighten/darken
Active: scale 0.98
Focus: 2px accent-primary ring, 2px offset
Disabled: opacity 50%, cursor not-allowed
Loading: spinner icon, text changes
```

### Cards
```
Default: as specified
Hover: scale 1.01, background paper-3
```

### Inputs
```
Default: transparent background
Focus: outline-none, ring 2px accent-primary
Error: ring 2px error, error message below
```

---

## Animation Specifications

### Page Transitions
```
Fade-in: opacity 0 → 1, duration 400ms, ease-out
Slide-up: y 20 → 0, duration 400ms, ease-out
Combined: fade + slide, stagger 100ms between cards
```

### Button Hover
```
Scale: 1.0 → 1.02, duration 200ms
Shadow: shadow-sm → shadow-md, duration 200ms
```

### Voice Recording
```
Pulsing ring: scale 1 → 1.2, opacity 1 → 0, duration 1500ms, repeat infinite
```

### Card Entrance
```
Stagger: 100ms delay between cards
Animation: fade-in + slide-up, duration 400ms
Easing: cubic-bezier(0.16, 1, 0.3, 1)
```

---

## Accessibility Requirements

### Contrast Ratios (WCAG AA)
```
Text on background: ≥ 4.5:1
accent-primary on white: 7.5:1 ✅
ink on paper: 15.4:1 ✅
ink-3 on paper: 4.6:1 ✅
```

### Focus States
```
All interactive elements: 2px accent-primary ring, 2px offset
Never animate focus ring (instant appearance)
```

### Touch Targets
```
Minimum: 44x44px
Voice button: 48x48px (primary action)
Submit button: 48px height minimum
```

---

## Icon Library

**Use Lucide Icons (https://lucide.dev/)**

**Icons needed:**
- Mic (voice input)
- Image (image upload)
- Send (submit)
- Loader2 (loading spinner)
- X (close/remove)
- Search (search button)
- Moon / Sun (theme toggle)
- CheckCircle / AlertCircle / XCircle (confidence)
- Globe (portal)
- Phone (helpline)
- Smartphone (app)
- Mail (email)
- MapPin (office)
- Clock (hours)
- ExternalLink (external links)
- Copy (copy button)
- Check (success state)
- Download (download button)

**Icon sizes:**
- Small: 16px (buttons, badges)
- Medium: 20px (card icons)
- Large: 24px (navigation)

---

## Figma Component Structure

### Recommended Figma Pages
1. **Design System** — tokens, colors, typography, components
2. **Home / Input** — input page layout
3. **Results** — results page layout
4. **Components** — all reusable components
5. **Prototypes** — interactive flows

### Component Variants
```
Button:
  - Primary (accent background)
  - Secondary (outlined)
  - Icon (circle)
  - States: default, hover, active, focus, disabled, loading

Card:
  - Reasoning Card
  - Submission Hub
  - Complaint Box
  - Channel Card

Input:
  - Textarea
  - Voice Button
  - Image Upload
  - Submit Button

Badge:
  - Confidence (success, warning, error)
  - Language (English, Urdu)
```

---

## Export Specifications

### For Development Handoff
```
Colors: Export as CSS variables (OKLCH) + hex fallbacks
Typography: Export as CSS font stacks
Spacing: Export as CSS variables (px + rem)
Components: Export as React components with Tailwind classes
Icons: Export as SVG (Lucide)
```

### For Figma Variables
```
Create variables for:
- All colors (light + dark mode)
- All spacing values
- All border-radius values
- All shadow values
- Typography styles (font, size, weight, line-height)
```

---

## Notes for Figma Designer

1. **Start with Design System page** — create all color styles, text styles, and effects
2. **Use Auto Layout** for all components (responsive by default)
3. **Create component variants** for all interactive states
4. **Test dark mode** — create both light and dark versions
5. **Test RTL** — create Urdu version of complaint box
6. **Use constraints** — ensure components resize correctly
7. **Add prototype connections** — link Home → Results flow
8. **Export tokens** — use Figma Tokens plugin for dev handoff

---

**Last Updated:** 2026-07-25
**Version:** 1.0
**Figma File:** [To be created]
