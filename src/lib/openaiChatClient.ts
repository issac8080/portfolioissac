import type { RetrievalSource } from "@/types/portfolioIntelligence";

export type ChatAvailability = { openai: boolean };

export async function getChatAvailability(): Promise<ChatAvailability> {
  try {
    const res = await fetch("/api/chat", { method: "GET", cache: "no-store" });
    if (!res.ok) return { openai: false };
    const j = (await res.json()) as Partial<ChatAvailability>;
    return { openai: Boolean(j.openai) };
  } catch {
    return { openai: false };
  }
}

export async function requestOpenAiRagReply(args: {
  userMessage: string;
  interviewMode: boolean;
  sources: RetrievalSource[];
}): Promise<{ reply: string; model?: string } | null> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage: args.userMessage,
        interviewMode: args.interviewMode,
        sources: args.sources,
      }),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { reply?: string; model?: string };
    if (!j.reply?.trim()) return null;
    return { reply: j.reply.trim(), model: j.model };
  } catch {
    return null;
  }
}
