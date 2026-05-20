"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Particle = {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
};

/** Deterministic PRNG so SSR markup matches first client paint (no Math.random in render). */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft square bokeh — reads like HUD / data shards over the hero */
export default function FloatingTechParticles({ count = 48 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() => {
    const list: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const rnd = mulberry32(i * 977 + 1337);
      list.push({
        id: i,
        left: `${8 + rnd() * 84}%`,
        top: `${6 + rnd() * 88}%`,
        size: 2 + rnd() * 5,
        delay: rnd() * 4,
        duration: 10 + rnd() * 14,
        driftX: (rnd() - 0.5) * 28,
      });
    }
    return list;
  }, [count]);

  if (!mounted || reduceMotion) return null;

  return (
    <div
      className="absolute inset-0 z-[5] pointer-events-none overflow-hidden"
      aria-hidden
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-[2px] bg-ai-glow/25 shadow-[0_0_12px_rgba(0,255,136,0.35)] border border-ai-glow/20"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: 0.15,
          }}
          animate={{
            opacity: [0.12, 0.55, 0.18, 0.45, 0.15],
            x: [0, p.driftX * 0.4, p.driftX * -0.2, p.driftX * 0.3, 0],
            y: [0, -22, -40, -18, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
