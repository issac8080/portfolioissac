"use client";

import { useEffect, useRef } from "react";

const RADIUS = 400;
const OPACITY = 0.15;

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
      el.style.background = `radial-gradient(circle ${RADIUS}px at ${x.current * 100}% ${y.current * 100}%, rgba(0, 255, 136, ${OPACITY}), rgba(0, 212, 255, ${OPACITY * 0.5}), transparent 70%)`;
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
      className="fixed inset-0 pointer-events-none transition-opacity duration-300"
      style={{
        zIndex: 2,
        background: `radial-gradient(circle ${RADIUS}px at 50% 50%, rgba(0, 255, 136, ${OPACITY}), transparent 70%)`,
      }}
      aria-hidden
    />
  );
}
