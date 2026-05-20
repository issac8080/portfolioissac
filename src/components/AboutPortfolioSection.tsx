"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Cpu,
  Fingerprint,
  Gamepad2,
  Layers,
  Mail,
  Mic,
  MousePointer2,
  Radio,
  Shield,
  Sparkles,
  Workflow,
  FileCode2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LabSectionGridBg } from "@/components/section-hud/LabSectionChrome";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";

const ease = [0.16, 1, 0.3, 1] as const;

const cards = [
  {
    icon: Cpu,
    title: "Engine & delivery",
    accent: "from-cyan-500/25 to-transparent",
    body:
      "Built on **Next.js 14 (App Router)** with TypeScript. Sections mix static content and client islands; heavy widgets load via **`dynamic()`** so first paint stays fast. **Tailwind** drives the glass / neon “AI lab” system; **Framer Motion** handles hero and UI micro-interactions. **API routes** under `src/app/api/*` power chat, contact, resume study, and ambient audio when configured.",
  },
  {
    icon: Bot,
    title: "Portfolio Intelligence",
    accent: "from-emerald-500/25 to-transparent",
    body:
      "**Portfolio Intelligence** is a fullscreen assistant that answers from this site’s **knowledge base** using **Transformers.js (Xenova / MiniLM)** in your browser — embeddings, similarity retrieval, and intent-style routing. **Explore** from the hero opens the flow; optional **voice** and telemetry-style readouts explain what happened without sending prompts to a custom model host unless you wire one in.",
  },
  {
    icon: Mic,
    title: "Interview & résumé",
    accent: "from-violet-500/22 to-transparent",
    body:
      "**Interview me** (nav + event) primes the assistant for recruiter-style Q&A. **AI résumé tailor** is a dedicated section for narrative help against your CV. **Preview résumé & Q&A** and **Download PDF** use the résumé asset on this origin. **Resume study** can open as a modal from deep links or nav actions.",
  },
  {
    icon: MousePointer2,
    title: "Motion, depth & scroll",
    accent: "from-violet-500/20 to-transparent",
    body:
      "**GSAP ScrollTrigger** and section reveals add cinematic scroll. **Lenis** smooths wheel / touch scrolling when enabled. The hero uses a **flat gradient ambient** and typography-led layout; decorative page layers trim automatically when the system requests **reduced motion**.",
  },
  {
    icon: Gamepad2,
    title: "Playgrounds & diagrams",
    accent: "from-fuchsia-500/18 to-transparent",
    body:
      "**Games playground** showcases interactive UI experiments. **Featured systems** renders **Mermaid** architecture lanes for flagship work. **Experience** uses a honeycomb lattice with threaded edges and detail modals. **Lab notebook** and the **Embeddings** playground explain retrieval with live text.",
  },
  {
    icon: FileCode2,
    title: "Data, API & trust",
    accent: "from-sky-500/22 to-transparent",
    body:
      "**`/api/portfolio`** returns a machine-readable snapshot (projects, meta) for bots and integrations. **Contact** can open `mailto:` and optionally **POST** to your webhook when env vars are set. Read **Security** for the short threat model: client-first inference, no auth wall, validated server routes.",
  },
  {
    icon: Fingerprint,
    title: "Preferences & memory (local only)",
    accent: "from-amber-500/15 to-transparent",
    body:
      "A lightweight **recruiter session** and semantic memory stay in **local browser storage** — no account, no profiling backend. **Voice** and “AI read” are optional and degrade gracefully if unsupported. **Telemetry** in the corner is a compact HUD for embedding status and latency on-device.",
  },
  {
    icon: Mail,
    title: "Contact & outbound",
    accent: "from-sky-500/20 to-transparent",
    body:
      "**Send message** opens your mail app with the draft pre-filled to the hire inbox. The same flow can optionally POST to a **contact webhook** when configured. **Case study modals** open from project cards and from assistant events so proof stays one click away.",
  },
  {
    icon: Shield,
    title: "Trust surface",
    accent: "from-rose-500/15 to-transparent",
    body:
      "**Plausible** (or similar) can be wired for privacy-light analytics when env keys exist. Dependencies are pinned in the lockfile; the most sensitive actions (**inference**, **memory**) stay on-device unless you explicitly add cloud services later.",
  },
] as const;

const featureCatalog: { title: string; items: string[] }[] = [
  {
    title: "Assistant & knowledge",
    items: [
      "Fullscreen Portfolio Intelligence with on-device MiniLM embeddings",
      "Knowledge base JSON + semantic search over portfolio facts",
      "Optional voice capture and read-aloud where the browser supports it",
      "Interview mode dispatch from the nav for recruiter-style sessions",
    ],
  },
  {
    title: "Content & proof",
    items: [
      "Case studies with deep-linkable project modals",
      "Research, leadership, activities, testimonials, and security write-ups",
      "Featured Systems with Mermaid diagrams per flagship build",
      "Experience lattice (hex nodes + role modals + “roles at a glance”)",
    ],
  },
  {
    title: "Labs & résumé",
    items: [
      "Lab notebook and embedding playground for retrieval intuition",
      "AI résumé tailor section tied to your CV narrative",
      "Résumé preview modal + PDF download from the same asset pipeline",
    ],
  },
  {
    title: "Infra & polish",
    items: [
      "REST routes: chat, contact, portfolio JSON, resume-chat, ambient-audio",
      "Lenis smooth scroll + GSAP-powered section reveals",
      "Ambient neural layer, grid, fog, and optional premium cursor lab",
      "Compact telemetry HUD for embedding / latency (read-only)",
    ],
  },
];

