"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, MessageSquare, FileText } from "lucide-react";
import { useLenisScroll } from "@/context/LenisContext";

type NavLink = { href: string; label: string };

const NAV_GROUPS: { label: string; links: NavLink[] }[] = [
  {
    label: "Work",
    links: [
      { href: "#hero", label: "Home" },
      { href: "#projects", label: "Projects" },
      { href: "#games", label: "Games" },
      { href: "#featured-systems", label: "Systems" },
      { href: "#experience", label: "Experience" },
    ],
  },
  {
    label: "Profile",
    links: [
      { href: "#research", label: "Research" },
      { href: "#lab", label: "Lab log" },
      { href: "#skills", label: "Skills" },
      { href: "#live-lab", label: "Embeddings" },
      { href: "#leadership", label: "Leadership" },
      { href: "#activities", label: "Activities" },
      { href: "#testimonials", label: "Testimonials" },
    ],
  },
    {
    label: "Connect",
    links: [
      { href: "#security-model", label: "Security" },
      { href: "#about-portfolio", label: "About" },
      { href: "#contact", label: "Contact" },
    ],
  },
];

const links: NavLink[] = NAV_GROUPS.flatMap((g) => g.links);

/** Sections linked from the nav menus (scroll-spy + dropdown active states). */
const SECTION_IDS = links.map((l) => l.href.slice(1));

/** Also track recruiter sections reached via Resume / Interview actions. */
const SCROLL_SPY_IDS = Array.from(new Set([...SECTION_IDS, "resume-tailor", "interview-issac"]));

function openInterviewAssistant() {
  window.dispatchEvent(
    new CustomEvent("portfolio-open-interview-mode", {
      detail: {},
    })
  );
}

/** Desktop Work menu: Home is already the brand link to #hero */
const WORK_MENU_LINKS = NAV_GROUPS[0].links.filter((l) => l.href !== "#hero");

const PARALLAX_STRENGTH = 6;
const SHRINK_SCROLL_THRESHOLD = 80;

/** Fluid width to tablet / laptop / desktop / ultrawide */
const CONTENT_MAX_WIDTH =
  "max-w-[min(80rem,calc(100vw-1.25rem))] 2xl:max-w-[min(96rem,calc(100vw-2rem))] 4xl:max-w-[min(112rem,calc(100vw-3rem))]";
const CONTENT_PADDING =
  "px-[max(0.5rem,min(3.5vw,1.25rem))] sm:px-[max(0.75rem,min(3vw,1.75rem))] md:px-[max(1rem,min(2.5vw,2rem))]";

type MenuKey = "work" | "profile" | "connect" | "resume";

function useActiveSection() {
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (SCROLL_SPY_IDS.includes(id)) setActiveId(id);
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      }
    );

    SCROLL_SPY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return activeId;
}

import type Lenis from "lenis";

function useScrollDockState(lenis: Lenis | null) {
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const prevY = useRef(0);

  useEffect(() => {
    const tick = (y: number) => {
      setDirection(y > prevY.current ? "down" : "up");
      prevY.current = y;
      setScrollY(y);
    };

    if (lenis) {
      tick(lenis.scroll);
      return lenis.on("scroll", () => tick(lenis.scroll));
    }

    tick(window.scrollY);
    const onWin = () => tick(window.scrollY);
    window.addEventListener("scroll", onWin, { passive: true });
    return () => window.removeEventListener("scroll", onWin);
  }, [lenis]);

  const isShrunk = scrollY > SHRINK_SCROLL_THRESHOLD && direction === "down";
  const blurAmount = Math.min(24, 12 + scrollY * 0.04);
  const bgOpacity = Math.min(0.85, 0.5 + scrollY * 0.002);

  return { scrollY, isShrunk, blurAmount, bgOpacity, direction };
}

function useMouseParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      /** Clamp Y so the dock never shifts upward under the OS / notch (was clipping the name). */
      const rawY = y * PARALLAX_STRENGTH;
      const clampedY = Math.max(-1.5, Math.min(2.5, rawY));
      setOffset({
        x: Math.max(-4, Math.min(4, x * PARALLAX_STRENGTH)),
        y: clampedY,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return offset;
}

function groupHasActive(links: NavLink[], activeId: string) {
  return links.some((l) => l.href.slice(1) === activeId);
}

function NavDesktopDropdown({
  menuKey,
  label,
  links: menuLinks,
  openMenu,
  setOpenMenu,
  activeId,
  scrollToSection,
}: {
  menuKey: MenuKey;
  label: string;
  links: NavLink[];
  openMenu: MenuKey | null;
  setOpenMenu: (k: MenuKey | null) => void;
  activeId: string;
  scrollToSection: (href: string) => void;
}) {
  const open = openMenu === menuKey;
  const containerRef = useRef<HTMLDivElement>(null);
  const activeInGroup = groupHasActive(menuLinks, activeId);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, setOpenMenu]);

  const toggle = () => {
    setOpenMenu(open ? null : menuKey);
  };

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1 rounded-lg py-2 pl-3 pr-2 text-sm font-medium transition-colors ${
          activeInGroup || open
            ? "text-ai-glow bg-ai-glow/10 border border-ai-border/50"
            : "text-ai-muted hover:text-white border border-transparent hover:border-ai-border/40"
        }`}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 opacity-80 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-[calc(100%+10px)] z-[100] min-w-[220px] rounded-xl border border-ai-border/80 bg-ai-bg py-2 shadow-2xl shadow-black/60 ring-1 ring-white/10 backdrop-blur-xl"
          >
            {menuLinks.map((link) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  role="menuitem"
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                    setOpenMenu(null);
                  }}
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-ai-glow/15 text-ai-glow font-medium"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavResumeDropdown({
  openMenu,
  setOpenMenu,
  onPreviewResume,
  onDownloadResume,
  scrollToSection,
  activeId,
}: {
  openMenu: MenuKey | null;
  setOpenMenu: (k: MenuKey | null) => void;
  onPreviewResume?: () => void;
  onDownloadResume?: () => void;
  scrollToSection: (href: string) => void;
  activeId: string;
}) {
  const open = openMenu === "resume";
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeToolsActive = activeId === "resume-tailor";

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, setOpenMenu]);

  const toggle = () => setOpenMenu(open ? null : "resume");

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1 rounded-lg py-2 pl-3 pr-2 text-sm font-medium transition-colors ${
          open || resumeToolsActive
            ? "text-ai-glow bg-ai-glow/10 border border-ai-border/50"
            : "text-ai-muted hover:text-white border border-transparent hover:border-ai-border/40"
        }`}
      >
        Resume
        <ChevronDown
          className={`h-3.5 w-3.5 opacity-80 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+10px)] z-[100] min-w-[220px] rounded-xl border border-ai-border/80 bg-ai-bg py-2 shadow-2xl shadow-black/60 ring-1 ring-white/10 backdrop-blur-xl"
          >
            {onPreviewResume && (
              <button
                type="button"
                role="menuitem"
                className="block w-full px-4 py-2.5 text-left text-sm text-ai-glow hover:bg-white/10 transition-colors"
                onClick={() => {
                  onPreviewResume();
                  setOpenMenu(null);
                }}
              >
                Preview résumé & Q&A
              </button>
            )}
            {onDownloadResume && (
              <button
                type="button"
                role="menuitem"
                className="block w-full px-4 py-2.5 text-left text-sm text-white/90 hover:bg-white/10 transition-colors"
                onClick={() => {
                  onDownloadResume();
                  setOpenMenu(null);
                }}
              >
                Download PDF
              </button>
            )}
            {(onPreviewResume || onDownloadResume) && (
              <div className="my-1.5 h-px bg-white/10" aria-hidden />
            )}
            <button
              type="button"
              role="menuitem"
              className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                resumeToolsActive
                  ? "bg-violet-500/15 text-violet-100 font-medium"
                  : "text-white/90 hover:bg-white/10"
              }`}
              onClick={() => {
                scrollToSection("#resume-tailor");
                setOpenMenu(null);
              }}
            >
              <FileText className="h-4 w-4 shrink-0 text-violet-300" aria-hidden />
              AI résumé tailor
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type NavProps = {
  onPreviewResume?: () => void;
  onDownloadResume?: () => void;
};

