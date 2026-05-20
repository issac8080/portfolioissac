"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Gauge,
  GitBranch,
  Layers,
  Radar,
  Timer,
  Zap,
} from "lucide-react";
import type { TelemetrySnapshot } from "@/types/portfolioIntelligence";
import { cn } from "@/lib/utils";

function TelemetryPanelInner({
  telemetry,
  engineeringMode,
  className,
}: {
  telemetry: TelemetrySnapshot | null;
  engineeringMode: boolean;
  className?: string;
}) {
  if (!telemetry) return null;
  const emb =
    telemetry.embeddingsStatus === "ready"
      ? "READY"
      : telemetry.embeddingsStatus === "loading"
        ? "LOAD"
        : "COLD";

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-2.5 backdrop-blur-md",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-emerald-300/80">
          <Radar className="h-3 w-3 text-cyan-400" aria-hidden />
          Telemetry
        </span>
        <span className="font-mono text-[9px] text-white/50">LIVE</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px]">
        <div className="flex items-center gap-1.5 text-ai-muted">
          <Cpu className="h-3 w-3 shrink-0 text-emerald-400/80" aria-hidden />
          <dt className="sr-only">Embeddings</dt>
          <dd className="font-mono text-emerald-200/90">EMB · {emb}</dd>
        </div>
        <div className="flex items-center gap-1.5 text-ai-muted">
          <Timer className="h-3 w-3 shrink-0 text-cyan-400/80" aria-hidden />
          <dt className="sr-only">Latency</dt>
          <dd className="font-mono text-cyan-100/90">
            LAT · {telemetry.retrievalLatencyMs}ms
          </dd>
        </div>
        <div className="flex items-center gap-1.5 text-ai-muted">
          <Layers className="h-3 w-3 shrink-0 text-violet-300/80" aria-hidden />
          <dt className="sr-only">Context depth</dt>
          <dd className="font-mono text-violet-100/90">
            CTX · {telemetry.contextDepth}
          </dd>
        </div>
        <div className="flex items-center gap-1.5 text-ai-muted">
          <Gauge className="h-3 w-3 shrink-0 text-amber-300/80" aria-hidden />
          <dt className="sr-only">Confidence</dt>
          <dd className="font-mono text-amber-100/90">
            CONF · {telemetry.confidenceDisplayPct}%
          </dd>
        </div>
      </dl>
      <div className="mt-2 space-y-1 border-t border-white/5 pt-2">
        <div className="flex items-center gap-1 text-[9px] text-ai-muted">
          <GitBranch className="h-3 w-3 text-emerald-400/70" aria-hidden />
          <span className="font-mono text-[9px] text-white/70">
            ROUTE · {telemetry.queryRoute}
          </span>
        </div>
        {engineeringMode && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {telemetry.activeModules.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wide text-emerald-200/90"
              >
                <Zap className="h-2.5 w-2.5" aria-hidden />
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default memo(TelemetryPanelInner);
