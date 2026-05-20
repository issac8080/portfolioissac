/** Dispatched to open the portfolio assistant in fullscreen (see `PortfolioChatbot`). */
export const PORTFOLIO_OPEN_INTELLIGENCE_FULLSCREEN = "portfolio-open-intelligence-fullscreen" as const;

export function openPortfolioIntelligenceFullscreen(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PORTFOLIO_OPEN_INTELLIGENCE_FULLSCREEN));
}
