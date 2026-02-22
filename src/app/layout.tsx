import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Issac Sunny | AI Engineer & Research Portfolio",
  description:
    "AI Engineer portfolio — Behavioral Insider Threat Detection, Transformer-LSTM, Salesforce, ML & Full-Stack. G10X | Christ College of Engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased noise-overlay min-h-screen bg-ai-bg`}
      >
        {children}
      </body>
    </html>
  );
}
