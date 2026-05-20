"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  MessageSquareText,
  Minus,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  PanelRight,
  Network,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  loadKnowledgeEmbeddings,
  search,
  formatReply,
  formatReplyStructured,
  getBestScore,
  getConfidenceThreshold,
  isReady,
  getProjectIntelBySource,
} from "@/lib/embeddingSearch";
import {
  augmentInterviewSearchQuery,
  formatInterviewReply,
  getInterviewSuggestionChips,
  INTERVIEW_WELCOME,
} from "@/lib/interviewMode";
import {
  detectIntent,
  getSuggestionsForIntent,
  getReplyTypeForIntent,
  type Intent,
} from "@/lib/intentDetection";
import { routeQueryToAgent } from "@/lib/agentRouter";
import { cn } from "@/lib/utils";
import ThinkingStateBanner from "@/components/portfolio-intelligence/ThinkingStateBanner";
import TelemetryPanel from "@/components/portfolio-intelligence/TelemetryPanel";
import MultiAgentRouteToast, {
  AgentBadge,
} from "@/components/portfolio-intelligence/MultiAgentRouteToast";
import CommandStrip from "@/components/portfolio-intelligence/CommandStrip";
import type {
  PortfolioChatMessage,
  TelemetrySnapshot,
  ProjectIntelDoc,
  AgentId,
  RetrievalSource,
} from "@/types/portfolioIntelligence";
import { useAiSystemOptional } from "@/context/AiSystemContext";
import { useRecruiterSession } from "@/hooks/useRecruiterSession";
import { useSemanticSessionMemory } from "@/hooks/useSemanticSessionMemory";
import { usePortfolioVoice } from "@/hooks/usePortfolioVoice";
import { getChatAvailability, requestOpenAiRagReply } from "@/lib/openaiChatClient";
import { PORTFOLIO_OPEN_INTELLIGENCE_FULLSCREEN } from "@/lib/portfolioIntelligenceEvents";

export type { RetrievalSource } from "@/types/portfolioIntelligence";
export type ChatMessage = PortfolioChatMessage;

const RetrievalFlowGraph = dynamic(
  () => import("@/components/portfolio-intelligence/RetrievalFlowGraph"),
  { ssr: false, loading: () => <div className="h-[140px] animate-pulse rounded-xl bg-white/5" /> }
);

const IntelligenceViewPanel = dynamic(
  () => import("@/components/portfolio-intelligence/IntelligenceViewPanel"),
  { ssr: false }
);

const KnowledgeGraphSurface = dynamic(
  () => import("@/components/portfolio-intelligence/KnowledgeGraphSurface"),
  { ssr: false }
);

const VISITOR_KEY = "portfolio_agent_visited";
const OPENAI_PREF_KEY = "pi_openai_synthesis_v1";
const MAX_CONTEXT_QUERIES = 3;
const COLLAPSE_THRESHOLD = 280;

