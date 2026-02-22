"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Minus, Send, Loader2, ChevronDown, ChevronUp } from "lucide-react";
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
} from "@/lib/embeddingSearch";
import {
  detectIntent,
  getSuggestionsForIntent,
  getReplyTypeForIntent,
  type ReplyType,
} from "@/lib/intentDetection";
import { cn } from "@/lib/utils";

const VISITOR_KEY = "portfolio_agent_visited";
const MAX_CONTEXT_QUERIES = 3;
const COLLAPSE_THRESHOLD = 280;

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  suggestions?: string[];
  replyType?: ReplyType;
};

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
    case "featured-systems":
      return "Ready. Ask about any featured system in detail.";
    case "leadership":
      return "Ready. Ask about leadership and community roles.";
    default:
      return "Portfolio Intelligence ready. Ask about projects, experience, research, or skills.";
  }
}

function buildDynamicWelcome(
  sectionId: string | null,
  isReturning: boolean
): string {
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
    "featured-systems",
    "experience",
    "research",
    "skills",
    "leadership",
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
  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    () => "Portfolio Intelligence ready. Ask about projects, experience, research, or skills."
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [contextQueries, setContextQueries] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateWelcome = useCallback(() => {
    const section = getSectionIdFromViewport();
    setCurrentSection(section);
    const visited = typeof localStorage !== "undefined" && localStorage.getItem(VISITOR_KEY);
    const returning = !!visited;
    if (typeof localStorage !== "undefined" && !visited) {
      localStorage.setItem(VISITOR_KEY, "1");
    }
    setIsReturning(returning);
    setWelcomeMessage(buildDynamicWelcome(section, returning));
  }, []);

  useEffect(() => {
    updateWelcome();
    const onScroll = () => updateWelcome();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateWelcome]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: Date.now(),
          suggestions: getSuggestionsForIntent("general"),
          replyType: "System Insight",
        },
      ]);
    }
  }, [open, welcomeMessage]);

  useEffect(() => {
    if (open && messages.length > 0 && messages[0].id === "welcome") {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === "welcome"
            ? { ...m, content: welcomeMessage, suggestions: getSuggestionsForIntent("general"), replyType: "System Insight" as const }
            : m
        )
      );
    }
  }, [welcomeMessage]);

  useEffect(() => {
    if (open && !modelReady && !modelLoading) {
      setModelLoading(true);
      loadKnowledgeEmbeddings()
        .then(() => {
          setModelReady(true);
          setModelLoading(false);
        })
        .catch(() => setModelLoading(false));
    }
  }, [open, modelReady, modelLoading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addContextQuery = useCallback((query: string) => {
    setContextQueries((prev) => [...prev.slice(-(MAX_CONTEXT_QUERIES - 1)), query.trim()]);
  }, []);

  const streamReply = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, { ...msg, content: "" }]);
    const words = msg.content.split(/(\s+)/);
    let i = 0;
    const id = msg.id;
    const timer = setInterval(() => {
      i += 1;
      const part = words.slice(0, i).join("");
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content: part } : m))
      );
      if (i >= words.length) {
        clearInterval(timer);
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, suggestions: msg.suggestions } : m))
        );
      }
    }, 28);
  };

  const sendMessageWithTyping = async (textOverride?: string) => {
    const text = (textOverride ?? input.trim()).trim();
    if (!text || loading) return;

    if (!textOverride) setInput("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      if (!isReady()) await loadKnowledgeEmbeddings();

      const intent = detectIntent(text);
      const options: { topK?: number; contextQueries?: string[]; sourceFilter?: string } = {
        topK: 5,
        contextQueries: contextQueries.slice(-MAX_CONTEXT_QUERIES),
      };
      if (currentProjectId) {
        const id = currentProjectId.toLowerCase();
        if (id.includes("urban") || id.includes("place")) options.sourceFilter = "Urban Place";
        else if (id.includes("aurashop")) options.sourceFilter = "AuraShop";
        else if (id.includes("dependency") || id.includes("analyzer")) options.sourceFilter = "Code Dependency";
        else if (id.includes("initra")) options.sourceFilter = "Initra";
        else if (id.includes("returns") || id.includes("autonomous")) options.sourceFilter = "Autonomous Returns";
      }

      const results = await search(text, 5, options);
      const threshold = getConfidenceThreshold();
      const bestScore = getBestScore(results);
      const suggestions = getSuggestionsForIntent(intent);

      let reply: string;
      if (results.length === 0 || bestScore < threshold) {
        reply = "I might need more context — try asking about a specific project or skill.";
      } else {
        reply = formatReplyStructured(results) || formatReply(results);
        if (!reply) reply = "I might need more context — try asking about a specific project or skill.";
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
        suggestions,
        replyType: getReplyTypeForIntent(intent),
      };
      streamReply(assistantMsg);
      addContextQuery(text);
    } catch {
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

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-md rounded-2xl border border-ai-border bg-ai-bg/95 shadow-2xl backdrop-blur-xl md:bottom-8 md:right-8 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-ai-border px-4 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-white truncate">Portfolio Intelligence</span>
                <StatusIndicator mode="local" loading={modelLoading} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-ai-muted hover:text-white shrink-0"
                aria-label="Minimize chat"
              >
                <Minus className="h-5 w-5" />
              </Button>
            </div>

            <div
              ref={scrollRef}
              className="h-[320px] md:h-[380px] overflow-y-auto overflow-x-hidden px-4 py-3 scrollbar-thin"
            >
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <MessageGroup
                    key={msg.id}
                    message={msg}
                    prevSameRole={i > 0 && messages[i - 1].role === msg.role}
                    onSuggestionClick={sendMessageWithTyping}
                    loading={loading}
                  />
                ))}
                {loading && <ThinkingDotWave />}
              </div>
            </div>

            <div className="border-t border-ai-border p-3 space-y-2">
              {modelLoading && (
                <p className="flex items-center gap-2 text-xs text-ai-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                  Loading model and knowledge base (one-time)…
                </p>
              )}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessageWithTyping()}
                  placeholder="Ask about projects, experience, research…"
                  className="flex-1 min-w-0 text-sm"
                  disabled={loading}
                />
                <Button
                  onClick={() => sendMessageWithTyping()}
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
              <p className="text-[10px] text-ai-muted/80 leading-tight">
                This assistant runs fully on-device using local embeddings.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-ai-border bg-ai-glow/20 text-ai-glow shadow-lg backdrop-blur-sm hover:bg-ai-glow/30 hover:shadow-[0_0_25px_rgba(0,255,136,0.3)] md:bottom-8 md:right-8"
            aria-label="Open portfolio intelligence"
          >
            <MessageCircle className="h-6 w-6" />
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
        "flex items-center gap-1.5 shrink-0 text-[10px] font-medium transition-opacity duration-200",
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
      {mode === "local" ? "Local Mode" : "Online"}
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
      <div className="flex items-center gap-1 rounded-2xl bg-ai-surface/60 border border-ai-border/50 px-4 py-2.5">
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

