import type { Intent, ReplyType } from "@/lib/intentDetection";

export type RetrievalSource = {
  source: string;
  category: string;
  score: number;
  excerpt: string;
};

export type AgentId =
  | "architecture"
  | "ai-systems"
  | "backend"
  | "recruiter"
  | "historian"
  | "ui-ux";

export type RoutedAgent = {
  id: AgentId;
  label: string;
  shortLabel: string;
  routingMessage: string;
  /** 0–1 heuristic for UI meter */
  routingConfidence: number;
};

export type TelemetrySnapshot = {
  embeddingsStatus: "cold" | "loading" | "ready";
  retrievalLatencyMs: number;
  contextDepth: number;
  topSimilarity: number;
  confidenceDisplayPct: number;
  activeModules: string[];
  queryRoute: string;
  intent: Intent;
};

export type ChatMessageIntel = {
  routedAgent?: RoutedAgent;
  telemetry?: TelemetrySnapshot;
  primaryProjectSource?: string | null;
};

export type ProjectIntelSections = {
  dataFlow?: string[];
  deployment?: string[];
  apis?: string[];
  stack?: string[];
  decisions?: string[];
  scalability?: string[];
  challenges?: string[];
  performance?: { label: string; value: string }[];
};

export type ProjectIntelDoc = {
  /** Matches case study id when present */
  caseStudyId?: string;
  architectureMermaid?: string;
  sections?: ProjectIntelSections;
  /** Human hint for "simulate" / demo CTA */
  demoHint?: string;
  /** Optional external demo URL */
  demoUrl?: string | null;
};

export type PortfolioChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  suggestions?: string[];
  replyType?: ReplyType;
  retrievalSources?: RetrievalSource[];
  lowConfidence?: boolean;
} & ChatMessageIntel;

export type RecruiterFocus = "salesforce" | "ai_ml" | "fullstack" | "general";

export type RecruiterSessionV1 = {
  version: 1;
  viewedProjectIds: string[];
  techMentions: Record<string, number>;
  queryCount: number;
  lastQueryAt: number;
  inferredFocus: RecruiterFocus;
  projectScores: Record<string, number>;
  interactionDepth: number;
};
