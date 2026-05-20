import { NextResponse } from "next/server";
import { preflightResponse, withApiCors } from "@/lib/apiRouteCors";
import { normalizeOpenAiApiKey } from "@/lib/openaiKey";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_USER_CHARS = 4000;
const MAX_SOURCES = 5;
const MAX_EXCERPT_CHARS = 900;

type ChatPostBody = {
  userMessage?: string;
  interviewMode?: boolean;
  sources?: {
    source: string;
    category: string;
    score: number;
    excerpt: string;
  }[];
};

function json(req: Request, body: unknown, status = 200) {
  return withApiCors(req, NextResponse.json(body, { status }));
}

export function OPTIONS(request: Request) {
  return preflightResponse(request);
}

export async function GET(req: Request) {
  const configured = Boolean(normalizeOpenAiApiKey(process.env.OPENAI_API_KEY));
  return json(req, { openai: configured });
}

export async function POST(req: Request) {
  const apiKey = normalizeOpenAiApiKey(process.env.OPENAI_API_KEY);
  if (!apiKey) {
    return json(req, { error: "OpenAI is not configured on the server." }, 503);
  }

  let body: ChatPostBody;
  try {
    body = (await req.json()) as ChatPostBody;
  } catch {
    return json(req, { error: "Invalid JSON body." }, 400);
  }

  const userMessage = String(body.userMessage ?? "").trim();
  if (!userMessage || userMessage.length > MAX_USER_CHARS) {
    return json(req, { error: "Missing or oversized userMessage." }, 400);
  }

  const interviewMode = Boolean(body.interviewMode);
  const rawSources = Array.isArray(body.sources) ? body.sources : [];
  const sources = rawSources.slice(0, MAX_SOURCES).map((s) => ({
    source: String(s.source ?? "unknown").slice(0, 200),
    category: String(s.category ?? "general").slice(0, 120),
    score: typeof s.score === "number" && Number.isFinite(s.score) ? Math.max(0, Math.min(1, s.score)) : 0,
    excerpt: String(s.excerpt ?? "").slice(0, MAX_EXCERPT_CHARS),
  }));

  const contextBlocks = sources.map((s, i) => {
    const pct = Math.round(s.score * 100);
    return `### [${i + 1}] ${s.source} (${s.category}) ~${pct}%\n${s.excerpt || "(empty)"}`;
  });
  const rag = contextBlocks.join("\n\n").trim() || "(No excerpts.)";

  const system = interviewMode
    ? `Interview Issac AI — answer ONLY from excerpts below. If thin, say so; markdown OK; be concise.`
    : `Portfolio assistant — Issac Sunny. Use ONLY excerpts below; no invented facts; markdown OK; be concise.`;

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
        max_tokens: 650,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Excerpts:\n${rag}\n\nQuestion:\n${userMessage}`,
          },
        ],
      }),
    });

    const raw = await res.text();
    if (!res.ok) {
      console.error("OpenAI HTTP error", res.status, raw.slice(0, 280));
      return json(req, { error: "OpenAI request failed." }, 502);
    }

    let data: { choices?: { message?: { content?: string | null } }[] };
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      return json(req, { error: "Invalid JSON from OpenAI." }, 502);
    }

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return json(req, { error: "Empty model response." }, 502);
    }

    return json(req, { reply, model });
  } catch {
    return json(req, { error: "Network error calling OpenAI." }, 502);
  }
}
