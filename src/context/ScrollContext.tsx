"use client";

import { createContext, useContext, useRef, type RefObject } from "react";

const ScrollContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function ScrollProvider({
  scrollRef,
  children,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <ScrollContext.Provider value={scrollRef}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContainer() {
  return useContext(ScrollContext);
}
