"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { caseStudies } from "@/data/caseStudies";
import type { CaseStudy } from "@/data/caseStudies";

gsap.registerPlugin(ScrollTrigger);

const categories = ["All", ...Array.from(new Set(caseStudies.map((c) => c.category)))];

export default function ProjectsShowcase({
  onSelectProject,
}: {
  onSelectProject: (project: CaseStudy) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("All");
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const filtered =
    filter === "All"
      ? caseStudies
      : caseStudies.filter((c) => c.category === filter);

  useEffect(() => {
    const section = sectionRef.current;
    const strip = stripRef.current;
    if (!section || !strip) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=250%",
      pin: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const stripWidth = Math.max(0, strip.scrollWidth - window.innerWidth);
        gsap.set(strip, { x: -progress * stripWidth });
      },
    });
    triggerRef.current = trigger;

    return () => {
      triggerRef.current?.kill();
      triggerRef.current = null;
    };
  }, []);

  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        data-cinematic-reveal
        className="relative h-screen overflow-hidden py-24 md:py-32"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-ai-bg via-ai-bg/95 to-ai-bg pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col pt-16 md:pt-20 px-6">
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

          <div className="flex-1 min-h-0 overflow-visible">
            <div
              ref={stripRef}
              className="flex gap-6 md:gap-8 pb-8"
              style={{ width: "max-content", willChange: "transform" }}
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
        </div>
      </section>
    </>
  );
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
    rotateY.set(dx * 10);
    rotateX.set(-dy * 10);
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
        perspective: 1000,
        boxShadow: springGlow.get()
          ? undefined
          : "0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,255,136,0.1)",
      }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onSelect}
      className="group cursor-pointer flex-shrink-0 w-[320px] md:w-[380px]"
    >
      <motion.div
        className="glass rounded-2xl p-6 h-full min-h-[320px] border border-ai-border gradient-border card-elevation-shadow flex flex-col"
        style={{
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
