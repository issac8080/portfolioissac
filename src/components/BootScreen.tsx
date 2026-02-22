"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "> INITIALIZING NEURAL INTERFACE...",
  "> LOADING CORE MODULES...",
  "> CONNECTING TO AI RESEARCH LAB...",
  "> AUTHENTICATING USER SESSION...",
  "> LOADING PORTFOLIO DATABASE...",
  "> RENDERING 3D NEURAL NETWORK...",
  "> CALIBRATING PARALLAX SYSTEMS...",
  "> SYSTEM READY.",
];

export default function BootScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (lineIndex >= BOOT_LINES.length) {
      setShowReady(true);
      setProgress(100);
      const t = setTimeout(() => onComplete(), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setProgress(((lineIndex + 1) / BOOT_LINES.length) * 100);
    }, 400 + lineIndex * 180);
    return () => clearTimeout(t);
  }, [lineIndex]);

  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ai-bg overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,255,136,0.08),transparent)] pointer-events-none" />
        <div className="relative w-full max-w-md mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-ai-glow font-mono text-sm tracking-widest uppercase mb-2">
              AI Research Lab
            </h2>
            <p className="text-ai-muted/80 font-mono text-xs">Boot sequence v2.0</p>
          </motion.div>

          <div className="font-mono text-sm text-ai-glow/90 space-y-1 min-h-[200px]">
            {BOOT_LINES.slice(0, lineIndex).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1"
              >
                <span className="text-ai-accent/70">{">"}</span>
                <span>{line}</span>
              </motion.div>
            ))}
            {!showReady && (
              <span className="inline-flex items-center gap-1">
                <span className="text-ai-accent/70">_</span>
                <span
                  className="w-2 h-4 bg-ai-glow inline-block animate-pulse"
                  style={{ opacity: cursorVisible ? 1 : 0 }}
                />
              </span>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 h-1 rounded-full bg-ai-surface overflow-hidden border border-ai-border/50"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-ai-glow to-ai-accent rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-ai-muted font-mono text-xs text-center"
          >
            {progress < 100 ? `Loading... ${Math.round(progress)}%` : "Initializing experience..."}
          </motion.p>

          <AnimatePresence>
            {showReady && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-ai-bg/95"
              >
                <div className="text-center">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-ai-glow font-mono text-lg tracking-widest"
                  >
                    SYSTEM READY
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-ai-muted text-sm mt-2"
                  >
                    Entering portfolio...
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
