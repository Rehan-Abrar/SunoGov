# Design System — SunoGov
**ARC Browser-Inspired UI/UX for Civic Navigation**

---

## Design Philosophy

SunoGov combines ARC Browser's modern, fluid aesthetic with the professionalism required for a government-adjacent civic app. The result is an interface that feels approachable and powerful, not bureaucratic or playful.

### Core Principles

1. **Sidebar-first layout** (desktop) → Bottom nav (mobile)
2. **Soft depth** — no hard borders, use shadows + subtle gradients
3. **Pill-shaped elements** — buttons, inputs, cards all use `rounded-2xl` to `rounded-full`
4. **Frosted glass effects** — `backdrop-blur` on floating elements
5. **Muted base + one accent color** — not rainbow, not flat
6. **Micro-animations everywhere** — Framer Motion for page transitions, hover states, loading
7. **Command palette** (⌘K) — power-user feature, very ARC

---

## Color Palette

### Primary Accent: Pakistan Green (Refined)

```css
--accent-primary: #0F766E    /* teal-700 — buttons, active states, links */
--accent-hover: #0D5F58      /* darker on hover */
--accent-light: #CCFBF1      /* teal-50 — badges, highlights */
```

**Why teal-700:**
- Professional, not playful (unlike bright green)
- Works for both Urdu and English text (high contrast)
- Government-appropriate tone

### Neutral Base

```css
/* Light Mode */
--bg-primary: #FFFFFF
--bg-secondary: #F9FAFB      /* gray-50 */
--bg-tertiary: #F3F4F6       /* gray-100 */
--text-primary: #111827      /* gray-900 */
--text-secondary: #6B7280    /* gray-500 */
--border: #E5E7EB            /* gray-200 */

/* Dark Mode */
--bg-primary: #0A0A0A
--bg-secondary: #171717      /* neutral-900 */
--bg-tertiary: #262626       /* neutral-800 */
--text-primary: #FAFAFA      /* neutral-50 */
--text-secondary: #A3A3A3    /* neutral-400 */
--border: #262626            /* neutral-800 */
```

### Semantic Colors

```css
--success: #10B981           /* emerald-500 — high confidence, verified */
--warning: #F59E0B           /* amber-500 — medium confidence, estimated data */
--error: #EF4444             /* red-500 — low confidence, API errors */
--info: #3B82F6              /* blue-500 — informational badges */
```

**Usage:**
- Confidence ≥ 0.8 → success (green)
- Confidence 0.5–0.8 → warning (amber)
- Confidence < 0.5 → error (red)
- Estimated data → warning badge

---

## Typography

### Latin (English)

```css
Font Family: 'Inter', sans-serif
Font Weights: 400 (normal), 500 (medium), 600 (semibold)
Letter Spacing: -0.02em (headings), 0 (body)
Line Height: 1.5 (body), 1.2 (headings)
```

### Urdu

```css
Font Family: 'Noto Nastaliq Urdu', serif
Direction: RTL (right-to-left)
Line Height: 2.0 (Nastaliq needs more vertical space)
Font Size: 1.125rem (18px) minimum for readability
Font Weight: 400 (normal), 700 (bold for headings)
```

**Why Nastaliq:** Standard Urdu script used in Pakistan, more legible than Naskh for formal complaints.

### Type Scale

```css
/* Page Title */
font-size: 2.25rem;          /* 36px */
font-weight: 600;
line-height: 1.2;
letter-spacing: -0.02em;

/* Section Heading */
font-size: 1.5rem;           /* 24px */
font-weight: 600;
line-height: 1.3;

/* Card Title */
font-size: 1.125rem;         /* 18px */
font-weight: 500;
line-height: 1.4;

/* Body */
font-size: 1rem;             /* 16px */
font-weight: 400;
line-height: 1.5;

/* Caption */
font-size: 0.875rem;         /* 14px */
font-weight: 400;
line-height: 1.4;
color: var(--text-secondary);
```

---

## Layout Structure

### Desktop (≥1024px)

