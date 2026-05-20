"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { RecruiterSessionV1 } from "@/types/portfolioIntelligence";

/** Lightweight live graph (SVG) — avoids second React Flow instance for session topology */
function KnowledgeGraphSurfaceInner({ session }: { session: RecruiterSessionV1 }) {
  const nodes = useMemo(() => {
    const projects = Object.entries(session.projectScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const tech = Object.entries(session.techMentions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    return { projects, tech };
  }, [session.projectScores, session.techMentions]);

  const cx = 110;
  const cy = 72;

  return (
    <div className="relative h-[150px] w-full overflow-hidden rounded-xl border border-violet-500/20 bg-gradient-to-b from-violet-950/40 to-black/50">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 220 150" aria-hidden>
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,255,136,0.05)" />
            <stop offset="50%" stopColor="rgba(0,212,255,0.45)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0.35)" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={cx}
          cy={cy}
          r={6}
          fill="rgba(0,255,136,0.9)"
          animate={{ opacity: [0.7, 1, 0.7], r: [5, 7, 5] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        {nodes.projects.map(([id], i) => {
          const angle = (i / Math.max(nodes.projects.length, 1)) * Math.PI * 2;
          const x = cx + Math.cos(angle) * 62;
          const y = cy + Math.sin(angle) * 42;
          return (
            <g key={id}>
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="url(#edgeGrad)"
                strokeWidth={1.2}
                strokeDasharray="4 3"
                opacity={0.85}
              />
              <circle cx={x} cy={y} r={5} fill="rgba(16,185,129,0.35)" stroke="rgba(16,185,129,0.8)" />
            </g>
          );
        })}
        {nodes.tech.map(([term], j) => {
          const angle = Math.PI + (j / Math.max(nodes.tech.length, 1)) * Math.PI * 0.9;
          const x = cx + Math.cos(angle) * 78;
          const y = cy + Math.sin(angle) * 52;
          return (
            <g key={term}>
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(167,139,250,0.25)"
                strokeWidth={1}
              />
              <rect
                x={x - 22}
                y={y - 6}
                width={44}
                height={12}
                rx={4}
                fill="rgba(30,20,50,0.85)"
                stroke="rgba(167,139,250,0.35)"
              />
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,255,136,0.12),transparent_55%)]" />
      <p className="absolute bottom-2 left-3 text-[8px] font-mono uppercase tracking-[0.2em] text-white/40">
        Session graph · local only
      </p>
    </div>
  );
}

export default memo(KnowledgeGraphSurfaceInner);
