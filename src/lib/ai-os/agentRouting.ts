/**
 * Phase 2+ — deterministic query routing hints for multi-agent orchestration UI.
 * Keeps logic client-side and explainable; the assistant still uses a single
 * retrieval stack today — this module only drives visualization / future routing.
 */

import type { AgentRoleId, AgentRoutingHint } from "./types";

const KEYWORDS: { id: AgentRoleId; patterns: RegExp[] }[] = [
  {
    id: "architecture",
    patterns: [/scalab/i, /architect/i, /trade-?off/i, /diagram/i, /system design/i],
  },
  {
    id: "ai_systems",
    patterns: [/embed/i, /vector/i, /semantic/i, /rag\b/i, /transformer/i, /model/i],
  },
  {
    id: "backend_infra",
    patterns: [/fastapi/i, /api\b/i, /database/i, /deploy/i, /infra/i, /chroma/i],
  },
  {
    id: "recruiter_assistant",
    patterns: [/hire/i, /role\b/i, /interview/i, /team/i, /culture/i],
  },
  {
    id: "project_historian",
    patterns: [/aurashop/i, /urban place/i, /initra/i, /returns/i, /dependency/i, /expenze/i],
  },
  {
    id: "research",
    patterns: [/paper/i, /research/i, /experiment/i, /threat/i, /autoencoder/i],
  },
  {
    id: "ui_ux_systems",
    patterns: [/ui\b/i, /ux\b/i, /tailwind/i, /motion/i, /accessib/i],
  },
  {
    id: "workflow_autonomous",
    patterns: [/agent/i, /langgraph/i, /workflow/i, /automation/i, /orchestr/i],
  },
];

function scoreAgent(id: AgentRoleId, q: string): number {
  const entry = KEYWORDS.find((k) => k.id === id);
  if (!entry) return 0;
  let s = 0;
  for (const re of entry.patterns) {
    if (re.test(q)) s += 1;
  }
  return s;
}

/**
 * Returns up to 4 ranked agents for UI orchestration previews.
 */
export function routeQueryToAgents(query: string): AgentRoutingHint[] {
  const q = query.trim();
  if (!q) return [];

  const ids: AgentRoleId[] = [
    "architecture",
    "ai_systems",
    "backend_infra",
    "recruiter_assistant",
    "project_historian",
    "research",
    "ui_ux_systems",
    "workflow_autonomous",
  ];

  const scored = ids
    .map((id) => ({ id, w: scoreAgent(id, q) }))
    .filter((x) => x.w > 0)
    .sort((a, b) => b.w - a.w);

  const hadKeywordHits = scored.length > 0;
  const base = hadKeywordHits ? scored : [{ id: "recruiter_assistant" as const, w: 0.5 }];

  return base.slice(0, 4).map(({ id, w }, i) => ({
    agentId: id,
    weight: Math.min(1, w / 3 + 0.25 - i * 0.05),
    rationale: hadKeywordHits
      ? "Keyword alignment with portfolio systems vocabulary."
      : "Default routing — general portfolio intelligence.",
  }));
}

export function agentDisplayName(id: AgentRoleId): string {
  const map: Record<AgentRoleId, string> = {
    architecture: "Architecture",
    ai_systems: "AI Systems",
    backend_infra: "Backend / Infra",
    recruiter_assistant: "Recruiter Assistant",
    project_historian: "Project Historian",
    research: "Research",
    ui_ux_systems: "UI / UX Systems",
    workflow_autonomous: "Workflow Autonomous",
  };
  return map[id];
}
