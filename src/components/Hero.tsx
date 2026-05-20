"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import {
  FolderOpen,
  Send,
  HeartHandshake,
  Sparkles,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { openPortfolioIntelligenceFullscreen } from "@/lib/portfolioIntelligenceEvents";
import { cn } from "@/lib/utils";
import { useExperiencePreferences } from "@/context/ExperiencePreferences";
import { contact, heroTagline } from "@/data/portfolio";

const easeLux = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { effectiveMinimalUI } = useExperiencePreferences();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] min-h-screen items-center justify-center overflow-x-clip overflow-y-visible py-[max(4rem,env(safe-area-inset-bottom))] max-md:scroll-mt-[calc(3.25rem+env(safe-area-inset-top,0px))]"
      aria-labelledby="hero-heading"
    >
      {!effectiveMinimalUI && (
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -left-[20%] top-[-10%] h-[min(85vh,640px)] w-[min(85vw,640px)] rounded-full bg-cyan-500/[0.12] blur-[100px]" />
          <div className="absolute -right-[15%] bottom-[-5%] h-[min(70vh,520px)] w-[min(70vw,520px)] rounded-full bg-fuchsia-600/[0.1] blur-[90px]" />
          <div className="absolute left-1/2 top-[38%] h-[min(55vh,420px)] w-[min(90vw,520px)] -translate-x-1/2 rounded-full bg-violet-600/[0.09] blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(56,249,215,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56,249,215,0.45) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 z-[19] bg-gradient-to-b from-[#020403]/95 via-[#050a0a]/45 to-[#010202]/96" />
      <div className="relative z-[30] isolate mx-auto w-full max-w-[min(80rem,calc(100%-1rem))] px-[clamp(0.75rem,4vw,2.25rem)] 2xl:max-w-[min(90rem,calc(100%-2rem))] 4xl:max-w-[min(100rem,calc(100%-3rem))]">
        <div className="mx-auto flex max-w-3xl flex-col items-center pb-6 pt-2 text-center sm:pb-8 sm:pt-4 lg:pb-10 lg:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: easeLux }}
            className="flex min-w-0 w-full flex-col items-center text-center"
          >
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-300/90 sm:mb-2 sm:text-[11px] sm:tracking-[0.35em]">
              Hello, I&apos;m
            </p>
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.06, ease: easeLux }}
              className="hero-mockup-title mx-auto max-w-[20ch] text-balance font-[var(--font-space-grotesk)] text-[clamp(2.25rem,8vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-white sm:max-w-none md:text-6xl lg:text-7xl"
            >
              <span className="text-white">Issac </span>
              <span className="bg-gradient-to-r from-sky-300 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(167,139,250,0.35)]">
                Sunny
              </span>
            </motion.h1>
            <p className="mt-3 max-w-xl text-[13px] font-medium leading-relaxed text-white/60 sm:mt-4 sm:text-sm md:text-base lg:text-lg">
              {heroTagline.split("|").map((part, i, arr) => (
                <span key={part}>
                  {part.trim()}
                  {i < arr.length - 1 && (
                    <span className="mx-1.5 text-cyan-400/45 sm:mx-2" aria-hidden>
                      |
                    </span>
                  )}
                </span>
              ))}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: easeLux }}
              className="mt-5 flex w-full max-w-[36rem] flex-col items-center gap-4 sm:mt-6"
            >
              <p className="text-pretty text-[15px] font-medium leading-[1.55] text-white/85 sm:text-base lg:text-lg">
                Introducing <span className="font-semibold text-cyan-200/95">Portfolio Intelligence</span>{" "}
                — the first feature on this site. Ask questions grounded in this portfolio&apos;s knowledge,
                privately in your browser.
              </p>
              <motion.button
                type="button"
                aria-label="Open Portfolio Intelligence in fullscreen"
                onClick={() => openPortfolioIntelligenceFullscreen()}
                whileHover={
                  reduceMotion ? undefined : { scale: 1.02, transition: { type: "spring", stiffness: 420, damping: 24 } }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-full border border-fuchsia-400/50 bg-gradient-to-r from-fuchsia-600/35 via-violet-600/28 to-cyan-600/28 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(217,70,239,0.22)] sm:gap-2 sm:px-5 sm:py-3 sm:text-[15px]",
                  "transition-[box-shadow,border-color,transform] duration-200 hover:border-fuchsia-300/70 hover:shadow-[0_0_28px_rgba(34,211,238,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020403]"
                )}
              >
                <Sparkles className="h-4 w-4 shrink-0 text-fuchsia-100 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
                <span className="whitespace-nowrap">Explore Portfolio Intelligence</span>
                <ChevronRight className="h-4 w-4 shrink-0 opacity-90 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.6, ease: easeLux }}
              className="mt-6 flex w-full max-w-xl flex-wrap justify-center gap-2 sm:mt-7 sm:gap-3"
            >
              <GhostIconLink href="#projects" icon={<FolderOpen className="w-4 h-4" aria-hidden />}>
                View Projects
              </GhostIconLink>
              <GhostIconLink href="#skills" icon={<BookOpen className="w-4 h-4" aria-hidden />}>
                Skills
              </GhostIconLink>
              <GhostIconLink href="#contact" icon={<Send className="w-4 h-4" aria-hidden />}>
                Get in Touch
              </GhostIconLink>
              <GhostIconLink
                href={`mailto:${contact.email}?subject=Opportunity%20%E2%80%94%20Issac%20Sunny`}
                icon={<HeartHandshake className="w-4 h-4" aria-hidden />}
              >
                Hire / collaborate
              </GhostIconLink>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-[32] flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden
      >
        {!reduceMotion && (
          <>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="lab-glow-breathe flex h-10 w-6 items-start justify-center rounded-full border-2 border-ai-glow/50 p-2"
            >
              <motion.div className="h-2 w-1 rounded-full bg-ai-glow" />
            </motion.div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-ai-glow/70 sm:text-xs">
              Scroll Down
            </span>
          </>
        )}
      </motion.div>
    </section>
  );
}

function GhostIconLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.12);
    y.set((e.clientY - cy) * 0.12);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={reduceMotion ? undefined : { x, y }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -3, scale: 1.02, transition: { type: "spring", stiffness: 380, damping: 22 } }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className="inline-flex min-h-[44px] min-w-0 max-w-full items-center justify-center gap-2 rounded-xl border border-ai-glow/45 bg-black/25 px-4 py-2.5 text-xs font-medium text-ai-glow backdrop-blur-md transition-[box-shadow,border-color,transform] duration-300 hover:border-ai-glow/75 hover:bg-ai-glow/10 hover:shadow-[0_12px_40px_rgba(0,255,136,0.22),0_0_0_1px_rgba(0,255,136,0.15)] will-change-transform sm:px-5 sm:py-3 sm:text-sm"
    >
      {icon}
      {children}
    </motion.a>
  );
}