```
┌─────────────────────────────────────────────┐
│  [Logo]  SunoGov              [⌘K] [Theme]  │  ← Top bar (h-16, sticky)
├─────────────────────────────────────────────┤
│                                             │
│  Main Content Area                          │
│  (max-w-3xl, centered)                      │
│                                             │
│  - Input Panel (hero section)               │
│  - Results (stacked cards)                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Key specs:**
- Top bar: `h-16`, `sticky top-0`, `bg-primary/80 backdrop-blur-xl`, `border-b`
- Content: `max-w-3xl mx-auto`, `px-6`, `py-8`
- Cards: `rounded-2xl`, `shadow-sm`, `border border-border`

### Mobile (<1024px)

```
┌─────────────────────┐
│  SunoGov    [⌘K]    │  ← Compact header
├─────────────────────┤
│                     │
│  Main Content       │
│  (full width)       │
│                     │
├─────────────────────┤
│  [🏠] [📋] [ℹ️]    │  ← Bottom nav (fixed)
└─────────────────────┘
```

**Key specs:**
- Header: `h-14`, `px-4`
- Content: `px-4`, `py-6`, `pb-20` (space for bottom nav)
- Bottom nav: `fixed bottom-0`, `h-16`, `bg-primary`, `border-t`

**Differences from ARC:**
- No persistent sidebar (civic app doesn't need multi-section nav)
- Single-column content (mobile-first)
- Top bar instead of sidebar for desktop

---

## Component Patterns

### 1. Input Panel (Hero Section)

**Structure:**
```tsx
<div className="rounded-2xl bg-secondary shadow-sm border border-border p-6">
  <textarea
    className="w-full min-h-[120px] bg-transparent border-0 resize-none
               text-primary placeholder:text-secondary
               focus:outline-none focus:ring-0"
    placeholder="Describe your civic issue..."
  />
  <div className="flex items-center justify-between mt-4">
    <div className="flex gap-2">
      <VoiceButton />      {/* Circular, accent-primary */}
      <ImageButton />      {/* Icon button */}
      <CitySelector />     {/* Optional dropdown */}
    </div>
    <SubmitButton />       {/* Full-width on mobile */}
  </div>
</div>
```

**Voice Button:**
- Circular: `w-12 h-12 rounded-full`
- Accent background: `bg-accent-primary text-white`
- Pulsing animation when active: `animate-pulse`
- Icon: microphone (Lucide)

**Submit Button:**
- Desktop: `px-8 py-3 rounded-full`
- Mobile: `w-full py-4 rounded-full`
- Accent background: `bg-accent-primary hover:bg-accent-hover`
- Shadow: `shadow-lg hover:shadow-xl`
- Loading state: spinner inside button

**Placeholder Text:**
- English: "Describe your civic issue..."
- Urdu: "اپنا شہری مسئلہ بیان کریں..."
- Rotate based on detected language

### 2. Reasoning Card

**Structure:**
```tsx
<div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20
                shadow-sm p-6">
  <div className="flex items-start justify-between">
    <div>
      <h3 className="text-lg font-semibold text-primary">
        {issue_display}
      </h3>
      <p className="text-sm text-secondary mt-1">
        {department.name}
      </p>
    </div>
    <ConfidenceBadge confidence={confidence} />
  </div>
  <p className="text-sm text-secondary italic mt-4">
    {department.reason}
  </p>
</div>
```

**Confidence Badge:**
```tsx
<span className={`
  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
  ${confidence >= 0.8 ? 'bg-success/10 text-success' :
    confidence >= 0.5 ? 'bg-warning/10 text-warning' :
    'bg-error/10 text-error'}
`}>
  {Math.round(confidence * 100)}% confident
</span>
```

**Animation:**
- Entrance: `fade-in + slide-up` (Framer Motion)
- Duration: `0.4s`, ease-out

### 3. Submission Hub

**Structure:**
```tsx
<div className="rounded-2xl bg-secondary border border-border p-6">
  <h3 className="text-lg font-semibold text-primary mb-4">
    Submit Your Complaint
  </h3>
  <div className="grid grid-cols-2 gap-4">
    <ChannelCard type="portal" />
    <ChannelCard type="helpline" />
    <ChannelCard type="app" />
    <ChannelCard type="office" />
  </div>
</div>
```

**Channel Card:**
```tsx
<div className="flex items-start gap-3 p-4 rounded-xl bg-primary
                hover:bg-tertiary transition-colors">
  <Icon className="w-5 h-5 text-accent-primary mt-0.5" />
  <div className="flex-1">
    <p className="text-sm font-medium text-primary">{label}</p>
    <p className="text-sm text-secondary mt-0.5">{value}</p>
  </div>
