"use client";

import { useState, useEffect, forwardRef, useMemo } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { caseStudies } from "@/data/caseStudies";
import type { CaseStudy } from "@/data/caseStudies";
import type { RecruiterSessionV1 } from "@/types/portfolioIntelligence";
import {
  Layers,
  Cpu,
  Sparkles,
  FolderKanban,
} from "lucide-react";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabStatusPanel,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { cn } from "@/lib/utils";
import { getProjectHudAccent } from "@/lib/projectCardHudTheme";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";

function readRecruiterProjectScores(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("pi_recruiter_v1");
    if (!raw) return {};
    const s = JSON.parse(raw) as RecruiterSessionV1;
    return s.projectScores && typeof s.projectScores === "object" ? s.projectScores : {};
  } catch {
    return {};
  }
}

const categories = ["All", ...Array.from(new Set(caseStudies.map((c) => c.category)))];

const TILT_MAX_DEG = 6;

const INITIAL_GRID = 9;

export default function ProjectsShowcase({
  onSelectProject,
}: {
  onSelectProject: (project: CaseStudy) => void;
}) {
  const [filter, setFilter] = useState("All");
  const [showAllProjects, setShowAllProjects] = useState(false);

  const [boost, setBoost] = useState<Record<string, number>>({});

  useEffect(() => {
    setBoost(readRecruiterProjectScores());
    const onUpd = () => setBoost(readRecruiterProjectScores());
    window.addEventListener("portfolio-recruiter-session-updated", onUpd);
    return () => window.removeEventListener("portfolio-recruiter-session-updated", onUpd);
  }, []);

  const filtered = useMemo(() => {
    const base =
      filter === "All"
        ? caseStudies
        : caseStudies.filter((c) => c.category === filter);
    return [...base].sort((a, b) => {
      const da = boost[a.id] ?? 0;
      const db = boost[b.id] ?? 0;
      if (db !== da) return db - da;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filter, boost]);

  const shownProjects = useMemo(
    () =>
      showAllProjects || filtered.length <= INITIAL_GRID
        ? filtered
        : filtered.slice(0, INITIAL_GRID),
    [filtered, showAllProjects]
  );

  const hiddenProjectCount = Math.max(0, filtered.length - INITIAL_GRID);

  useEffect(() => {
    setShowAllProjects(false);
  }, [filter]);

  const featuredCount = useMemo(
    () => caseStudies.filter((c) => c.featured).length,
    []
  );

  return (
    <section
      id="projects"
      data-cinematic-reveal
      className={cn(
        siteSectionClass("isolation-isolate z-[1] overflow-visible"),
        "pb-12 md:pb-16"
      )}
    >
      <LabSectionGridBg />
      <div className={cn(SITE_SECTION_INNER, "flex flex-col overflow-visible pt-2 md:pt-4")}>
        <LabSectionIntro
          eyebrow="Case study deck"
          title="Projects"
          description="Nine case studies per view — expand for the full deck or filter by category. Recruiter session can re-rank cards locally."
          aside={
            <LabStatusPanel label="Lab status">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] text-ai-muted">
                    <FolderKanban className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
                    Case studies
                  </div>
                  <p className="font-mono text-xl font-bold text-white">
                    {String(caseStudies.length).padStart(2, "0")}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] text-ai-muted">
                    <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" aria-hidden />
                    Featured
                  </div>
                  <p className="font-mono text-xl font-bold text-fuchsia-200">{featuredCount}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400/60 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.9)]" />
                </span>
                <span className="text-[11px] font-medium text-lime-200/95">Portfolio link graph live</span>
              </div>
            </LabStatusPanel>
          }
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
                filter === cat
                  ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.25)]"
                  : "border-white/10 bg-black/30 text-ai-muted hover:border-white/20 hover:text-white/90"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        <div className="relative" style={{ perspective: "1200px" }}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shownProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={filtered.indexOf(project)}
                  gridMode
                  onSelect={() => onSelectProject(project)}
                />
              ))}
            </AnimatePresence>
          </div>
          {hiddenProjectCount > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllProjects((v) => !v)}
                className="rounded-full border border-fuchsia-400/45 bg-fuchsia-500/10 px-5 py-2 text-sm font-semibold text-fuchsia-100 shadow-[0_0_22px_rgba(217,70,239,0.2)] transition-colors hover:border-fuchsia-300/70 hover:bg-fuchsia-500/15"
              >
                {showAllProjects ? "Show fewer" : `+${hiddenProjectCount} more`}
              </button>
            </div>
          )}
        </div>

        <LabSectionFooterStrip
          items={[
            { icon: <Layers className="h-3.5 w-3.5 text-violet-400" aria-hidden />, label: "Case dossiers" },
            { icon: <Cpu className="h-3.5 w-3.5 text-cyan-400" aria-hidden />, label: "Systems detail" },
            { icon: <Sparkles className="h-3.5 w-3.5 text-fuchsia-400" aria-hidden />, label: "Featured signals" },
            { icon: <FolderKanban className="h-3.5 w-3.5 text-lime-400" aria-hidden />, label: "Deep pages" },
          ]}
        />
      </div>
    </section>
  );
}

