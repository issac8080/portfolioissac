"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

function readPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function syncSimpleModeAttr(prefersReducedMotion: boolean) {
  try {
    if (typeof document === "undefined") return;
    if (prefersReducedMotion) {
      document.documentElement.setAttribute("data-simple-mode", "1");
    } else {
      document.documentElement.removeAttribute("data-simple-mode");
    }
  } catch {
    /* ignore */
  }
}

export type ExperiencePreferencesContextValue = {
  /** Scan control removed — always false; use `effectiveMinimalUI` */
  simpleMode: false;
  /** no-op (kept for backward compatibility) */
  setSimpleMode: (value: boolean) => void;
  prefersReducedMotion: boolean;
  saveData: boolean;
  effectiveMinimalUI: boolean;
};

const ExperiencePreferencesContext =
  createContext<ExperiencePreferencesContextValue | null>(null);

const noopSetSimpleMode = () => {};

export function ExperiencePreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);

  useLayoutEffect(() => {
    const mqReduce = readPrefersReducedMotion();
    setPrefersReducedMotion(mqReduce);
    syncSimpleModeAttr(mqReduce);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMq = () => {
      const next = mq.matches;
      setPrefersReducedMotion(next);
      syncSimpleModeAttr(next);
    };
    syncMq();
    mq.addEventListener("change", syncMq);

    type Conn = {
      saveData?: boolean;
      addEventListener?: (type: string, listener: () => void) => void;
      removeEventListener?: (type: string, listener: () => void) => void;
    };
    const conn = (navigator as Navigator & { connection?: Conn }).connection;

    const syncSaveData = () => {
      try {
        setSaveData(Boolean(conn?.saveData));
      } catch {
        setSaveData(false);
      }
    };
    syncSaveData();
    conn?.addEventListener?.("change", syncSaveData);

    return () => {
      mq.removeEventListener("change", syncMq);
      conn?.removeEventListener?.("change", syncSaveData);
    };
  }, []);

  const effectiveMinimalUI = useMemo(() => prefersReducedMotion, [prefersReducedMotion]);

  const value = useMemo(
    () => ({
      simpleMode: false as const,
      setSimpleMode: noopSetSimpleMode,
      prefersReducedMotion,
      saveData,
      effectiveMinimalUI,
    }),
    [prefersReducedMotion, saveData, effectiveMinimalUI]
  );

  return (
    <ExperiencePreferencesContext.Provider value={value}>
      {children}
    </ExperiencePreferencesContext.Provider>
  );
}

export function useExperiencePreferences(): ExperiencePreferencesContextValue {
  const ctx = useContext(ExperiencePreferencesContext);
  if (!ctx) {
    throw new Error(
      "useExperiencePreferences must be used within ExperiencePreferencesProvider"
    );
  }
  return ctx;
}

export function useExperiencePreferencesOptional(): ExperiencePreferencesContextValue | null {
  return useContext(ExperiencePreferencesContext);
}
