"use client";

/**
 * Ultra-light ambient layer: CSS-only grid + soft glows.
 * Disabled under data-simple-mode (Experience preferences / reduced motion).
 */
export default function AiAmbientNeuralLayer() {
  return (
    <div
      className="ai-os-ambient pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.35] md:opacity-45"
      aria-hidden
    >
      <div className="ai-os-neural-grid absolute inset-[-20%] origin-center" />
      <div className="absolute -left-1/4 top-1/3 h-72 w-72 rounded-full bg-ai-accent/5 blur-3xl animate-pulse" />
      <div className="absolute -right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-ai-glow/5 blur-3xl animate-pulse [animation-delay:1.2s]" />
    </div>
  );
}
