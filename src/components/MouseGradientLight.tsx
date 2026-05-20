"use client";

import { useEffect, useRef } from "react";

const RADIUS = 400;
const OPACITY = 0.09;

export default function MouseGradientLight() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useRef(0.5);
  const y = useRef(0.5);
  const targetX = useRef(0.5);
  const targetY = useRef(0.5);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      targetX.current = e.clientX / window.innerWidth;
      targetY.current = e.clientY / window.innerHeight;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const update = () => {
      x.current = lerp(x.current, targetX.current, 0.08);
      y.current = lerp(y.current, targetY.current, 0.08);
      el.style.background = `radial-gradient(circle ${RADIUS}px at ${x.current * 100}% ${y.current * 100}%, rgba(56, 249, 215, ${OPACITY}), rgba(196, 181, 253, ${OPACITY * 0.55}), rgba(125, 211, 252, ${OPACITY * 0.4}), transparent 72%)`;
      rafId.current = requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", onMove);
    rafId.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none transition-opacity duration-300 will-change-transform"
      data-parallax-scroll="0.09"
      style={{
        zIndex: 2,
        background: `radial-gradient(circle ${RADIUS}px at 50% 50%, rgba(56, 249, 215, ${OPACITY * 0.85}), rgba(240, 171, 252, ${OPACITY * 0.35}), transparent 72%)`,
      }}
      aria-hidden
    />
  );
}
