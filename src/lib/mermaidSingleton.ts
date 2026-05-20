/**
 * Single mermaid initialize + dynamic import so multiple charts don't fight
 * each other's config and so the heavy bundle loads once on the client.
 */
import type { MermaidConfig } from "mermaid";

const MERMAID_CONFIG: MermaidConfig = {
  startOnLoad: false,
  theme: "dark",
  securityLevel: "strict",
  themeVariables: {
    primaryColor: "#38f9d7",
    primaryTextColor: "#e5e7eb",
    primaryBorderColor: "rgba(56,249,215,0.45)",
    lineColor: "rgba(125,211,252,0.85)",
    secondaryColor: "#0a0a0f",
    tertiaryColor: "rgba(15,15,25,0.92)",
    background: "#0a0a0f",
    mainBkg: "rgba(15,15,25,0.96)",
    nodeBorder: "rgba(196,181,253,0.45)",
    clusterBkg: "rgba(10,10,15,0.88)",
    titleColor: "#7dd3fc",
    edgeLabelBackground: "rgba(10,10,15,0.92)",
    nodeTextColor: "#e5e7eb",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: false,
    curve: "basis",
    padding: 12,
    nodeSpacing: 50,
    rankSpacing: 50,
  },
};

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;
let initialized = false;

export async function getMermaid() {
  mermaidPromise ??= import("mermaid").then((m) => m.default);
  const mermaid = await mermaidPromise;
  if (!initialized) {
    mermaid.initialize({ ...MERMAID_CONFIG });
    initialized = true;
  }
  return mermaid;
}

export function nextMermaidDomId(prefix = "mmd") {
  const u =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return `${prefix}-${u}`;
}
