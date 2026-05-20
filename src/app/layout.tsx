import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { getPublicSiteUrl } from "@/data/siteMeta";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteUrl = getPublicSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Issac Sunny | AI Engineer & Research Portfolio",
    template: "%s | Issac Sunny",
  },
  description:
    "AI Engineer portfolio — Behavioral Insider Threat Detection, Transformer-LSTM, Salesforce, ML & Full-Stack. G10X | Christ College of Engineering.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Issac Sunny",
    title: "Issac Sunny | AI Engineer & Research Portfolio",
    description:
      "Research, case studies, on-device portfolio assistant, lab notebook, and machine-readable /api/portfolio.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Issac Sunny | AI Engineer & Research Portfolio",
    description:
      "AI/ML portfolio — insider-threat research, systems design, and practical full-stack delivery.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased noise-overlay min-h-screen bg-ai-bg`}
        suppressHydrationWarning
      >
        <Script
          id="portfolio-prefs-sync"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='portfolio_simple_mode';var simple=localStorage.getItem(k)==='1';var reduce=false;try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}if(simple||reduce){document.documentElement.setAttribute('data-simple-mode','1');}else{document.documentElement.removeAttribute('data-simple-mode');}}catch(e){}})();`,
          }}
        />
        <JsonLd />
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        {children}
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
