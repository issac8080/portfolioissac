/**
 * Client-side intent classification for Portfolio Intelligence Agent.
 * Keyword/regex based — no external API.
 */

export type Intent =
  | "projects"
  | "experience"
  | "skills"
  | "research"
  | "contact"
  | "architecture"
  | "technologies"
  | "general";

const INTENT_PATTERNS: { intent: Intent; patterns: (string | RegExp)[] }[] = [
  {
    intent: "projects",
    patterns: [
      "project", "urban place", "aurashop", "code dependency", "initra",
      "returns resolution", "autonomous returns", "ai systems", "marketplace",
      "e-commerce", "analyzer", "inventory",
    ],
  },
  {
    intent: "experience",
    patterns: [
      "experience", "career", "job", "intern", "work", "g10x", "whitematrix",
      "codsoft", "ieee", "ziuke", "pkj", "role", "contribution", "timeline",
    ],
  },
  {
    intent: "skills",
    patterns: [
      "skill", "tech", "technology", "python", "salesforce", "apex", "mern",
      "react", "node", "ml", "machine learning", "tensorflow", "certification",
    ],
  },
  {
    intent: "research",
    patterns: [
      "research", "paper", "insider threat", "behavioral", "transformer",
      "lstm", "anomaly", "explainability",
    ],
  },
  {
    intent: "contact",
    patterns: [
      "contact", "hire", "email", "reach", "connect", "linkedin", "message",
    ],
  },
  {
    intent: "architecture",
    patterns: [
      "architecture", "flow", "diagram", "system design", "pipeline", "agent",
      "workflow", "how it works", "components",
    ],
  },
  {
    intent: "technologies",
    patterns: [
      "stack", "technologies", "framework", "library", "api", "database",
      "frontend", "backend", "tools",
    ],
  },
];

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

export function detectIntent(query: string): Intent {
  const q = normalize(query);
  if (!q) return "general";

  let best: Intent = "general";
  let bestScore = 0;

  for (const { intent, patterns } of INTENT_PATTERNS) {
    let score = 0;
    for (const p of patterns) {
      if (typeof p === "string") {
        if (q.includes(p)) score += 1;
      } else {
        if (p.test(q)) score += 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  return best;
}

/** Reply type badge for UI */
export type ReplyType = "System Insight" | "Project Summary" | "Architecture View";

export function getReplyTypeForIntent(intent: Intent): ReplyType {
  if (intent === "architecture") return "Architecture View";
  if (intent === "projects") return "Project Summary";
  return "System Insight";
}

export function getSuggestionsForIntent(intent: Intent): string[] {
  const map: Record<Intent, string[]> = {
    projects: [
      "Ask about Urban Place",
      "Explain AuraShop",
      "What is the Code Dependency Analyzer?",
      "View AI Workflow",
      "Compare projects",
    ],
    experience: [
      "Show Experience Summary",
      "What did Issac do at G10X?",
      "Tell me about the AI Engineer role",
    ],
    skills: [
      "What technologies does Issac use?",
      "List key skills",
    ],
    research: [
      "Explain the Insider Threat research",
      "What is the hybrid Transformer-LSTM?",
    ],
    contact: [
      "How can I contact Issac?",
      "Where is the contact section?",
    ],
    architecture: [
      "How does Urban Place work?",
      "Explain the Returns Resolution architecture",
    ],
    technologies: [
      "Tech stack for Urban Place",
      "What frameworks are used?",
    ],
    general: [
      "Ask about Urban Place",
      "View AI Workflow",
      "Show Experience Summary",
      "Compare projects",
    ],
  };
  return map[intent] ?? map.general;
}
