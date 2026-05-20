import { NextResponse } from "next/server";

/** Allow browser clients that send `Origin` (e.g. dev on localhost or prod site URL). */
export function allowedRequestOrigin(originHeader: string | null): string | null {
  if (!originHeader) return null;
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "").trim();
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(originHeader)) return originHeader;
  if (site && originHeader === site) return originHeader;
  return null;
}

export function withApiCors(request: Request, response: NextResponse): NextResponse {
  const origin = allowedRequestOrigin(request.headers.get("origin"));
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.append("Vary", "Origin");
  }
  return response;
}

export function preflightResponse(request: Request): NextResponse {
  return withApiCors(request, new NextResponse(null, { status: 204 }));
}
