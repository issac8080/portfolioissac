"use client";

import { useEffect, useMemo, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { getGiscusEmbedConfig } from "@/lib/giscusConfig";

export default function ContactDiscussions() {
  const hostRef = useRef<HTMLDivElement>(null);
  const config = useMemo(() => getGiscusEmbedConfig(), []);

  useEffect(() => {
    if (!config || !hostRef.current) return;

    const root = hostRef.current;
    root.innerHTML = "";
    const mount = document.createElement("div");
    mount.className = "giscus";
    root.appendChild(mount);

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", config.repo);
    script.setAttribute("data-repo-id", config.repoId);
    script.setAttribute("data-category", config.category);
    script.setAttribute("data-category-id", config.categoryId);
    script.setAttribute("data-mapping", config.mapping);
    if (config.mapping === "specific") {
      script.setAttribute("data-term", config.term);
    }
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", config.reactionsEnabled);
    script.setAttribute("data-emit-metadata", config.emitMetadata);
    script.setAttribute("data-input-position", config.inputPosition);
    script.setAttribute("data-theme", config.theme);
    script.setAttribute("data-lang", config.lang);
    script.setAttribute("data-loading", config.loading);
    root.appendChild(script);

    return () => {
      root.innerHTML = "";
    };
  }, [config]);

  if (!config) return null;

  return (
    <div className="mt-16 md:mt-20 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-center gap-2 mb-3">
        <MessageCircle
          className="h-5 w-5 text-ai-glow shrink-0"
          aria-hidden
        />
        <h3 className="text-xl md:text-2xl font-semibold text-white font-[var(--font-space-grotesk)]">
          Discussion
        </h3>
      </div>
      <p className="text-ai-muted text-sm text-center mb-6 max-w-xl mx-auto">
        Comments via{" "}
        <a
          href="https://giscus.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ai-glow/90 underline-offset-2 hover:underline"
        >
          Giscus
        </a>
        . Sign in with GitHub to comment.
      </p>
      <div
        ref={hostRef}
        className="giscus-host rounded-2xl border border-ai-border/60 bg-ai-surface/20 p-3 md:p-4 min-h-[200px]"
      />
    </div>
  );
}
