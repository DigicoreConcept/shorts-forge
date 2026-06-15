# ShortForge

## Platform Introduction

ShortForge is a SaaS platform that turns long-form videos into ready-to-publish short clips automatically. Users upload a video (or paste a public URL), define clip timeframes, and the platform generates clips, AI captions, titles, descriptions, and hashtags. Built for podcasters, marketers, and content agencies.

---

## Architecture Overview

- **Frontend**: React 18 + Vite 6 + TypeScript
- **Styling**: Tailwind CSS v3 (PostCSS)
- **Animations**: Framer Motion
- **Routing**: React Router v7
- **State**: Zustand (auth + UI) · TanStack Query v5 (server state)
- **Icons**: Lucide React v1
- **File upload**: react-dropzone
- **Design**: Dark SaaS UI — inspired by Notion / Linear / Stripe

All backend processing is mocked in the frontend. API calls are stubbed with `useMockJob` patterns — swap for real endpoints when the backend is ready.

---

## Installation

```bash
git clone <repo>
cd ShortForge
npm install
npm run dev
```

Access at: `http://localhost:5173`

---

## Commands Used During Development

| Command | Purpose |
|---|---|
| `npx -y create-vite@latest ./ --template react --no-interactive` | Scaffold React + Vite project |
| `npm install` | Install base dependencies |
| `npm install framer-motion lucide-react react-router-dom @tanstack/react-query zustand react-dropzone clsx tailwind-merge recharts` | Install frontend libraries |
| `npm install -D tailwindcss@3 postcss autoprefixer` | Install Tailwind CSS v3 |
| `npx tailwindcss@3 init -p` | Generate tailwind.config.js and postcss.config.js |
| `npm install -D typescript @types/node @types/react @types/react-dom` | TypeScript support |
| `npm run dev` | Start development server |
| `npm run build` | Production build (verify before deploy) |

**Note**: Tailwind v4 was attempted but removed — its native Rust binary (`oxide`) causes a Bus Error on this machine. Tailwind v3 with PostCSS is stable and equivalent for this project.

---

## Feature Explanations

### Public Pages
- **Homepage** — Hero, how-it-works flow, features grid, results stats, testimonials, pricing preview, FAQ, CTA banner
- **Features** — Full feature breakdown (8 cards)
- **Pricing** — 3-tier cards (Starter $19 / Creator $49 / Agency $149) + Enterprise contact block
- **About** — Mission, story, values, roadmap

### Auth
- **Login** — Email/password with remember me. Google OAuth stubbed (Coming Soon)
- **Register** — Full name, email, password with confirm
- **Forgot Password** — Email reset with success state

### Dashboard
- **Dashboard Home** — 4 stat cards (uploads, clips, storage, credits) + recent jobs table
- **Upload Page** — Drag-and-drop file zone OR public URL, title, language, clip duration (30s/60s/90s/custom), custom timeframe ranges
- **Processing Page** — Immersive full-screen animated pipeline with 5 steps: Upload progress → Waveform animation → Clip materializing → Typing metadata → Success burst. Auto-redirects on completion
- **Clips** — Responsive grid, search, preview modal, edit/download/delete actions
- **Clip Detail** — Video player, editable title/description/tags, copy-to-clipboard, regenerate
- **Channels** — YouTube (connect ready), TikTok/Instagram (coming soon)
- **Billing** — Plan + renewal info, usage bars with color-coded warnings, payment method
- **Settings** — Tabs: Profile (avatar, name, email), Notifications (toggles), Security (password change, 2FA stub)

---

## Route Map

```
/                          Homepage
/features                  Features
/pricing                   Pricing
/about                     About
/login                     Login
/register                  Register
/forgot-password           Forgot Password
/dashboard                 Dashboard Home
/dashboard/upload          Upload Page
/dashboard/processing/:id  Processing Page (full-screen)
/dashboard/clips           Clips Grid
/dashboard/clips/:id       Clip Detail
/dashboard/projects        Projects (stub)
/dashboard/channels        Channels
/dashboard/billing         Billing
/dashboard/settings        Settings
```

---

## API Overview

All API calls are currently mocked. Replace the following stubs with real backend calls:

| Location | Mock | Real endpoint (future) |
|---|---|---|
| `Login.tsx` | Hardcoded user object | `POST /api/auth/login` |
| `Register.tsx` | Hardcoded user object | `POST /api/auth/register` |
| `UploadPage.tsx` | Generates fake jobId | `POST /api/jobs` |
| `ProcessingPage.tsx` | Local state machine timer | `GET /api/jobs/:id` (poll) |
| `ClipsPage.tsx` | `mockClips` array | `GET /api/clips` |
| `BillingPage.tsx` | Hardcoded usage | `GET /api/billing/usage` |

---

## Theme System

Design tokens are based on a custom red-themed Light Mode palette, defined in `tailwind.config.js` and inline:
- Primary Accent: `#EF5350`
- Secondary Accent: `#C62828`
- Background Light: `#FFEBEE`
- Background Darker: `#FFF5F5`
- Card Background: `#FFFFFF`
- Borders: `#FFCDD2`
- Text (Dark): `#1A1A1A`
- Text (Muted): `#616161`
- Sidebar/Dark Panel: `#1A1A1A`

Typography relies on Google Fonts:
- **Headings & Numbers**: `Bebas Neue`
- **Body & UI**: `Inter`

All pages use raw Tailwind utility classes with inline hex colors for precision. The design adopts an editorial, high-contrast, premium SaaS aesthetic without relying on external component libraries like Shadcn/UI.
