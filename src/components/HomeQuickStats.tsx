"use client";

import { motion } from "framer-motion";
import { Briefcase, Code2, FolderKanban, Infinity } from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import { skills } from "@/data/portfolio";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export default function HomeQuickStats() {
  const projectCount = caseStudies.length;
  const techCount = skills.stackTags.length;

  const stats = [
    {
      label: "Projects",
      value: `${projectCount}+`,
      sub: "Case studies & builds",
      icon: FolderKanban,
      accent: "from-cyan-500/20 to-cyan-500/5 border-cyan-400/30",
    },
    {
      label: "Experience",
      value: "3+",
      sub: "Years shipping",
      icon: Briefcase,
      accent: "from-fuchsia-500/20 to-violet-500/5 border-fuchsia-400/30",
    },
    {
      label: "Technologies",
      value: `${techCount}+`,
      sub: "Stack & tools",
      icon: Code2,
      accent: "from-violet-500/20 to-cyan-500/5 border-violet-400/30",
    },
    {
      label: "Learning",
      value: "∞",
      sub: "Always iterating",
      icon: Infinity,
      accent: "from-lime-500/15 to-emerald-500/5 border-lime-400/35",
    },
  ];

  return (
    <section
      id="home-stats"
      aria-label="Quick stats"
      className={cn(siteSectionClass("!py-12 md:!py-16"), "border-y border-white/[0.06] bg-black/25")}
    >
      <div className={SITE_SECTION_INNER}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-5">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.45, ease }}
                whileHover={{ y: -2, transition: { type: "spring", stiffness: 400, damping: 24 } }}
                className={cn(
                  "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-5",
                  s.accent
                )}
              >
                <div className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden />
                <Icon className="relative mb-3 h-5 w-5 text-cyan-200/90 sm:h-6 sm:w-6" aria-hidden />
                <p className="relative font-mono text-[10px] font-semibold uppercase tracking-wider text-ai-muted sm:text-xs">
                  {s.label}
                </p>
                <p className="relative mt-1 font-[var(--font-space-grotesk)] text-2xl font-black text-white sm:text-3xl">
                  {s.value}
                </p>
                <p className="relative mt-1 text-[11px] text-ai-muted/90 sm:text-xs">{s.sub}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
