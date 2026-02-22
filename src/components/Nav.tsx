"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#games", label: "Games" },
  { href: "#featured-systems", label: "Systems" },
  { href: "#experience", label: "Experience" },
  { href: "#research", label: "Research" },
  { href: "#skills", label: "Skills" },
  { href: "#leadership", label: "Leadership" },
  { href: "#contact", label: "Contact" },
];

const SECTION_IDS = links.map((l) => l.href.slice(1));

const PARALLAX_STRENGTH = 6;
const SHRINK_SCROLL_THRESHOLD = 80;

/** Max width aligned with main content grid (e.g. max-w-7xl sections) */
const CONTENT_MAX_WIDTH = "max-w-7xl";
const CONTENT_PADDING = "px-6";

function useActiveSection() {
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (SECTION_IDS.includes(id)) setActiveId(id);
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return activeId;
}

function useScrollDockState() {
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const prevY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setDirection(y > prevY.current ? "down" : "up");
      prevY.current = y;
      setScrollY(y);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isShrunk = scrollY > SHRINK_SCROLL_THRESHOLD && direction === "down";
  const blurAmount = Math.min(24, 12 + scrollY * 0.04);
  const bgOpacity = Math.min(0.85, 0.5 + scrollY * 0.002);

  return { scrollY, isShrunk, blurAmount, bgOpacity, direction };
}

function useMouseParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setOffset({
        x: x * PARALLAX_STRENGTH,
        y: y * PARALLAX_STRENGTH,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return offset;
}

/** Single nav link with active pill positioned relative to this item (absolute under label) */
function NavItemDesktop({
  href,
  label,
  isActive,
  onNavigate,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onNavigate();
    },
    [onNavigate]
  );

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="command-dock-item relative flex items-center justify-center rounded-lg py-2 px-3 text-xs font-medium whitespace-nowrap"
      initial={false}
      animate={{
        scale: hover ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Active pill: absolute relative to this nav item, directly under label */}
      {isActive && (
        <motion.span
          className="command-dock-active-pill"
          layoutId="activePill"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <span
        className={`relative z-10 transition-colors duration-200 ${
          isActive
            ? "text-ai-glow font-medium command-dock-text-glow"
            : "text-ai-muted hover:text-white"
        } ${hover ? "command-dock-text-glow" : ""}`}
      >
        {label}
      </span>
    </motion.a>
  );
}

type NavProps = {
  onPreviewResume?: () => void;
  onDownloadResume?: () => void;
};

export default function Nav({ onPreviewResume, onDownloadResume }: NavProps = {}) {
  const activeId = useActiveSection();
  const { isShrunk, blurAmount, bgOpacity } = useScrollDockState();
  const parallax = useMouseParallax();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = useCallback((href: string) => {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  }, []);

  return (
    <>
      {/* Desktop: layout-constrained floating command dock (same grid as content) */}
      <motion.header
        className={`fixed left-0 right-0 z-50 pointer-events-none hidden md:block ${CONTENT_PADDING}`}
        style={{ top: 24 }}
        initial={false}
        animate={{
          x: parallax.x,
          y: parallax.y,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <div className={`${CONTENT_MAX_WIDTH} mx-auto flex justify-center`}>
          <motion.nav
            className="command-dock command-dock-constrained pointer-events-auto flex flex-nowrap items-center justify-center gap-2 rounded-2xl overflow-hidden"
            initial={false}
            animate={{
              paddingTop: isShrunk ? 6 : 8,
              paddingBottom: isShrunk ? 6 : 8,
              paddingLeft: 16,
              paddingRight: 16,
              scale: isShrunk ? 0.98 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              backdropFilter: `blur(${blurAmount}px)`,
              WebkitBackdropFilter: `blur(${blurAmount}px)`,
              backgroundColor: `rgba(10, 10, 18, ${bgOpacity})`,
            }}
          >
            <div className="command-dock-noise" aria-hidden />
            <div className="command-dock-border" aria-hidden />
            <div className="command-dock-nav-row relative z-10 flex flex-nowrap items-center justify-center gap-2 min-w-0 overflow-x-auto">
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#hero");
                }}
                className="text-xs font-bold text-white hover:text-ai-glow transition-colors shrink-0 py-2 px-2 rounded-lg"
              >
                Issac Sunny
              </a>
              <span className="h-4 w-px bg-ai-border/60 shrink-0" aria-hidden />
              {links.map((link) => (
                <NavItemDesktop
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={activeId === link.href.slice(1)}
                  onNavigate={() => scrollToSection(link.href)}
                />
              ))}
              {(onPreviewResume ?? onDownloadResume) && (
                <>
                  <span className="h-4 w-px bg-ai-border/60 shrink-0" aria-hidden />
                  {onPreviewResume && (
                    <button
                      type="button"
                      onClick={onPreviewResume}
                      className="text-xs font-medium text-ai-muted hover:text-white hover:text-ai-glow transition-colors shrink-0 py-2 px-3 rounded-lg"
                    >
                      Preview Resume
                    </button>
                  )}
                  {onDownloadResume && (
                    <button
                      type="button"
                      onClick={onDownloadResume}
                      className="text-xs font-medium text-ai-muted hover:text-white hover:text-ai-glow transition-colors shrink-0 py-2 px-3 rounded-lg"
                    >
                      Download Resume
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.nav>
        </div>
      </motion.header>

      {/* Mobile: FAB + radial command wheel */}
      <div className="md:hidden fixed bottom-6 right-6 z-50 pointer-events-none">
        <div className="pointer-events-auto relative w-14 h-14">
          <AnimatePresence>
            {mobileOpen && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileOpen(false)}
                  style={{ width: 280, height: 280, left: -133, top: -133 }}
                />
                {links.map((link, i) => {
                  const angle = (i / links.length) * 2 * Math.PI - Math.PI / 2;
                  const r = 100;
                  const x = Math.cos(angle) * r;
                  const y = Math.sin(angle) * r;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="command-dock-radial-item absolute left-1/2 top-1/2 flex items-center justify-center rounded-full bg-ai-surface border border-ai-border text-white text-xs font-medium backdrop-blur-md"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        x,
                        y,
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                        delay: i * 0.02,
                      }}
                      style={{
                        width: 44,
                        height: 44,
                        marginLeft: -22,
                        marginTop: -22,
                        boxShadow: "0 0 20px rgba(0, 255, 136, 0.2)",
                      }}
                    >
                      {link.label.slice(0, 3)}
                    </motion.a>
                  );
                })}
              </>
            )}
          </AnimatePresence>
          <motion.button
            className="command-dock-fab w-14 h-14 rounded-full flex items-center justify-center bg-ai-surface border border-ai-border shadow-lg"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            animate={{ rotate: mobileOpen ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              boxShadow: "0 0 30px rgba(0, 255, 136, 0.25)",
            }}
          >
            <Menu className="w-6 h-6 text-ai-glow" />
          </motion.button>
        </div>
      </div>
    </>
  );
}
