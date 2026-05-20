"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RecruiterSessionV1, RecruiterFocus } from "@/types/portfolioIntelligence";
import type { RetrievalSource } from "@/types/portfolioIntelligence";
import { caseStudyIdFromKbSource } from "@/lib/sourceToCaseStudyId";

const STORAGE_KEY = "pi_recruiter_v1";
const EVENT = "portfolio-recruiter-session-updated";

const TECH_TERMS = [
  "salesforce",
  "apex",
  "react",
  "next.js",
  "fastapi",
  "python",
  "tensorflow",
  "langgraph",
  "chromadb",
  "mongodb",
  "typescript",
  "node",
  "socket",
  "firebase",
  "supabase",
] as const;

function emptySession(): RecruiterSessionV1 {
  return {
    version: 1,
    viewedProjectIds: [],
    techMentions: {},
    queryCount: 0,
    lastQueryAt: 0,
    inferredFocus: "general",
    projectScores: {},
    interactionDepth: 0,
  };
}

function loadSession(): RecruiterSessionV1 {
  if (typeof window === "undefined") return emptySession();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySession();
    const parsed = JSON.parse(raw) as RecruiterSessionV1;
    if (parsed?.version !== 1) return emptySession();
    return {
      ...emptySession(),
      ...parsed,
      viewedProjectIds: Array.isArray(parsed.viewedProjectIds)
        ? parsed.viewedProjectIds
        : [],
      techMentions: parsed.techMentions && typeof parsed.techMentions === "object"
        ? parsed.techMentions
        : {},
      projectScores: parsed.projectScores && typeof parsed.projectScores === "object"
        ? parsed.projectScores
        : {},
    };
  } catch {
    return emptySession();
  }
}

function inferFocus(tech: Record<string, number>, projectScores: Record<string, number>): RecruiterFocus {
  const sf = (tech.salesforce ?? 0) + (tech.apex ?? 0);
  const ai =
    (tech.tensorflow ?? 0) +
    (tech.python ?? 0) +
    (tech.langgraph ?? 0) +
    (tech.chromadb ?? 0);
  const fs =
    (tech.react ?? 0) +
    (tech["next.js"] ?? 0) +
    (tech.typescript ?? 0) +
    (tech.node ?? 0);

  const topProj = Object.entries(projectScores).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (topProj === "smartlead-ai" || topProj === "sales-cloud-e2e" || sf >= 3) return "salesforce";
  if (ai >= 4) return "ai_ml";
  if (fs >= 4) return "fullstack";
  return "general";
}

function countTechInText(text: string): Partial<Record<(typeof TECH_TERMS)[number], number>> {
  const t = text.toLowerCase();
  const out: Partial<Record<(typeof TECH_TERMS)[number], number>> = {};
  const bump = (key: (typeof TECH_TERMS)[number]) => {
    out[key] = (out[key] ?? 0) + 1;
  };
  if (/\bsalesforce\b/.test(t)) bump("salesforce");
  if (/\bapex\b/.test(t)) bump("apex");
  if (/\breact\b/.test(t)) bump("react");
  if (/\bnext\.?js\b|\bnextjs\b/.test(t)) bump("next.js");
  if (/\bfastapi\b/.test(t)) bump("fastapi");
  if (/\bpython\b/.test(t)) bump("python");
  if (/\btensorflow\b/.test(t)) bump("tensorflow");
  if (/\blanggraph\b/.test(t)) bump("langgraph");
  if (/\bchromadb\b/.test(t)) bump("chromadb");
  if (/\bmongodb\b/.test(t)) bump("mongodb");
  if (/\btypescript\b|\bts\b/.test(t)) bump("typescript");
  if (/\bnode\.?js\b|\bnode\b/.test(t)) bump("node");
  if (/\bsocket\.?io\b|\bsocket\b/.test(t)) bump("socket");
  if (/\bfirebase\b/.test(t)) bump("firebase");
  if (/\bsupabase\b/.test(t)) bump("supabase");
  return out;
}

export function dispatchRecruiterSession(session: RecruiterSessionV1) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: session }));
}

export function useRecruiterSession() {
  const [session, setSession] = useState<RecruiterSessionV1>(emptySession);

  useEffect(() => {
    const s = loadSession();
    setSession(s);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.piFocus = s.inferredFocus;
    }
  }, []);

  const persist = useCallback((next: RecruiterSessionV1) => {
    setSession(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      dispatchRecruiterSession(next);
    } catch {
      /* quota or private mode */
    }
  }, []);

  const recordInteraction = useCallback(
    (userQuery: string, sources: RetrievalSource[] | undefined) => {
      const base = loadSession();
      const techMentions = { ...base.techMentions };
      const mergedQuery = `${userQuery} ${(sources ?? []).map((s) => s.excerpt).join(" ")}`;
      const found = countTechInText(mergedQuery);
      for (const [k, v] of Object.entries(found)) {
        if (!v) continue;
        techMentions[k] = (techMentions[k] ?? 0) + v;
      }

      const projectScores = { ...base.projectScores };
      const viewed = new Set(base.viewedProjectIds);
      for (const s of sources ?? []) {
        const pid = caseStudyIdFromKbSource(s.source);
        if (pid) {
          viewed.add(pid);
          projectScores[pid] = (projectScores[pid] ?? 0) + s.score * 2 + 0.15;
        }
      }

      const next: RecruiterSessionV1 = {
        ...base,
        techMentions,
        projectScores,
        viewedProjectIds: Array.from(viewed).slice(-24),
        queryCount: base.queryCount + 1,
        lastQueryAt: Date.now(),
        interactionDepth: base.interactionDepth + 1 + (sources?.length ?? 0) * 0.25,
        inferredFocus: inferFocus(techMentions, projectScores),
      };
      persist(next);

      if (typeof document !== "undefined") {
        document.documentElement.dataset.piFocus = next.inferredFocus;
      }
    },
    [persist]
  );

  const recommendations = useMemo(() => {
    const ranked = Object.entries(session.projectScores)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);
    return ranked.slice(0, 4);
  }, [session.projectScores]);

  return { session, recordInteraction, recommendations, persist };
}
