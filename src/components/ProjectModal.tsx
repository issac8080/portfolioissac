"use client";

import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink } from "lucide-react";
import type { CaseStudy } from "@/data/caseStudies";
import { projectMermaidDiagrams } from "@/data/projectDiagrams";
import MermaidChart from "@/components/MermaidChart";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: CaseStudy | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!project) return;
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [project, handleEscape]);

  useEffect(() => {
    if (!project) return;
    const t = window.setTimeout(() => panelRef.current?.focus(), 100);
    return () => window.clearTimeout(t);
  }, [project]);

  if (!project) return null;

  const pid = project.id;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        aria-describedby="project-modal-summary"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        />
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full max-w-6xl max-h-[100dvh] sm:max-h-[90vh] m-2 sm:m-4 overflow-hidden flex flex-col glass rounded-xl sm:rounded-2xl border border-ai-border shadow-2xl shadow-ai-glow/10 outline-none"
          data-lenis-prevent-wheel
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-ai-border bg-ai-bg/95 backdrop-blur-md rounded-t-xl sm:rounded-t-2xl shrink-0 gap-3">
            <div>
              <h2
                id="project-modal-title"
                className="text-lg sm:text-2xl md:text-3xl font-bold text-white font-[var(--font-space-grotesk)]"
              >
                {project.productTitle}
              </h2>
              <p id="project-modal-summary" className="text-ai-glow/90 text-sm mt-1">
                {project.tagline}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <a
                  href={`#${pid}-modal-problem`}
                  className="text-ai-muted hover:text-ai-glow underline underline-offset-2"
                >
                  Problem
                </a>
                <span className="text-ai-border">·</span>
                <a
                  href={`#${pid}-modal-architecture`}
                  className="text-ai-muted hover:text-ai-glow underline underline-offset-2"
                >
                  Architecture
                </a>
                <span className="text-ai-border">·</span>
                <a
                  href={`#${pid}-modal-ai`}
                  className="text-ai-muted hover:text-ai-glow underline underline-offset-2"
                >
                  AI workflow
                </a>
                <span className="text-ai-border">·</span>
                <Link
                  href={`/projects/${project.id}`}
                  prefetch={false}
                  className="text-ai-accent hover:text-ai-accent/90 underline underline-offset-2"
                  onClick={onClose}
                >
                  Shareable page
                </Link>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-ai-muted hover:text-white hover:bg-ai-glow/10 transition-colors"
              aria-label="Close project details"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 scroll-smooth">
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-ai-border bg-ai-surface/30 p-4"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-ai-muted mb-1">
                      {m.label}
                    </p>
                    <p className="text-sm text-white/95">{m.value}</p>
                  </div>
                ))}
              </div>
            )}

            <Section
              id={`${pid}-modal-problem`}
              title="Problem Statement"
              content={project.problemStatement}
            />
            <Section
              id={`${pid}-modal-architecture`}
              title="System Architecture"
              content={project.systemArchitecture}
            />

            {projectMermaidDiagrams[project.id] && (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h3 className="text-ai-glow font-mono text-sm uppercase tracking-wider mb-3">
                  System Flow
                </h3>
                <MermaidChart projectId={project.id} deferUntilVisible={false} />
              </motion.div>
            )}

            <Section id={`${pid}-modal-ai`} title="AI Workflow" content={project.aiWorkflow} />
            <Section
              id={`${pid}-modal-engineering`}
              title="Engineering Contribution"
              content={project.engineeringContribution}
            />
            <Section
              id={`${pid}-modal-impact`}
              title="Business Impact"
              content={project.businessImpact}
            />

            {project.engineeringNotes && project.engineeringNotes.length > 0 && (
              <div id={`${pid}-modal-notes`} className="space-y-3">
                <h3 className="text-ai-accent font-mono text-sm uppercase tracking-wider">
                  Engineering notes
                </h3>
                {project.engineeringNotes.map((n) => (
                  <div
                    key={n.label}
                    className="rounded-xl border border-ai-border/80 border-l-2 border-l-ai-accent/50 bg-ai-surface/20 p-4"
                  >
                    <p className="text-xs font-semibold text-ai-accent mb-1">{n.label}</p>
                    <p className="text-sm text-ai-muted leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="text-ai-glow font-mono text-sm uppercase tracking-wider mb-3">
                Key Features
              </h3>
              <ul className="space-y-2">
                {project.keyFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-ai-muted text-sm">
                    <span className="text-ai-glow mt-0.5">▹</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-ai-glow font-mono text-sm uppercase tracking-wider mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-lg bg-ai-glow/10 text-ai-glow text-xs font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {(project.github || project.link) && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-ai-border">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ai-glow/20 text-ai-glow border border-ai-border hover:bg-ai-glow/30 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    View on GitHub
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ai-accent/20 text-ai-accent border border-ai-border hover:bg-ai-accent/30 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: string;
}) {
  return (
    <div id={id}>
      <h3 className="text-ai-glow font-mono text-sm uppercase tracking-wider mb-2">
        {title}
      </h3>
      <p className="text-ai-muted text-sm leading-relaxed">{content}</p>
    </div>
  );
}