function isCasualConversation(raw: string): boolean {
  const t = raw.trim().toLowerCase().replace(/[!?.]+$/g, "").trim();
  if (t.length > 56) return false;
  if (/^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(t)) return true;
  if (/^(how are you|how r you|what'?s up|sup)\b/.test(t)) return true;
  if (/^(thanks|thank you|thx|bye|goodbye|ok|okay|cool|nice)\b/.test(t) && t.length <= 32)
    return true;
  return false;
}

function buildCasualPortfolioReply(raw: string): string {
  const t = raw.trim().toLowerCase();
  if (/thank/.test(t)) {
    return "You’re welcome. Ask about **projects**, **experience**, or flip **Interview** for technical drills.";
  }
  if (/how are you|how r you/.test(t)) {
    return "Doing well — thanks for asking. I’m Issac’s portfolio assistant: ask about **Urban Place**, **AuraShop**, **skills**, or anything in the knowledge base.";
  }
  if (/^(bye|goodbye)\b/.test(t)) {
    return "Goodbye — come back anytime for project deep-dives or **Interview** mode.";
  }
  return "Hi. Ask about Issac’s **projects**, **research**, **experience**, or use **Interview** for architecture-style questions.";
}

function buildTelemetry(args: {
  embeddingsStatus: TelemetrySnapshot["embeddingsStatus"];
  latencyMs: number;
  contextDepth: number;
  score: number;
  routeLabel: string;
  intent: Intent;
  engineeringMode: boolean;
  interviewMode: boolean;
  openaiSynthesis?: boolean;
}): TelemetrySnapshot {
  const confidenceDisplayPct = Math.min(99, Math.max(0, Math.round(args.score * 100)));
  const activeModules = [
    "MiniLM-L6-v2",
    "Cosine retrieval",
    "KB-JSON",
    "Intent",
    "Agent router",
  ];
  if (args.engineeringMode) {
    activeModules.push("Session graph", "Recruiter memory", "Voice IO");
  }
  if (args.interviewMode) {
    activeModules.push("Interview KB synthesis");
  }
  if (args.openaiSynthesis) {
    activeModules.push("GPT assist");
  }
  return {
    embeddingsStatus: args.embeddingsStatus,
    retrievalLatencyMs: args.latencyMs,
    contextDepth: args.contextDepth,
    topSimilarity: args.score,
    confidenceDisplayPct,
    activeModules,
    queryRoute: args.routeLabel,
    intent: args.intent,
  };
}

/** Professional system assistant tone — contextual by section */
function getWelcomeBySection(sectionId: string | null): string {
  switch (sectionId) {
    case "projects":
      return "Portfolio Intelligence ready. You can ask about any project or system architecture.";
    case "experience":
      return "Ready. Ask for career overview, roles, or contributions.";
    case "skills":
      return "Ready. Questions about technologies and skills are supported.";
    case "research":
      return "Ready. I can summarize research and methodology.";
    case "contact":
      return "Ready. I can direct you to contact options.";
    case "games":
      return "Ready. The playground is for quick demos—ask about projects if you want deeper detail.";
    case "featured-systems":
      return "Ready. Ask about any featured system in detail.";
    case "leadership":
      return "Ready. Ask about leadership and community roles.";
    case "activities":
      return "Ready. Ask about IEEE events, CTF, webinars, and hackathons.";
    case "testimonials":
      return "Ready. Peer testimonials are on this page — ask how collaboration or delivery showed up in projects.";
    case "lab":
      return "Ready. Ask about experiments, tradeoffs, or what shipped from the lab log.";
    case "live-lab":
      return "Ready. The embedding playground uses the same assistant model as this panel.";
    case "security-model":
      return "Ready. I can summarize how this site handles contact, scripts, and abuse surface.";
    case "about-portfolio":
      return "Ready. Ask how this portfolio is built — stack, AI layer, motion, and privacy choices.";
    case "interview-issac":
      return "Interview Issac AI is available — open the assistant and enable Interview mode for technical drills.";
    case "resume-tailor":
      return "Ready. Use the résumé tailor section to export a role-specific PDF.";
    default:
      return "Portfolio Intelligence ready. Ask about projects, experience, research, or skills.";
  }
}

function buildDynamicWelcome(sectionId: string | null, isReturning: boolean): string {
  if (isReturning) {
    return "Welcome back. Ask for deeper insights on any project or system.";
  }
  return getWelcomeBySection(sectionId);
}

function getSectionIdFromViewport(): string | null {
  if (typeof document === "undefined") return null;
  const sections = [
    "hero",
    "projects",
    "games",
    "featured-systems",
    "experience",
    "research",
    "lab",
    "skills",
    "live-lab",
    "leadership",
    "activities",
    "testimonials",
    "security-model",
    "about-portfolio",
    "interview-issac",
    "resume-tailor",
    "contact",
  ];
  const rects = sections.map((id) => {
    const el = document.getElementById(id);
    if (!el) return { id, top: Infinity, bottom: -Infinity };
    const r = el.getBoundingClientRect();
    return { id, top: r.top, bottom: r.bottom };
  });
  const mid = window.innerHeight / 2;
  for (const { id, top, bottom } of rects) {
    if (top <= mid && bottom >= mid) return id;
  }
  return null;
}

type PortfolioChatbotProps = {
  currentProjectId?: string | null;
};

export default function PortfolioChatbot({ currentProjectId = null }: PortfolioChatbotProps) {
  const aiOpt = useAiSystemOptional();
  const aiRef = useRef(aiOpt);
  aiRef.current = aiOpt;

  const [open, setOpen] = useState(false);
  /** Immersive layout — opened from hero CTA or toolbar; dock with header control or Esc. */
  const [fullscreen, setFullscreen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    () => "Portfolio Intelligence ready. Ask about projects, experience, research, or skills."
  );
  const [messages, setMessages] = useState<PortfolioChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [contextQueries, setContextQueries] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [engineeringMode, setEngineeringMode] = useState(false);
  const [interviewMode, setInterviewMode] = useState(false);
  const [telemetryExpanded, setTelemetryExpanded] = useState(false);
  /** Off by default — React Flow is heavy and steals vertical space from the conversation. */
  const [showRetrievalGraph, setShowRetrievalGraph] = useState(false);
  const [lastTelemetry, setLastTelemetry] = useState<TelemetrySnapshot | null>(null);
  const [lastSources, setLastSources] = useState<RetrievalSource[]>([]);
  const [lastQueryLabel, setLastQueryLabel] = useState("");
  const [routingToast, setRoutingToast] = useState<{
    message: string;
    agentId: AgentId;
  } | null>(null);
  const [matchStrengthPct, setMatchStrengthPct] = useState<number | null>(null);
  const [showThinkingResolved, setShowThinkingResolved] = useState(false);
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);
  const [intelligenceSource, setIntelligenceSource] = useState<string | null>(null);
  const [intelDoc, setIntelDoc] = useState<ProjectIntelDoc | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [advancedUnlocked, setAdvancedUnlocked] = useState(false);
  const [openaiAvailable, setOpenaiAvailable] = useState(false);
  const [openaiEnabled, setOpenaiEnabled] = useState(false);

  const { session, recordInteraction, recommendations } = useRecruiterSession();
  const { entries: memoryEntries, append: appendMemory } = useSemanticSessionMemory();
  const { supported: voiceSupported, listening, listenOnce, stop, speak, cancelSpeech } =
    usePortfolioVoice();

  const autoSpeakRef = useRef(false);
  useEffect(() => {
    autoSpeakRef.current = autoSpeak;
  }, [autoSpeak]);

  const updateWelcome = useCallback(() => {
    const section = getSectionIdFromViewport();
    const visited = typeof localStorage !== "undefined" && localStorage.getItem(VISITOR_KEY);
    const returning = !!visited;
    if (typeof localStorage !== "undefined" && !visited) {
      localStorage.setItem(VISITOR_KEY, "1");
    }
    setIsReturning(returning);
    if (interviewMode) {
      setWelcomeMessage(INTERVIEW_WELCOME);
      return;
    }
    setWelcomeMessage(buildDynamicWelcome(section, returning));
  }, [interviewMode]);

  useEffect(() => {
    updateWelcome();
    const onScroll = () => updateWelcome();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateWelcome]);

  useEffect(() => {
    const onInterview = (e: Event) => {
      const ce = e as CustomEvent<{ query?: string }>;
      setInterviewMode(true);
      setWelcomeMessage(INTERVIEW_WELCOME);
      setOpen(true);
      if (ce.detail?.query) setInput(ce.detail.query);
    };
    window.addEventListener("portfolio-open-interview-mode", onInterview as EventListener);
    return () =>
      window.removeEventListener("portfolio-open-interview-mode", onInterview as EventListener);
  }, []);

  useEffect(() => {
    const onFullscreen = () => {
      setFullscreen(true);
      setOpen(true);
    };
    window.addEventListener(PORTFOLIO_OPEN_INTELLIGENCE_FULLSCREEN, onFullscreen);
    return () => window.removeEventListener(PORTFOLIO_OPEN_INTELLIGENCE_FULLSCREEN, onFullscreen);
  }, []);

  const toggleInterviewMode = useCallback(() => {
    setInterviewMode((prev) => {
      const next = !prev;
      queueMicrotask(() => {
        setWelcomeMessage(
          next ? INTERVIEW_WELCOME : buildDynamicWelcome(getSectionIdFromViewport(), isReturning)
        );
      });
      return next;
    });
  }, [isReturning]);

  useEffect(() => {
    aiRef.current?.setAssistantPanelOpen(open);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (intelligenceOpen) {
          setIntelligenceOpen(false);
          return;
        }
        if (fullscreen) {
          setFullscreen(false);
          return;
        }
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, intelligenceOpen, fullscreen]);

  useEffect(() => {
    if (!open || !fullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, fullscreen]);

  useEffect(() => {
    if (!open) setFullscreen(false);
  }, [open]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: Date.now(),
          suggestions: interviewMode ? getInterviewSuggestionChips() : getSuggestionsForIntent("general"),
          replyType: "System Insight",
        },
      ]);
    }
  }, [open, welcomeMessage, interviewMode]);

  useEffect(() => {
    if (open && messages.length > 0 && messages[0].id === "welcome") {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === "welcome"
            ? {
                ...m,
                content: welcomeMessage,
                suggestions: interviewMode ? getInterviewSuggestionChips() : getSuggestionsForIntent("general"),
                replyType: "System Insight" as const,
              }
            : m
        )
      );
    }
  }, [welcomeMessage, open, messages.length, interviewMode]);

  useEffect(() => {
    if (open && !modelReady && !modelLoading) {
      setModelLoading(true);
      aiRef.current?.recordModelLoadStart();
      loadKnowledgeEmbeddings()
        .then(() => {
          setModelReady(true);
          setModelLoading(false);
          aiRef.current?.recordModelLoadEnd(true);
        })
        .catch(() => {
          setModelLoading(false);
          aiRef.current?.recordModelLoadEnd(false);
        });
    }
  }, [open, modelReady, modelLoading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, lastTelemetry, showRetrievalGraph]);

  useEffect(() => {
    if (!routingToast) return;
    const t = window.setTimeout(() => setRoutingToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [routingToast]);

  useEffect(() => {
    try {
      const v = sessionStorage.getItem(OPENAI_PREF_KEY);
      if (v === "1") setOpenaiEnabled(true);
      else if (v === "0") setOpenaiEnabled(false);
    } catch {
      /* */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void getChatAvailability().then(({ openai }) => {
      setOpenaiAvailable(openai);
      if (!openai) return;
      try {
        const stored = sessionStorage.getItem(OPENAI_PREF_KEY);
        if (stored === null) {
          setOpenaiEnabled(true);
          sessionStorage.setItem(OPENAI_PREF_KEY, "1");
        }
      } catch {
        setOpenaiEnabled(true);
      }
    });
  }, [open]);

  const toggleOpenaiEnabled = useCallback(() => {
    setOpenaiEnabled((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem(OPENAI_PREF_KEY, next ? "1" : "0");
      } catch {
        /* */
      }
      return next;
    });
  }, []);

  const addContextQuery = useCallback((query: string) => {
    setContextQueries((prev) => [...prev.slice(-(MAX_CONTEXT_QUERIES - 1)), query.trim()]);
  }, []);

  /** Show the full assistant message immediately — per-token streaming was ~28ms × tokens (often 10s+). */
  const streamReply = useCallback((msg: PortfolioChatMessage, onDone?: () => void) => {
    setMessages((prev) => [...prev, msg]);
    queueMicrotask(() => onDone?.());
  }, []);

  const sendMessageWithTyping = async (textOverride?: string) => {
    const text = (textOverride ?? input.trim()).trim();
    if (!text || loading) return;

    if (!textOverride) setInput("");
    const userMsg: PortfolioChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setShowThinkingResolved(false);
    setMatchStrengthPct(null);

    const intent = detectIntent(text);
    const routed = routeQueryToAgent(intent, text, []);
    setRoutingToast({ message: routed.routingMessage, agentId: routed.id });

    const ai = aiRef.current;
    ai?.previewOrchestrationForQuery(text);
    ai?.setInferenceState("embedding");

    try {
      const contextDepthUsed = Math.min(MAX_CONTEXT_QUERIES, contextQueries.length);

      if (isCasualConversation(text)) {
        ai?.setInferenceState("synthesis");
        const reply = buildCasualPortfolioReply(text);
        const embStatus: TelemetrySnapshot["embeddingsStatus"] = modelReady
          ? "ready"
          : modelLoading
            ? "loading"
            : "cold";
        const telemetry = buildTelemetry({
          embeddingsStatus: embStatus,
          latencyMs: 0,
          contextDepth: contextDepthUsed,
          score: 1,
          routeLabel: routed.label,
          intent,
          engineeringMode,
          interviewMode,
          openaiSynthesis: false,
        });
        setLastTelemetry(telemetry);
        setLastSources([]);
        setLastQueryLabel(text);
        setMatchStrengthPct(null);
        setShowThinkingResolved(false);

        const assistantMsg: PortfolioChatMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: Date.now(),
          suggestions: getSuggestionsForIntent(intent),
          replyType: getReplyTypeForIntent(intent),
          lowConfidence: false,
          routedAgent: routed,
          telemetry,
          primaryProjectSource: null,
        };
        streamReply(assistantMsg, () => {
          if (autoSpeakRef.current) {
            const plain = reply.replace(/\*\*/g, "").replace(/#{1,6}\s?/g, "");
            speak(plain.slice(0, 800));
          }
        });
        setLoading(false);
        return;
      }

      if (!isReady()) {
        ai?.recordModelLoadStart();
        await loadKnowledgeEmbeddings();
        ai?.recordModelLoadEnd(true);
      }

      ai?.setInferenceState("vector_scan");

      const options: { contextQueries?: string[]; sourceFilter?: string } = {
        contextQueries: contextQueries.slice(-MAX_CONTEXT_QUERIES),
      };
      if (currentProjectId) {
        const id = currentProjectId.toLowerCase();
        if (id.includes("urban") || id.includes("place")) options.sourceFilter = "Urban Place";
        else if (id.includes("aurashop")) options.sourceFilter = "AuraShop";
        else if (id.includes("dependency") || id.includes("analyzer"))
          options.sourceFilter = "Code Dependency";
        else if (id.includes("initra")) options.sourceFilter = "Initra";
        else if (id.includes("returns") || id.includes("autonomous"))
          options.sourceFilter = "Autonomous Returns";
      }

      const searchQuery = interviewMode ? augmentInterviewSearchQuery(text) : text;
      const topK = interviewMode ? 6 : 4;

      const t0 = performance.now();
      const results = await search(searchQuery, topK, options);
      const latencyMs = Math.round(performance.now() - t0);
      const threshold = getConfidenceThreshold();
      const bestScore = getBestScore(results);
      const suggestions = getSuggestionsForIntent(intent);
      const agent = routeQueryToAgent(intent, text, results);

      const retrievalSources: NonNullable<PortfolioChatMessage["retrievalSources"]> = results
        .slice(0, 5)
        .map((r) => ({
          source: r.chunk.source,
          category: r.chunk.category,
          score: r.score,
          excerpt:
            r.chunk.text.length > 140 ? `${r.chunk.text.slice(0, 140)}…` : r.chunk.text,
        }));

      ai?.setInferenceState("synthesis");
      ai?.recordRetrieval({
        latencyMs,
        bestScore,
        hitCount: results.length,
        contextDepth: contextDepthUsed,
      });
      setLastSources(retrievalSources);
      setLastQueryLabel(text);
      setMatchStrengthPct(Math.round(bestScore * 100));
      setShowThinkingResolved(true);
      window.setTimeout(() => setShowThinkingResolved(false), 1400);

      const intelMap = getProjectIntelBySource();
      const topChunk = results[0]?.chunk;
      const primaryProjectSource =
        topChunk?.category === "projects" ? topChunk.source : null;
      let nextIntel: ProjectIntelDoc | null = null;
      if (primaryProjectSource && intelMap && intelMap[primaryProjectSource]) {
        nextIntel = intelMap[primaryProjectSource];
      }
      if (primaryProjectSource) {
        setIntelligenceSource(primaryProjectSource);
        setIntelDoc(nextIntel);
      }
      // Do not auto-open the intelligence overlay — it hid the chat and felt slow/cluttered.
      // Users open it from "Open intelligence view" under Sources when they want the deep dive.

      let reply: string;
      let lowConfidence = false;

      if (interviewMode) {
        reply = formatInterviewReply(text, results, bestScore, threshold);
        lowConfidence = results.length === 0 || bestScore < threshold + 0.12;
      } else if (results.length === 0 || bestScore < threshold) {
        lowConfidence = true;
        reply =
          "I could not match that closely to this site's knowledge base (below the confidence threshold). Try a specific project name or rephrase.\n\nClosest snippets considered (may be only loosely related) are listed under **Sources** below.";
      } else {
        reply = formatReplyStructured(results) || formatReply(results);
        if (!reply) {
          lowConfidence = true;
          reply =
            "I found related chunks but could not format a confident summary. See **Sources** below or ask about a named project.";
        } else if (bestScore < threshold + 0.12) {
          lowConfidence = true;
          reply =
            "**Note:** match confidence is moderate; verify against the cited sources below.\n\n" +
            reply;
        }
      }

      let usedOpenAI = false;
      if (
        openaiEnabled &&
        openaiAvailable &&
        results.length > 0 &&
        !isCasualConversation(text)
      ) {
        const sourcesForApi: RetrievalSource[] = results.slice(0, 5).map((r) => ({
          source: r.chunk.source,
          category: r.chunk.category,
          score: r.score,
          excerpt:
            r.chunk.text.length > 720 ? `${r.chunk.text.slice(0, 720)}…` : r.chunk.text,
        }));
        const oa = await requestOpenAiRagReply({
          userMessage: text,
          interviewMode,
          sources: sourcesForApi,
        });
        if (oa?.reply) {
          reply = oa.reply;
          usedOpenAI = true;
        }
      }

      const embStatus: TelemetrySnapshot["embeddingsStatus"] = modelReady
        ? "ready"
        : modelLoading
          ? "loading"
          : "cold";

      const telemetry = buildTelemetry({
        embeddingsStatus: embStatus,
        latencyMs,
        contextDepth: contextDepthUsed,
        score: bestScore,
        routeLabel: agent.label,
        intent,
        engineeringMode,
        interviewMode,
        openaiSynthesis: usedOpenAI,
      });
      setLastTelemetry(telemetry);

      const suggestionList = interviewMode ? getInterviewSuggestionChips() : suggestions;
      const assistantMsg: PortfolioChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
        suggestions: suggestionList,
        replyType: getReplyTypeForIntent(intent),
        retrievalSources,
        lowConfidence,
        routedAgent: agent,
        telemetry,
        primaryProjectSource,
      };

      recordInteraction(text, retrievalSources);
      const memorySummary = usedOpenAI
        ? interviewMode
          ? `Interview${primaryProjectSource ? ` · ${primaryProjectSource}` : ""} · polished`
          : primaryProjectSource
            ? `Grounded: ${primaryProjectSource} · polished`
            : `Intent ${intent}; top ${(bestScore * 100).toFixed(0)}% · polished`
        : interviewMode
          ? `Interview Issac${primaryProjectSource ? ` · ${primaryProjectSource}` : ""}`
          : primaryProjectSource
            ? `Grounded: ${primaryProjectSource}`
            : `Intent: ${intent}; top match ${(bestScore * 100).toFixed(0)}%`;
      appendMemory(text, memorySummary);

      streamReply(assistantMsg, () => {
        if (autoSpeakRef.current) {
          const plain = reply.replace(/\*\*/g, "").replace(/#{1,6}\s?/g, "");
          speak(plain.slice(0, 1200));
        }
      });
      addContextQuery(text);
    } catch {
      aiRef.current?.setInferenceState("error");
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content:
            "Something went wrong. Ensure you're online for the first load, then try again.",
          timestamp: Date.now(),
          suggestions: getSuggestionsForIntent("general"),
          replyType: "System Insight",
        },
      ]);
      addContextQuery(text);
    } finally {
      setLoading(false);
    }
  };

  const onVoice = () => {
    if (listening) {
      stop();
      return;
    }
    listenOnce(
      (said) => {
        void sendMessageWithTyping(said);
      },
      () => {}
    );
  };

  const onTailoredResume = async () => {
    const lines = [
      "Issac Sunny — tailored signals (generated locally, not uploaded)",
      `Inferred recruiter focus: ${session.inferredFocus}`,
      `Top case studies by engagement: ${recommendations.join(", ") || "n/a"}`,
      `Technologies surfacing in session: ${Object.keys(session.techMentions).slice(0, 12).join(", ") || "n/a"}`,
      "",
      "Suggested resume emphasis bullets:",
      ...recommendations.map(
        (id) => `• Double-weight narrative for "${id}" with quantified outcomes.`
      ),
    ];
    const doc = lines.join("\n");
    try {
      await navigator.clipboard.writeText(doc);
    } catch {
      /* */
    }
    window.dispatchEvent(new CustomEvent("portfolio-open-resume-preview"));
  };

  return (
    <>
      <IntelligenceViewPanel
        open={intelligenceOpen}
        onClose={() => setIntelligenceOpen(false)}
        sourceName={intelligenceSource ?? ""}
        intel={intelDoc}
      />

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-chat-title"
            aria-describedby="portfolio-chat-desc"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className={cn(
              "fixed flex min-h-0 flex-col overflow-hidden border border-ai-border/80 bg-ai-bg/92 shadow-2xl backdrop-blur-2xl pi-command-holo",
              fullscreen
                ? "z-[70] inset-0 max-h-[100dvh] w-full max-w-none rounded-none"
                : "z-[65] rounded-2xl max-md:inset-x-2 max-md:top-[max(4.75rem,env(safe-area-inset-top))] max-md:bottom-[max(5.75rem,env(safe-area-inset-bottom))] max-md:w-auto max-md:max-w-none md:bottom-8 md:right-8 md:left-auto md:max-h-[min(88dvh,720px)] md:w-[calc(100vw-1.25rem)] md:max-w-[min(100vw-1.25rem,520px)]"
            )}
            data-lenis-prevent-wheel
          >
            <div className="pointer-events-none absolute inset-0 ai-os-neural-grid opacity-[0.35]" aria-hidden />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/[0.04] via-transparent to-emerald-500/[0.05]" aria-hidden />

            <div className="relative flex shrink-0 items-start justify-between gap-2 border-b border-ai-border/80 px-3 py-2 md:px-4">
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span id="portfolio-chat-title" className="truncate text-sm font-semibold text-white">
                    {interviewMode ? "Interview Issac AI" : "Portfolio assistant"}
                  </span>
                  {interviewMode && (
                    <span className="inline-flex items-center gap-0.5 rounded-full border border-cyan-400/35 bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-cyan-100">
                      <MessageSquareText className="h-3 w-3" aria-hidden />
                      Interview
                    </span>
                  )}
                  <StatusIndicator mode="local" loading={modelLoading} />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 px-2 text-[10px] text-cyan-200/90 hover:bg-white/5"
                    onClick={() => setTelemetryExpanded((v) => !v)}
                  >
                    <Network className="h-3 w-3" aria-hidden />
                    Telemetry
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "h-7 gap-1 px-2 text-[10px] hover:bg-white/5",
                      showRetrievalGraph
                        ? "text-emerald-200/95"
                        : "text-emerald-200/70"
                    )}
                    onClick={() => setShowRetrievalGraph((v) => !v)}
                  >
                    <PanelRight className="h-3 w-3" aria-hidden />
                    Flow
                  </Button>
                </div>
                <p
                  id="portfolio-chat-desc"
                  className="max-w-[400px] text-[10px] leading-snug text-ai-muted/90"
                >
                  {interviewMode
                    ? `Technical and architecture-style questions, grounded in this portfolio’s content.${
                        openaiAvailable
                          ? " Turn on **GPT** for smoother phrasing when you want it."
                          : ""
                      } Esc closes overlays in order (intelligence → fullscreen → assistant).`
                    : `Ask about projects, experience, and skills — answers are built from this site’s knowledge base.${
                        openaiAvailable
                          ? " Turn on **GPT** for a more conversational tone when you want it."
                          : ""
                      } Esc closes overlays in order (intelligence → fullscreen → assistant).`}
                </p>
              </div>
              <div className="mt-0.5 flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setFullscreen((f) => !f)}
                  className="h-9 w-9 text-ai-muted hover:text-white"
                  aria-label={fullscreen ? "Dock assistant panel" : "Expand assistant to fullscreen"}
                  title={fullscreen ? "Dock panel" : "Fullscreen"}
                >
                  {fullscreen ? (
                    <Minimize2 className="h-5 w-5" aria-hidden />
                  ) : (
                    <Maximize2 className="h-5 w-5" aria-hidden />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFullscreen(false);
                    setOpen(false);
                  }}
                  className="h-9 w-9 text-ai-muted hover:text-white"
                  aria-label="Close portfolio assistant"
                >
                  <Minus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="relative shrink-0 space-y-1.5 border-b border-white/5 px-3 pb-1.5 pt-0.5">
              <AnimatePresence>
                {routingToast && (
                  <MultiAgentRouteToast
                    key={routingToast.message}
                    message={routingToast.message}
                    visible
                    agentId={routingToast.agentId}
                  />
                )}
              </AnimatePresence>
              <ThinkingStateBanner
                active={loading}
                matchStrengthPct={matchStrengthPct}
                showResolved={showThinkingResolved}
              />
              {telemetryExpanded && lastTelemetry && (
                <TelemetryPanel telemetry={lastTelemetry} engineeringMode={engineeringMode} />
              )}
              {advancedUnlocked && (
                <KnowledgeGraphSurface session={session} />
              )}
              {showRetrievalGraph && lastSources.length > 0 && !loading && (
                <RetrievalFlowGraph query={lastQueryLabel || "…"} sources={lastSources} />
              )}
            </div>

            <div
              ref={scrollRef}
              className="relative min-h-[200px] flex-1 overflow-y-auto overflow-x-hidden px-3 py-2.5 scrollbar-thin md:px-4"
            >
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <MessageGroup
                    key={msg.id}
                    message={msg}
                    prevSameRole={i > 0 && messages[i - 1].role === msg.role}
                    onSuggestionClick={sendMessageWithTyping}
                    loading={loading}
                    onOpenIntel={(src) => {
                      const map = getProjectIntelBySource();
                      setIntelligenceSource(src);
                      setIntelDoc(map?.[src] ?? null);
                      setIntelligenceOpen(true);
                    }}
                  />
                ))}
                {loading && <ThinkingDotWave />}
              </div>
            </div>

            <CommandStrip
              engineeringMode={engineeringMode}
              onToggleEngineering={() => setEngineeringMode((v) => !v)}
              interviewMode={interviewMode}
              onToggleInterview={toggleInterviewMode}
              openaiAvailable={openaiAvailable}
              openaiEnabled={openaiEnabled}
              onToggleOpenai={toggleOpenaiEnabled}
              voiceSupported={voiceSupported}
              listening={listening}
              onVoice={onVoice}
              autoSpeak={autoSpeak}
              onToggleAutoSpeak={() => {
                setAutoSpeak((v) => !v);
                if (autoSpeak) cancelSpeech();
              }}
              onTailoredResume={() => void onTailoredResume()}
              onAdvancedUnlock={() => setAdvancedUnlocked((v) => !v)}
              advancedUnlocked={advancedUnlocked}
            />

            <div className="relative shrink-0 space-y-1.5 border-t border-ai-border/60 p-3 pt-2">
              {modelLoading && (
                <p className="flex items-center gap-2 text-xs text-ai-muted">
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
                  Loading model and knowledge base (one-time)…
                </p>
              )}
              {engineeringMode && memoryEntries.length > 0 && (
                <p className="text-[9px] text-ai-muted/90">
                  Session memory ({memoryEntries.length}):{" "}
                  <span className="font-mono text-white/70">
                    {memoryEntries
                      .slice(-2)
                      .map((e) => e.query.slice(0, 40))
                      .join(" · ")}
                  </span>
                </p>
              )}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && void sendMessageWithTyping()}
                  placeholder={
                    interviewMode
                      ? "Technical question, tradeoff, or scalability drill…"
                      : "Ask about a project, stack, or experience…"
                  }
                  className="min-w-0 flex-1 border-white/10 bg-black/30 text-sm"
                  disabled={loading}
                />
                <Button
                  onClick={() => void sendMessageWithTyping()}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="shrink-0"
                  aria-label="Send"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] leading-tight text-ai-muted/80">
                Retrieval runs on your device from this site’s content.
                {openaiAvailable ? " **GPT** optionally refines wording when enabled." : ""}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              setFullscreen(false);
              setOpen(true);
            }}
            className={cn(
              "fixed z-[65] flex h-14 w-14 items-center justify-center rounded-full border border-ai-border/90",
              "max-md:left-[max(0.75rem,env(safe-area-inset-left))] max-md:right-auto max-md:bottom-[max(5.75rem,env(safe-area-inset-bottom))]",
              "md:bottom-8 md:right-8 md:left-auto",
              "bg-gradient-to-br from-emerald-500/25 via-ai-bg to-cyan-500/20 text-ai-glow shadow-lg backdrop-blur-md",
              "hover:shadow-[0_0_28px_rgba(56,249,215,0.35)]"
            )}
            aria-label="Open AI portfolio intelligence system"
          >
            <MessageCircle className="h-6 w-6" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function StatusIndicator({
  mode,
  loading,
}: {
  mode: "local" | "online";
  loading: boolean;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-1.5 text-[10px] font-medium transition-opacity duration-200",
        mode === "local" ? "text-ai-glow/90" : "text-ai-accent/90",
        loading && "opacity-60"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          mode === "local" ? "bg-ai-glow" : "bg-ai-accent",
          !loading && "animate-pulse"
        )}
      />
      {mode === "local" ? "Local tensor core" : "Online"}
    </span>
  );
}

