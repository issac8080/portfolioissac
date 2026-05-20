"use client";

import dynamic from "next/dynamic";
import { Shield, Lock, Eye } from "lucide-react";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";

const MermaidChart = dynamic(() => import("@/components/MermaidChart"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-ai-border/60 bg-ai-surface/20 p-6 text-center text-ai-muted text-sm min-h-[200px] flex items-center justify-center">
      Loading diagram…
    </div>
  ),
});

/** Site architecture for security / trust section — matches copy (static, on-device ML, optional webhook) */
const SITE_TRUST_FLOW = `
flowchart TB
  subgraph BR["Browser (your device)"]
    U[UI + forms]
    E[Transformers.js]
    K[knowledgeBase.json]
  end
  subgraph NX["This site (Next.js)"]
    S[Static pages and JS bundle]
    A["/api/contact"]
  end
  subgraph EX["Optional only"]
    W[Webhook]
    PL[Plausible]
  end
  U --> S
  U -->|no auth| E
  E --> K
  U -->|POST body| A
  A -->|if env set| W
  S -->|if env set| PL
`.trim();

export default function SecurityModelSection() {
  return (
    <section
      id="security-model"
      className={siteSectionClass("border-t border-ai-border/40")}
      data-cinematic-reveal
      aria-labelledby="security-model-heading"
    >
      <LabSectionGridBg />
      <div className={SITE_SECTION_INNER}>
        <LabSectionIntro
          eyebrow="Trust plane"
          title="Lightweight threat model (this site)"
          titleId="security-model-heading"
          description="This portfolio is mostly static plus client-side ML (Transformers.js). No authenticated session. Risks considered in design are summarized beside the live data-flow diagram."
          titleClassName="!text-2xl sm:!text-3xl md:!text-4xl"
          className="mb-10"
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 lg:items-stretch">
          <div className="min-w-0">
            <ul className="space-y-3 text-sm text-ai-muted list-disc pl-5 marker:text-ai-glow/50">
              <li>
                <strong className="text-white/90">Contact form</strong> —{" "}
                <strong className="text-white/90">Send</strong> opens your mail client with the draft
                pre-addressed; the same payload may POST to{" "}
                <code className="text-ai-glow/90 text-xs">/api/contact</code> and an optional{" "}
                <code className="text-ai-glow/90 text-xs">CONTACT_WEBHOOK_URL</code> when configured.
              </li>
              <li>
                <strong className="text-white/90">On-device assistant</strong> — No user content
                leaves the browser for inference; knowledge is public JSON. If you later add cloud
                LLMs, treat user prompts as untrusted and add rate limits + abuse monitoring.
              </li>
              <li>
                <strong className="text-white/90">Third-party scripts</strong> — Analytics (Plausible)
                is optional via env; no fingerprinting by default.
              </li>
              <li>
                <strong className="text-white/90">Dependencies</strong> — Keep Next.js and
                transformers pinned; run <code className="text-ai-glow/90 text-xs">npm audit</code>{" "}
                in CI.
              </li>
            </ul>
          </div>

          <div className="min-w-0 flex flex-col">
            <p className="text-ai-glow font-mono text-[10px] sm:text-xs uppercase tracking-wider mb-3">
              Trust boundary / data flow
            </p>
            <div className="flex-1 glass rounded-2xl border border-ai-border/70 overflow-hidden flex flex-col min-h-[260px] lg:min-h-[300px]">
              <div className="flex-1 overflow-auto p-3 sm:p-4 touch-pan-y [&_.mermaid-chart]:min-h-[200px]">
                <MermaidChart code={SITE_TRUST_FLOW} instanceId="security-model-flow" />
              </div>
              <p className="text-ai-muted/90 text-[10px] sm:text-xs px-3 pb-3 pt-0 border-t border-ai-border/40 leading-snug">
                Nothing in the chat or embedding UI is sent to a custom server for this demo—only a
                contact form hits <code className="text-ai-glow/80">/api/contact</code> when you
                submit it.
              </p>
            </div>
          </div>
        </div>

        <LabSectionFooterStrip
          items={[
            { icon: <Shield className="h-4 w-4 text-emerald-400" aria-hidden />, label: "threat model" },
            { icon: <Lock className="h-4 w-4 text-cyan-400" aria-hidden />, label: "on-device ml" },
            { icon: <Eye className="h-4 w-4 text-violet-400" aria-hidden />, label: "data flow" },
          ]}
        />
      </div>
    </section>
  );
}