function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <p className="text-sm leading-relaxed text-ai-muted">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-white/90">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

export default function AboutPortfolioSection() {
  return (
    <section
      id="about-portfolio"
      aria-labelledby="about-portfolio-heading"
      className={siteSectionClass("border-t border-ai-border/50")}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        aria-hidden
        style={{
          background:
            "radial-gradient(900px 520px at 12% -10%, rgba(0,212,255,0.14), transparent 55%), radial-gradient(700px 480px at 88% 20%, rgba(0,255,136,0.1), transparent 50%), radial-gradient(600px 400px at 50% 100%, rgba(139,92,246,0.08), transparent 45%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden>
        <LabSectionGridBg className="opacity-100" />
      </div>

      <div className={SITE_SECTION_INNER}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease }}
          className="mb-12 text-center md:mb-16"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ai-glow/35 bg-ai-glow/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ai-glow/95">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Meta · how this site is built
          </div>
          <h2
            id="about-portfolio-heading"
            className="mb-4 font-[var(--font-space-grotesk)] text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            About this portfolio
          </h2>
          <p className="mx-auto max-w-3xl text-pretty text-sm text-ai-muted sm:text-base">
            This page is both a resume and a <span className="text-white/90">living demo</span> of product
            UX, performance budgets, and privacy-aware AI surfaces — not a generic template. Use the sections
            below as a <span className="text-white/90">feature map</span>: what ships today, how it behaves in
            the browser, and where server hooks exist when you configure environment variables.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease }}
          className="mb-12 rounded-2xl border border-white/10 bg-black/40 p-5 shadow-lg backdrop-blur-md sm:p-7 md:mb-14"
        >
          <h3 className="mb-4 text-center font-[var(--font-space-grotesk)] text-lg font-semibold text-white sm:text-xl">
            Feature catalog
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {featureCatalog.map((block) => (
              <div key={block.title} className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-200/85">
                  {block.title}
                </p>
                <ul className="space-y-2 text-sm leading-relaxed text-ai-muted">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ai-glow/80" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {cards.map((c, idx) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.06, ease }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-5 shadow-lg backdrop-blur-md",
                "transition-[border-color,box-shadow] duration-300 hover:border-ai-glow/40 hover:shadow-[0_0_36px_rgba(0,255,136,0.1)]"
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                  "bg-gradient-to-br",
                  c.accent
                )}
                aria-hidden
              />
              <div className="relative flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ai-glow shadow-[0_0_24px_rgba(0,255,136,0.12)]">
                  <c.icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 space-y-2">
                  <h3 className="font-[var(--font-space-grotesk)] text-base font-semibold text-white sm:text-lg">
                    {c.title}
                  </h3>
                  <RichText text={c.body} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
          className="rounded-2xl border border-ai-border/70 bg-gradient-to-br from-ai-surface/50 via-black/40 to-ai-surface/30 p-6 sm:p-8 md:p-10"
        >
          <div className="mb-6 flex flex-wrap items-center gap-3 text-white">
            <Workflow className="h-6 w-6 text-cyan-300" aria-hidden />
            <h3 className="font-[var(--font-space-grotesk)] text-xl font-bold sm:text-2xl">
              Visitor journey (simplified)
            </h3>
          </div>
          <ol className="grid gap-4 text-sm text-ai-muted md:grid-cols-2 md:gap-x-10 md:gap-y-5">
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ai-glow/30 bg-ai-glow/10 text-xs font-bold text-ai-glow">
                1
              </span>
              <span>
                <strong className="text-white/90">Land</strong> — Hero and primary nav establish tone;
                scroll reveals stay lightweight when motion is reduced.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ai-glow/30 bg-ai-glow/10 text-xs font-bold text-ai-glow">
                2
              </span>
              <span>
                <strong className="text-white/90">Proof of work</strong> — Projects, case modals, and
                lab sections show shipped thinking; embeddings playground mirrors the assistant stack.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ai-glow/30 bg-ai-glow/10 text-xs font-bold text-ai-glow">
                3
              </span>
              <span>
                <strong className="text-white/90">Conversational layer</strong> — Chatbot grounds answers
                in your public KB; routing and telemetry are transparent by design.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ai-glow/30 bg-ai-glow/10 text-xs font-bold text-ai-glow">
                4
              </span>
              <span>
                <strong className="text-white/90">Convert</strong> — Contact opens your mail client with a
                drafted note; resume PDF is one click. Optional webhook can archive leads server-side.
              </span>
            </li>
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 text-xs text-ai-muted">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
              <Layers className="h-4 w-4 text-cyan-300" aria-hidden />
              Monorepo-style <code className="text-ai-glow/90">src/</code> data + components
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
              <Radio className="h-4 w-4 text-emerald-300" aria-hidden />
              Event hooks for case studies + resume preview from the assistant
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
