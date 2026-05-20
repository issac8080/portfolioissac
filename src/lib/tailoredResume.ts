import { caseStudies, type CaseStudy } from "@/data/caseStudies";
import {
  contact,
  education,
  experience,
  publication,
  skills,
  summary,
} from "@/data/portfolio";

export type ResumeRoleId =
  | "ai_engineer"
  | "ml_engineer"
  | "ai_automation_engineer"
  | "fullstack_ai_engineer"
  | "research_engineer"
  | "backend_ai_engineer";

export const RESUME_ROLE_OPTIONS: { id: ResumeRoleId; label: string; short: string }[] = [
  { id: "ai_engineer", label: "AI Engineer", short: "Applied AI systems & product delivery" },
  { id: "ml_engineer", label: "ML Engineer", short: "Modeling, evaluation, and ML systems" },
  { id: "ai_automation_engineer", label: "AI Automation Engineer", short: "Agents, workflows, and ops automation" },
  { id: "fullstack_ai_engineer", label: "Full Stack AI Engineer", short: "End-to-end AI web platforms" },
  { id: "research_engineer", label: "Research Engineer", short: "Research-to-production & publications" },
  { id: "backend_ai_engineer", label: "Backend AI Engineer", short: "APIs, data, and inference services" },
];

type RoleProfile = {
  headline: string;
  summaryLead: string;
  projectKeywords: string[];
  certificationPick: (c: string[]) => string[];
  experienceBoost: (company: string, role: string) => number;
};

const ROLE_PROFILE: Record<ResumeRoleId, RoleProfile> = {
  ai_engineer: {
    headline: "AI Engineer",
    summaryLead:
      "Hands-on AI engineer shipping retrieval-aware assistants, policy-gated marketplaces, and production FastAPI/Next.js stacks.",
    projectKeywords: [
      "openai",
      "gpt",
      "rag",
      "embedding",
      "langgraph",
      "agent",
      "fastapi",
      "next",
      "chromadb",
      "policy",
      "trust",
    ],
    certificationPick: (c) =>
      c.filter((x) => /AI|ML|TensorFlow|Conversational|Agentic|Python/i.test(x)).slice(0, 5),
    experienceBoost: (company, role) => {
      let s = 0;
      if (/white matrix|g10x/i.test(company)) s += 4;
      if (/ai|machine learning|intern|associate/i.test(role)) s += 3;
      if (/salesforce/i.test(company)) s += 1;
      return s;
    },
  },
  ml_engineer: {
    headline: "ML Engineer",
    summaryLead:
      "ML engineer focused on model integration, evaluation signals, embeddings/RAG patterns, and robust data pipelines.",
    projectKeywords: [
      "pytorch",
      "transformer",
      "lstm",
      "autoencoder",
      "embedding",
      "sentence",
      "chromadb",
      "rag",
      "model",
      "eval",
      "graph",
    ],
    certificationPick: (c) =>
      c.filter((x) => /TensorFlow|ML|Machine|Python|AI/i.test(x)).slice(0, 5),
    experienceBoost: (company, role) => {
      let s = 0;
      if (/codsoft|white matrix/i.test(company)) s += 4;
      if (/machine learning|ai/i.test(role)) s += 3;
      return s;
    },
  },
  ai_automation_engineer: {
    headline: "AI Automation Engineer",
    summaryLead:
      "Automation engineer pairing LLM agents with business workflows: returns ops, lead routing, and policy-aware bots.",
    projectKeywords: [
      "langgraph",
      "agent",
      "automation",
      "flow",
      "whatsapp",
      "apex",
      "web-to-lead",
      "policy",
      "vision",
      "openai",
    ],
    certificationPick: (c) =>
      c.filter((x) => /Agentic|AI|Conversational|Cloud|Python/i.test(x)).slice(0, 5),
    experienceBoost: (company, role) => {
      let s = 0;
      if (/g10x/i.test(company)) s += 3;
      if (/intern|associate/i.test(role)) s += 2;
      return s;
    },
  },
  fullstack_ai_engineer: {
    headline: "Full Stack AI Engineer",
    summaryLead:
      "Full-stack AI engineer across Next.js, FastAPI, auth/JWT layers, and OpenAI-powered product experiences.",
    projectKeywords: [
      "next",
      "fastapi",
      "react",
      "tailwind",
      "jwt",
      "openai",
      "rest",
      "socket",
      "firebase",
      "typescript",
    ],
    certificationPick: (c) =>
      c.filter((x) => /JavaScript|Python|CSS|Bootstrap|AI|TensorFlow/i.test(x)).slice(0, 5),
    experienceBoost: (company, role) => {
      let s = 0;
      if (/ziuke|white matrix|ict academy/i.test(company)) s += 3;
      if (/full stack|mern|development|intern/i.test(role)) s += 2;
      return s;
    },
  },
  research_engineer: {
    headline: "Research Engineer",
    summaryLead:
      "Research engineer bridging publications in explainable deep learning with pragmatic systems thinking.",
    projectKeywords: [
      "transformer",
      "lstm",
      "autoencoder",
      "explainability",
      "insider",
      "threat",
      "pytorch",
      "research",
      "hybrid",
    ],
    certificationPick: (c) =>
      c.filter((x) => /TensorFlow|ML|Deep|Python/i.test(x)).slice(0, 5),
    experienceBoost: (company, role) => {
      let s = 0;
      if (/ieee|white matrix|codsoft/i.test(company)) s += 3;
      if (/research|chair|ml/i.test(role)) s += 3;
      return s;
    },
  },
  backend_ai_engineer: {
    headline: "Backend AI Engineer",
    summaryLead:
      "Backend AI engineer building APIs, persistence, auth, and inference-adjacent services for AI products.",
    projectKeywords: [
      "fastapi",
      "sql",
      "jwt",
      "api",
      "python",
      "backend",
      "sqlite",
      "sqlalchemy",
      "rest",
      "server",
    ],
    certificationPick: (c) =>
      c.filter((x) => /Python|Cloud|TensorFlow|AI/i.test(x)).slice(0, 5),
    experienceBoost: (company, role) => {
      let s = 0;
      if (/white matrix|ict academy|g10x/i.test(company)) s += 3;
      if (/engineer|intern|backend|mern/i.test(role)) s += 2;
      return s;
    },
  },
};

