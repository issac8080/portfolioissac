"use client";

import { motion } from "framer-motion";
import { FlaskConical, Beaker, Zap } from "lucide-react";
import { labNotebookEntries } from "@/data/labNotebook";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";

export default function LabNotebookSection() {
  return (
    <section
      id="lab"
      className={siteSectionClass()}
      data-cinematic-reveal
      aria-labelledby="lab-heading"
    >
      <LabSectionGridBg />
      <div className={SITE_SECTION_INNER}>
        <LabSectionIntro
          eyebrow="Lab notebook"
          title="Experiments & tradeoffs"
          titleId="lab-heading"
          description="Short, dated entries — hypothesis, what changed, outcome. Mirrors how product ML teams ship learning loops, not only launch posts."
          titleClassName="!text-3xl md:!text-5xl"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {labNotebookEntries.map((entry, i) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="glass rounded-2xl border border-ai-border p-6 flex flex-col gap-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                <time
                  className="text-xs font-mono text-ai-glow/80 shrink-0"
                  dateTime={entry.date}
                >
                  {entry.date}
                </time>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-ai-muted mb-1">
                  Hypothesis
                </p>
                <p className="text-sm text-ai-muted leading-relaxed">{entry.hypothesis}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-ai-muted mb-1">
                  What we tried
                </p>
                <p className="text-sm text-ai-muted leading-relaxed">{entry.whatWeTried}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-ai-muted mb-1">Outcome</p>
                <p className="text-sm text-white/90 leading-relaxed">{entry.outcome}</p>
              </div>
              {entry.link && (
                <a
                  href={entry.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ai-glow hover:underline mt-auto pt-2"
                >
                  {entry.link.label} →
                </a>
              )}
            </motion.article>
          ))}
        </div>

        <LabSectionFooterStrip
          items={[
            { icon: <FlaskConical className="h-4 w-4 text-emerald-400" aria-hidden />, label: "hypothesis" },
            { icon: <Beaker className="h-4 w-4 text-sky-400" aria-hidden />, label: "experiments" },
            { icon: <Zap className="h-4 w-4 text-amber-400" aria-hidden />, label: "outcomes" },
          ]}
        />
      </div>
    </section>
  );
}
