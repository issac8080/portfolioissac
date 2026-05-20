"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  experienceNodes,
  experienceEdges,
  type ExperienceNode,
} from "@/data/experienceNodes";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabStatusPanel,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";
import { cn } from "@/lib/utils";
import { Hexagon, Layers2, MousePointer2, Network } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/** Pointy-top regular hexagon clip-path */
const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

/** Row-major order in the 3×2 grid (desktop): top 0–2, bottom 3–5 */
const GRID_ORDER = [0, 1, 2, 3, 4, 5] as const;

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<ExperienceNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const hexRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [linePaths, setLinePaths] = useState<{ d: string; from: number; to: number }[]>([]);
  const sectionInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const isReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Measure hex centers and compute SVG paths from DOM positions
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const updateLines = () => {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setLinePaths([]);
        return;
      }
      const rect = grid.getBoundingClientRect();
      const paths: { d: string; from: number; to: number }[] = [];
      experienceEdges.forEach(([fromIdx, toIdx]) => {
        const fromEl = hexRefs.current[fromIdx];
        const toEl = hexRefs.current[toIdx];
        if (!fromEl || !toEl) return;
        const r1 = fromEl.getBoundingClientRect();
        const r2 = toEl.getBoundingClientRect();
        if (r1.width < 4 || r1.height < 4 || r2.width < 4 || r2.height < 4) return;
        const x1 = r1.left - rect.left + r1.width / 2;
        const y1 = r1.top - rect.top + r1.height / 2;
        const x2 = r2.left - rect.left + r2.width / 2;
        const y2 = r2.top - rect.top + r2.height / 2;
        paths.push({
          d: `M ${x1} ${y1} L ${x2} ${y2}`,
          from: fromIdx,
          to: toIdx,
        });
      });
      setLinePaths(paths);
    };

    const scheduleLines = () => {
      requestAnimationFrame(() => requestAnimationFrame(updateLines));
    };

    const staggerMs =
      (experienceNodes.length - 1) * 100 + (isReducedMotion ? 50 : 650);
    const timers = [60, 320, staggerMs, staggerMs + 400].map((ms) =>
      setTimeout(scheduleLines, ms)
    );

    const ro = new ResizeObserver(scheduleLines);
    ro.observe(grid);
    window.addEventListener("scroll", scheduleLines, { passive: true });
    return () => {
      timers.forEach(clearTimeout);
      ro.disconnect();
      window.removeEventListener("scroll", scheduleLines);
    };
  }, [sectionInView, isReducedMotion]);

  const openModal = (node: ExperienceNode) => {
    setSelected(node);
  };

  // Disable background scroll when Experience modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  const isEdgeHovered = (from: number, to: number) => {
    if (hoveredEdge === null) return false;
    const [a, b] = experienceEdges[hoveredEdge];
    return (a === from && b === to) || (a === to && b === from);
  };
  const isEdgeActive = (from: number, to: number) => {
    if (activeNode === null) return false;
    return activeNode === from || activeNode === to;
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={siteSectionClass("z-0 overflow-y-visible")}
    >
      <LabSectionGridBg />
      <div className={cn(SITE_SECTION_INNER, "pb-1 md:pb-2")}>
        <LabSectionIntro
          eyebrow="Timeline lattice"
          title="Experience"
          description="Career graph — straight connectors show threads (ML path, web path, leadership, overlaps). Hover a line or node for detail."
          descriptionSecondary="Roles across AI/ML engineering, full-stack, Salesforce, and community leadership — click any hex for the full story."
          titleClassName="!text-3xl md:!text-5xl"
          aside={
            <LabStatusPanel label="Lattice status">
              <div className="space-y-2 text-xs text-ai-muted">
                <div className="flex justify-between gap-6">
                  <span>Nodes</span>
                  <span className="font-mono text-white">{experienceNodes.length}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span>Edges</span>
                  <span className="font-mono text-white">{experienceEdges.length}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span>Mode</span>
                  <span className="text-cyan-200/90">interactive</span>
                </div>
              </div>
            </LabStatusPanel>
          }
        />

        {/* 3×2 grid (mobile: single column) — one grid keeps rows aligned */}
        <div
          ref={gridRef}
          className="experience-honeycomb relative mx-auto w-full max-w-2xl min-w-0 overflow-hidden rounded-2xl px-3 py-5 md:max-w-3xl md:px-6 md:py-6"
        >
          {/* SVG connection lines (desktop only, behind hexes) — straight segments, clipped to honeycomb */}
          <svg
            ref={svgRef}
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            style={{ overflow: "hidden" }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="experience-line-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#38f9d7" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.9" />
              </linearGradient>
              <filter id="experience-line-glow">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g pointerEvents="none">
              {linePaths.map((path, i) => {
                const [fromIdx, toIdx] = experienceEdges[i];
                const active = isEdgeHovered(fromIdx, toIdx) || isEdgeActive(fromIdx, toIdx);
                return (
                  <motion.path
                    key={`${path.from}-${path.to}`}
                    d={path.d}
                    fill="none"
                    stroke="url(#experience-line-grad)"
                    strokeWidth={active ? 4 : 2.75}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: sectionInView ? 1 : 0,
                      opacity: sectionInView ? (active ? 1 : 0.58) : 0,
                    }}
                    transition={{
                      pathLength: { duration: 0.6, delay: i * 0.06 },
                      opacity: { duration: 0.3 },
                    }}
                    style={{
                      filter: active ? "url(#experience-line-glow)" : "none",
                    }}
                  />
                );
              })}
            </g>
          </svg>
          {/* Invisible wide stroke for line hover (desktop); separate layer so SVG stays pointer-events-none for pass-through */}
          <svg
            className="absolute inset-0 hidden h-full w-full md:block"
            style={{ overflow: "hidden", pointerEvents: "auto" }}
            preserveAspectRatio="none"
            aria-hidden
          >
            {linePaths.map((path, i) => (
              <path
                key={`hit-${i}`}
                d={path.d}
                fill="none"
                stroke="transparent"
                strokeWidth="20"
                strokeLinecap="round"
                onMouseEnter={() => setHoveredEdge(i)}
                onMouseLeave={() => setHoveredEdge(null)}
                className="cursor-default"
              />
            ))}
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center mx-auto w-full md:w-fit gap-x-[var(--hex-gap)] gap-y-[var(--hex-gap)] md:gap-y-[calc(var(--hex-gap)+6px)]">
            {GRID_ORDER.map((idx, order) => (
              <HexCard
                key={experienceNodes[idx].id}
                node={experienceNodes[idx]}
                index={idx}
                order={order}
                sectionInView={sectionInView}
                isReducedMotion={isReducedMotion}
                isActive={activeNode === idx}
                onHover={() => setActiveNode(idx)}
                onLeave={() => setActiveNode(null)}
                onOpenModal={openModal}
                hexRef={(el) => {
                  hexRefs.current[idx] = el;
                }}
              />
            ))}
          </div>
        </div>

        {/* Roles at a glance (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-12 overflow-hidden rounded-2xl border-x border-white/10 border-t-2 border-t-cyan-400/70 border-b-2 border-b-violet-500/45 bg-black/35 px-4 py-7 shadow-[0_0_36px_rgba(34,211,238,0.14)] backdrop-blur-xl sm:px-6 md:mt-14 md:px-8 md:py-9"
        >
          <div
            className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-[0.15]"
            aria-hidden
          />
          <h3 className="relative mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
            Roles at a glance
          </h3>
          <ul className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {experienceNodes.map((node) => (
              <li key={node.id} className="flex min-h-0">
                <button
                  type="button"
                  onClick={() => {
                    openModal(node);
                  }}
                  className="group flex h-full min-h-[168px] w-full flex-col rounded-xl border border-cyan-400/20 bg-ai-surface/25 px-4 py-3 text-left transition-colors hover:border-fuchsia-400/35 hover:bg-cyan-500/5 hover:shadow-[0_0_24px_rgba(56,249,215,0.12)]"
                >
                  <span className="font-medium text-white group-hover:text-ai-glow transition-colors block">
                    {node.role}
                  </span>
                  <span className="text-ai-muted text-xs block mt-0.5">
                    @ {node.organization}
                  </span>
                  <span className="text-ai-muted/80 text-xs block mt-1">
                    {node.period} · {node.duration}
                  </span>
                  <p className="mt-auto text-ai-muted/90 text-xs line-clamp-3 leading-relaxed">
                    {node.contribution}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        <LabSectionFooterStrip
          items={[
            { icon: <Network className="h-4 w-4 text-cyan-400" aria-hidden />, label: "thread graph" },
            { icon: <Hexagon className="h-4 w-4 text-violet-400" aria-hidden />, label: "hex nodes" },
            { icon: <MousePointer2 className="h-4 w-4 text-fuchsia-400" aria-hidden />, label: "click to expand" },
            { icon: <Layers2 className="h-4 w-4 text-lime-400" aria-hidden />, label: "multi-role stack" },
          ]}
        />
      </div>

      <ExperienceModal
        node={selected}
        onClose={() => {
          setSelected(null);
        }}
      />
    </section>
  );
}

function HexCard({
  node,
  index,
  order,
  sectionInView,
  isReducedMotion,
  isActive,
  onHover,
  onLeave,
  onOpenModal,
  hexRef,
}: {
  node: ExperienceNode;
  index: number;
  order: number;
  sectionInView: boolean;
  isReducedMotion: boolean;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onOpenModal: (node: ExperienceNode) => void;
  hexRef: (el: HTMLDivElement | null) => void;
}) {
  const handleClick = () => {
    onOpenModal(node);
  };

  return (
    <motion.div
      ref={hexRef}
      initial={{ opacity: 0, y: 32 }}
      animate={{
        opacity: sectionInView ? 1 : 0,
        y: sectionInView ? 0 : 32,
      }}
      transition={{
        duration: isReducedMotion ? 0.25 : 0.55,
        delay: isReducedMotion ? 0 : order * 0.1,
        ease: "easeOut",
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="experience-hex-wrap flex-shrink-0 w-[var(--hex-w)] h-[var(--hex-h)] md:w-[var(--hex-w)] md:h-[var(--hex-h)]"
    >
      <motion.button
        type="button"
        onClick={handleClick}
        className="experience-hex-card relative w-full h-full flex flex-col items-center justify-center text-center rounded-lg border border-ai-border bg-ai-surface/60 backdrop-blur-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ai-glow/50"
        style={{ clipPath: HEX_CLIP }}
        whileHover={isReducedMotion ? {} : { scale: 1.08 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Gradient border glow (via box-shadow) */}
        <span
          className="absolute inset-0 rounded-lg pointer-events-none transition-shadow duration-300"
          style={{
            clipPath: HEX_CLIP,
            boxShadow: isActive
              ? "inset 0 0 0 2px rgba(0,255,136,0.4), 0 0 28px rgba(0,255,136,0.3)"
              : "inset 0 0 0 1px rgba(0,255,136,0.25)",
          }}
          aria-hidden
        />
        <span className="relative z-10 line-clamp-2 px-2 text-[10px] font-medium leading-tight text-white md:text-xs">
          {node.role}
        </span>
        <span className="relative z-10 text-[10px] text-ai-muted mt-0.5 px-2">
          @ {node.organization}
        </span>
        <span className="relative z-10 text-[10px] text-ai-muted/80 mt-0.5">
          {node.duration}
        </span>
      </motion.button>
    </motion.div>
  );
}

