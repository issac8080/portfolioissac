# Issac Sunny — AI Engineer Portfolio

A futuristic AI-themed portfolio built with Next.js 14, TailwindCSS, Framer Motion, GSAP ScrollTrigger, and Three.js. Designed to feel like an interactive AI research lab dashboard.

## Tech Stack

- **Next.js 14** (App Router)
- **TailwindCSS** — styling, glassmorphism, gradients
- **Framer Motion** — micro-interactions, magnetic buttons, text reveal
- **GSAP + ScrollTrigger** — parallax, scroll-triggered reveals, depth-based sections
- **Three.js** (via @react-three/fiber) — neural network particle background
- **Shadcn UI** — Dialog, Button, Input components

## Features

- **Hero**: Three.js neural network background, parallax intro, floating role text, magnetic CTA buttons
- **Projects**: Category filter, 3D tilt cards, expandable modal, GitHub-ready
- **Experience**: Scroll-triggered vertical timeline with node animations
- **Research**: Featured publication (Behavioral Insider Threat Detection — Hybrid Transformer-LSTM Autoencoder), workflow stepper, metrics panel
- **Skills**: Animated radial progress, interactive tech stack hover
- **Leadership**: IEEE Computer Society Chair, motion card stack
- **Contact**: Floating panel, magnetic inputs, phone/email/LinkedIn
- **Mobile**: Fixed top bar with menu + safe areas; floating music reads an MP3 from **`public/`** (default: Syn Cole NCS track name) or **`NEXT_PUBLIC_AMBIENT_MUSIC_PATH`**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Resume PDF (preview + Q&A modal)

Place your file at **`public/issac_sunny_resume.pdf`**. Nav **Resume → Preview résumé & Q&A** opens an **in-page modal**: PDF beside Q&A grounded in the same profile as the site. Optional richer answers can be enabled via server config (see env table below); otherwise replies stay short and pattern-matched from that data. **Download** still fetches the PDF. Legacy URL **`/resume-study`** redirects to **`/?resumeStudy=1`**. Set **`NEXT_PUBLIC_RESUME_PDF_PATH`** to override the public path.

The layout uses fluid **`clamp` / `min` / `vw`** spacing and extra breakpoints **`3xl` (1920px)** and **`4xl` (2560px)** for large monitors and TVs; the nav and hero cap content width so lines stay readable on ultrawide screens.

### Windows / OneDrive (missing chunks, `Cannot find module './8948.js'`, 404 on `/_next/static/chunks/*`)

If the repo lives under **`OneDrive - …`** (not only `OneDrive\`), this project now treats that as OneDrive and puts the **dev** build output under **`%TEMP%\next-dist-portfolio-issac`** so sync does not tear apart `.next`. `npm run dev` sets **`NODE_PATH`** to this repo’s `node_modules` so server bundles compiled under Temp can still `require("next/…")`.

After upgrading, **stop** `npm run dev`, wipe caches, then start again:

```bash
npm run dev:clean
```

If anything still looks stale, run `npm run clean` then `npm run dev`. Only run **one** dev server on port 3000 (two processes sharing output causes the same chunk errors).

**Port 3000 in use but no terminal:** Cursor (or a background task) can leave **`node … next\dist\server\lib\start-server.js`** running. Run `npm run dev:kill-port` (Windows) to stop only this repo’s Next dev on that port, then `npm run dev` again.

## Build

```bash
npm run build
npm start
```

## Environment

Core features work **without** environment variables.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for Open Graph, `metadataBase`, and JSON-LD (default: `http://localhost:3000`). Set to your production URL in deploy. |
| `NEXT_PUBLIC_CALENDLY_URL` | Optional full Calendly scheduling link; shown in Hero and Contact when set. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional [Plausible](https://plausible.io) domain (e.g. `yoursite.com`); loads the script in `layout.tsx`. |
| `CONTACT_WEBHOOK_URL` | Optional HTTPS endpoint — receives a **background** JSON `POST` when someone uses **Send message (open in email)** (same payload as before). Primary UX is their mail app with a pre-filled draft to `contact.email` in `portfolio.ts`. |
| `OPENAI_API_KEY` | Optional. Enables the portfolio chat **GPT** toggle: server-side Chat Completions using the **same RAG excerpts** as on-device retrieval. Never use `NEXT_PUBLIC_*` for keys. |
| `OPENAI_CHAT_MODEL` | Optional override (default `gpt-4o-mini`). |

Machine-readable profile: **`GET /api/portfolio`** (static JSON). Chat config: **`GET /api/chat`** → `{ "openai": true }` when `OPENAI_API_KEY` is set. Résumé study: **`GET /api/resume-chat`** → `{ "enabled": true }`. **`/api/chat`** and **`/api/resume-chat`** support **`OPTIONS`** and set **`Access-Control-Allow-Origin`** when the request **`Origin`** matches **`NEXT_PUBLIC_SITE_URL`** or localhost (for cross-origin tooling); same-origin use from this app does not require CORS.

## Content

Profile data lives in `src/data/portfolio.ts`. Update contact, experience, projects, skills, and publication there. Case studies live in `src/data/caseStudies.ts`. Site “Now” line and last-updated date: `src/data/siteMeta.ts`.
