"use client";

import { useEffect, useCallback } from "react";
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

  if (!project) return null;

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
      >
        {/* Dark backdrop — click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        />
        {/* Full-screen overlay panel — Apple product-detail style */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 overflow-hidden flex flex-col glass rounded-2xl border border-ai-border shadow-2xl shadow-ai-glow/10"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-ai-border bg-ai-bg/95 backdrop-blur-md rounded-t-2xl shrink-0">
            <div>
              <h2
                id="project-modal-title"
                className="text-2xl md:text-3xl font-bold text-white font-[var(--font-space-grotesk)]"
              >
                {project.productTitle}
              </h2>
              <p className="text-ai-glow/90 text-sm mt-1">{project.tagline}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-ai-muted hover:text-white hover:bg-ai-glow/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            <Section title="Problem Statement" content={project.problemStatement} />
            <Section title="System Architecture" content={project.systemArchitecture} />

            {/* System architecture diagram — Mermaid */}
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
                <MermaidChart projectId={project.id} />
              </motion.div>
            )}

            <Section title="AI Workflow" content={project.aiWorkflow} />
            <Section title="Engineering Contribution" content={project.engineeringContribution} />
            <Section title="Business Impact" content={project.businessImpact} />

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

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-ai-glow font-mono text-sm uppercase tracking-wider mb-2">
        {title}
      </h3>
      <p className="text-ai-muted text-sm leading-relaxed">{content}</p>
    </div>
  );
}