const ProjectCard = forwardRef<
  HTMLDivElement,
  {
    project: CaseStudy;
    index: number;
    gridMode?: boolean;
    onSelect: () => void;
  }
>(function ProjectCard({ project, index, gridMode, onSelect }, ref) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });
  const glow = useMotionValue(0);
  const springGlow = useSpring(glow, { stiffness: 150, damping: 20 });
  const h = getProjectHudAccent(index);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateY.set(Math.max(-TILT_MAX_DEG, Math.min(TILT_MAX_DEG, dx * TILT_MAX_DEG)));
    rotateX.set(Math.max(-TILT_MAX_DEG, Math.min(TILT_MAX_DEG, -dy * TILT_MAX_DEG)));
    glow.set(1);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    glow.set(0);
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
      }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        willChange: "transform",
        boxShadow: springGlow.get()
          ? undefined
          : "0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,255,136,0.1)",
      }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onSelect}
      className={cn(
        "project-card group cursor-pointer",
        gridMode
          ? "w-full min-w-0 flex-shrink-0"
          : "flex-shrink-0 snap-center w-[min(20rem,calc(100vw-6.5rem))] max-w-[calc(100vw-6.5rem)] md:w-[min(23.75rem,calc(100vw-8rem))] md:max-w-[min(23.75rem,calc(100vw-8rem))]"
      )}
    >
      <motion.div
        className={cn(
          "relative flex h-full min-h-[280px] min-w-0 flex-col overflow-hidden rounded-2xl border-x border-white/[0.08] bg-[rgba(6,8,14,0.82)] p-6 backdrop-blur-md sm:min-h-[300px] md:min-h-[320px]",
          h.borderNeonTop,
          h.borderNeonBottom,
          h.hudGlow
        )}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transition: "box-shadow 0.3s ease",
          boxShadow: springGlow.get()
            ? "0 30px 60px -15px rgba(0,0,0,0.55), 0 0 48px rgba(56,249,215,0.18)"
            : undefined,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.06) 45%, transparent 90%)",
          }}
        />
        <div className="relative mb-3 flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", h.dot)} aria-hidden />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ai-muted">
            {project.category}
          </span>
        </div>
        <h3
          className={cn(
            "relative mb-2 text-xl font-bold text-white transition-colors group-hover:text-white",
            h.titleAccent
          )}
        >
          {project.productTitle}
        </h3>
        <p className="relative mb-4 flex-1 text-sm leading-snug text-ai-muted line-clamp-2">
          {project.tagline}
        </p>
        <div className="relative flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06 + i * 0.04 }}
              className={cn("rounded-md px-2.5 py-1 text-xs font-medium", h.techChip)}
            >
              {t}
            </motion.span>
          ))}
        </div>
        <div
          className={cn(
            "relative mt-4 flex flex-col gap-2 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between",
            h.ctaRow,
            "text-ai-accent"
          )}
        >
          <span className="font-semibold uppercase tracking-wider text-white/90 transition-colors group-hover:text-white">
            Open dossier
          </span>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Link
              href={`/projects/${project.id}`}
              prefetch={false}
              onClick={(e) => e.stopPropagation()}
              className={cn("font-semibold hover:underline", h.titleAccent)}
            >
              Dedicated page
            </Link>
            <span className="hidden opacity-0 transition-opacity group-hover:opacity-100 sm:inline">
              →
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

ProjectCard.displayName = "ProjectCard";
