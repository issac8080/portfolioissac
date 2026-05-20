"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Section reveals + optional scroll-linked parallax on `[data-parallax-scroll]` (skipped when user prefers reduced motion). */
export default function ScrollEffects({
  modalOpen = false,
}: {
  modalOpen?: boolean;
}) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (modalOpen) return;

    ctxRef.current = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Depth parallax: background layers drift at different rates while scrolling
      if (!reduceMotion) {
        gsap.utils
          .toArray<HTMLElement>("[data-parallax-scroll]")
          .forEach((el) => {
            const raw = el.dataset.parallaxScroll ?? "0.12";
            const speed = Number.parseFloat(raw);
            if (!Number.isFinite(speed)) return;
            gsap.fromTo(
              el,
              { y: speed * 72 },
              {
                y: -speed * 72,
                ease: "none",
                scrollTrigger: {
                  trigger: "#main-content",
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 2.6,
                },
              }
            );
          });
      }

      // Section entry: one-shot reveal when section enters view (no scrub)
      gsap.utils.toArray<HTMLElement>("[data-cinematic-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => {
      ctxRef.current?.revert();
    };
  }, [modalOpen]);

  return null;
}