</div>
```

**Channel Types:**
- **Portal:** External link icon, opens in new tab, accent button
- **Helpline:** Phone icon, `tel:` link, large font
- **App:** App store icon, download link
- **Office:** Map pin icon, copy-to-clipboard
- **Email:** Mail icon, `mailto:` link
- **Hours:** Clock icon, text-secondary

### 4. Complaint Box

**Structure:**
```tsx
<div className="rounded-2xl bg-secondary border border-border p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-primary">
      Your Complaint
    </h3>
    <div className="flex gap-2">
      <TabButton active={activeTab === 'ur'}>اردو</TabButton>
      <TabButton active={activeTab === 'en'}>English</TabButton>
    </div>
  </div>
  <div className="relative">
    <pre className="whitespace-pre-wrap text-primary font-mono text-sm
                    bg-primary rounded-xl p-4 border border-border">
      {activeTab === 'ur' ? complaint_ur : complaint_en}
    </pre>
    <CopyButton className="absolute top-2 right-2" />
  </div>
  <button className="mt-4 w-full py-3 rounded-full border border-border
                     hover:bg-tertiary transition-colors">
    Download PDF
  </button>
</div>
```

**Urdu Tab:**
```tsx
<pre dir="rtl" className="font-nastaliq text-lg leading-loose">
  {complaint_ur}
</pre>
```

**Copy Button:**
- Icon: clipboard (Lucide)
- Tooltip: "Copy to clipboard"
- Success state: checkmark icon for 2s

### 5. Command Palette (⌘K)

**Structure:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="rounded-2xl overflow-hidden shadow-2xl">
    <div className="p-4 border-b border-border">
      <input
        type="text"
        placeholder="Search complaints, departments..."
        className="w-full bg-transparent border-0 focus:outline-none
                   text-primary placeholder:text-secondary"
        autoFocus
      />
    </div>
    <div className="max-h-[400px] overflow-y-auto p-2">
      {results.map(result => (
        <CommandItem key={result.id} {...result} />
      ))}
    </div>
  </DialogContent>
</Dialog>
```

**Keyboard Shortcuts:**
- `⌘K` / `Ctrl+K` — Open palette
- `↑↓` — Navigate results
- `↵` — Select result
- `Esc` — Close palette

**Recent Complaints:**
- Stored in localStorage
- Show last 5 complaints
- Click to view results again

---

## Micro-Interactions (Framer Motion)

### Page Transitions

```tsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  duration: 0.4,
  ease: [0.04, 0.62, 0.23, 0.98] // ease-out
};
```

### Button Hover

```tsx
const buttonVariants = {
  rest: { scale: 1, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 }
  }
};
```

### Voice Recording

```tsx
const pulseVariants = {
  active: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};
```

### Card Entrance

```tsx
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

// Stagger children
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### Loading States

**Skeleton:**
```tsx
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-tertiary rounded w-3/4"></div>
  <div className="h-4 bg-tertiary rounded"></div>
  <div className="h-4 bg-tertiary rounded w-5/6"></div>
</div>
```

**Shimmer:**
```css
.shimmer {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 0%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## Urdu / RTL Support

### Automatic Detection

```tsx
const isRTL = language === 'ur';

<div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
  {content}
</div>
```

### Layout Adjustments

**Icons:**
```tsx
// Mirror action icons for RTL
<ArrowLeft className={isRTL ? 'rotate-180' : ''} />
```

**Padding/Margin:**
```css
/* Use logical properties */
padding-inline-start: 1rem;  /* left in LTR, right in RTL */
padding-inline-end: 1rem;    /* right in LTR, left in RTL */
```

### Typography

**Mixed Content:**
```tsx
{/* Don't mix LTR/RTL inline — use separate containers */}
<div dir="ltr">
  <p>English text</p>
</div>
<div dir="rtl">
  <p className="font-nastaliq">اردو متن</p>
</div>
```

**Numbers:**
```css
/* Numbers always LTR, even in Urdu text */
.phone-number {
  direction: ltr;
  unicode-bidi: isolate;
}
```

---

## Mobile Adaptations

### Bottom Navigation

```tsx
<nav className="fixed bottom-0 left-0 right-0 h-16 bg-primary
                border-t border-border flex items-center justify-around">
  <NavItem icon={Home} label="Home" href="/" />
  <NavItem icon={FileText} label="Recent" href="/recent" />
  <NavItem icon={Info} label="About" href="/about" />
</nav>
```

**Active State:**
```tsx
<span className="absolute bottom-1 left-1/2 -translate-x-1/2
                 w-1 h-1 rounded-full bg-accent-primary" />
```

### Touch Targets

```css
/* Minimum 44x44px for all buttons */
button {
  min-width: 44px;
  min-height: 44px;
}

/* Voice button: primary action */
.voice-button {
  width: 64px;
  height: 64px;
}

/* Spacing between interactive elements */
.interactive-group {
  gap: 1rem; /* gap-4 */
}
```

### Keyboard Handling

```tsx
// Auto-resize textarea
<textarea
  className="min-h-[120px] max-h-[200px] resize-none"
  onInput={(e) => {
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
  }}
/>

// Submit button sticky above keyboard
<div className="sticky bottom-0 bg-primary pt-4">
  <SubmitButton />
</div>
```

---

## Accessibility

### Contrast Ratios

```css
/* WCAG AA compliant (≥ 4.5:1) */
--accent-primary on white: 7.5:1 ✅
--text-primary on white: 15.4:1 ✅
--text-secondary on white: 4.6:1 ✅
--accent-primary on dark: 5.2:1 ✅
```

### Focus States

```css
/* All interactive elements */
button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

### Screen Readers

```tsx
// Icon buttons
<button aria-label="Record voice complaint">
  <MicIcon />
</button>

// Loading states
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? <Skeleton /> : <Content />}
</div>