function ThinkingDotWave() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-1 rounded-2xl border border-ai-border/50 bg-ai-surface/60 px-4 py-2.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-ai-glow/90"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.12,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function parseSections(content: string): { title: string; body: string }[] {
  const sections: { title: string; body: string }[] = [];
  const parts = content.split(/\n\n---\n\n/);
  for (const part of parts) {
    const match = part.match(/^\*\*(.+?)\*\*\n\n?([\s\S]*)/);
    if (match) {
      sections.push({ title: match[1].trim(), body: match[2].trim() });
    } else if (part.trim()) {
      sections.push({ title: "Overview", body: part.trim() });
    }
  }
  if (sections.length === 0 && content.trim()) {
    sections.push({ title: "Response", body: content.trim() });
  }
  return sections;
}

function MessageGroup({
  message,
  prevSameRole,
  onSuggestionClick,
  loading,
  onOpenIntel,
}: {
  message: PortfolioChatMessage;
  prevSameRole: boolean;
  onSuggestionClick: (text: string) => void;
  loading: boolean;
  onOpenIntel: (source: string) => void;
}) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex flex-col",
        isUser ? "items-end" : "items-start",
        prevSameRole && (isUser ? "mt-1" : "mt-2")
      )}
    >
      <MessageBubble
        message={message}
        onSuggestionClick={onSuggestionClick}
        loading={loading}
        onOpenIntel={onOpenIntel}
      />
    </motion.div>
  );
}

