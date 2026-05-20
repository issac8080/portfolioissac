"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MotionValue } from "framer-motion";

type Value = {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
};

const HeroBackgroundMotionContext = createContext<Value | null>(null);

export function HeroBackgroundMotionProvider({
  springX,
  springY,
  children,
}: Value & { children: ReactNode }) {
  return (
    <HeroBackgroundMotionContext.Provider value={{ springX, springY }}>
      {children}
    </HeroBackgroundMotionContext.Provider>
  );
}

export function useHeroBackgroundMotion(): Value | null {
  return useContext(HeroBackgroundMotionContext);
}
