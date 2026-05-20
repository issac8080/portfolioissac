# AI Portfolio Intelligence System — Architecture

This document describes the progressive enhancement layered on top of the existing on-device retrieval stack (`embeddingSearch.ts`, `intentDetection.ts`, `knowledgeBase.json`).

## 1. Architecture plan

| Layer | Responsibility |
| --- | --- |
| **Retrieval core** | Unchanged: Transformers.js `Xenova/all-MiniLM-L6-v2`, cosine search, chunking, filters. |
| **Knowledge extensions** | Optional `projectIntelligence` map in `knowledgeBase.json` loaded beside chunks (same fetch). |
| **Presentation intelligence** | Simulated multi-agent routing (`agentRouter.ts`), telemetry snapshots, Framer Motion UI. |
| **Recruiter memory** | `useRecruiterSession` → `localStorage` key `pi_recruiter_v1` + `CustomEvent` for project reordering. |
| **Session semantic log** | `useSemanticSessionMemory` → `localStorage` rolling Q/A summaries (privacy-first). |
| **Heavy UI** | Dynamic `import()` for React Flow graph, intelligence panel, SVG session graph. |

## 2. Folder structure

```
src/
  components/
    PortfolioChatbot.tsx          # Orchestrator (command shell + chat)
    portfolio-intelligence/
      ThinkingStateBanner.tsx
      TelemetryPanel.tsx
      RetrievalFlowGraph.tsx      # React Flow similarity graph
      MultiAgentRouteToast.tsx    # Routing toast + AgentBadge
      IntelligenceViewPanel.tsx # Project dossier + Mermaid
      KnowledgeGraphSurface.tsx # SVG session topology
      CommandStrip.tsx            # Voice, AI read, Interview, Eng, Résumé, Adv
  hooks/
    useRecruiterSession.ts
    useSemanticSessionMemory.ts
    usePortfolioVoice.ts
  lib/
    agentRouter.ts
    sourceToCaseStudyId.ts
    embeddingSearch.ts            # + getProjectIntelBySource()
  types/
    portfolioIntelligence.ts
public/
  knowledgeBase.json              # chunks + projectIntelligence
```

## 3. Component breakdown

- **PortfolioChatbot**: wires retrieval, telemetry, recruiter hooks, intelligence sheet, lazy modules, keyboard (Esc hierarchy).
- **ThinkingStateBanner**: cinematic pipeline copy while embedding search runs.
- **TelemetryPanel**: embeddings status, latency, context depth, confidence %, route label, module chips (engineering mode).
- **RetrievalFlowGraph**: query node → evidence nodes → domain nodes (React Flow).
- **IntelligenceViewPanel**: tabs (Overview / Data flow / Engineering), Mermaid from KB metadata, CTAs to case study + playground.
- **CommandStrip**: mic (Web Speech API), `speechSynthesis` read-back, **Interview Issac AI** toggle (technical KB synthesis), engineering telemetry toggle, tailored résumé clipboard + resume modal event, advanced unlock (session graph).

## 4. Multi-agent model

Routing is **heuristic and cosmetic**: it does not fork models or retrieval. It maps `(intent, query text, top SearchResult)` → specialist persona for recruiter-grade UX. The embedding pipeline remains single-path.

## 5. Performance

- React Flow and intelligence panel are **SSR-disabled** dynamic imports.
- Cosine + embedding work unchanged; telemetry uses `performance.now()` around `search()`.
- Session graph SVG is lightweight vs a second Flow canvas.

## 6. Suggested npm packages (optional next steps)

- `@radix-ui/react-tabs` — tab primitive for intelligence panel.
- `zustand` — if global AI OS state grows beyond context.
- `use-debounce` — for live graph updates while typing (if added).
- `react-virtuoso` — if transcript length explodes.

## 7. Future extensibility

- **True multi-agent**: server-side tool calls per agent with shared RAG (keep client KB as fallback).
- **WebGPU embedding** when Transformers.js pipeline supports it for faster cold start.
- **Project intelligence authoring**: expand `projectIntelligence` entries per project; optional JSON schema validation in CI.
- **Recruiter PDF merge**: pipe `pi_recruiter_v1` into `generateResumePdf` variants.
- **A11y**: respect `prefers-reduced-motion` on banner intervals and Flow `animated` edges.

## 8. Cross-page integration

- `portfolio-recruiter-session-updated` → `ProjectsShowcase` re-sorts visible cards.
- `portfolio-open-case-study` → `page.tsx` opens `ProjectModal`.
- `portfolio-open-resume-preview` → `page.tsx` opens **`ResumeStudyModal`** (PDF + Q&A; OpenAI when configured, else local).
- `document.documentElement.dataset.piFocus` → CSS variables in `globals.css` for adaptive accents.
