"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import MermaidChart from "@/components/MermaidChart";
import { getFeaturedCaseStudies } from "@/data/caseStudies";
import type { CaseStudy } from "@/data/caseStudies";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabStatusPanel,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { getProjectHudAccent } from "@/lib/projectCardHudTheme";
import { cn } from "@/lib/utils";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";
import { Cpu, GitBranch, Network, Zap } from "lucide-react";

const featured = getFeaturedCaseStudies();

/** Pipeline steps aligned with case study architecture — detail copy is accurate to writeups */
type FeaturedStep = {
  label: string;
  short: string;
  detail: string;
  /** Short label under risk bars (mobile-friendly) */
  barLabel: string;
  /** Relative load / sensitivity for the risk strip (0–100) */
  load: number;
};

const FEATURED_PIPELINES: Record<string, FeaturedStep[]> = {
  "autonomous-returns": [
    {
      label: "Vision Agent",
      short: "GPT-4o Vision",
      barLabel: "Vision",
      detail:
        "Analyzes return and exchange photos; produces structured condition and damage descriptions that downstream agents use as evidence.",
      load: 78,
    },
    {
      label: "Policy Agent",
      short: "RAG + ChromaDB",
      barLabel: "Policy",
      detail:
        "SentenceTransformers encode queries; semantic retrieval from ChromaDB pulls the policy clauses relevant to the case.",
      load: 92,
    },
    {
      label: "Resolution Agent",
      short: "Approve / reject / escalate",
      barLabel: "Resolve",
      detail:
        "Consumes vision output and policy excerpts (LangGraph handoff); decides outcome with reasoning and confidence for audit.",
      load: 88,
    },
    {
      label: "Communication Agent",
      short: "Customer messaging",
      barLabel: "Comms",
      detail:
        "Turns the resolution into clear customer-facing messages (confirmation, denial rationale, or escalation notice).",
      load: 70,
    },
  ],
  "code-dependency-analyzer": [
    {
      label: "Parse AST",
      short: "Source analysis",
      barLabel: "AST",
      detail:
        "Python AST parsing extracts imports and call relationships into a directed graph representation of the repo.",
      load: 85,
    },
    {
      label: "Build Graph",
      short: "Dependencies",
      barLabel: "Graph",
      detail:
        "Constructs import/call graph for traversal; foundation for blast-radius queries from changed modules.",
      load: 90,
    },
    {
      label: "Blast Radius",
      short: "Impact scope",
      barLabel: "Blast",
      detail:
        "Graph traversal from changed nodes yields impacted modules and transitive dependents for CI and review.",
      load: 82,
    },
    {
      label: "Risk Score",
      short: "Quantified risk",
      barLabel: "Risk",
      detail:
        "Combines fan-out, depth, centrality (and optional ML predictors) into a single score for prioritizing tests and review.",
      load: 76,
    },
  ],
  "urban-place": [
    {
      label: "Identity Verification",
      short: "AI pipeline",
      barLabel: "Identity",
      detail:
        "Providers submit documents; OpenAI-assisted extraction and consistency checks feed eligibility before listings go live.",
      load: 80,
    },
    {
      label: "Qualification Eval",
      short: "Tutor scoring",
      barLabel: "Qualify",
      detail:
        "Structured prompts and rubrics assess subject mastery and pedagogy; scores stored for ranking and policy gates.",
      load: 86,
    },
    {
      label: "Trust Score",
      short: "Completion & ratings",
      barLabel: "Trust",
      detail:
        "Server-side score from completion rate, cancellations, and ratings—updates after each booking lifecycle event.",
      load: 88,
    },
    {
      label: "Policy Listing",
      short: "Discovery",
      barLabel: "Listing",
      detail:
        "Policy engine gates who appears in discovery; commission and booking state machine enforce marketplace rules.",
      load: 74,
    },
  ],
};