function MessageBubble({
  message,
  onSuggestionClick,
  loading,
  onOpenIntel,
}: {
  message: PortfolioChatMessage;
  onSuggestionClick: (text: string) => void;
  loading: boolean;
  onOpenIntel: (source: string) => void;
}) {
  const isUser = message.role === "user";
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const sections = !isUser ? parseSections(message.content) : null;
  const hasMultipleSections = sections && sections.length > 1;
  const isLong = message.content.length > COLLAPSE_THRESHOLD;

  const toggleSection = (i: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className={cn("flex max-w-[94%] flex-col gap-2", isUser && "items-end")}>
      {!isUser && (
        <div className="flex flex-wrap items-center gap-2">
          {message.replyType && (
            <span
              className={cn(
                "w-fit shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                message.replyType === "Project Summary" &&
                  "border-ai-glow/30 bg-ai-glow/5 text-ai-glow/90",
                message.replyType === "Architecture View" &&
                  "border-ai-accent/30 bg-ai-accent/5 text-ai-accent/90",
                message.replyType === "System Insight" &&
                  "border-ai-border/50 bg-ai-surface/30 text-ai-muted"
              )}
            >
              {message.replyType}
            </span>
          )}
          {message.routedAgent && (
            <AgentBadge
              agentId={message.routedAgent.id}
              label={message.routedAgent.label}
              confidence={message.routedAgent.routingConfidence}
            />
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-2xl border px-4 py-2.5 text-sm",
          isUser
            ? "border-ai-border bg-ai-glow/20 text-white"
            : "border-ai-border/50 bg-ai-surface/60 text-ai-muted"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : hasMultipleSections ? (
          <div className="space-y-2">
            {sections!.map((sec, i) => (
              <div key={i} className="overflow-hidden rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection(i)}
                  className="flex w-full items-center justify-between gap-2 py-1.5 text-left text-xs font-medium text-ai-glow/90"
                >
                  <span>{sec.title}</span>
                  {expandedSections.has(i) ? (
                    <ChevronUp className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {expandedSections.has(i) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="whitespace-pre-wrap break-words pb-1 pt-0.5 text-ai-muted">
                        {sec.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : isLong ? (
          <>
            <p className="whitespace-pre-wrap break-words">
              {collapsed ? message.content.slice(0, COLLAPSE_THRESHOLD) + "…" : message.content}
            </p>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="mt-2 flex items-center gap-1 text-[10px] font-medium text-ai-glow/80 hover:text-ai-glow"
            >
              {collapsed ? (
                <>
                  Show more <ChevronDown className="h-3 w-3" />
                </>
              ) : (
                <>
                  Show less <ChevronUp className="h-3 w-3" />
                </>
              )}
            </button>
          </>
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}
        {!isUser && message.telemetry && !loading && (
          <details className="mt-3 rounded-lg border border-ai-border/50 bg-black/30 px-2 py-1.5">
            <summary className="cursor-pointer select-none text-[10px] font-medium text-cyan-300/90">
              Engineering trace (expandable)
            </summary>
            <dl className="mt-2 grid grid-cols-2 gap-1 text-[9px] text-ai-muted">
              <dt>Latency</dt>
              <dd className="font-mono text-white/80">{message.telemetry.retrievalLatencyMs} ms</dd>
              <dt>Top similarity</dt>
              <dd className="font-mono text-white/80">
                {(message.telemetry.topSimilarity * 100).toFixed(1)}%
              </dd>
              <dt>Route</dt>
              <dd className="font-mono text-white/80">{message.telemetry.queryRoute}</dd>
            </dl>
          </details>
        )}
        {!isUser &&
          message.retrievalSources &&
          message.retrievalSources.length > 0 &&
          !loading && (
            <details className="mt-3 rounded-lg border border-ai-border/60 bg-ai-bg/40 px-2 py-1.5">
              <summary className="cursor-pointer select-none text-[10px] font-medium text-ai-glow">
                Sources (retrieval)
              </summary>
              <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto pr-1">
                {message.retrievalSources.map((s, idx) => (
                  <li
                    key={`${s.source}-${idx}`}
                    className="border-b border-ai-border/30 pb-2 text-[10px] text-ai-muted last:border-0 last:pb-0"
                  >
                    <span className="font-mono text-ai-glow/90">
                      {(s.score * 100).toFixed(1)}%
                    </span>{" "}
                    <span className="text-white/80">{s.source}</span>
                    <span className="text-ai-muted"> · {s.category}</span>
                    <p className="mt-0.5 leading-snug text-ai-muted/90">{s.excerpt}</p>
                    {s.category === "projects" && (
                      <button
                        type="button"
                        onClick={() => onOpenIntel(s.source)}
                        className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-cyan-300 hover:underline"
                      >
                        Open intelligence view
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
      </div>
      {!isUser && message.suggestions && message.suggestions.length > 0 && !loading && (
        <div className="flex max-w-[94%] flex-wrap gap-1.5">
          {message.suggestions.slice(0, 5).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggestionClick(s)}
              className="rounded-lg border border-ai-border/50 bg-ai-glow/10 px-2.5 py-1.5 text-[11px] text-ai-glow transition-colors duration-150 hover:bg-ai-glow/20"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
