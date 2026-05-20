"use client";

import { useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Cpu,
  ExternalLink,
  GitBranch,
  Layers,
  Network,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectIntelDoc } from "@/types/portfolioIntelligence";
import { caseStudyIdFromKbSource } from "@/lib/sourceToCaseStudyId";

const MermaidChart = dynamic(() => import("@/components/MermaidChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-32 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-[10px] text-ai-muted">
      Loading diagram…
    </div>
  ),
});

type Tab = "overview" | "flow" | "engineering";

function SectionBlock({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Cpu;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-200/90">
        <Icon className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
        {title}
      </h3>
      <div className="space-y-1.5 text-[11px] leading-relaxed text-ai-muted">{children}</div>
    </section>
  );
}

function ListItems({ items }: { items: string[] }) {
  return (
    <ul className="list-inside list-disc space-y-1 marker:text-emerald-500/80">
      {items.map((x) => (
        <li key={x.slice(0, 40)}>{x}</li>
      ))}
    </ul>
  );
}

export default function IntelligenceViewPanel({
  open,
  onClose,
  sourceName,
  intel,
}: {
  open: boolean;
  onClose: () => void;
  sourceName: string;
  intel: ProjectIntelDoc | null;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const caseId = intel?.caseStudyId ?? caseStudyIdFromKbSource(sourceName);

  const openDossier = () => {
    if (caseId) {
      window.dispatchEvent(
        new CustomEvent("portfolio-open-case-study", { detail: { caseStudyId: caseId } })
      );
    }
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const simulate = () => {
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth", block: "start" });
    onClose();
  };

  const sections = intel?.sections;

  const tabBtn = (id: Tab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
        tab === id
          ? "bg-emerald-500/20 text-emerald-200"
          : "text-white/50 hover:text-white/80"
      }`}
    >
      {label}
    </button>
  );

  const overview = useMemo(
    () => (
      <div className="space-y-3">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="text-[11px] font-medium text-white/90">{sourceName}</p>
          <p className="mt-1 text-[10px] text-ai-muted">
            {intel?.demoHint ??
              "Structured dossier assembled from local knowledge metadata + retrieval context."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-100 hover:bg-emerald-500/20"
              onClick={openDossier}
            >
              <ExternalLink className="mr-1 h-3 w-3" aria-hidden />
              Open case study
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 border-violet-500/30 bg-violet-500/10 text-[10px] text-violet-100 hover:bg-violet-500/20"
              onClick={simulate}
            >
              <Sparkles className="mr-1 h-3 w-3" aria-hidden />
              Simulate / playground
            </Button>
          </div>
        </div>
        {sections?.stack && (
          <SectionBlock title="Stack signals" icon={Layers}>
            <div className="flex flex-wrap gap-1">
              {sections.stack.map((t) => (
                <span
                  key={t}
                  className="rounded border border-white/10 bg-black/30 px-2 py-0.5 font-mono text-[9px] text-cyan-100/90"
                >
                  {t}
                </span>
              ))}
            </div>
          </SectionBlock>
        )}
        {sections?.performance && sections.performance.length > 0 && (
          <SectionBlock title="Performance metrics" icon={Activity}>
            <dl className="grid gap-1">
              {sections.performance.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between gap-2 rounded border border-white/5 bg-black/20 px-2 py-1"
                >
                  <dt className="text-[10px] text-white/70">{m.label}</dt>
                  <dd className="font-mono text-[10px] text-emerald-300">{m.value}</dd>
                </div>
              ))}
            </dl>
          </SectionBlock>
        )}
      </div>
    ),
    [intel?.demoHint, sections?.performance, sections?.stack, sourceName]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            aria-label="Close intelligence view"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="intel-panel-title"
            initial={{ x: "100%", opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-md flex-col border-l border-emerald-500/20 bg-[#050508]/95 shadow-[-12px_0_40px_rgba(0,255,136,0.08)] backdrop-blur-xl md:max-w-lg"
            data-lenis-prevent-wheel
          >
            <header className="flex items-start justify-between gap-2 border-b border-white/10 px-4 py-3">
              <div>
                <p
                  id="intel-panel-title"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300/90"
                >
                  <Network className="h-4 w-4 text-cyan-400" aria-hidden />
                  Intelligence View
                </p>
                <p className="mt-1 text-[10px] text-ai-muted">Project intelligence · on-device KB</p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="shrink-0 text-white/60 hover:text-white"
                onClick={onClose}
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </Button>
            </header>
            <div className="flex gap-1 border-b border-white/5 px-3 py-2">
              {tabBtn("overview", "Overview")}
              {tabBtn("flow", "Data flow")}
              {tabBtn("engineering", "Engineering")}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
              {tab === "overview" && overview}
              {tab === "flow" && (
                <div className="space-y-3">
                  {sections?.dataFlow && (
                    <SectionBlock title="Animated data paths" icon={GitBranch}>
                      <ListItems items={sections.dataFlow} />
                    </SectionBlock>
                  )}
                  {sections?.deployment && (
                    <SectionBlock title="Deployment flow" icon={Shield}>
                      <ListItems items={sections.deployment} />
                    </SectionBlock>
                  )}
                  {sections?.apis && (
                    <SectionBlock title="API relationships" icon={ArrowRight}>
                      <ListItems items={sections.apis} />
                    </SectionBlock>
                  )}
                  {!sections?.dataFlow && !sections?.deployment && (
                    <p className="text-[11px] text-ai-muted">
                      Extend <span className="font-mono text-white/70">projectIntelligence</span> in{" "}
                      <span className="font-mono text-white/70">knowledgeBase.json</span> for richer
                      flow metadata.
                    </p>
                  )}
                </div>
              )}
              {tab === "engineering" && (
                <div className="space-y-3">
                  {intel?.architectureMermaid && (
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      <p className="border-b border-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-emerald-200/80">
                        Architecture diagram
                      </p>
                      <div className="p-2">
                        <MermaidChart
                          code={intel.architectureMermaid}
                          instanceId={`intel-${sourceName}`}
                          deferUntilVisible={false}
                          className="text-[10px]"
                        />
                      </div>
                    </div>
                  )}
                  {sections?.decisions && (
                    <SectionBlock title="Engineering decisions" icon={BookOpen}>
                      <ListItems items={sections.decisions} />
                    </SectionBlock>
                  )}
                  {sections?.scalability && (
                    <SectionBlock title="Scalability analysis" icon={Cpu}>
                      <ListItems items={sections.scalability} />
                    </SectionBlock>
                  )}
                  {sections?.challenges && (
                    <SectionBlock title="Challenges solved" icon={Sparkles}>
                      <ListItems items={sections.challenges} />
                    </SectionBlock>
                  )}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