export default function FeaturedSystemsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const n = featured.length;

  return (
    <section
      id="featured-systems"
      ref={ref}
      className={siteSectionClass()}
      data-cinematic-reveal
    >
      <LabSectionGridBg />
      <div className={cn(SITE_SECTION_INNER, "max-w-7xl")}>
        <LabSectionIntro
          eyebrow="Production signals"
          title="Featured systems"
          description="AI-heavy delivery — workflow steps, decision detail, and risk strips grounded in each case study."
          titleClassName="!text-3xl sm:!text-4xl md:!text-5xl"
          aside={
            <LabStatusPanel label="Lab status">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] text-ai-muted">
                    <Network className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
                    Pipelines
                  </div>
                  <p className="font-mono text-xl font-bold text-white">{String(n).padStart(2, "0")}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] text-ai-muted">
                    <Cpu className="h-3.5 w-3.5 text-violet-300" aria-hidden />
                    Stages max
                  </div>
                  <p className="font-mono text-xl font-bold text-violet-200">04</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400/60 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.9)]" />
                </span>
                <span className="text-[11px] font-medium text-lime-200/95">Diagrams synced to writeups</span>
              </div>
            </LabStatusPanel>
          }
        />

        <div className="grid gap-8 sm:gap-10 lg:gap-12">
          {featured.map((project, i) => (
            <FeaturedDashboard key={project.id} project={project} index={i} isInView={isInView} />
          ))}
        </div>

        <LabSectionFooterStrip
          items={[
            { icon: <GitBranch className="h-3.5 w-3.5 text-fuchsia-400" aria-hidden />, label: "LangGraph paths" },
            { icon: <Network className="h-3.5 w-3.5 text-cyan-400" aria-hidden />, label: "Service edges" },
            { icon: <Zap className="h-3.5 w-3.5 text-lime-400" aria-hidden />, label: "Load model" },
            { icon: <Cpu className="h-3.5 w-3.5 text-violet-400" aria-hidden />, label: "Case-grounded" },
          ]}
        />
      </div>
    </section>
  );
}

