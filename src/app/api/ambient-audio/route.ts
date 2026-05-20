import { NextResponse } from "next/server";

/**
 * Same-origin audio stream so `<audio src>` works without third-party hotlink / CORS issues.
 * Override upstream with AMBIENT_AUDIO_PROXY_URL (server env, not NEXT_PUBLIC).
 */
const DEFAULT_UPSTREAM =
  "https://archive.org/download/testmp3testfile/mpthreetest.mp3";

export async function GET() {
  const upstream =
    process.env.AMBIENT_AUDIO_PROXY_URL?.trim() || DEFAULT_UPSTREAM;

  try {
    const res = await fetch(upstream, {
      headers: { "User-Agent": "IssacPortfolio-Ambient/1.0" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Audio source unavailable" },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") || "audio/mpeg";

    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load ambient audio" },
      { status: 502 }
    );
  }
}
