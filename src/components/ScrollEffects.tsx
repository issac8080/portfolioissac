"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Section-based scroll triggers only. Uses native window scroll. No parallax, no scrub that ties animation to scroll position. */
export default function ScrollEffects({
  modalOpen = false,
}: {
  modalOpen?: boolean;
}) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (modalOpen) return;

    ctxRef.current = gsap.context(() => {
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
