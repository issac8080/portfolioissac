# AI-native portfolio — architecture & roadmap

This document describes how the site evolves from an **advanced portfolio** into an **AI-native engineering intelligence system** while keeping the existing Next.js App Router stack, design tokens, and sections intact.

## 1. Guiding principles

- **Progressive enhancement**: ship thin vertical slices (telemetry → orchestration UI → simulations → graph) behind stable interfaces.
- **Preserve production paths**: semantic retrieval stays client-side (`embeddingSearch.ts` + `knowledgeBase.json`); no mandatory backend for core UX.
- **Modular boundaries**: `lib/ai-os/*` (pure logic), `context/*` (session + telemetry), `components/ai-os/*` (chrome), feature folders per phase.
- **Accessibility & motion**: respect `ExperiencePreferences` / `data-simple-mode` — decorative layers off, telemetry degrades to a compact readout.
- **Explainability**: every “AI” visualization should map to a measurable signal (latency, cosine score, chunk count) or be explicitly labeled as **preview / simulation**.

## 2. Recommended folder structure (incremental)

```
src/
  app/                    # App Router (unchanged role)
  components/
    ai-os/                # Global AI OS chrome (Phase 1+)
    ...                   # Existing sections
  context/
    AiSystemContext.tsx   # Telemetry + orchestration preview state
    ExperiencePreferences.tsx
    LenisContext.tsx
  lib/
    ai-os/
      types.ts            # Shared AI OS types
      agentRouting.ts     # Deterministic multi-agent routing hints (Phase 2)
      recruiterMemory.ts  # (Phase 5) local interest vectors — future
      codeIndex/          # (Phase 8) optional static code index — future
    embeddingSearch.ts    # Transformers.js pipeline (source of truth)
  data/                   # Portfolio content (unchanged)
docs/
  AI_OS_ARCHITECTURE.md   # This file
```

## 3. Component hierarchy (high level)

```
RootLayout
└── page (Home)
    ├── ExperiencePreferencesProvider
    ├── LenisProvider
    ├── AiSystemProvider
    │   ├── AiSystemShell (telemetry + module dock)
    │   ├── main …
    │   │   └── data-rich-page
    │   │       ├── AiAmbientNeuralLayer
    │   │       ├── AnimatedGrid / DepthFog / …
    │   ├── PortfolioChatbot (feeds telemetry)
    │   └── EmbeddingPlayground (feeds lab + footprint)
    └── dynamic modals …
```

## 4. State management architecture

| Concern | Mechanism | Notes |
|--------|-----------|--------|
| Scroll / Lenis | `LenisContext` | Unchanged |
| Accessibility / minimal UI | `ExperiencePreferences` | Drives `effectiveMinimalUI` |
| AI OS telemetry | `AiSystemContext` | **Ephemeral** session metrics + orchestration **preview** |
| Chat transcript | `PortfolioChatbot` local state | Later: reducer or lightweight store if needed |
| Recruiter adaptation (Phase 5) | New `RecruiterProfileContext` + `localStorage` | Keep typed adapters; never block render |

Avoid a global monolith: add **narrow contexts** per domain (recruiter, simulations, code index) that optionally consume `AiSystemContext`.

## 5. Agent orchestration architecture (Phase 2+)

**Today**: single retrieval + intent labels (`intentDetection.ts`) + UI preview via `routeQueryToAgents()` in `lib/ai-os/agentRouting.ts`.

**Target**:

1. **Router** — classifies query → ordered agent list + weights (keyword / embedding / rules).
2. **Planner** — DAG of “tasks” (retrieve, summarize, cite, visualize) with simulated timing.
3. **Presenter** — Framer Motion graph of active agents; confidence bars from retrieval scores + heuristics.
4. **Synthesizer** — still one reply generator; agents influence **structure** (sections) and **citations**, not parallel LLM calls (unless you add an API later).

Keep orchestration **inspectable** (why these agents?) to reinforce senior-AI narrative.

## 6. Vector visualization strategy (Phases 3–4)

| View | Tech | Purpose |
|------|------|---------|
| Project “Run simulation” | Framer Motion + small canvas/SVG | Narrated pipeline: ingest → embed → retrieve → act |
| Knowledge graph | `react-force-graph` + WebGL **or** React Flow already in stack | Relationships between projects, skills, APIs |
| Embedding space | 2D PCA/t-SNE **optional** (heavy) | Demo only; lazy-load + web worker |
| Architecture | Mermaid (existing) | Truthful diagrams |

