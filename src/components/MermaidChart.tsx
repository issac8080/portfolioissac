"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { projectMermaidDiagrams } from "@/data/projectDiagrams";

const MERMAID_DARK = {
  theme: "dark" as const,
  themeVariables: {
    primaryColor: "#00ff88",
    primaryTextColor: "#e5e7eb",
    primaryBorderColor: "rgba(0,255,136,0.4)",
    lineColor: "rgba(0,212,255,0.6)",
    secondaryColor: "#0a0a0f",
    tertiaryColor: "rgba(15,15,25,0.9)",
    background: "#0a0a0f",
    mainBkg: "rgba(15,15,25,0.9)",
    nodeBorder: "rgba(0,255,136,0.3)",
    clusterBkg: "rgba(10,10,15,0.8)",
    titleColor: "#00ff88",
    edgeLabelBackground: "rgba(10,10,15,0.9)",
    nodeTextColor: "#e5e7eb",
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: "basis" as const,
  },
};

export default function MermaidChart({ projectId }: { projectId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = projectMermaidDiagrams[projectId];
    if (!code || !containerRef.current) {
      setSvg(null);
      return;
    }

    let cancelled = false;
    const id = `mermaid-${projectId}-${Date.now()}`;

    mermaid.initialize({
      startOnLoad: false,
      ...MERMAID_DARK,
    });

    mermaid
      .render(id, code)
      .then(({ svg: result }) => {
        if (!cancelled) {
          setSvg(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(String(err?.message ?? err));
          setSvg(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (error) {
    return (
      <div className="rounded-xl bg-ai-surface/50 border border-ai-border p-4 text-ai-muted text-sm">
        Diagram could not be loaded.
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="rounded-xl bg-ai-surface/50 border border-ai-border p-8 flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-ai-muted text-sm">Loading diagram…</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-chart overflow-auto rounded-xl bg-ai-surface/30 border border-ai-border p-4 flex items-center justify-center min-h-[220px] [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
