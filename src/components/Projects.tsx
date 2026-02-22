"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { projects } from "@/data/portfolio";
import type { Project } from "@/data/portfolio";

const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section
      id="projects"
      className="relative py-24 md:py-32 overflow-hidden"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4 font-[var(--font-space-grotesk)]"
        >
          Projects
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-ai-muted mb-10"
        >
          AI research, Salesforce, ML & full-stack work
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-ai-glow/20 text-ai-glow border border-ai-border shadow-[0_0_15px_rgba(0,255,136,0.15)]"
                  : "bg-ai-surface/50 text-ai-muted border border-transparent hover:border-ai-border/50"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onSelect={() => setSelected(project)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="glass border-ai-border max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-ai-glow">{selected.title}</DialogTitle>
                <DialogDescription>{selected.subtitle}</DialogDescription>
              </DialogHeader>
              <p className="text-ai-muted text-sm">{selected.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {selected.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-md bg-ai-glow/10 text-ai-glow text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {(selected.github || selected.link) && (
                <div className="flex gap-3 mt-4">
                  {selected.github && (
                    <a
                      href={selected.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ai-accent hover:underline text-sm"
                    >
                      GitHub
                    </a>
                  )}
                  {selected.link && (
                    <a
                      href={selected.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ai-accent hover:underline text-sm"
                    >
                      Live
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateY.set(dx * 8);
    rotateX.set(-dy * 8);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onSelect}
      className="group cursor-pointer"
    >
      <div className="glass rounded-xl p-6 h-full border border-ai-border hover:border-ai-glow/30 transition-colors duration-300 gradient-border card-elevation-shadow">
        <div className="text-ai-glow/70 text-xs font-mono mb-2">{project.category}</div>
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-ai-glow transition-colors">
          {project.title}
        </h3>
        <p className="text-ai-muted text-sm line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className="text-xs text-ai-accent/80">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