**Rule**: 3D / force-graph features are **dynamic imports** with `ssr: false` and a lightweight loading shell.

## 7. Animation system plan

- **Global**: ambient grid + scanline (CSS, low GPU) — already Phase 1 direction.
- **Interaction**: Framer Motion for panel choreography; prefer `layout` + opacity over layout thrashing properties.
- **Reduced motion**: gate decorative layers with `effectiveMinimalUI`; keep telemetry as static text.
- **Cinematic section reveals**: existing `data-cinematic-reveal` — extend with stagger hooks, not new global CSS explosion.

## 8. Performance optimization strategy

1. **Lazy-load** Phase 4+ graph bundles (`next/dynamic`, `webpackChunkName` mental model).
2. **Single embedding pipeline** — all features call `embeddingSearch.ts`; avoid second model.
3. **Throttle telemetry** — index footprint refresh on interval (already 5s + on retrieval).
4. **Workers** (optional later) — embedding batching for code index (Phase 8).
5. **FPS**: cap particle counts; prefer CSS blur over per-frame JS layout.

## 9. Suggested libraries (by phase)

| Phase | Library | Why |
|-------|---------|-----|
| 4 | `react-force-graph` | 3D / WebGL graph with less boilerplate than raw Three.js |
| 4 | `three` (already) | Custom shaders / instancing if you outgrow force-graph |
| 9 | Web Speech API | Voice I/O without bundling heavy STT |
| 9 | `cmdk` or custom | Command palette — keyboard-first |
| 8 | `simple-git` / build-time only | Index repos at build, ship static JSON |

## 10. Step-by-step implementation roadmap

1. **Phase 1 (done in repo)**: `AiSystemProvider`, telemetry HUD, ambient layer, module dock, chat + lab instrumentation.
2. **Phase 2**: Orchestration timeline UI inside chat + shared `AgentRun` type; animate handoff between agents.
3. **Phase 3**: Per-project `SimulationLauncher` + lazy `simulations/*` modules keyed by `project.id`.
4. **Phase 4**: Knowledge graph route `/lab/graph` or in-page tab; data-driven nodes from `portfolio.ts` + `caseStudies.ts`.
5. **Phase 5**: `recruiterMemory` — events (`project_view`, `embedding_play`, `section_dwell`) → scored interests → reorder `FeaturedSystems` props.
6. **Phase 6**: Session memory graph (local) + “memory timeline” panel; optional embedding of interests with same MiniLM.
7. **Phase 7**: `ExplainabilityPanel` in `ProjectModal` fed from structured fields in data (not prose-only).
8. **Phase 8**: Build-time indexer → `public/codeIndex.json` + retrieval path in assistant.
9. **Phase 9**: Voice + command palette + sound (opt-in, muted by default).
10. **Phase 10**: Observability dashboard route reusing telemetry + staged pipeline metrics from chat.
11. **Phase 11**: Consolidate visual tokens (glow, fog, grid) into a small `visualSystem` theme module.
12. **Phase 12**: “Interview Issac AI” — stricter prompt template + optional API; on-device remains fallback.
13. **Phase 13**: “Advanced mode” unlock flag from recruiter profile depth.
14. **Phase 14**: Resume variants — extend `generateResumePdf.ts` with role templates (data-driven).
15. **Phase 15**: Continuous perf budget + lint for dynamic import boundaries.

## 11–15. Deliverables mapping

| Deliverable | Location |
|-------------|----------|
| Production-ready Phase 1 code | `context/AiSystemContext.tsx`, `components/ai-os/*`, `lib/ai-os/*`, `embeddingSearch.getEmbeddingIndexStats` |
| Reusable hooks | `useAiSystem`, `useAiSystemOptional` |
| AI system UI | `AiTelemetryPanel`, `AiActiveModulesDock`, `AiAmbientNeuralLayer` |
| Motion / observability | Framer in panel; Phase 10 expands into full dashboard route |

---

*Maintainers: when adding a new “AI” surface, ask: **what signal does it visualize**, and **what degrades when `data-simple-mode` is on**?*
