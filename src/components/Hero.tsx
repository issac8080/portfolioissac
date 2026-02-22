"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import dynamic from "next/dynamic";

const NeuralNetwork = dynamic(
  () => import("@/components/background/NeuralNetwork"),
  { ssr: false }
);

const roles = [
  "AI Engineer",
  "ML Researcher",
  "Salesforce Associate",
  "Full-Stack Developer",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const t = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX - innerWidth / 2) / innerWidth);
    mouseY.set((clientY - innerHeight / 2) / innerHeight);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={onMouseMove}
    >
      <NeuralNetwork />
      <div className="absolute inset-0 bg-gradient-to-b from-ai-bg/80 via-transparent to-ai-bg z-10 pointer-events-none" />
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          style={{
            x: springX,
            y: springY,
          }}
          className="inline-block"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-ai-glow/80 text-sm md:text-base font-mono tracking-widest uppercase mb-4"
          >
            AI Research Lab
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-[var(--font-space-grotesk)]"
          >
            Issac Sunny
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="h-12 md:h-14 flex items-center justify-center"
          >
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xl md:text-2xl lg:text-3xl text-ai-accent font-medium"
            >
              {roles[roleIndex]}
            </motion.span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-ai-muted text-base md:text-lg max-w-2xl mx-auto mt-6"
          >
            Associate — Salesforce @ G10X · Thrissur, Kerala · Insider Threat
            Detection · Transformer-LSTM · ML & Full-Stack
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <MagneticButton href="#projects">View Projects</MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              Get in Touch
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-ai-glow/50 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 rounded-full bg-ai-glow" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function MagneticButton({
  children,
  href,
  variant = "default",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "default" | "outline";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.2;
    const dy = (e.clientY - cy) * 0.2;
    x.set(dx);
    y.set(dy);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300";
  const styles =
    variant === "outline"
      ? "border border-ai-border text-ai-glow hover:bg-ai-glow/10 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)]"
      : "bg-ai-glow/20 text-ai-glow border border-ai-border hover:bg-ai-glow/30 hover:shadow-[0_0_25px_rgba(0,255,136,0.25)]";

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={`${base} ${styles}`}
    >
      {children}
    </motion.a>
  );
}
