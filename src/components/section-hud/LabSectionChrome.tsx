"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Games-playground style grid + scan line — place inside `relative` section. */
export function LabSectionGridBg({ className }: { className?: string }) {
  return (
    <>
      <div
        className={cn("pointer-events-none absolute inset-0 opacity-[0.32]", className)}
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(56,249,215,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125,211,252,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 90%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-cyan-400/22 to-transparent"
        aria-hidden
      />
    </>
  );
}

export function LabSectionIntro({
  eyebrow,
  title,
  description,
  descriptionSecondary,
  aside,
  titleClassName,
  className,
  titleId,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  descriptionSecondary?: ReactNode;
  aside?: ReactNode;
  /** Optional smaller title (e.g. long section names on mobile) */
  titleClassName?: string;
  /** Root layout overrides (e.g. centered contact header) */
  className?: string;
  /** For `aria-labelledby` on parent section */
  titleId?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
          {eyebrow}
        </p>
        <h2
          id={titleId ?? undefined}
          className={cn(
            "mb-3 bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-lime-200 bg-clip-text font-[var(--font-space-grotesk)] text-3xl font-black uppercase tracking-tight text-transparent drop-shadow-[0_0_24px_rgba(56,249,215,0.22)] md:text-5xl md:leading-tight",
            titleClassName
          )}
        >
          {title}
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-ai-muted md:text-base">{description}</p>
        {descriptionSecondary ? (
          <p className="mt-2 max-w-xl text-sm text-ai-muted/85">{descriptionSecondary}</p>
        ) : null}
      </div>
      {aside}
    </div>
  );
}

/** Glass status panel with shimmer (matches games “Lab status”). */
export function LabStatusPanel({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full shrink-0 overflow-hidden rounded-xl border border-cyan-400/25 bg-black/50 p-4 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:max-w-sm",
        className
      )}
    >
      <div className="games-hud-shimmer pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <p className="relative mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
        {label}
      </p>
      <div className="relative">{children}</div>
    </div>
  );
}

/** Footer strip: neon icons + caps labels (games playground parity). */
export function LabSectionFooterStrip({
  items,
}: {
  items: { icon: ReactNode; label: string }[];
}) {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-ai-muted sm:justify-between">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-2">
          {it.icon}
          {it.label}
        </span>
      ))}
    </div>
  );
}
