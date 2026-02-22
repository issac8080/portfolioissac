"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Minus, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  loadKnowledgeEmbeddings,
  search,
  formatReply,
  isReady,
} from "@/lib/embeddingSearch";
import { cn } from "@/lib/utils";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

const WELCOME =
  "Hi! I'm your portfolio assistant. I answer questions about Issac's projects (Urban Place, AuraShop, Code Dependency Analyzer, Initra, Autonomous Returns), experience (G10X, AI Engineer Intern, IEEE Chair), research (Behavioral Insider Threat Detection), and skills (Python, ML, Salesforce, MERN, Cloud). Ask me anything—no API key needed, everything runs in your browser.";

export default function PortfolioChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      if (!isReady()) {
        await loadKnowledgeEmbeddings();
      }
      const results = await search(text, 3);
      const reply = formatReply(results);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "Something went wrong. Make sure you're online for the first load (to fetch the model and knowledge), then you can try again or ask differently.",
          timestamp: Date.now(),
        },
      ]);
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
            className="fixed bottom-6 right-6 z-[70] w-[calc(100vw-3rem)] max-w-md rounded-2xl border border-ai-border bg-ai-bg/95 shadow-2xl backdrop-blur-xl md:bottom-8 md:right-8"
          >
            <div className="flex items-center justify-between border-b border-ai-border px-4 py-3">
              <span className="font-semibold text-white">Portfolio Assistant</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-ai-muted hover:text-white"
                aria-label="Minimize chat"
              >
                <Minus className="h-5 w-5" />
              </Button>
            </div>

            <div
              ref={scrollRef}
              className="h-[320px] md:h-[380px] overflow-y-auto overflow-x-hidden px-4 py-3 scrollbar-thin"
            >
              <div className="space-y-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {loading && <TypingIndicator />}
              </div>
            </div>

            <div className="border-t border-ai-border p-3">
              {modelLoading && (
                <p className="mb-2 flex items-center gap-2 text-xs text-ai-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading AI model and knowledge base (one-time)…
                </p>
              )}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask about projects, experience, research, skills…"
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
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
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full border border-ai-border bg-ai-glow/20 text-ai-glow shadow-lg backdrop-blur-sm hover:bg-ai-glow/30 hover:shadow-[0_0_25px_rgba(0,255,136,0.3)] md:bottom-8 md:right-8"
            aria-label="Open portfolio chat"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-ai-glow/20 text-white border border-ai-border"
            : "bg-ai-surface/60 text-ai-muted border border-ai-border/50"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start"
    >
      <div className="flex gap-1.5 rounded-2xl bg-ai-surface/60 border border-ai-border/50 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-ai-glow"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
