"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "pi_semantic_memory_v1";
const MAX = 24;

export type MemoryEntry = {
  id: string;
  query: string;
  summaryLine: string;
  at: number;
};

function load(): MemoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as MemoryEntry[];
    return Array.isArray(arr) ? arr.slice(-MAX) : [];
  } catch {
    return [];
  }
}

/** Privacy-first rolling session log (local only). */
export function useSemanticSessionMemory() {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);

  useEffect(() => {
    setEntries(load());
  }, []);

  const append = useCallback((query: string, summaryLine: string) => {
    const q = query.trim();
    if (!q) return;
    const next: MemoryEntry = {
      id: `m-${Date.now()}`,
      query: q.slice(0, 400),
      summaryLine: summaryLine.slice(0, 280),
      at: Date.now(),
    };
    setEntries((prev) => {
      const merged = [...prev.filter((e) => e.query !== next.query), next].slice(-MAX);
      try {
        localStorage.setItem(KEY, JSON.stringify(merged));
      } catch {
        /* ignore */
      }
      return merged;
    });
  }, []);

  const clear = useCallback(() => {
    setEntries([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { entries, append, clear };
}
