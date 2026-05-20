"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Soft cursor orb + faint trail — pointer/fine only; no touch targets blocked.
 */
export default function PremiumCursorLab({ enabled }: { enabled: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 28, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 280, damping: 28, mass: 0.35 });
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, x, y]);

  useEffect(() => {
    if (!enabled) return;
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const trail = trailRef.current;
    if (!trail) return;

    const unsubX = sx.on("change", (vx) => {
      trail.style.setProperty("--cx", `${vx}px`);
    });
    const unsubY = sy.on("change", (vy) => {
      trail.style.setProperty("--cy", `${vy}px`);
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [enabled, sx, sy]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] hidden [@media(pointer:fine)]:block"
      aria-hidden
    >
      <div
        ref={trailRef}
        className="absolute h-[min(42vw,420px)] w-[min(42vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.14] mix-blend-screen blur-3xl"
        style={{
          left: "var(--cx, -9999px)",
          top: "var(--cy, -9999px)",
          background:
            "radial-gradient(circle, rgba(0,255,136,0.45) 0%, rgba(0,212,255,0.2) 38%, transparent 70%)",
        }}
      />
      <motion.div
        className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ai-glow/50 bg-ai-glow/25 shadow-[0_0_24px_rgba(0,255,136,0.55)]"
        style={{ left: sx, top: sy }}
      />
    </div>
  );
}
