"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { testimonials } from "@/data/testimonials";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";
import { cn } from "@/lib/utils";
import { getProjectHudAccent } from "@/lib/projectCardHudTheme";

const INITIAL_VISIBLE = 6;

export default function TestimonialsSection() {
  const [showAll, setShowAll] = useState(false);
  const hiddenCount = Math.max(0, testimonials.length - INITIAL_VISIBLE);
  const list = showAll ? testimonials : testimonials.slice(0, INITIAL_VISIBLE);

  return (
    <section
      id="testimonials"
      className={siteSectionClass()}
      data-cinematic-reveal
      aria-labelledby="testimonials-heading"
    >
      <LabSectionGridBg />
      <div className={cn(SITE_SECTION_INNER, "pb-1 md:pb-2")}>
        <LabSectionIntro
          eyebrow="Peer signal"
          title="Testimonials"
          titleId="testimonials-heading"
          description="What colleagues and collaborators say — engineering depth, ownership, and how shipped work lands in the real world."
          titleClassName="!text-3xl md:!text-5xl"
        />

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {list.map((t) => {
            const globalIndex = testimonials.indexOf(t);
            const accent = getProjectHudAccent(globalIndex);
            return (
              <motion.li
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-24px" }}
                transition={{ delay: (globalIndex % 6) * 0.04, duration: 0.35 }}
                className="h-full min-h-0"
              >
                <article
                  className={cn(
                    "relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border-x border-white/10 bg-black/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl sm:p-6",
                    accent.borderNeonTop,
                    accent.borderNeonBottom,
                    accent.hudGlow
                  )}
                >
                  <div className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden />
                  <div className="relative flex min-h-0 flex-1 flex-col">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h3 className={cn("font-[var(--font-space-grotesk)] text-base font-semibold text-white", accent.titleAccent)}>
                          {t.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-ai-muted">{t.title}</p>
                      </div>
                      <Quote className="h-5 w-5 shrink-0 text-cyan-400/60" aria-hidden />
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                      {t.quotes.map((q, qi) => (
                        <blockquote
                          key={`${t.name}-${qi}`}
                          className="border-l-2 border-cyan-400/35 pl-3 text-sm leading-relaxed text-ai-muted/95"
                        >
                          {q}
                        </blockquote>
                      ))}
                    </div>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </ul>

        {hiddenCount > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="rounded-full border border-cyan-400/45 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.18)] transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/15"
            >
              {showAll ? "Show fewer" : `+${hiddenCount} more`}
            </button>
          </div>
        )}

        <LabSectionFooterStrip
          items={[
            { icon: <Star className="h-4 w-4 text-amber-400" aria-hidden />, label: "peer quotes" },
            { icon: <Quote className="h-4 w-4 text-cyan-400" aria-hidden />, label: "signal deck" },
            { icon: <Star className="h-4 w-4 text-fuchsia-400" aria-hidden />, label: "live roster" },
          ]}
        />
      </div>
    </section>
  );
}
