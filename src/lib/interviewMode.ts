import type { SearchResult } from "@/lib/embeddingSearch";
import { formatReply, formatReplyStructured } from "@/lib/embeddingSearch";

/** Augment user text so retrieval favors architecture / tradeoff / scale language. */
export function augmentInterviewSearchQuery(userText: string): string {
  const t = userText.trim();
  if (!t) return t;
  return `${t} system design architecture engineering tradeoffs scalability reliability observability testing security performance latency throughput`;
}

export const INTERVIEW_WELCOME =
  "Interview Issac AI — ask technical questions, challenge architecture, discuss tradeoffs, or probe scalability. Answers draw from this portfolio’s knowledge base.";

export function buildInterviewDiscussionGuide(userQuery: string): string {
  const q = userQuery.toLowerCase();
  const blocks: string[] = ["#### How to use this in an interview\n"];

  if (/(trade-?off|tradeoff|compromise|vs\.?|instead|rather)/i.test(q)) {
    blocks.push(
      "- Name **two viable options** (e.g., sync vs async, SQL vs document, monolith vs services) and tie each to **constraints** (team size, latency budget, compliance, ops maturity).\n" +
        "- Close with **what you would ship first** and what you would measure before expanding scope.\n"
    );
  }
  if (/(scale|scalability|load|throughput|latency|slo|performance|bottleneck)/i.test(q)) {
    blocks.push(
      "- Separate **hot path** vs **control plane**; call out likely bottlenecks (DB, fan-out, embeddings, external APIs).\n" +
        "- Mention **horizontal scaling** levers (stateless workers, queues, caching, read replicas) and **failure modes** (timeouts, retries, idempotency).\n"
    );
  }
  if (/(architect|design|diagram|component|service|boundary)/i.test(q)) {
    blocks.push(
      "- Walk **clients → APIs → data** with clear ownership boundaries; cite auth, policy, and persistence explicitly.\n" +
        "- Highlight **one deliberate coupling** you accept (and why) versus one abstraction you defer.\n"
    );
  }
  if (/(ml|model|embedding|transformer|rag|vector|training|eval)/i.test(q)) {
    blocks.push(
      "- Clarify **data lifecycle** (collection, labeling, drift) and **inference path** (latency, batching, GPU/CPU).\n" +
        "- For retrieval systems: discuss **chunking, refresh, evaluation**, and guardrails against low-confidence answers.\n"
    );
  }
  if (blocks.length === 1) {
    blocks.push(
      "- Start from **requirements** (who, SLO, constraints), then map to **components** and **failure handling**.\n" +
        "- End with **metrics** you would watch in the first week after shipping.\n"
    );
  }

  blocks.push(
    "\nIf you want a drill, ask: *“What breaks first under 10× traffic?”* or *“What would you cut if you had two engineers for six weeks?”*"
  );
  return blocks.join("");
}

/**
 * Interview-style framing on top of retrieved portfolio chunks (still KB-grounded; not a hosted LLM).
 */
export function formatInterviewReply(
  userQuery: string,
  results: SearchResult[],
  bestScore: number,
  confidenceThreshold: number
): string {
  const header =
    "### Interview Issac AI\n\n" +
    `**Your question:** ${userQuery}\n\n` +
    "_Mode: technical / architecture assistant — responses synthesize **only** retrieved portfolio passages below._\n\n";

  if (results.length === 0 || bestScore < confidenceThreshold) {
    return (
      header +
      "I do not yet have a **high-confidence** match in the on-site knowledge base for that phrasing.\n\n" +
      "**Try:** name a project (Urban Place, AuraShop, Code Dependency Analyzer, Initra, Autonomous Returns, Expenze) or a stack keyword (FastAPI, Next.js, LangGraph, RAG, embeddings).\n\n" +
      buildInterviewDiscussionGuide(userQuery)
    );
  }

  const moderate = bestScore < confidenceThreshold + 0.12;
  const evidence = formatReplyStructured(results) || formatReply(results) || "_No formatted evidence._\n";

  const caution = moderate
    ? "> **Note:** retrieval confidence is moderate — cross-check details in the cited sources and ask a follow-up for stack specifics.\n\n"
    : "";

  return (
    header +
    caution +
    "#### Evidence (portfolio KB)\n\n" +
    evidence +
    "\n\n" +
    buildInterviewDiscussionGuide(userQuery) +
    "\n\n---\n*Grounding: on-device MiniLM retrieval over this site’s JSON knowledge — not a cloud LLM.*"
  );
}

/** Short follow-ups for the chat strip when Interview mode is active. */
export function getInterviewSuggestionChips(): string[] {
  return [
    "Urban Place: auth + trust score + booking flow",
    "Tradeoffs: SQLite vs Postgres for this marketplace",
    "How would you load-test AuraShop recommendations?",
    "Autonomous Returns: LangGraph policy boundaries",
    "Initra: blast radius vs false positives",
  ];
}
