"use client";

import { motion } from "framer-motion";
import { useAiSystemOptional } from "@/context/AiSystemContext";
import { useExperiencePreferencesOptional } from "@/context/ExperiencePreferences";
import { cn } from "@/lib/utils";

const MODULES: { id: string; label: string; short: string }[] = [
  { id: "semantic_index", label: "Semantic index", short: "IDX" },
  { id: "retrieval", label: "Vector retrieval", short: "RET" },
  { id: "intent_router", label: "Intent router", short: "INT" },
  { id: "portfolio_assistant", label: "Portfolio assistant", short: "AST" },
  { id: "embedding_lab", label: "Embedding lab", short: "LAB" },
];

function moduleActive(
  id: string,
  ctx: NonNullable<ReturnType<typeof useAiSystemOptional>>
): boolean {
  const now = Date.now();
  const recent = ctx.lastRetrievalAt != null && now - ctx.lastRetrievalAt < 3200;
  switch (id) {
    case "semantic_index":
      return ctx.embeddingStatus === "ready";
    case "retrieval":
      return recent || ctx.inferenceState === "vector_scan";
    case "intent_router":
      return recent || ctx.inferenceState === "embedding";
    case "portfolio_assistant":
      return ctx.assistantPanelOpen;
    case "embedding_lab":
      return ctx.embeddingLabActive;
    default:
      return false;
  }
}

export default function AiActiveModulesDock() {
  const ctx = useAiSystemOptional();
  const prefs = useExperiencePreferencesOptional();
  const minimal = prefs?.effectiveMinimalUI ?? false;

  if (!ctx || minimal) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-[max(5.5rem,env(safe-area-inset-bottom))] left-1/2 z-[38] hidden w-[min(96vw,520px)] -translate-x-1/2 md:block"
      aria-hidden
    >
      <div className="flex items-center justify-center gap-1 rounded-full border border-ai-border/40 bg-ai-bg/55 px-2 py-1.5 shadow-lg shadow-black/40 backdrop-blur-md">
        {MODULES.map((m) => {
          const on = moduleActive(m.id, ctx);
          return (
            <motion.span
              key={m.id}
              title={m.label}
              className={cn(
                "relative rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wide",
                on
                  ? "text-ai-glow border border-ai-glow/35 bg-ai-glow/10"
                  : "text-ai-muted/70 border border-transparent bg-transparent"
              )}
              animate={on ? { opacity: [0.85, 1, 0.85] } : { opacity: 0.55 }}
              transition={
                on ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }
              }
            >
              {m.short}
              {on ? (
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ai-glow shadow-[0_0_8px_rgba(0,255,136,0.7)]" />
              ) : null}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
