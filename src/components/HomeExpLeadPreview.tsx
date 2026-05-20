"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Briefcase, Users } from "lucide-react";
import { experience, leadership } from "@/data/portfolio";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export default function HomeExpLeadPreview() {
  const expPreview = experience.slice(0, 3);
  const leadCards = leadership.slice(0, 2);

  return (
    <section
      id="home-overview"
      aria-label="Experience and leadership overview"
      className={cn(siteSectionClass("!py-14 md:!py-18"), "scroll-mt-[calc(4rem+env(safe-area-inset-top,0px))]")}
    >
      <div className={SITE_SECTION_INNER}>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-5 shadow-[0_0_32px_rgba(56,249,215,0.08)] backdrop-blur-xl sm:p-6"
          >
            <div className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-[0.1]" aria-hidden />
            <div className="relative mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-cyan-300" aria-hidden />
                <h2 className="font-[var(--font-space-grotesk)] text-lg font-bold uppercase tracking-tight text-white sm:text-xl">
                  Experience
                </h2>
              </div>
              <Link
                href="#experience"
                className="group flex items-center gap-0.5 text-xs font-semibold text-cyan-200/90 transition-colors hover:text-cyan-100 sm:text-sm"
              >
                View all
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
            <ul className="relative space-y-0">
              {expPreview.map((job, i) => (
                <li key={`${job.company}-${job.role}-${i}`} className="flex gap-3 sm:gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/35 bg-cyan-500/10 text-[10px] font-bold text-cyan-100 sm:h-11 sm:w-11">
                      {job.company
                        .split(/\s+/)
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 3)
                        .toUpperCase()}
                    </span>
                    {i < expPreview.length - 1 && (
                      <span
                        className="mt-1 min-h-[2rem] w-px flex-1 bg-gradient-to-b from-cyan-400/40 to-transparent"
                        aria-hidden
                      />
                    )}
                  </div>
                  <div className={cn("min-w-0 flex-1 pb-6", i === expPreview.length - 1 && "pb-0")}>
                    <p className="font-semibold text-white">{job.role}</p>
                    <p className="text-sm text-cyan-200/85">{job.company}</p>
                    <p className="mt-1 text-xs text-ai-muted">
                      {job.period}
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-5 shadow-[0_0_32px_rgba(196,181,253,0.1)] backdrop-blur-xl sm:p-6"
          >
            <div className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-[0.1]" aria-hidden />
            <div className="relative mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-fuchsia-300" aria-hidden />
                <h2 className="font-[var(--font-space-grotesk)] text-lg font-bold uppercase tracking-tight text-white sm:text-xl">
                  Leadership
                </h2>
              </div>
              <Link
                href="#leadership"
                className="group flex items-center gap-0.5 text-xs font-semibold text-fuchsia-200/90 transition-colors hover:text-fuchsia-100 sm:text-sm"
              >
                View all
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
            <ul className="relative space-y-3">
              {leadCards.map((item, i) => (
                <li key={`${item.role}-${i}`}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-fuchsia-400/35"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold leading-tight sm:text-xs",
                        i === 0
                          ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100"
                          : "border-cyan-400/35 bg-cyan-500/10 text-cyan-100"
                      )}
                      aria-hidden
                    >
                      {i === 0 ? "IEEE" : "PGM"}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{item.role}</p>
                      <p className="text-sm text-fuchsia-200/80">{item.org}</p>
                      <p className="mt-1 text-xs text-ai-muted">
                        {item.period}
                        {"location" in item && item.location ? ` · ${item.location}` : ""}
                      </p>
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ai-muted/95">{item.description}</p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-ai-muted opacity-60" aria-hidden />
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
