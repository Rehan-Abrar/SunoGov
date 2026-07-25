# SunoGov UI — Next.js

A civic complaint routing tool for Pakistani citizens. Built with Next.js 15, React 18, Tailwind CSS v4, and Framer Motion.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Project Structure

```
Highfidelity/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── results/           # Results page
│   ├── about/             # About page
│   ├── dashboard/         # Dashboard page
│   ├── not-found.tsx      # 404 page
│   ├── api/               # API routes
│   │   └── classify/      # Complaint classification endpoint
│   └── globals.css        # Global styles
├── components/
│   ├── SunoGovApp.tsx     # Main app component (monolithic)
│   ├── ui/                # shadcn/ui components
│   └── figma/             # Figma-specific components
├── lib/
│   └── utils.ts           # Utility functions
├── styles/
│   ├── fonts.css          # Font imports
│   ├── tailwind.css       # Tailwind configuration
│   ├── theme.css          # Design tokens (light/dark)
│   └── globals.css        # Base styles
└── public/                # Static assets
```

## Features

- **Bilingual Support**: English and Urdu (RTL)
- **Dark/Light Mode**: Theme toggle with smooth transitions
- **Voice Input**: Record complaints in English or Urdu
- **Image Upload**: Attach photos of civic issues
- **Smart Routing**: AI identifies the right government department
- **Command Palette**: Quick search with Cmd+K
- **Responsive Design**: Mobile-first with bottom navigation
- **Animations**: Smooth transitions with Framer Motion and GSAP

## Pages

- **Home** (`/`) — Main input interface
- **Results** (`/results`) — Classification results and submission channels
- **About** (`/about`) — Information about SunoGov
- **Dashboard** (`/dashboard`) — Complaint statistics and history

## API Routes

- `POST /api/classify` — Classify a complaint (stub implementation)

## Design System

- **Primary Color**: Teal-700 (#0F766E)
- **Fonts**: Inter (Latin), Noto Nastaliq Urdu (Urdu)
- **Components**: shadcn/ui with custom theme
- **Icons**: Phosphor Icons

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 18.3.1
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, GSAP
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Phosphor Icons, Lucide React
- **Charts**: Recharts

## License

Built at the Qwen Pakistan AI Buildathon 2026.
