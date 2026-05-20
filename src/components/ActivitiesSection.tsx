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
import { communityHighlights } from "@/data/leadershipTimeline";
import { Bot, Cpu, Flag, Rocket, Shield, Sparkles } from "lucide-react";

const activityCards = [
  {
    title: "CTF 2024 — IEEE Computer Society",
    body: "College-level cybersecurity competition: challenge design, infra hygiene, onboarding, and judging — focused on ethical hacking, OSINT, web, RE, and crypto.",
    icon: Shield,
    accent: "from-fuchsia-500/20 to-cyan-500/10 border-fuchsia-400/35",
  },
  {
    title: "Technical webinars & events",
    body: "Series of sessions spanning AI/ML, cybersecurity, modern web, and cloud/DevOps — labs, Q&A, and materials students could reuse for portfolios.",
    icon: Cpu,
    accent: "from-cyan-500/20 to-violet-500/10 border-cyan-400/35",
  },
  {
    title: "Robotics — Gesture Control (CET Trivandrum, 2022)",
    body: "Hands-on exposure to embedded sensing and HCI demos; competed alongside peers in a statewide technical showcase environment.",
    icon: Bot,
    accent: "from-lime-500/15 to-emerald-500/10 border-lime-400/30",
  },
  {
    title: "Hackathon — St. Thomas Institute of Technology, Trivandrum",
    body: "Shipped a prototype under time pressure with clear pitch, git hygiene, and stakeholder storytelling — great practice for product thinking in the room.",
    icon: Rocket,
    accent: "from-violet-500/20 to-fuchsia-500/10 border-violet-400/35",
  },
];

export default function ActivitiesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="activities"
      ref={ref}
      className={siteSectionClass()}
      data-cinematic-reveal
      aria-labelledby="activities-heading"
    >
      <LabSectionGridBg />
      <div className={cn(SITE_SECTION_INNER, "max-w-6xl")}>
        <LabSectionIntro
          eyebrow="Beyond the desk"
          title="Activities & contributions"
          titleId="activities-heading"
          description="IEEE Computer Society programs plus statewide technical events — execution, teaching, and competition floors."
          titleClassName="!text-3xl md:!text-5xl"
        />

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {activityCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={{ y: -3, transition: { type: "spring", stiffness: 380, damping: 22 } }}
                className={cn(
                  "relative flex min-h-[200px] flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-4 shadow-lg sm:min-h-[220px] sm:p-5",
                  card.accent
                )}
              >
                <div className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-[0.1]" aria-hidden />
                <Icon className="relative mb-3 h-8 w-8 text-cyan-200/90" aria-hidden />
                <h3 className="relative text-base font-semibold text-white sm:text-lg">{card.title}</h3>
                <p className="relative mt-2 flex-1 text-xs leading-relaxed text-ai-muted/95 sm:text-sm">{card.body}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {communityHighlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className="flex gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-md sm:p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10">
                  <Icon className="h-5 w-5 text-cyan-200" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-white">{h.title}</h4>
                  <p className="mt-1 text-sm text-ai-muted/95">{h.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <LabSectionFooterStrip
          items={[
            { icon: <Shield className="h-4 w-4 text-fuchsia-400" aria-hidden />, label: "CTF & security" },
            { icon: <Cpu className="h-4 w-4 text-cyan-400" aria-hidden />, label: "webinars" },
            { icon: <Bot className="h-4 w-4 text-lime-400" aria-hidden />, label: "state events" },
          ]}
        />
      </div>
    </section>
  );
}
