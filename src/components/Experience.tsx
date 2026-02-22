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

gsap.registerPlugin(ScrollTrigger);

/** Flat-top hexagon clip-path */
const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

/** Honeycomb layout: row1 = 3, row2 = 4, row3 = 3. We have 6 nodes → row1: 3, row2: 3 (offset). */
const ROW_1_INDICES = [0, 1, 2];
const ROW_2_INDICES = [3, 4, 5];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<ExperienceNode | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<{
    x: number;
    y: number;
  } | null>(null);
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
      const rect = grid.getBoundingClientRect();
      const paths: { d: string; from: number; to: number }[] = [];
      experienceEdges.forEach(([fromIdx, toIdx]) => {
        const fromEl = hexRefs.current[fromIdx];
        const toEl = hexRefs.current[toIdx];
        if (!fromEl || !toEl) return;
        const r1 = fromEl.getBoundingClientRect();
        const r2 = toEl.getBoundingClientRect();
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

    // Run after hexes have laid out (stagger delay + layout)
    const t = setTimeout(updateLines, 400);
    const ro = new ResizeObserver(updateLines);
    ro.observe(grid);
    window.addEventListener("scroll", updateLines, { passive: true });
    return () => {
      clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("scroll", updateLines);
    };
  }, [sectionInView]);

  const openModal = (node: ExperienceNode, sourceRect: DOMRect) => {
    setSelectedOrigin({
      x: sourceRect.left + sourceRect.width / 2,
      y: sourceRect.top + sourceRect.height / 2,
    });
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
      className="relative z-0 pt-28 pb-24 md:pt-32 md:pb-32 overflow-x-hidden overflow-y-visible"
    >
      <div className="max-w-4xl mx-auto px-6 relative z-0">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-2 font-[var(--font-space-grotesk)]"
        >
          Experience
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-ai-muted mb-2 max-w-2xl"
        >
          Neural career map — hover and click nodes to see full details.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-ai-muted/80 text-sm mb-14 md:mb-16 max-w-2xl"
        >
          Roles across AI/ML engineering, full-stack development, Salesforce, and
          community leadership.
        </motion.p>

        {/* Honeycomb grid: constrained so nodes stay inside viewport and below navbar */}
        <div
          ref={gridRef}
          className="experience-honeycomb relative mx-auto w-full max-w-lg md:max-w-2xl min-w-0"
        >
          {/* SVG connection lines (desktop only, behind hexes) */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full hidden md:block"
            style={{ overflow: "visible", pointerEvents: "none" }}
          >
            <defs>
              <linearGradient
                id="experience-line-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.5" />
              </linearGradient>
              <filter id="experience-line-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
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
                    strokeWidth={active ? 2.5 : 1.5}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: sectionInView ? 1 : 0,
                      opacity: sectionInView ? (active ? 0.9 : 0.35) : 0,
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
            className="absolute inset-0 w-full h-full hidden md:block"
            style={{ overflow: "visible", pointerEvents: "auto" }}
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

          {/* Row 1: 3 hexagons; mobile: stack vertically */}
          <div className="flex flex-col md:flex-row flex-nowrap items-center justify-center gap-[var(--hex-gap)]">
            {ROW_1_INDICES.map((idx, order) => (
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

          {/* Row 2: 3 hexagons; desktop: offset by half hex width (honeycomb); mobile: stack, no offset */}
          <div className="experience-hex-row-2 flex flex-col md:flex-row flex-nowrap items-center justify-center gap-[var(--hex-gap)] mt-[var(--hex-gap)] md:translate-x-[calc((var(--hex-w)+var(--hex-gap))/2)]">
            {ROW_2_INDICES.map((idx, order) => (
              <HexCard
                key={experienceNodes[idx].id}
                node={experienceNodes[idx]}
                index={idx}
                order={order + ROW_1_INDICES.length}
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
          className="mt-16 pt-10 border-t border-ai-border/50"
        >
          <h3 className="text-ai-glow font-mono text-xs uppercase tracking-wider mb-4">
            Roles at a glance
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {experienceNodes.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={(e) => {
                    const rect = (
                      e.currentTarget as HTMLElement
                    ).getBoundingClientRect();
                    openModal(node, rect);
                  }}
                  className="text-left w-full rounded-xl border border-ai-border/50 bg-ai-surface/30 px-4 py-3 hover:border-ai-glow/30 hover:bg-ai-glow/5 transition-colors group"
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
                  <p className="text-ai-muted/90 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {node.contribution}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <ExperienceModal
        node={selected}
        origin={selectedOrigin}
        onClose={() => {
          setSelected(null);
          setSelectedOrigin(null);
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
  onOpenModal: (node: ExperienceNode, rect: DOMRect) => void;
  hexRef: (el: HTMLDivElement | null) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLDivElement;
    onOpenModal(node, el.getBoundingClientRect());
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
        <span className="relative z-10 text-xs font-medium text-white px-2 leading-tight">
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
  origin,
  onClose,
}: {
  node: ExperienceNode | null;
  origin: { x: number; y: number } | null;
  onClose: () => void;
}) {
  const centerX =
    typeof window !== "undefined" ? window.innerWidth / 2 : 0;
  const centerY =
    typeof window !== "undefined" ? window.innerHeight / 2 : 0;
  const fromX = origin ? origin.x - centerX : 0;
  const fromY = origin ? origin.y - centerY : 0;

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
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.2,
              x: fromX,
              y: fromY,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              x: fromX * 0.3,
              y: fromY * 0.3,
              filter: "blur(4px)",
            }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 280,
              mass: 0.8,
            }}
            className="fixed left-1/2 top-1/2 z-[100] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-ai-border bg-ai-bg/95 p-6 shadow-2xl shadow-ai-glow/10 backdrop-blur-xl"
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
        </>
      )}
    </AnimatePresence>
  );
}