// Error messages
<div role="alert" className="text-error">
  {errorMessage}
</div>
```

### Keyboard Navigation

```tsx
// Command palette
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

## What Makes This "ARC-Style but Professional"

### ARC Elements We Keep

✅ **Frosted glass effects** — `backdrop-blur-xl` on cards and modals
✅ **Pill-shaped buttons/inputs** — `rounded-full` for CTAs, `rounded-2xl` for cards
✅ **Soft shadows** — `shadow-sm` to `shadow-lg`, no hard borders
✅ **Command palette (⌘K)** — power-user feature
✅ **Micro-animations** — Framer Motion for all transitions
✅ **Dark mode default** — with light mode toggle

### ARC Elements We Skip

❌ **Sidebar navigation** — not needed for single-purpose app
❌ **Tab groups** — we have tabs, but not color-coded groups
❌ **Split view** — mobile-first, single column
❌ **Playful gradients** — we use solid accent colors

### Professional Additions

✅ **High contrast for Urdu text** — Nastaliq font, 18px minimum
✅ **Clear visual hierarchy** — confidence badges, semantic colors
✅ **Trust signals** — verified data badges, official portal links
✅ **Print-friendly PDF layout** — clean complaint format
✅ **Government-appropriate tone** — not startup-playful

---

## Pages & Routing

### Core Pages

1. **Home / Input Page** (`/`)
   - Text input, voice button, image upload
   - City selector (optional pre-filter)
   - The main entry point

2. **Results Page** (`/results`)
   - Reasoning Card
   - Submission Hub
   - Complaint Box (Urdu + English)
   - PDF download

### Supporting Pages

3. **About Page** (`/about`)
   - What SunoGov does
   - How it works (3-step diagram)
   - Team info
   - Privacy notice

4. **404 Page** (`not-found.tsx`)
   - Standard Next.js catch-all
   - "Go Home" button

### Future Pages (If Needed)

5. **Recent Complaints** (`/recent`)
   - LocalStorage-based history
   - Click to view past results

6. **Privacy Policy** (`/privacy`)
   - Required for government-adjacent app

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] Install `framer-motion` and `lucide-react`
- [ ] Set up Tailwind config with custom colors
- [ ] Create global CSS variables (light/dark mode)
- [ ] Build top bar component
- [ ] Build bottom nav component (mobile)

### Phase 2: Input Page

- [ ] Build InputPanel component
- [ ] Add voice button with Web Speech API
- [ ] Add image upload with base64 conversion
- [ ] Add city selector dropdown
- [ ] Wire up API call to `/classify`

### Phase 3: Results Page

- [ ] Build ReasoningCard component
- [ ] Build SubmissionHub component
- [ ] Build ComplaintBox component with tabs
- [ ] Add copy-to-clipboard functionality
- [ ] Add PDF export (react-pdf or print CSS)

### Phase 4: Polish

- [ ] Add Framer Motion animations
- [ ] Implement dark mode toggle
- [ ] Add command palette (⌘K)
- [ ] Test Urdu RTL support
- [ ] Mobile responsive check
- [ ] Accessibility audit

---

## Design Tokens (Tailwind Config)

```js
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        accent: {
          primary: '#0F766E',
          hover: '#0D5F58',
          light: '#CCFBF1',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        nastaliq: ['Noto Nastaliq Urdu', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
};
```

---

## Resources

**Inspiration:**
- ARC Browser — https://arc.net/
- Vercel Dashboard — https://vercel.com/dashboard
- Linear — https://linear.app

**Assets:**
- Lucide Icons — https://lucide.dev/
- Framer Motion — https://www.framer.com/motion/
- Noto Nastaliq Urdu — https://fonts.google.com/specimen/Noto+Nastaliq+Urdu

---

**Last Updated:** 2026-07-25
**Version:** 1.0
