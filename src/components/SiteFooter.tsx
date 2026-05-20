import Link from "next/link";
import { getPublicSiteUrl, siteMeta } from "@/data/siteMeta";
import { LabSectionGridBg } from "@/components/section-hud/LabSectionChrome";

export default function SiteFooter() {
  const base = getPublicSiteUrl();

  return (
    <footer className="relative overflow-hidden border-t border-ai-border/60 bg-ai-bg/80 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden>
        <LabSectionGridBg />
      </div>
      <div className="relative z-10 mx-auto flex max-w-[min(80rem,calc(100vw-1.5rem))] flex-col gap-6 px-[max(0.75rem,min(3vw,1.5rem))] py-10 text-sm text-ai-muted sm:px-[max(1rem,min(3vw,2rem))] md:flex-row md:items-center md:justify-between 2xl:max-w-[min(96rem,calc(100vw-2rem))]">
        <div>
          <p className="text-white/90 font-medium">Issac Sunny</p>
          <p className="mt-1 text-xs">
            Content last reviewed{" "}
            <time dateTime={siteMeta.lastContentUpdate}>{siteMeta.lastContentUpdate}</time>
            . Resume preview and download use the PDF in <code className="font-mono text-white/70">public/</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <Link
            href="/api/portfolio"
            className="text-ai-glow hover:underline"
            prefetch={false}
          >
            Machine-readable portfolio (JSON)
          </Link>
          <a href={`${base}/#security-model`} className="text-ai-glow hover:underline">
            Site threat model
          </a>
          <a
            href="https://github.com/"
            className="text-ai-muted hover:text-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            Contribute via GitHub (link your repo)
          </a>
        </div>
      </div>
    </footer>
  );
}
