/** Site-wide copy and freshness — update `lastContentUpdate` when you ship content changes. */
export const siteMeta = {
  lastContentUpdate: "2026-05-07",
} as const;

export function getPublicSiteUrl(): string {
  const raw =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function getCalendlyUrl(): string {
  return (
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CALENDLY_URL) || ""
  ).trim();
}
