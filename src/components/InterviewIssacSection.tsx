"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquareText, Sparkles, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";

const CHIPS: { label: string; query: string }[] = [
  {
    label: "Urban Place architecture",
    query:
      "Walk through Urban Place system architecture: auth, trust score, booking state machine, and where you would add idempotency for payments.",
  },
  {
    label: "Tradeoffs: SQLite vs Postgres",
    query:
      "What tradeoffs does Urban Place accept by using SQLite, and what would you change before production traffic?",
  },
  {
    label: "Scale the embedding assistant",
    query:
      "How would you scale this portfolio's on-device embedding assistant pattern to thousands of concurrent users?",
  },
  {
    label: "RAG evaluation",
    query:
      "How would you evaluate RAG quality for Autonomous Returns or AuraShop, beyond cosine similarity?",
  },
  {
    label: "Latency & SLOs",
    query:
      "What SLOs would you set for AuraShop chat + recommendations, and how would you detect regressions?",
  },
];

function openInterview(query?: string) {
  window.dispatchEvent(
    new CustomEvent("portfolio-open-interview-mode", {
      detail: { query },
    })
  );
}

export default function InterviewIssacSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="interview-issac"
      ref={ref}
      className={siteSectionClass()}
      data-cinematic-reveal
      aria-labelledby="interview-issac-heading"
    >
      <LabSectionGridBg />
      <div className={SITE_SECTION_INNER}>
        <LabSectionIntro
          eyebrow="Technical interview"
          title="Interview Issac AI"
          titleId="interview-issac-heading"
          description="Run technical and architecture drills grounded in this portfolio's knowledge base (on-device retrieval — not a hosted LLM). Use Interview me in the nav or enable Interview in the floating assistant."
          titleClassName="!text-2xl md:!text-4xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="glass rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.04] via-ai-bg/40 to-transparent p-6 shadow-[0_0_60px_rgba(34,211,238,0.06)] md:p-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl space-y-3">
              <ul className="text-sm text-ai-muted/95 space-y-1.5 list-none pl-0 flex flex-col gap-1.5">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" aria-hidden />
                  <span>System design and component boundaries</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" aria-hidden />
                  <span>ML, RAG, and embeddings lifecycle</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" aria-hidden />
                  <span>Reliability, observability, and failure modes</span>
                </li>
              </ul>
            </div>
            <Button
              type="button"
              onClick={() => openInterview()}
              className="shrink-0 gap-2 bg-gradient-to-r from-cyan-500/25 to-violet-500/20 border border-cyan-400/25 text-white hover:from-cyan-500/35 hover:to-violet-500/28 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
            >
              <Sparkles className="h-4 w-4 text-cyan-200" aria-hidden />
              Open assistant · Interview mode
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ai-muted">
            <Waypoints className="h-4 w-4 text-cyan-400/70" aria-hidden />
            Starter prompts
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {CHIPS.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => openInterview(c.query)}
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-left text-xs text-white/90 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10"
              >
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>

        <LabSectionFooterStrip
          items={[
            { icon: <MessageSquareText className="h-4 w-4 text-cyan-400" aria-hidden />, label: "interview mode" },
            { icon: <Waypoints className="h-4 w-4 text-violet-400" aria-hidden />, label: "starter drills" },
            { icon: <Sparkles className="h-4 w-4 text-fuchsia-400" aria-hidden />, label: "kb grounded" },
          ]}
        />
      </div>
    </section>
  );
}
