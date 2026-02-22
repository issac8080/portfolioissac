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

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Environment

No env vars required for the portfolio. Optional: add analytics or form backend later.

## Content

Profile data lives in `src/data/portfolio.ts`. Update contact, experience, projects, skills, and publication there.
