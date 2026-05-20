"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FileDown, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RESUME_ROLE_OPTIONS,
  buildTailoredResume,
  tailoredResumePlainText,
  type ResumeRoleId,
} from "@/lib/tailoredResume";
import { cn } from "@/lib/utils";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";

export default function ResumeTailorSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [roleId, setRoleId] = useState<ResumeRoleId>("ai_engineer");
  const [exporting, setExporting] = useState(false);

  const doc = useMemo(() => buildTailoredResume(roleId), [roleId]);
  const preview = useMemo(() => tailoredResumePlainText(doc), [doc]);

  const onExportPdf = async () => {
    setExporting(true);
    try {
      const { downloadTailoredResumeForRole } = await import("@/lib/tailoredResumePdf");
      downloadTailoredResumeForRole(roleId);
    } finally {
      setExporting(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(preview);
    } catch {
      /* */
    }
  };

  return (
    <section
      id="resume-tailor"
      ref={ref}
      className={siteSectionClass()}
      data-cinematic-reveal
    >
      <LabSectionGridBg />
      <div className={SITE_SECTION_INNER}>
        <LabSectionIntro
          eyebrow="Résumé toolkit"
          title="AI résumé tailor"
          description="Pick a target role. The page re-ranks projects, re-orders experience emphasis, selects certifications, and builds role-specific summaries from structured portfolio data — then exports a PDF instantly in the browser (jsPDF). Deterministic tailor, not a hosted LLM; verify before sharing externally."
          titleClassName="!text-2xl md:!text-4xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              {RESUME_ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRoleId(opt.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                    roleId === opt.id
                      ? "border-violet-400/50 bg-violet-500/15 text-white"
                      : "border-white/10 bg-black/20 text-ai-muted hover:border-white/20 hover:text-white/90"
                  )}
                >
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className="text-[11px] mt-0.5 opacity-80">{opt.short}</div>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                onClick={() => void onExportPdf()}
                disabled={exporting}
                className="gap-2 bg-violet-500/20 text-violet-100 border border-violet-400/30 hover:bg-violet-500/30"
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                Export PDF
              </Button>
              <Button type="button" variant="outline" onClick={() => void onCopy()} className="border-white/15">
                Copy plain text
              </Button>
            </div>
          </div>

          <div className="glass rounded-2xl border border-ai-border/80 p-4 md:p-6 min-h-[320px]">
            <p className="text-[10px] uppercase tracking-wider text-ai-muted mb-2">Live preview</p>
            <pre
              data-lenis-prevent-wheel
              className="text-[11px] md:text-xs leading-relaxed text-white/85 whitespace-pre-wrap font-mono max-h-[min(70vh,520px)] overflow-y-auto pr-1 scrollbar-thin"
            >
              {preview}
            </pre>
          </div>
        </motion.div>

        <LabSectionFooterStrip
          items={[
            { icon: <FileText className="h-4 w-4 text-violet-400" aria-hidden />, label: "role presets" },
            { icon: <FileDown className="h-4 w-4 text-cyan-400" aria-hidden />, label: "pdf export" },
            { icon: <Loader2 className="h-4 w-4 text-lime-400" aria-hidden />, label: "live preview" },
          ]}
        />
      </div>
    </section>
  );
}
