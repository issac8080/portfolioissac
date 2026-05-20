"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";
import { cn } from "@/lib/utils";
import { Award, Users, Trophy, CheckCircle2 } from "lucide-react";
import {
  ieeeLeadershipEvents,
  ieeeLeadershipMeta,
} from "@/data/leadershipTimeline";

const kindStyles: Record<string, string> = {
  ctf: "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-100",
  webinar: "border-cyan-400/40 bg-cyan-500/10 text-cyan-50",
  workshop: "border-violet-400/40 bg-violet-500/10 text-violet-50",
  participation: "border-lime-400/35 bg-lime-500/10 text-lime-50",
};

export default function LeadershipSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="leadership" ref={ref} className={siteSectionClass()} data-cinematic-reveal>
      <LabSectionGridBg />
      <div className={cn(SITE_SECTION_INNER, "max-w-6xl pb-1 md:pb-2")}>
        <LabSectionIntro
          eyebrow="IEEE Computer Society"
          title="Leadership"
          description={`${ieeeLeadershipMeta.role} (${ieeeLeadershipMeta.period}) — ${ieeeLeadershipMeta.org}, ${ieeeLeadershipMeta.location}.`}
          descriptionSecondary={ieeeLeadershipMeta.tagline}
          titleClassName="!text-3xl md:!text-5xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/50 via-ai-surface/30 to-black/50 p-5 shadow-[0_0_40px_rgba(56,249,215,0.08)] sm:p-7 md:p-8"
        >
          <div className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-ai-border bg-ai-glow/15">
                  <Award className="h-7 w-7 text-ai-glow" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white sm:text-xl">{ieeeLeadershipMeta.role}</h3>
                  <p className="mt-1 text-sm text-cyan-200/90">{ieeeLeadershipMeta.org}</p>
                  <p className="mt-2 text-xs text-ai-muted sm:text-sm">
                    {ieeeLeadershipMeta.period} · {ieeeLeadershipMeta.location}
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {ieeeLeadershipMeta.responsibilities.map((line) => (
                  <li key={line.slice(0, 32)} className="flex gap-2 text-sm text-white/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400/80" aria-hidden />
                    <span className="leading-snug">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative lg:col-span-7">
              <div
                className="pointer-events-none absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/50 via-fuchsia-400/35 to-transparent sm:left-4"
                aria-hidden
              />
              <ul className="relative space-y-5 pl-9 sm:space-y-6 sm:pl-11">
                {ieeeLeadershipEvents.map((ev, i) => {
                  const Icon = ev.icon;
                  return (
                    <motion.li
                      key={ev.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.45 }}
                      className="relative"
                    >
                      <span
                        className="absolute -left-[1.35rem] top-3 flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/35 bg-black/80 shadow-[0_0_18px_rgba(56,249,215,0.25)] sm:-left-[1.6rem] sm:h-8 sm:w-8"
                        aria-hidden
                      >
                        <Icon className="h-3.5 w-3.5 text-cyan-200 sm:h-4 sm:w-4" />
                      </span>
                      <motion.article
                        whileHover={{ y: -2, transition: { type: "spring", stiffness: 420, damping: 28 } }}
                        className={cn(
                          "rounded-2xl border p-4 transition-[box-shadow,border-color] duration-300 sm:p-5",
                          "bg-black/35 backdrop-blur-md hover:shadow-[0_0_28px_rgba(56,249,215,0.12)]",
                          kindStyles[ev.kind] ?? "border-white/10"
                        )}
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-ai-muted">
                            {ev.kind}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-white sm:text-lg">{ev.title}</h4>
                        <p className="mt-2 text-xs leading-relaxed text-ai-muted/95 sm:text-sm">{ev.summary}</p>
                        {ev.detail && (
                          <p className="mt-2 text-[11px] leading-relaxed text-ai-muted/80 sm:text-xs">{ev.detail}</p>
                        )}
                      </motion.article>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>
        </motion.div>

        <LabSectionFooterStrip
          items={[
            { icon: <Award className="h-4 w-4 text-amber-400" aria-hidden />, label: "chapter programs" },
            { icon: <Users className="h-4 w-4 text-cyan-400" aria-hidden />, label: "student reach" },
            { icon: <Trophy className="h-4 w-4 text-fuchsia-400" aria-hidden />, label: "competition ops" },
          ]}
        />
      </div>
    </section>
  );
}
