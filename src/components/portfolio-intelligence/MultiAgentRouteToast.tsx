"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  Brain,
  Briefcase,
  Database,
  History,
  Palette,
  Sparkles,
} from "lucide-react";
import type { AgentId } from "@/types/portfolioIntelligence";
import { cn } from "@/lib/utils";

const ICONS: Record<AgentId, typeof Brain> = {
  architecture: Boxes,
  "ai-systems": Brain,
  backend: Database,
  recruiter: Briefcase,
  historian: History,
  "ui-ux": Palette,
};

type ToastProps = {
  message: string | null;
  visible: boolean;
  agentId?: AgentId | null;
};

/** forwardRef so Framer Motion / AnimatePresence (PopChild) can attach refs. */
const MultiAgentRouteToast = forwardRef<HTMLDivElement, ToastProps>(
  function MultiAgentRouteToast({ message, visible, agentId }, ref) {
    if (!message || !visible) return null;
    const Icon = (agentId && ICONS[agentId]) || Sparkles;
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className={cn(
          "mb-2 flex items-center gap-2 rounded-lg border border-violet-500/25",
          "bg-gradient-to-r from-violet-600/15 to-transparent px-2.5 py-1.5"
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-violet-300" aria-hidden />
        <p className="text-[10px] font-medium leading-snug text-violet-100/95">{message}</p>
      </motion.div>
    );
  }
);

MultiAgentRouteToast.displayName = "MultiAgentRouteToast";

export default MultiAgentRouteToast;

export function AgentBadge({
  agentId,
  label,
  confidence,
}: {
  agentId: AgentId;
  label: string;
  confidence: number;
}) {
  const Icon = ICONS[agentId] ?? Sparkles;
  const pct = Math.round(confidence * 100);
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1">
      <Icon className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
      <div className="flex flex-col leading-none">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/90">
          {label}
        </span>
        <span className="text-[8px] text-emerald-300/90">Routing confidence · {pct}%</span>
      </div>
    </div>
  );
}