function FeaturedDashboard({
  project,
  index,
  isInView,
}: {
  project: CaseStudy;
  index: number;
  isInView: boolean;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = FEATURED_PIPELINES[project.id] ?? [];
  const accent = getProjectHudAccent(index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={cn(
        "relative overflow-x-clip overflow-y-visible rounded-2xl border-x border-white/[0.08] bg-[rgba(6,8,14,0.75)] backdrop-blur-md",
        accent.borderNeonTop,
        accent.borderNeonBottom,
        accent.hudGlow
      )}
    >
      <div className="p-4 sm:p-6 md:p-8 border-b border-ai-border/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <span className="text-ai-glow font-mono text-[10px] sm:text-xs uppercase tracking-wider">
              Featured system
            </span>
            <h3 className={cn("mt-1 break-words text-lg font-bold text-white sm:text-xl md:text-2xl", accent.titleAccent)}>
              {project.productTitle}
            </h3>
            <p className="text-ai-muted text-xs sm:text-sm mt-1">{project.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:max-w-md lg:justify-end shrink-0">
            {project.tech.slice(0, 6).map((t) => (
              <span key={t} className={cn("whitespace-nowrap rounded-lg px-2 py-1 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs", accent.techChip)}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stacked on mobile; desktop: pipeline full width → detail|risk row → full-width architecture */}
      <div className="p-4 sm:p-6 md:p-8 space-y-6 lg:space-y-8 min-w-0">
        <div className="space-y-4 min-w-0">
          <h4 className="text-ai-glow font-mono text-[10px] sm:text-xs uppercase tracking-wider">
            Workflow / Decision Pipeline
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {steps.map((step, i) => (
              <motion.button
                key={step.label}
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.15 + i * 0.08 }}
                onClick={() => setActiveStep(i)}
                className={cn(
                  "min-h-[4.5rem] touch-manipulation rounded-xl border px-2.5 py-2.5 text-left transition-all sm:min-h-[5rem] sm:px-3",
                  activeStep === i
                    ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.2)] ring-1 ring-cyan-400/35"
                    : "border-white/10 bg-black/25 text-ai-muted hover:border-cyan-500/30 hover:bg-white/[0.04]"
                )}
              >
                <span className="font-medium block text-xs sm:text-sm leading-snug">{step.label}</span>
                <span className="text-[10px] sm:text-xs opacity-90 mt-0.5 block leading-snug">
                  {step.short}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Detail + risk: balanced row on lg (no dead zone under detail only) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:items-stretch">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-0">
            <div
              className="glass rounded-xl p-4 sm:p-5 border border-ai-border flex flex-col justify-start text-left gap-3 flex-1 min-h-[140px] lg:min-h-[200px]"
              aria-live="polite"
            >
              <p className="text-ai-glow text-xs sm:text-sm font-semibold">
                {steps[activeStep]?.label ?? "—"}
                <span className="text-ai-muted font-normal"> — {steps[activeStep]?.short ?? ""}</span>
              </p>
              <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                {steps[activeStep]?.detail ?? "Select a step above."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 flex flex-col min-h-0">
            <h4 className="text-ai-glow font-mono text-[10px] sm:text-xs uppercase tracking-wider mb-3">
              Confidence / Risk
            </h4>
            <div className="glass rounded-xl p-4 sm:p-5 border border-ai-border flex flex-col flex-1 justify-center">
              <div className="flex items-end gap-1.5 sm:gap-2 h-28 sm:h-32">
                {steps.map((step, i) => {
                  const h = step.load;
                  const isActive = activeStep === i;
                  return (
                    <motion.div
                      key={step.label}
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${h}%` } : { height: 0 }}
                      transition={{ delay: index * 0.15 + i * 0.05, duration: 0.5 }}
                      className={`flex-1 rounded-t min-h-[8px] max-w-[72px] mx-auto ${
                        isActive
                          ? "bg-gradient-to-t from-ai-glow to-ai-accent ring-1 ring-ai-glow/40"
                          : "bg-gradient-to-t from-ai-glow/35 to-ai-accent/35"
                      }`}
                    />
                  );
                })}
              </div>
              <div
                className="grid gap-1 mt-2"
                style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
              >
                {steps.map((step, i) => (
                  <span
                    key={`lbl-${step.label}`}
                    className={`text-[9px] sm:text-[10px] text-center leading-tight block truncate ${
                      activeStep === i ? "text-ai-glow font-medium" : "text-ai-muted"
                    }`}
                    title={step.label}
                  >
                    {step.barLabel}
                  </span>
                ))}
              </div>
              <p className="text-ai-muted text-[10px] sm:text-xs mt-4 text-center leading-snug">
                Relative load by stage — tap a workflow card to highlight
              </p>
            </div>
          </div>
        </div>

        {/* Natural-width SVG (useMaxWidth: false) + horizontal scroll — avoids 0-width collapse in flex */}
        <div className="min-w-0 space-y-3">
          <h4 className="text-ai-glow font-mono text-[10px] sm:text-xs uppercase tracking-wider">
            Architecture (LangGraph / services)
          </h4>
          <div className="glass rounded-xl border border-ai-border/80 bg-ai-surface/20 overflow-hidden shadow-inner">
            <div className="featured-arch-diagram w-full min-h-[min(40vw,280px)] sm:min-h-[300px] md:min-h-[320px] max-h-[min(70vh,560px)] overflow-x-auto overflow-y-auto overscroll-x-contain touch-pan-x p-3 sm:p-4 md:p-5 bg-gradient-to-b from-ai-bg/40 to-ai-bg/70">
              <MermaidChart
                projectId={project.id}
                deferUntilVisible
                className="!min-h-0 !rounded-none !border-0 !bg-transparent !p-0 w-full max-w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 pt-0">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 text-[11px] sm:text-xs border-t border-ai-border/40 pt-4">
          <span className="text-ai-glow font-mono uppercase tracking-wider shrink-0">
            Agent / module flow
          </span>
          <div className="flex flex-wrap gap-x-1 gap-y-1 text-ai-muted">
            {steps.map((step, i) => (
              <span key={step.label}>
                <span className={activeStep === i ? "text-ai-glow font-medium" : undefined}>{step.label}</span>
                {i < steps.length - 1 && <span className="text-ai-border mx-0.5">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
