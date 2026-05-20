"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ChevronDown, ChevronUp, Cpu, Gauge, Network } from "lucide-react";
import { useAiSystemOptional } from "@/context/AiSystemContext";
import { useExperiencePreferencesOptional } from "@/context/ExperiencePreferences";
import { agentDisplayName } from "@/lib/ai-os/agentRouting";
import type { EmbeddingRuntimeStatus, InferencePipelineState } from "@/lib/ai-os/types";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "portfolio_ai_os_telemetry_collapsed";

function formatBytes(n: number): string {
  if (n <= 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function statusDotClass(s: EmbeddingRuntimeStatus): string {
  switch (s) {
    case "ready":
      return "bg-ai-glow shadow-[0_0_10px_rgba(0,255,136,0.5)]";
    case "warming":
      return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.45)]";
    case "error":
      return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.45)]";
    default:
      return "bg-ai-muted";
  }
}

function inferenceLabel(s: InferencePipelineState): string {
  switch (s) {
    case "model_init":
      return "Model init";
    case "embedding":
      return "Embedding query";
    case "vector_scan":
      return "Vector scan";
    case "synthesis":
      return "Synthesis";
    case "error":
      return "Fault";
    default:
      return "Idle";
  }
}

function LatencySparkline({
  values,
  gradientId,
}: {
  values: readonly number[];
  gradientId: string;
}) {
  const w = 88;
  const h = 20;
  if (values.length === 0) {
    return (
      <span className="font-mono text-[9px] text-ai-muted" aria-hidden>
        —
      </span>
    );
  }
  const max = Math.max(...values, 8);
  const min = 0;
  const span = Math.max(max - min, 1);
  const step = w / Math.max(values.length - 1, 1);
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / span) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const d = `M ${pts.join(" L ")}`;
  return (
    <svg width={w} height={h} className="overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgba(0,255,136,0.15)" />
          <stop offset="100%" stopColor="rgba(0,212,255,0.35)" />
        </linearGradient>
      </defs>
      <path
        d={`${d} L ${w} ${h} L 0 ${h} Z`}
        fill={`url(#${gradientId})`}
        opacity={0.5}
      />
      <path
        d={d}
        fill="none"
        stroke="rgba(0,255,136,0.85)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AiTelemetryPanel() {
  const ctx = useAiSystemOptional();
  const prefs = useExperiencePreferencesOptional();
  const minimal = prefs?.effectiveMinimalUI ?? false;
  const baseId = useId().replace(/:/g, "");
  const panelId = `ai-os-telemetry-${baseId}`;
  const sparkGradientId = `ai-os-spark-${baseId}`;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(COLLAPSE_KEY);
      if (v === "0") setExpanded(true);
      else if (v === "1") setExpanded(false);
    } catch {
      /* ignore */
    }
  }, []);

  const persistExpanded = useCallback((next: boolean) => {
    setExpanded(next);
    try {
      window.localStorage.setItem(COLLAPSE_KEY, next ? "0" : "1");
    } catch {
      /* ignore */
    }
  }, []);

  if (!ctx) return null;

  const confPct =
    ctx.semanticConfidence != null
      ? `${(ctx.semanticConfidence * 100).toFixed(1)}%`
      : "—";

  const latency =
    ctx.retrievalLatencyMs != null ? `${ctx.retrievalLatencyMs.toFixed(0)} ms` : "—";

  const agentSummary =
    ctx.activeOrchestrationAgents.length > 0
      ? ctx.activeOrchestrationAgents
          .slice(0, 3)
          .map((a) => agentDisplayName(a.agentId))
          .join(" · ")
      : "Portfolio intelligence";

  if (minimal) {
    return (
    <div
      className="fixed left-2 z-[42] max-md:top-[calc(env(safe-area-inset-top,0px)+3.5rem)] md:top-[4rem] max-w-[min(calc(100vw-1rem),200px)] rounded-md border border-ai-border/45 bg-ai-bg/92 px-2 py-1 text-[9px] leading-tight text-ai-muted shadow-sm backdrop-blur-sm"
        aria-live="polite"
      >
        <span className="font-mono text-ai-glow/90">AI</span>{" "}
        <span className="text-white/80">{ctx.embeddingStatus}</span>
        {ctx.retrievalLatencyMs != null ? (
          <>
            {" · "}
            <span className="font-mono">{latency}</span>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="fixed left-2 z-[42] max-md:top-[calc(env(safe-area-inset-top,0px)+3.5rem)] md:top-[4rem] flex max-w-[min(calc(100vw-1rem),220px)] flex-col items-start gap-0.5">
      <motion.div
        layout
        className="relative overflow-hidden rounded-lg border border-ai-border/55 bg-ai-bg/85 shadow-md shadow-black/40 backdrop-blur-md"
        style={{ boxShadow: "0 0 20px rgba(0, 212, 255, 0.04)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(0,255,136,0.06) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "ai-os-scan 7s ease-in-out infinite",
          }}
        />
        <button
          type="button"
          onClick={() => persistExpanded(!expanded)}
          className="relative flex w-full min-w-0 items-center justify-between gap-2 px-2 py-1.5 text-left"
          aria-expanded={expanded}
          aria-controls={panelId}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statusDotClass(ctx.embeddingStatus))} />
            <span className="flex min-w-0 items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-wide text-white/88">
              <Cpu className="h-3 w-3 shrink-0 text-ai-accent/85" aria-hidden />
              <span className="truncate">Telemetry</span>
            </span>
          </div>
          <span className="flex shrink-0 items-center gap-0.5 text-[9px] text-ai-muted">
            <Gauge className="h-2.5 w-2.5" aria-hidden />
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative border-t border-ai-border/40"
            >
              <div className="max-h-[min(48vh,320px)] overflow-y-auto px-2 py-2 space-y-2 scrollbar-thin">
                <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[9px]">
                  <dt className="text-ai-muted">Retrieval latency</dt>
                  <dd className="font-mono text-ai-glow/95 text-right">{latency}</dd>
                  <dt className="text-ai-muted">Index memory</dt>
                  <dd className="font-mono text-right text-white/85">
                    {formatBytes(ctx.approxIndexBytes)}
                  </dd>
                  <dt className="text-ai-muted">Semantic confidence</dt>
                  <dd className="font-mono text-right text-white/85">{confPct}</dd>
                  <dt className="text-ai-muted">Embeddings</dt>
                  <dd className="text-right capitalize text-white/85">{ctx.embeddingStatus}</dd>
                  <dt className="text-ai-muted">Context depth</dt>
                  <dd className="font-mono text-right text-white/85">{ctx.contextDepth}</dd>
                  <dt className="text-ai-muted">Inference</dt>
                  <dd className="text-right text-white/85">{inferenceLabel(ctx.inferenceState)}</dd>
                  <dt className="text-ai-muted">Session intelligence</dt>
                  <dd className="font-mono text-right text-ai-accent/95">{ctx.sessionIntelligence}</dd>
                </dl>

                <div>
                  <div className="mb-0.5 flex items-center gap-1 text-[8px] font-medium uppercase tracking-wide text-ai-muted">
                    <Activity className="h-2.5 w-2.5" aria-hidden />
                    Latency
                  </div>
                  <LatencySparkline
                    values={ctx.latencyHistoryMs}
                    gradientId={sparkGradientId}
                  />
                </div>

                <div>
                  <div className="mb-0.5 flex items-center gap-1 text-[8px] font-medium uppercase tracking-wide text-ai-muted">
                    <Network className="h-2.5 w-2.5" aria-hidden />
                    Agents
                  </div>
                  <p className="text-[8px] leading-snug text-ai-muted/90">{agentSummary}</p>
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {ctx.activeOrchestrationAgents.map((a) => (
                      <span
                        key={a.agentId}
                        className="rounded border border-ai-border/45 bg-ai-surface/40 px-1 py-0.5 font-mono text-[8px] text-ai-glow/90"
                        title={a.rationale}
                      >
                        {agentDisplayName(a.agentId)}{" "}
                        <span className="text-ai-muted">{(a.weight * 100).toFixed(0)}%</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="max-w-[200px] pl-0.5 text-[7px] leading-tight text-ai-muted/70" aria-live="polite">
        On-device retrieval metrics.
      </p>
    </div>
  );
}
