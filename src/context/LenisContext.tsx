"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type LenisScrollApi = {
  lenis: Lenis | null;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: Parameters<Lenis["scrollTo"]>[1]
  ) => void;
};

const LenisContext = createContext<LenisScrollApi | null>(null);

export function useLenisScroll(): LenisScrollApi | null {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /** Native scroll on small viewports avoids Lenis + ScrollTrigger jank on touch. */
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    if (reduce || narrow) return;

    const instance = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.085,
      touchMultiplier: 1.15,
      wheelMultiplier: 0.9,
      orientation: "vertical",
      anchors: true,
    });

    instance.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          instance.scrollTo(value, { immediate: true });
        }
        return instance.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed",
    });

    const onTicker = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTicker);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(onTicker);
      instance.destroy();
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      ScrollTrigger.refresh();
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options?: Parameters<Lenis["scrollTo"]>[1]) => {
      lenis?.scrollTo(target, options ?? {});
    },
    [lenis]
  );

  const value = useMemo<LenisScrollApi>(
    () => ({
      lenis,
      scrollTo,
    }),
    [lenis, scrollTo]
  );

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}