/** Parse **Title**\n\nBody or --- into sections for expandable UI */
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
}: {
  message: ChatMessage;
  prevSameRole: boolean;
  onSuggestionClick: (text: string) => void;
  loading: boolean;
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
      />
    </motion.div>
  );
}

function MessageBubble({
  message,
  onSuggestionClick,
  loading,
}: {
  message: ChatMessage;
  onSuggestionClick: (text: string) => void;
  loading: boolean;
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
    <div className={cn("flex flex-col gap-2 max-w-[92%]", isUser && "items-end")}>
      {!isUser && message.replyType && (
        <span
          className={cn(
            "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 w-fit",
            message.replyType === "Project Summary" &&
              "text-ai-glow/90 border-ai-glow/30 bg-ai-glow/5",
            message.replyType === "Architecture View" &&
              "text-ai-accent/90 border-ai-accent/30 bg-ai-accent/5",
            message.replyType === "System Insight" &&
              "text-ai-muted border-ai-border/50 bg-ai-surface/30"
          )}
        >
          {message.replyType}
        </span>
      )}
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 text-sm border w-full",
          isUser
            ? "bg-ai-glow/20 text-white border-ai-border"
            : "bg-ai-surface/60 text-ai-muted border-ai-border/50"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : hasMultipleSections ? (
          <div className="space-y-2">
            {sections!.map((sec, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection(i)}
                  className="w-full flex items-center justify-between gap-2 py-1.5 text-left text-ai-glow/90 text-xs font-medium"
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
                      <p className="whitespace-pre-wrap break-words text-ai-muted pt-0.5 pb-1">
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
              {collapsed
                ? message.content.slice(0, COLLAPSE_THRESHOLD) + "…"
                : message.content}
            </p>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="mt-2 flex items-center gap-1 text-[10px] text-ai-glow/80 hover:text-ai-glow font-medium"
            >
              {collapsed ? (
                <>Show more <ChevronDown className="h-3 w-3" /></>
              ) : (
                <>Show less <ChevronUp className="h-3 w-3" /></>
              )}
            </button>
          </>
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
      {!isUser && message.suggestions && message.suggestions.length > 0 && !loading && (
        <div className="flex flex-wrap gap-1.5 max-w-[92%]">
          {message.suggestions.slice(0, 4).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggestionClick(s)}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-ai-glow/10 text-ai-glow border border-ai-border/50 hover:bg-ai-glow/20 transition-colors duration-150"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

