"use client";

import { useRef, useEffect } from "react";

const CELL = 56;
const LINE_OPACITY = 0.048;

export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let offset = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      offset += reduceMotion ? 0 : 0.32;
      const startX = -CELL + (offset % CELL);
      const startY = -CELL + (offset * 0.5 % CELL);

      const PALETTE = [
        `rgba(56, 249, 215, ${LINE_OPACITY})`,
        `rgba(196, 181, 253, ${LINE_OPACITY * 0.95})`,
        `rgba(125, 211, 252, ${LINE_OPACITY * 0.9})`,
      ];
      ctx.lineWidth = 1;

      let vi = 0;
      for (let x = startX; x < w + CELL; x += CELL) {
        ctx.strokeStyle = PALETTE[vi % PALETTE.length];
        vi++;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      let hi = 0;
      for (let y = startY; y < h + CELL; y += CELL) {
        ctx.strokeStyle = PALETTE[(hi + 1) % PALETTE.length];
        hi++;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
