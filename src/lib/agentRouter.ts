import type { Intent } from "@/lib/intentDetection";
import type { RoutedAgent, AgentId } from "@/types/portfolioIntelligence";
import type { SearchResult } from "@/lib/embeddingSearch";

const AGENTS: Record<
  AgentId,
  { label: string; shortLabel: string; routingMessage: (name: string) => string }
> = {
  architecture: {
    label: "Architecture Agent",
    shortLabel: "Architecture",
    routingMessage: (name) => `Routing query to ${name} for system topology & flows…`,
  },
  "ai-systems": {
    label: "AI Systems Agent",
    shortLabel: "AI Systems",
    routingMessage: (name) => `Delegating to ${name} for models, agents, and ML pipelines…`,
  },
  backend: {
    label: "Backend Agent",
    shortLabel: "Backend",
    routingMessage: (name) => `Handoff to ${name} for APIs, data, and service boundaries…`,
  },
  recruiter: {
    label: "Recruiter Assistant",
    shortLabel: "Recruiter",
    routingMessage: (name) => `Engaging ${name} for hiring signals & next steps…`,
  },
  historian: {
    label: "Project Historian",
    shortLabel: "Historian",
    routingMessage: (name) => `Indexing narrative context with ${name}…`,
  },
  "ui-ux": {
    label: "UI/UX Agent",
    shortLabel: "UI/UX",
    routingMessage: (name) => `Surface analysis via ${name}…`,
  },
};

function pickAgentId(
  intent: Intent,
  query: string,
  top: SearchResult | undefined
): AgentId {
  const q = query.toLowerCase();
  if (
    /\b(hire|recruit|interview|salary|role|candidate|cv|resume|linkedin)\b/.test(q) ||
    intent === "contact"
  ) {
    return "recruiter";
  }
  if (intent === "architecture" || /\b(diagram|topology|sequence|component)\b/.test(q)) {
    return "architecture";
  }
  if (
    intent === "research" ||
    /\b(model|transformer|embedding|llm|langgraph|chromadb|vision|agent)\b/.test(q)
  ) {
    return "ai-systems";
  }
  if (
    /\b(api|database|postgres|sqlite|fastapi|server|deploy|docker|infra)\b/.test(q) ||
    (intent === "technologies" && /\b(backend|server)\b/.test(q))
  ) {
    return "backend";
  }
  if (
    /\b(ui|ux|tailwind|responsive|accessibility|a11y|design system)\b/.test(q) ||
    (intent === "technologies" && /\b(frontend|css|react)\b/.test(q))
  ) {
    return "ui-ux";
  }
  if (
    intent === "projects" &&
    (/\b(history|timeline|evolution|compare|versus|vs)\b/.test(q) || /\bhow did\b/.test(q))
  ) {
    return "historian";
  }
  if (intent === "projects" && top?.chunk.category === "projects") {
    return "architecture";
  }
  if (intent === "experience") return "recruiter";
  if (intent === "skills" || intent === "technologies") return "backend";
  return "ai-systems";
}

function heuristicConfidence(intent: Intent, top?: SearchResult): number {
  let c = 0.55;
  if (top && top.score > 0.32) c += 0.12;
  if (top && top.score > 0.45) c += 0.1;
  if (intent !== "general") c += 0.08;
  return Math.min(0.97, Math.max(0.38, c));
}

/**
 * Simulated multi-agent router: maps intent + query + top retrieval to a specialist agent.
 * Does not change the embedding pipeline — presentation layer only.
 */
export function routeQueryToAgent(
  intent: Intent,
  query: string,
  results: SearchResult[]
): RoutedAgent {
  const top = results[0];
  const id = pickAgentId(intent, query, top);
  const meta = AGENTS[id];
  const routingConfidence = heuristicConfidence(intent, top);
  return {
    id,
    label: meta.label,
    shortLabel: meta.shortLabel,
    routingMessage: meta.routingMessage(meta.label),
    routingConfidence,
  };
}
