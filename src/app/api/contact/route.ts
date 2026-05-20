import { NextResponse } from "next/server";

const MAX_LEN = 8000;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const name = typeof o.name === "string" ? o.name.trim().slice(0, 200) : "";
  const email = typeof o.email === "string" ? o.email.trim().slice(0, 320) : "";
  const message =
    typeof o.message === "string" ? o.message.trim().slice(0, MAX_LEN) : "";

  if (message.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Message must be at least 8 characters." },
      { status: 400 }
    );
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "portfolio-contact",
          name: name || undefined,
          email: email || undefined,
          message,
          at: new Date().toISOString(),
        }),
      });
      if (!r.ok) {
        return NextResponse.json(
          { ok: false, error: "Upstream webhook rejected the request." },
          { status: 502 }
        );
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: "Could not reach contact webhook." },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({
    ok: true,
    delivered: Boolean(webhook),
    note: webhook
      ? undefined
      : "No CONTACT_WEBHOOK_URL configured — message accepted for UX only; wire a webhook or form backend to persist.",
  });
}
