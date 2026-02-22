"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills } from "@/data/portfolio";

const topSkills = skills.top;
const techStack = [
  "Python", "TensorFlow", "PyTorch", "Salesforce", "Apex", "React",
  "Node.js", "MongoDB", "SQL", "Git", "Docker", "MLOps",
];

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-4 font-[var(--font-space-grotesk)]"
        >
          Skills
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-ai-muted mb-12"
        >
          Top skills & tech stack
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-ai-glow font-mono text-sm uppercase tracking-wider">
              Top Skills
            </h3>
            {topSkills.map((skill, i) => (
              <RadialSkill
                key={skill}
                id={skill.replace(/\s/g, "-")}
                label={skill}
                value={90 - i * 5}
                delay={i * 0.1}
                isInView={isInView}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-ai-glow font-mono text-sm uppercase tracking-wider mb-6">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(0, 255, 136, 0.2)",
                    borderColor: "rgba(0, 255, 136, 0.4)",
                  }}
                  className="px-4 py-2 rounded-lg border border-ai-border bg-ai-surface/50 text-sm text-ai-muted hover:text-ai-glow transition-colors cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
            <div className="mt-8">
              <h4 className="text-ai-muted text-sm mb-3">Certifications</h4>
              <ul className="space-y-2 text-sm text-ai-muted">
                {skills.certifications.slice(0, 4).map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <span className="text-ai-glow mt-0.5">▹</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function RadialSkill({
  label,
  value,
  delay,
  isInView,
  id,
}: {
  label: string;
  value: number;
  delay: number;
  isInView: boolean;
  id: string;
}) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ delay }}
      className="flex items-center gap-4"
    >
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="rgba(0,255,136,0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke={`url(#skillGrad-${id})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1, delay, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id={`skillGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-ai-glow">
          {value}%
        </span>
      </div>
      <span className="text-white font-medium">{label}</span>
    </motion.div>
  );
}
