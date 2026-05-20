import { cn } from "@/lib/utils";

/**
 * Shared vertical rhythm + horizontal gutter for main sections (hero → contact).
 * Use the outer class on `<section>` and the inner class on the first content wrapper
 * (after optional `LabSectionGridBg`).
 */
export const SITE_SECTION_V = "py-20 md:py-24 lg:py-28";

export const SITE_SECTION_OUTER = "relative overflow-x-hidden";

/** Default content width — one column feel across the page. */
export const SITE_SECTION_INNER = "relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

/** Forms / dense copy (e.g. contact) — still same horizontal padding as other sections. */
export const SITE_SECTION_INNER_NARROW = "relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8";

export function siteSectionClass(...extra: (string | undefined)[]) {
  return cn(SITE_SECTION_OUTER, SITE_SECTION_V, ...extra);
}
