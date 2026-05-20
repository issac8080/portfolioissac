"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

type Props = {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  intense: boolean;
};

/**
 * Radial highlight that follows smoothed cursor position (same springs as hero tilt).
 */
export default function HeroCursorGlow({ springX, springY, intense }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const x = (springX.get() + 0.5) * 100;
      const y = (springY.get() + 0.5) * 100;
      const r = intense ? "min(52vw, 520px)" : "min(42vw, 380px)";
      const a = intense ? 0.24 : 0.14;
      const b = intense ? 0.09 : 0.05;
      el.style.background = `radial-gradient(circle ${r} at ${x}% ${y}%, rgba(0,255,204,${a}), rgba(0,255,136,${b}), transparent 68%)`;
    };

    apply();
    const u1 = springX.on("change", apply);
    const u2 = springY.on("change", apply);
    return () => {
      u1();
      u2();
    };
  }, [springX, springY, intense]);

  return (
    <div
      ref={ref}
      data-rich-hero
      className="absolute inset-0 z-[17] pointer-events-none mix-blend-screen"
      aria-hidden
    />
  );
}