export default function Nav({
  onPreviewResume,
  onDownloadResume,
}: NavProps = {}) {
  const activeId = useActiveSection();
  const lenisApi = useLenisScroll();
  const { isShrunk, blurAmount, bgOpacity } = useScrollDockState(lenisApi?.lenis ?? null);
  const parallax = useMouseParallax();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const scrollToSection = useCallback(
    (href: string) => {
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el && lenisApi?.lenis) {
        lenisApi.lenis.scrollTo(el, { offset: -96, duration: 1.05 });
      } else if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMobileOpen(false);
    },
    [lenisApi?.lenis]
  );

  useEffect(() => {
    if (!openMenu) return;
    const onScroll = () => setOpenMenu(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [openMenu]);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  const desktopGroups = useMemo(
    () => [
      { key: "work" as const, label: NAV_GROUPS[0].label, links: WORK_MENU_LINKS },
      { key: "profile" as const, label: NAV_GROUPS[1].label, links: NAV_GROUPS[1].links },
      { key: "connect" as const, label: NAV_GROUPS[2].label, links: NAV_GROUPS[2].links },
    ],
    []
  );

  return (
    <>
      {/* Mobile: always-visible top bar (menu + brand) — fixed above page scroll */}
      <div className="pointer-events-none md:hidden fixed inset-x-0 top-0 z-[100]">
      <div
        className="pointer-events-auto flex items-center justify-between gap-2 border-b border-ai-border/70 bg-ai-bg/95 px-[max(0.75rem,env(safe-area-inset-left))] py-2 pr-[max(0.75rem,env(safe-area-inset-right))] pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] shadow-lg shadow-black/40 backdrop-blur-xl"
      >
          <a
            href="#hero"
            aria-label="Issac Sunny — home"
            className="min-w-0 truncate text-sm font-bold text-white hover:text-ai-glow transition-colors"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#hero");
            }}
          >
            Issac.
          </a>
          <motion.button
            type="button"
            className="command-dock-fab flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ai-border bg-ai-surface text-ai-glow shadow-md"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-dialog"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            animate={{ rotate: mobileOpen ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </motion.button>
        </div>
      </div>

      <motion.header
        className={`fixed left-0 right-0 z-50 pointer-events-none hidden md:block pt-[max(0.5rem,env(safe-area-inset-top,0px))] ${CONTENT_PADDING}`}
        style={{ top: 0 }}
        initial={{ opacity: 0, y: -8 }}
        animate={{
          opacity: 1,
          x: parallax.x,
          y: parallax.y,
        }}
        transition={{
          opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          y: { type: "spring", stiffness: 150, damping: 20 },
          x: { type: "spring", stiffness: 150, damping: 20 },
        }}
      >
        <div className={`${CONTENT_MAX_WIDTH} mx-auto flex justify-center pt-3`}>
          <motion.nav
            aria-label="Primary"
            className="command-dock command-dock-constrained lab-command-dock pointer-events-auto flex flex-nowrap items-center justify-center gap-2 rounded-full"
            initial={false}
            animate={{
              paddingTop: isShrunk ? 8 : 10,
              paddingBottom: isShrunk ? 8 : 10,
              paddingLeft: 18,
              paddingRight: 18,
              scale: isShrunk ? 0.98 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              backdropFilter: `blur(${blurAmount}px)`,
              WebkitBackdropFilter: `blur(${blurAmount}px)`,
              backgroundColor: `rgba(10, 10, 18, ${bgOpacity})`,
              overflow: "visible",
            }}
          >
            <div className="command-dock-noise" aria-hidden />
            <div className="command-dock-border" aria-hidden />
            <div className="command-dock-nav-row relative z-10 flex flex-nowrap items-center justify-center gap-2 min-w-0">
              <a
                href="#hero"
                aria-label="Issac Sunny — home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#hero");
                }}
                className={`text-sm font-bold shrink-0 py-2 px-2 rounded-lg transition-colors ${
                  activeId === "hero"
                    ? "text-ai-glow"
                    : "text-white hover:text-ai-glow"
                }`}
              >
                Issac.
              </a>
              <span
                className="h-5 w-px bg-ai-border/50 shrink-0"
                aria-hidden
              />
              {desktopGroups.map((g) => (
                <NavDesktopDropdown
                  key={g.key}
                  menuKey={g.key}
                  label={g.label}
                  links={g.links}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  activeId={activeId}
                  scrollToSection={scrollToSection}
                />
              ))}
              <NavResumeDropdown
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                onPreviewResume={onPreviewResume}
                onDownloadResume={onDownloadResume}
                scrollToSection={scrollToSection}
                activeId={activeId}
              />
              <a
                href="#about-portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#about-portfolio");
                }}
                className={`shrink-0 rounded-lg border py-2 px-3 text-sm font-medium transition-colors ${
                  activeId === "about-portfolio"
                    ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-100"
                    : "border-transparent text-ai-muted hover:border-ai-border/40 hover:text-white"
                }`}
              >
                About
              </a>
              <button
                type="button"
                onClick={() => {
                  openInterviewAssistant();
                }}
                className={`flex items-center gap-1.5 shrink-0 rounded-lg border py-2 px-3 text-sm font-medium transition-colors ${
                  activeId === "interview-issac"
                    ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-100"
                    : "border-transparent text-ai-muted hover:border-ai-border/40 hover:text-white"
                }`}
                title="Open the portfolio assistant in Interview mode"
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                Interview me
              </button>
            </div>
          </motion.nav>
        </div>
      </motion.header>

      <div className="md:hidden">
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm pointer-events-auto"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Site sections"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                id="mobile-nav-dialog"
                data-lenis-prevent-wheel
                className="pointer-events-auto fixed bottom-0 left-0 right-0 z-[95] max-h-[min(78vh,560px)] overflow-y-auto rounded-t-2xl border border-ai-border border-b-0 bg-ai-bg/98 backdrop-blur-xl shadow-2xl px-4 pt-3 pb-[max(2rem,env(safe-area-inset-bottom,0px))]"
              >
                <div className="flex items-center justify-between border-b border-ai-border/60 pb-3 mb-3">
                  <span className="text-sm font-semibold text-white">
                    Navigate
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-2 text-ai-muted hover:text-white hover:bg-ai-surface"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-5 pb-4">
                  {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-ai-muted/90 mb-2">
                        {group.label}
                      </p>
                      <div className="flex flex-col gap-1">
                        {group.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection(link.href);
                            }}
                            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                              activeId === link.href.slice(1)
                                ? "bg-ai-glow/15 text-ai-glow border border-ai-border/50"
                                : "text-white/90 hover:bg-ai-surface border border-transparent"
                            }`}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                  {(onPreviewResume ?? onDownloadResume) && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-ai-border/50">
                      {onPreviewResume && (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileOpen(false);
                            onPreviewResume();
                          }}
                          className="rounded-lg border border-ai-border px-3 py-2.5 text-sm font-medium text-ai-glow hover:bg-ai-glow/10"
                        >
                          Preview résumé & Q&A
                        </button>
                      )}
                      {onDownloadResume && (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileOpen(false);
                            onDownloadResume();
                          }}
                          className="rounded-lg border border-ai-border px-3 py-2.5 text-sm font-medium text-white hover:bg-ai-surface"
                        >
                          Download Resume
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col gap-2 pt-2 border-t border-ai-border/50">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        scrollToSection("#resume-tailor");
                      }}
                      className={`w-full rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        activeId === "resume-tailor"
                          ? "border-violet-400/50 bg-violet-500/15 text-violet-50"
                          : "border-violet-400/30 bg-violet-500/10 text-violet-100 hover:bg-violet-500/15"
                      }`}
                    >
                      AI résumé tailor
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        openInterviewAssistant();
                      }}
                      className={`w-full rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        activeId === "interview-issac"
                          ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-50"
                          : "border-cyan-400/35 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/15"
                      }`}
                    >
                      Interview me
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
