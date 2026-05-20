/**
 * Lightweight event helper — works with Plausible when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set
 * (see `layout.tsx`). Safe to call from the client only.
 */
export function trackPortfolioEvent(
  name: string,
  props?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  const plausible = (
    window as unknown as {
      plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
    }
  ).plausible;
  if (typeof plausible === "function") {
    plausible(name, props ? { props } : undefined);
  }
}