function ExperienceModal({
  node,
  onClose,
}: {
  node: ExperienceNode | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence mode="wait">
      {node && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="pointer-events-auto w-full max-w-lg max-h-[min(90dvh,640px)] overflow-y-auto rounded-2xl border border-ai-border bg-ai-bg/95 p-6 shadow-2xl shadow-ai-glow/10 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{node.role}</h3>
                <p className="text-ai-glow text-sm">@ {node.organization}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-ai-muted hover:bg-ai-glow/10 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-ai-muted font-mono text-xs uppercase tracking-wider">
                  Duration
                </dt>
                <dd className="text-white mt-0.5">
                  {node.period} · {node.duration}
                </dd>
              </div>
              {node.location && (
                <div>
                  <dt className="text-ai-muted font-mono text-xs uppercase tracking-wider">
                    Location
                  </dt>
                  <dd className="text-white mt-0.5">{node.location}</dd>
                </div>
              )}
              <div>
                <dt className="text-ai-muted font-mono text-xs uppercase tracking-wider">
                  Contribution
                </dt>
                <dd className="text-ai-muted mt-0.5 leading-relaxed">
                  {node.contribution}
                </dd>
              </div>
              <div>
                <dt className="text-ai-muted font-mono text-xs uppercase tracking-wider">
                  Impact
                </dt>
                <dd className="text-ai-muted mt-0.5 leading-relaxed">
                  {node.impact}
                </dd>
              </div>
              <div>
                <dt className="text-ai-muted font-mono text-xs uppercase tracking-wider">
                  Technologies
                </dt>
                <dd className="mt-1.5 flex flex-wrap gap-2">
                  {node.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-ai-glow/15 px-2.5 py-1 text-xs text-ai-glow border border-ai-border/50"
                    >
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