function scoreCaseStudy(cs: CaseStudy, keywords: string[]): number {
  const blob = [
    cs.productTitle,
    cs.tagline,
    cs.category,
    ...cs.tech,
    ...(cs.aiMlComponents ?? []),
    cs.engineeringContribution,
  ]
    .join(" ")
    .toLowerCase();
  let s = cs.featured ? 2 : 0;
  for (const k of keywords) {
    if (!k) continue;
    if (blob.includes(k.toLowerCase())) s += 2;
  }
  return s;
}

export type TailoredResumeDoc = {
  roleId: ResumeRoleId;
  roleLabel: string;
  headline: string;
  summaryParagraphs: string[];
  skillBullets: string[];
  certifications: string[];
  projects: { title: string; line: string; tech: string[] }[];
  experience: { company: string; role: string; period: string; location: string | null }[];
  education: { name: string; degree: string; period: string }[];
  publicationLine: string | null;
  contactLine: string;
};

export function buildTailoredResume(roleId: ResumeRoleId): TailoredResumeDoc {
  const profile = ROLE_PROFILE[roleId];
  const ranked = [...caseStudies]
    .map((cs) => ({ cs, s: scoreCaseStudy(cs, profile.projectKeywords) }))
    .sort((a, b) => b.s - a.s);
  const top = ranked.slice(0, 4).map((r) => r.cs);

  const summaryTail =
    roleId === "research_engineer"
      ? `Publication highlight: ${publication.title.slice(0, 120)}…`
      : `Open to roles aligned with **${profile.headline}** — portfolio and live demos available on request.`;

  const summaryParagraphs = [
    `${profile.summaryLead} Core background: ${summary.slice(0, 220).trim()}${summary.length > 220 ? "…" : ""}`,
    summaryTail,
  ];

  const skillBullets = [
    ...skills.top,
    ...skills.languages.map((l) => `${l.name} (${l.level})`),
  ];

  const certifications = profile.certificationPick(skills.certifications);

  const projects = top.map((cs) => ({
    title: cs.productTitle,
    line: cs.tagline,
    tech: cs.tech.slice(0, 8),
  }));

  const sortedExp = [...experience].sort((a, b) => {
    const sa = profile.experienceBoost(a.company, a.role);
    const sb = profile.experienceBoost(b.company, b.role);
    if (sb !== sa) return sb - sa;
    return 0;
  });

  const publicationLine =
    roleId === "research_engineer" || roleId === "ml_engineer"
      ? `${publication.title} — ${publication.author}`
      : null;

  const contactLine = `${contact.email} · ${contact.mobile} · ${contact.linkedin}`;

  return {
    roleId,
    roleLabel: profile.headline,
    headline: profile.headline,
    summaryParagraphs,
    skillBullets,
    certifications,
    projects,
    experience: sortedExp.slice(0, 10),
    education,
    publicationLine,
    contactLine,
  };
}

export function tailoredResumePlainText(doc: TailoredResumeDoc): string {
  const lines: string[] = [
    "Issac Sunny",
    doc.headline,
    "",
    "SUMMARY",
    ...doc.summaryParagraphs.map((p) => p + "\n"),
    "",
    "TOP SKILLS",
    ...doc.skillBullets.map((s) => `• ${s}`),
    "",
    "CERTIFICATIONS (selected)",
    ...doc.certifications.map((s) => `• ${s}`),
    "",
    "SELECTED PROJECTS",
    ...doc.projects.flatMap((p) => [`• ${p.title}: ${p.line}`, `  Tech: ${p.tech.join(", ")}`]),
    "",
    "EXPERIENCE",
    ...doc.experience.map(
      (e) => `• ${e.role} — ${e.company} (${e.period})${e.location ? ` · ${e.location}` : ""}`
    ),
    "",
    "EDUCATION",
    ...doc.education.map((ed) => `• ${ed.degree} — ${ed.name} (${ed.period})`),
  ];
  if (doc.publicationLine) {
    lines.push("", "PUBLICATION", doc.publicationLine);
  }
  lines.push("", "CONTACT", doc.contactLine);
  lines.push(
    "",
    "—",
    "Generated on issacsunny.dev — tailor is heuristic from portfolio JSON; verify before sending externally."
  );
  return lines.join("\n");
}
