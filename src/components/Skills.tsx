"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BadgeCheck, Cpu, Gauge, Sparkles } from "lucide-react";
import { skills } from "@/data/portfolio";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabStatusPanel,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { getProjectHudAccent } from "@/lib/projectCardHudTheme";
import { cn } from "@/lib/utils";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";

const topSkills = skills.top;
const techStack = skills.stackTags;

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const panelA = useMemo(() => getProjectHudAccent(0), []);
  const panelB = useMemo(() => getProjectHudAccent(1), []);
  const certPreview = skills.certifications.slice(0, 4);

  return (
    <section id="skills" ref={ref} className={siteSectionClass()} data-cinematic-reveal>
      <LabSectionGridBg />
      <div className={SITE_SECTION_INNER}>
        <LabSectionIntro
          eyebrow="Loadout matrix"
          title="Skills"
          description="Top tracks & a wide engineering stack — ML, agents, full-stack, data, and cloud — tied to shipped work."
          descriptionSecondary="Rings show emphasis areas (not exam scores); tags mirror tools used across case studies and research."
          titleClassName="!text-3xl md:!text-5xl"
          aside={
            <LabStatusPanel label="Matrix status">
              <div className="space-y-2 text-xs text-ai-muted">
                <div className="flex justify-between gap-6">
                  <span>Core tracks</span>
                  <span className="font-mono text-white">{topSkills.length}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span>Stack tags</span>
                  <span className="font-mono text-white">{techStack.length}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span>Certs (preview)</span>
                  <span className="font-mono text-white">{certPreview.length}</span>
                </div>
              </div>
            </LabStatusPanel>
          }
        />

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(
              "relative overflow-hidden rounded-2xl border-x border-white/10 bg-black/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl md:p-8",
              panelA.borderNeonTop,
              panelA.borderNeonBottom,
              panelA.hudGlow
            )}
          >
            <div
              className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-[0.18]"
              aria-hidden
            />
            <h3
              className={cn(
                "relative mb-5 flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-wider",
                panelA.titleAccent
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", panelA.dot)} aria-hidden />
              Top skills
            </h3>
            <div className="relative grid gap-5 sm:grid-cols-2 sm:gap-4">
              {topSkills.map((skill, i) => (
                <RadialSkill
                  key={skill}
                  id={skill.replace(/\s/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}
                  label={skill}
                  value={90 - i * 4}
                  delay={i * 0.08}
                  isInView={isInView}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(
              "relative overflow-hidden rounded-2xl border-x border-white/10 bg-black/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl md:p-8",
              panelB.borderNeonTop,
              panelB.borderNeonBottom,
              panelB.hudGlow
            )}
          >
            <div
              className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-[0.18]"
              aria-hidden
            />
            <div className="relative">
              <h3
                className={cn(
                  "mb-6 flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-wider",
                  panelB.titleAccent
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", panelB.dot)} aria-hidden />
                Tech stack
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {techStack.map((tech, i) => {
                  const chip = getProjectHudAccent(i);
                  return (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{
                        scale: 1.06,
                        boxShadow:
                          "0 0 20px rgba(56, 249, 215, 0.2), 0 0 32px rgba(196, 181, 253, 0.16)",
                      }}
                      className={cn(
                        "cursor-default rounded-full px-3.5 py-1.5 text-sm text-ai-muted transition-colors hover:text-white",
                        chip.techChip
                      )}
                    >
                      {tech}
                    </motion.span>
                  );
                })}
              </div>
              <div className={cn("mt-8 rounded-xl border border-white/10 bg-black/30 p-4", panelB.ctaRow)}>
                <h4 className={cn("mb-3 text-xs font-semibold uppercase tracking-wider", panelB.titleAccent)}>
                  Certifications
                </h4>
                <ul className="space-y-2 text-sm text-ai-muted">
                  {certPreview.map((c) => (
                    <li key={c} className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                      <span className="mt-0.5 text-cyan-300">▹</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <LabSectionFooterStrip
          items={[
            { icon: <Gauge className="h-4 w-4 text-emerald-400" aria-hidden />, label: "proficiency" },
            { icon: <Cpu className="h-4 w-4 text-sky-400" aria-hidden />, label: "stack depth" },
            { icon: <BadgeCheck className="h-4 w-4 text-violet-400" aria-hidden />, label: "certs" },
            { icon: <Sparkles className="h-4 w-4 text-amber-400" aria-hidden />, label: "live matrix" },
          ]}
        />
      </div>
    </section>
  );
}

function RadialSkill({
  label,
  value,
  delay,
  isInView,
  id,
}: {
  label: string;
  value: number;
  delay: number;
  isInView: boolean;
  id: string;
}) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ delay }}
      className="flex items-center gap-4"
    >
      <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
        <svg className="-rotate-90 h-24 w-24" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="rgba(56,249,215,0.12)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke={`url(#skillGrad-${id})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1, delay, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id={`skillGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38f9d7" />
              <stop offset="55%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-ai-glow">
          {value}%
        </span>
      </div>
      <span className="min-w-0 font-medium text-white text-sm sm:text-base leading-snug">{label}</span>
    </motion.div>
  );
}
