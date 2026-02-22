"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { getFeaturedCaseStudies } from "@/data/caseStudies";
import type { CaseStudy } from "@/data/caseStudies";

const featured = getFeaturedCaseStudies();

const SYSTEM_STEPS: Record<string, { label: string; desc: string }[]> = {
  "autonomous-returns": [
    { label: "Vision Agent", desc: "Image analysis" },
    { label: "Policy Agent", desc: "RAG retrieval" },
    { label: "Resolution Agent", desc: "Approve/Reject/Escalate" },
    { label: "Communication Agent", desc: "Customer response" },
  ],
  "code-dependency-analyzer": [
    { label: "Parse AST", desc: "Source analysis" },
    { label: "Build Graph", desc: "Dependencies" },
    { label: "Blast Radius", desc: "Impact scope" },
    { label: "Risk Score", desc: "Quantified risk" },
  ],
  "urban-place": [
    { label: "Identity Verification", desc: "AI pipeline" },
    { label: "Qualification Eval", desc: "Tutor scoring" },
    { label: "Trust Score", desc: "Completion & ratings" },
    { label: "Policy Listing", desc: "Provider discovery" },
  ],
};

export default function FeaturedSystemsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="featured-systems"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
      data-cinematic-reveal
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-2 font-[var(--font-space-grotesk)]"
        >
          Featured Systems
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-ai-muted mb-12"
        >
          AI-heavy systems — workflow, decision pipeline, risk visualization
        </motion.p>

        <div className="grid gap-8 lg:gap-10">
          {featured.map((project, i) => (
            <FeaturedDashboard key={project.id} project={project} index={i} isInView={isInView} />
          ))}
        </div>
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
  const steps = SYSTEM_STEPS[project.id] ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="glass rounded-2xl border border-ai-border overflow-hidden gradient-border"
    >
      <div className="p-6 md:p-8 border-b border-ai-border/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-ai-glow font-mono text-xs uppercase tracking-wider">
              Featured System
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
              {project.productTitle}
            </h3>
            <p className="text-ai-muted text-sm mt-1">{project.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 5).map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg bg-ai-glow/10 text-ai-glow/90 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:p-8">
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-ai-glow font-mono text-xs uppercase tracking-wider">
            Workflow / Decision Pipeline
          </h4>
          <div className="flex flex-wrap gap-2">
            {steps.map((step, i) => (
              <motion.button
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.15 + i * 0.08 }}
                onClick={() => setActiveStep(i)}
                className={`px-4 py-3 rounded-xl border text-left transition-all ${
                  activeStep === i
                    ? "border-ai-glow/50 bg-ai-glow/10 text-ai-glow"
                    : "border-ai-border/50 text-ai-muted hover:border-ai-border"
                }`}
              >
                <span className="font-medium block">{step.label}</span>
                <span className="text-xs opacity-80">{step.desc}</span>
              </motion.button>
            ))}
          </div>
          <div className="glass rounded-xl p-4 border border-ai-border min-h-[120px] flex items-center justify-center">
            <span className="text-ai-muted text-sm">
              {steps[activeStep]?.label ?? "—"} → {steps[activeStep]?.desc ?? "—"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-ai-glow font-mono text-xs uppercase tracking-wider">
            Confidence / Risk
          </h4>
          <div className="glass rounded-xl p-6 border border-ai-border">
            <div className="flex items-end gap-2 h-24">
              {[72, 88, 65, 94].map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={isInView ? { height: `${v}%` } : {}}
                  transition={{ delay: index * 0.15 + i * 0.05, duration: 0.5 }}
                  className="flex-1 rounded-t bg-gradient-to-t from-ai-glow/40 to-ai-accent/40 min-h-[8px]"
                />
              ))}
            </div>
            <p className="text-ai-muted text-xs mt-3 text-center">
              Score / confidence distribution
            </p>
          </div>
          <div className="glass rounded-xl p-6 border border-ai-border border-dashed min-h-[100px] flex items-center justify-center">
            <span className="text-ai-muted text-xs">Graph visualization placeholder</span>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-8 pb-6 md:pb-8">
        <div className="flex flex-wrap gap-3">
          <span className="text-ai-glow font-mono text-xs uppercase tracking-wider">
            Agent / Module flow
          </span>
          <div className="flex flex-wrap gap-2">
            {steps.map((step, i) => (
              <span key={step.label} className="text-ai-muted text-xs">
                {step.label}
                {i < steps.length - 1 && " → "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
