"use client";

import { motion } from "framer-motion";

const floatA = {
  y: [0, -14, 0],
  rotateX: [0, 6, 0],
  rotateY: [0, -5, 0],
};
const floatB = {
  y: [0, 12, 0],
  rotateX: [0, -5, 0],
  rotateY: [0, 7, 0],
};
const floatC = {
  y: [0, -10, 0],
  rotateX: [0, 4, 0],
  rotateY: [0, 6, 0],
};

export default function HeroFloatingLabElements() {
  return (
    <div
      className="absolute inset-0 z-[16] pointer-events-none overflow-hidden"
      aria-hidden
      style={{ perspective: "1200px" }}
    >
      <motion.div
        animate={floatA}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[22%] w-24 h-16 rounded-lg border border-ai-glow/25 bg-ai-surface/20 backdrop-blur-md shadow-[0_0_40px_rgba(0,255,136,0.12)]"
        style={{ transformStyle: "preserve-3d" }}
      />
      <motion.div
        animate={floatB}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute right-[10%] top-[30%] w-20 h-20 rounded-md border border-cyan-400/20 bg-black/30 backdrop-blur-sm shadow-[0_0_32px_rgba(0,212,255,0.15)]"
        style={{
          transformStyle: "preserve-3d",
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        }}
      />
      <motion.div
        animate={floatC}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute right-[18%] bottom-[26%] w-14 h-14 border border-ai-glow/30 bg-gradient-to-br from-ai-glow/10 to-transparent rounded-sm shadow-[0_0_24px_rgba(0,255,136,0.18)]"
        style={{ transformStyle: "preserve-3d", transform: "rotateX(58deg) rotateZ(12deg)" }}
      />
    </div>
  );
}
