"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RESUME_PDF_PUBLIC_PATH,
  RESUME_DOWNLOAD_FILENAME,
  downloadResumePdfAsset,
} from "@/lib/resumeAsset";
import { localResumeQuestionAnswer } from "@/lib/resumeLocalQa";
import { cn } from "@/lib/utils";
import { Download, Loader2, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ResumeStudyModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Ask about Issac’s résumé — experience, education, projects, or how to talk about them in an interview. " +
        "Answers follow the same profile as the rest of this site, with the PDF open beside you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    void fetch("/api/resume-chat", { method: "GET", cache: "no-store" })
      .then((r) => r.json())
      .then((j: { enabled?: boolean }) => setApiOk(Boolean(j.enabled)))
      .catch(() => setApiOk(false));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setMessages([
        {
          role: "assistant",
          content:
            "Ask about Issac’s résumé — experience, education, projects, or how to talk about them in an interview. " +
            "Answers follow the same profile as the rest of this site, with the PDF open beside you.",
        },
      ]);
      setInput("");
    }
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const nextMsgs: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMsgs);
    setLoading(true);

    let answered = false;
    if (apiOk) {
      try {
        const res = await fetch("/api/resume-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMsgs.map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        const j = (await res.json()) as { reply?: string };
        if (res.ok && j.reply?.trim()) {
          setMessages((prev) => [...prev, { role: "assistant", content: j.reply!.trim() }]);
          answered = true;
        }
      } catch {
        /* fall through to local */
      }
    }

    if (!answered) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: localResumeQuestionAnswer(text) },
      ]);
    }

    setLoading(false);
  }, [apiOk, input, loading, messages]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent-wheel
        className="!gap-0 !p-0 z-[120] flex max-h-[min(96dvh,920px)] w-[min(100vw,calc(100vw-0.75rem))] max-w-[min(1200px,calc(100vw-0.75rem))] flex-col overflow-hidden border border-ai-border bg-ai-bg p-0 sm:rounded-xl"
        style={{ touchAction: "manipulation" }}
      >
        <DialogHeader className="shrink-0 space-y-0 border-b border-ai-border px-3 py-2.5 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DialogTitle className="text-left text-sm text-white sm:text-base">
              Résumé — {RESUME_DOWNLOAD_FILENAME}
            </DialogTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-ai-border text-xs text-white hover:bg-ai-surface"
                onClick={() => void downloadResumePdfAsset()}
              >
                <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
                Download
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-xs text-ai-muted hover:text-white"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
          <p className="mt-1 text-[10px] text-ai-muted">
            Q&amp;A uses Issac’s résumé profile; the PDF stays in view for reference.
          </p>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="relative h-[38vh] shrink-0 border-b border-ai-border md:h-auto md:w-[48%] md:border-b-0 md:border-r">
            <iframe
              title="Resume PDF"
              src={`${RESUME_PDF_PUBLIC_PATH}#view=FitH`}
              className="absolute inset-0 h-full w-full border-0 bg-black/40"
            />
          </div>

          <div className="flex min-h-[42vh] flex-1 flex-col md:min-h-0">
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-2 scrollbar-thin sm:px-4"
            >
              {messages.map((m, i) => (
                <div
                  key={`${i}-${m.role}-${m.content.slice(0, 20)}`}
                  className={cn(
                    "max-w-[98%] rounded-lg border px-2.5 py-2 text-xs leading-relaxed sm:text-sm",
                    m.role === "user"
                      ? "ml-auto border-cyan-500/25 bg-cyan-500/10 text-white"
                      : "border-white/10 bg-white/[0.04] text-ai-muted"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-[11px] text-ai-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  …
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-ai-border p-2 sm:p-3">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && void send()}
                  placeholder="Ask about this résumé…"
                  disabled={loading}
                  className="min-w-0 flex-1 border-white/15 bg-black/35 text-sm"
                />
                <Button
                  type="button"
                  size="icon"
                  disabled={loading || !input.trim()}
                  onClick={() => void send()}
                  aria-label="Send"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
