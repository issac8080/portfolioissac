/**
 * Shared types for the on-site "AI operating system" experience layer.
 * Telemetry is derived from real client-side retrieval; orchestration fields
 * are designed to extend into multi-agent simulation (Phase 2+).
 */

export type InferencePipelineState =
  | "idle"
  | "model_init"
  | "embedding"
  | "vector_scan"
  | "synthesis"
  | "error";

export type EmbeddingRuntimeStatus = "cold" | "warming" | "ready" | "error";

export type AiSubsystemId =
  | "semantic_index"
  | "retrieval"
  | "intent_router"
  | "portfolio_assistant"
  | "embedding_lab"
  | "session_memory";

export type RetrievalTelemetryEvent = {
  latencyMs: number;
  bestScore: number;
  hitCount: number;
  contextDepth: number;
  at: number;
};

export type AgentRoleId =
  | "architecture"
  | "ai_systems"
  | "backend_infra"
  | "recruiter_assistant"
  | "project_historian"
  | "research"
  | "ui_ux_systems"
  | "workflow_autonomous";

export type AgentRoutingHint = {
  agentId: AgentRoleId;
  weight: number;
  rationale: string;
};
