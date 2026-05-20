"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = [
  "Analyzing architecture…",
  "Searching vector memory…",
  "Cross-referencing projects…",
] as const;

type Props = {
  active: boolean;
  /** Cosine similarity 0–100 for final beat */
  matchStrengthPct: number | null;
  /** Briefly show completion line after pipeline idle */
  showResolved: boolean;
};

export default function ThinkingStateBanner({
  active,
  matchStrengthPct,
  showResolved,
}: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) {
      setIdx(0);
      return;
    }
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % BASE.length);
    }, 720);
    return () => window.clearInterval(t);
  }, [active]);

  const line = useMemo(() => {
    if (showResolved && matchStrengthPct != null) {
      return `Confidence: ${matchStrengthPct}% · vector alignment`;
    }
    if (active) return BASE[idx];
    return null;
  }, [active, idx, matchStrengthPct, showResolved]);

  return (
    <div className="relative min-h-[2.25rem]" aria-live="polite">
      <AnimatePresence mode="wait">
        {(active || showResolved) && line && (
          <motion.div
            key={line}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.22 }}
            className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-emerald-500/5 to-transparent px-3 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-200/90">
              {line}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
