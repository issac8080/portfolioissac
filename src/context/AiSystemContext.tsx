"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AgentRoutingHint,
  EmbeddingRuntimeStatus,
  InferencePipelineState,
  RetrievalTelemetryEvent,
} from "@/lib/ai-os/types";
import { getEmbeddingIndexStats, isReady as isEmbeddingReady } from "@/lib/embeddingSearch";
import { routeQueryToAgents } from "@/lib/ai-os/agentRouting";

const MAX_LATENCY_SAMPLES = 8;

export type AiSystemContextValue = {
  embeddingStatus: EmbeddingRuntimeStatus;
  inferenceState: InferencePipelineState;
  retrievalLatencyMs: number | null;
  latencyHistoryMs: readonly number[];
  semanticConfidence: number | null;
  contextDepth: number;
  sessionQueryCount: number;
  sessionIntelligence: number;
  activeOrchestrationAgents: AgentRoutingHint[];
  lastRetrievalAt: number | null;
  assistantPanelOpen: boolean;
  embeddingLabActive: boolean;
  systemPulse: number;
  approxIndexBytes: number;
  recordModelLoadStart: () => void;
  recordModelLoadEnd: (success: boolean) => void;
  recordRetrieval: (e: Omit<RetrievalTelemetryEvent, "at">) => void;
  setInferenceState: (s: InferencePipelineState) => void;
  setAssistantPanelOpen: (open: boolean) => void;
  setEmbeddingLabActive: (active: boolean) => void;
  previewOrchestrationForQuery: (query: string) => void;
  refreshIndexFootprint: () => void;
};

const AiSystemContext = createContext<AiSystemContextValue | null>(null);

export function AiSystemProvider({ children }: { children: React.ReactNode }) {
  const [embeddingStatus, setEmbeddingStatus] =
    useState<EmbeddingRuntimeStatus>("cold");
  const [inferenceState, setInferenceState] =
    useState<InferencePipelineState>("idle");
  const [retrievalLatencyMs, setRetrievalLatencyMs] = useState<number | null>(null);
  const latencyRef = useRef<number[]>([]);
  const [latencyVersion, setLatencyVersion] = useState(0);
  const [semanticConfidence, setSemanticConfidence] = useState<number | null>(null);
  const [contextDepth, setContextDepth] = useState(0);
  const [sessionQueryCount, setSessionQueryCount] = useState(0);
  const [lastRetrievalAt, setLastRetrievalAt] = useState<number | null>(null);
  const [assistantPanelOpen, setAssistantPanelOpen] = useState(false);
  const [embeddingLabActive, setEmbeddingLabActive] = useState(false);
  const [activeOrchestrationAgents, setActiveOrchestrationAgents] = useState<
    AgentRoutingHint[]
  >([]);
  const [systemPulse, setSystemPulse] = useState(0);
  const [approxIndexBytes, setApproxIndexBytes] = useState(0);

  const refreshIndexFootprint = useCallback(() => {
    const stats = getEmbeddingIndexStats();
    setApproxIndexBytes(stats.approxIndexBytes);
    if (stats.ready) {
      setEmbeddingStatus((prev) => (prev === "error" ? prev : "ready"));
    }
  }, []);

  useEffect(() => {
    if (isEmbeddingReady()) {
      setEmbeddingStatus("ready");
      refreshIndexFootprint();
    }
  }, [refreshIndexFootprint]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSystemPulse((p) => (p + 1) % 1_000_000);
      if (isEmbeddingReady()) refreshIndexFootprint();
    }, 5000);
    return () => window.clearInterval(id);
  }, [refreshIndexFootprint]);

  const recordModelLoadStart = useCallback(() => {
    setEmbeddingStatus("warming");
    setInferenceState("model_init");
  }, []);

  const recordModelLoadEnd = useCallback((success: boolean) => {
    setEmbeddingStatus(success ? "ready" : "error");
    setInferenceState(success ? "idle" : "error");
    if (success) refreshIndexFootprint();
  }, [refreshIndexFootprint]);

  const previewOrchestrationForQuery = useCallback((query: string) => {
    setActiveOrchestrationAgents(routeQueryToAgents(query));
  }, []);

  const recordRetrieval = useCallback(
    (e: Omit<RetrievalTelemetryEvent, "at">) => {
      setRetrievalLatencyMs(e.latencyMs);
      const next = [...latencyRef.current, e.latencyMs].slice(-MAX_LATENCY_SAMPLES);
      latencyRef.current = next;
      setLatencyVersion((v) => v + 1);
      setSemanticConfidence(e.bestScore);
      setContextDepth(e.contextDepth);
      setLastRetrievalAt(Date.now());
      setSessionQueryCount((c) => c + 1);
      setInferenceState("idle");
      refreshIndexFootprint();
    },
    [refreshIndexFootprint]
  );

  const sessionIntelligence = useMemo(() => {
    const conf = semanticConfidence ?? 0;
    const n = sessionQueryCount;
    const boot =
      embeddingStatus === "ready" ? 14 : embeddingStatus === "warming" ? 6 : 0;
    return Math.min(100, Math.round(n * 6 + conf * 30 + boot));
  }, [sessionQueryCount, semanticConfidence, embeddingStatus]);

  const latencyHistoryMs = useMemo(() => {
    void latencyVersion;
    return Object.freeze([...latencyRef.current]) as readonly number[];
  }, [latencyVersion]);

  const setInferenceStateStable = useCallback((s: InferencePipelineState) => {
    setInferenceState(s);
  }, []);

  const value = useMemo(
    () => ({
      embeddingStatus,
      inferenceState,
      retrievalLatencyMs,
      latencyHistoryMs,
      semanticConfidence,
      contextDepth,
      sessionQueryCount,
      sessionIntelligence,
      activeOrchestrationAgents,
      lastRetrievalAt,
      assistantPanelOpen,
      embeddingLabActive,
      systemPulse,
      approxIndexBytes,
      recordModelLoadStart,
      recordModelLoadEnd,
      recordRetrieval,
      setInferenceState: setInferenceStateStable,
      setAssistantPanelOpen,
      setEmbeddingLabActive,
      previewOrchestrationForQuery,
      refreshIndexFootprint,
    }),
    [
      embeddingStatus,
      inferenceState,
      retrievalLatencyMs,
      latencyHistoryMs,
      semanticConfidence,
      contextDepth,
      sessionQueryCount,
      sessionIntelligence,
      activeOrchestrationAgents,
      lastRetrievalAt,
      assistantPanelOpen,
      embeddingLabActive,
      systemPulse,
      approxIndexBytes,
      recordModelLoadStart,
      recordModelLoadEnd,
      recordRetrieval,
      setInferenceStateStable,
      previewOrchestrationForQuery,
      refreshIndexFootprint,
    ]
  );

  return <AiSystemContext.Provider value={value}>{children}</AiSystemContext.Provider>;
}

export function useAiSystem(): AiSystemContextValue {
  const ctx = useContext(AiSystemContext);
  if (!ctx) {
    throw new Error("useAiSystem must be used within AiSystemProvider");
  }
  return ctx;
}

export function useAiSystemOptional(): AiSystemContextValue | null {
  return useContext(AiSystemContext);
}
