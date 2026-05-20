"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { projectMermaidDiagrams } from "@/data/projectDiagrams";
import { cn } from "@/lib/utils";
import { getMermaid, nextMermaidDomId } from "@/lib/mermaidSingleton";

export default function MermaidChart({
  projectId,
  code,
  instanceId = "inline",
  className,
  /** @deprecated — config is unified; prop kept for API compatibility */
  intrinsicLayout = false,
  deferUntilVisible = true,
}: {
  projectId?: string;
  code?: string;
  instanceId?: string;
  className?: string;
  intrinsicLayout?: boolean;
  /** When true, wait until the chart is near the viewport before importing mermaid / rendering */
  deferUntilVisible?: boolean;
}) {
  void intrinsicLayout;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(!deferUntilVisible);

  const resolvedCode =
    code ?? (projectId ? projectMermaidDiagrams[projectId] : undefined);
  const renderKey = projectId ?? instanceId;

  useEffect(() => {
    if (!deferUntilVisible) {
      setVisible(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [deferUntilVisible, renderKey]);

  useEffect(() => {
    if (!resolvedCode || !visible) {
      if (!resolvedCode) {
        setSvg(null);
        setError(null);
      }
      return;
    }

    let cancelled = false;
    const id = nextMermaidDomId(`mermaid-${renderKey}`);

    const run = async () => {
      try {
        const mermaid = await getMermaid();
        if (cancelled) return;
        const { svg: result, bindFunctions } = await mermaid.render(id, resolvedCode);
        if (cancelled) return;
        setSvg(result);
        setError(null);
        queueMicrotask(() => {
          const root = containerRef.current;
          if (!root || cancelled) return;
          bindFunctions?.(root);
        });
      } catch (err) {
        if (!cancelled) {
          setError(String((err as Error)?.message ?? err));
          setSvg(null);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [resolvedCode, renderKey, visible]);

  /** Normalize SVG sizing for flex/scroll parents (avoids 0×0 or overflow glitches) */
  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root || !svg) return;
    const svgEl = root.querySelector("svg");
    if (!svgEl) return;

    const vb = svgEl.getAttribute("viewBox");
    if (vb) {
      const parts = vb.trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts.every((n) => !Number.isNaN(n))) {
        const [, , vw, vh] = parts;
        const maxW = Math.max(280, root.clientWidth || 0);
        if (vw > 0 && vh > 0 && maxW > 0) {
          const scale = Math.min(1, maxW / vw);
          const w = Math.round(vw * scale);
          const h = Math.round(vh * scale);
          svgEl.setAttribute("width", String(w));
          svgEl.setAttribute("height", String(h));
        }
      }
    }

    svgEl.style.maxWidth = "100%";
    svgEl.style.height = "auto";
    svgEl.style.display = "block";
    svgEl.style.marginInline = "auto";
    svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }, [svg]);

  if (!resolvedCode) {
    return null;
  }

  if (error) {
    return (
      <div className="rounded-xl bg-ai-surface/50 border border-ai-border p-4 text-ai-muted text-sm space-y-2">
        <p>Diagram could not be rendered.</p>
        <p className="text-[11px] opacity-80 font-mono break-all">{error}</p>
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "rounded-xl bg-ai-surface/50 border border-ai-border p-8 flex items-center justify-center min-h-[180px] sm:min-h-[200px]",
          className
        )}
      >
        <div className="flex flex-col items-center gap-2 text-ai-muted text-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" aria-hidden />
          <span>{visible ? "Rendering diagram…" : "Scroll to load diagram…"}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "mermaid-chart overflow-x-auto overflow-y-visible rounded-xl bg-ai-surface/30 border border-ai-border p-3 sm:p-4 min-h-[160px] w-full max-w-full flex justify-center [&_svg]:max-w-full",
        className
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
