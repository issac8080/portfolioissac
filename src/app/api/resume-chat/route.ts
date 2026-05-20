import { NextResponse } from "next/server";
import { preflightResponse, withApiCors } from "@/lib/apiRouteCors";
import { buildResumeStudyContext } from "@/lib/resumeStudyContext";
import { normalizeOpenAiApiKey } from "@/lib/openaiKey";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_CONTEXT_CHARS = 10_000;
const MAX_TURNS = 16;
const MAX_MESSAGE_CHARS = 3000;

type Turn = { role?: string; content?: string };

function json(req: Request, body: unknown, status = 200) {
  return withApiCors(req, NextResponse.json(body, { status }));
}

export function OPTIONS(request: Request) {
  return preflightResponse(request);
}

export async function GET(req: Request) {
  const ok = Boolean(normalizeOpenAiApiKey(process.env.OPENAI_API_KEY));
  return json(req, { enabled: ok });
}

export async function POST(req: Request) {
  const apiKey = normalizeOpenAiApiKey(process.env.OPENAI_API_KEY);
  if (!apiKey) {
    return json(req, { error: "Add OPENAI_API_KEY to the server environment." }, 503);
  }

  let body: { messages?: Turn[] };
  try {
    body = (await req.json()) as { messages?: Turn[] };
  } catch {
    return json(req, { error: "Invalid JSON body." }, 400);
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const turns = rawMessages
    .slice(-MAX_TURNS)
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content ?? "").slice(0, MAX_MESSAGE_CHARS),
    }))
    .filter((m) => m.content.trim().length > 0);

  const firstUser = turns.findIndex((t) => t.role === "user");
  const trimmed = firstUser >= 0 ? turns.slice(firstUser) : turns;

  if (trimmed.length === 0 || trimmed[trimmed.length - 1].role !== "user") {
    return json(req, { error: "Last message must be a non-empty user message." }, 400);
  }

  let resumeBlock = buildResumeStudyContext();
  if (resumeBlock.length > MAX_CONTEXT_CHARS) {
    resumeBlock = resumeBlock.slice(0, MAX_CONTEXT_CHARS) + "\n…(truncated)";
  }

  const system =
    "Coach for Issac Sunny’s résumé. Facts ONLY from CONTEXT below; if missing, say so. Short markdown.\n\nCONTEXT:\n" +
    resumeBlock;

  const model = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.25,
        max_tokens: 700,
        messages: [{ role: "system", content: system }, ...trimmed],
      }),
    });

    const raw = await res.text();
    if (!res.ok) {
      console.error("OpenAI resume-chat error", res.status, raw.slice(0, 280));
      return json(req, { error: "OpenAI request failed." }, 502);
    }

    const data = JSON.parse(raw) as { choices?: { message?: { content?: string | null } }[] };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return json(req, { error: "Empty model response." }, 502);
    }

    return json(req, { reply, model });
  } catch {
    return json(req, { error: "Network error calling OpenAI." }, 502);
  }
}
