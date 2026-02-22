"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { caseStudies } from "@/data/caseStudies";
import type { CaseStudy } from "@/data/caseStudies";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = ["All", ...Array.from(new Set(caseStudies.map((c) => c.category)))];

const TILT_MAX_DEG = 6;

export default function ProjectsShowcase({
  onSelectProject,
}: {
  onSelectProject: (project: CaseStudy) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("All");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filtered =
    filter === "All"
      ? caseStudies
      : caseStudies.filter((c) => c.category === filter);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - 2
    );
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScrollOrResize = () => {
      requestAnimationFrame(updateScrollState);
    };
    onScrollOrResize();
    el.addEventListener("scroll", onScrollOrResize, { passive: true });
    const ro = new ResizeObserver(onScrollOrResize);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScrollOrResize);
      ro.disconnect();
    };
  }, [filtered.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.85;
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const max = scrollWidth - clientWidth;
      setScrollProgress(max <= 0 ? 1 : scrollLeft / max);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [filtered.length]);

  return (
    <section
      id="projects"
      data-cinematic-reveal
      className="relative py-24 md:py-32 overflow-visible min-h-auto isolation-isolate z-[1]"
      style={{ paddingBottom: "4rem" }}
    >
      <div className="relative z-10 flex flex-col pt-16 md:pt-20 px-6 overflow-visible max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white font-[var(--font-space-grotesk)]">
            Projects
          </h2>
          <p className="text-ai-muted mt-2">
            AI product systems — horizontal scroll to explore
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? "bg-ai-glow/20 text-ai-glow border border-ai-border shadow-[0_0_15px_rgba(0,255,136,0.15)]"
                  : "bg-ai-surface/50 text-ai-muted border border-transparent hover:border-ai-border/50"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        <div className="relative overflow-visible">
          {/* Left fade mask */}
          <div
            className="projects-fade-mask projects-fade-left absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            aria-hidden
          />
          {/* Right fade mask */}
          <div
            className="projects-fade-mask projects-fade-right absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            aria-hidden
          />

          {/* Scroll arrows */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-ai-border bg-ai-bg/90 backdrop-blur-sm flex items-center justify-center text-ai-glow transition-opacity duration-200",
              canScrollLeft ? "opacity-100 hover:bg-ai-glow/10" : "opacity-0 pointer-events-none"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-ai-border bg-ai-bg/90 backdrop-blur-sm flex items-center justify-center text-ai-glow transition-opacity duration-200",
              canScrollRight ? "opacity-100 hover:bg-ai-glow/10" : "opacity-0 pointer-events-none"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scroll track wrapper: overflow-x auto, overflow-y visible so cards are never vertically clipped */}
          <div
            ref={scrollRef}
            className="scroll-wrapper projects-scroll-container overflow-x-auto overflow-y-visible scroll-smooth py-4"
            style={{
              scrollSnapType: "x mandatory",
              scrollPaddingInline: "2rem",
              paddingInline: "2rem",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Card row: flex, gap 1.5rem, align stretch, height auto; padding for 3D tilt clearance */}
            <div
              className="projects-cards-strip flex gap-6 items-stretch h-auto py-6 px-2"
              style={{
                width: "max-content",
                perspective: "1200px",
              }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    onSelect={() => onSelectProject(project)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Scroll progress bar: outside scroll container; bottom -1.5rem so it does not overlap cards */}
          <div
            className="absolute left-0 w-full z-10 bg-ai-surface/50 rounded-full overflow-hidden"
            style={{ bottom: "-1.5rem", height: "6px" }}
            aria-hidden
          >
            <div
              className="h-full bg-ai-glow/60 rounded-full transition-[width] duration-150"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: CaseStudy;
  index: number;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });
  const glow = useMotionValue(0);
  const springGlow = useSpring(glow, { stiffness: 150, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
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
      className="project-card group cursor-pointer flex-shrink-0 min-w-[320px] w-[320px] md:w-[380px] snap-center"
    >
      <motion.div
        className="glass rounded-2xl p-6 h-full min-h-[320px] border border-ai-border gradient-border card-elevation-shadow flex flex-col"
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transition: "box-shadow 0.3s ease",
          boxShadow: springGlow.get()
            ? "0 30px 60px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,136,0.2), 0 0 50px -10px rgba(0,255,136,0.3)"
            : undefined,
        }}
      >
        <div className="text-ai-glow/80 text-xs font-mono uppercase tracking-wider mb-3">
          {project.category}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-ai-glow transition-colors">
          {project.productTitle}
        </h3>
        <p className="text-ai-muted text-sm line-clamp-2 mb-4 flex-1">
          {project.tagline}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06 + i * 0.04 }}
              className="px-2.5 py-1 rounded-md bg-ai-glow/10 text-ai-glow/90 text-xs font-medium"
            >
              {t}
            </motion.span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-ai-border/50 flex items-center justify-between text-xs text-ai-accent">
          <span>View case study</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            →
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
