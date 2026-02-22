/**
 * Client-side semantic search using Transformers.js (Xenova/all-MiniLM-L6-v2).
 * Embeds knowledge base in browser, stores vectors in memory, retrieves by cosine similarity.
 * No API calls, fully offline capable.
 */

export type KnowledgeChunk = {
  id: string;
  text: string;
  category: string;
  source: string;
};

export type SearchResult = {
  chunk: KnowledgeChunk;
  score: number;
};

type TensorLike = { data: Float32Array | number[]; dims?: number[] };

let pipeline: ((text: string, opts: { pooling: string; normalize: boolean }) => Promise<TensorLike>) | null = null;
let vectors: Float32Array[] = [];
let chunks: KnowledgeChunk[] = [];
let dim = 0;
let ready = false;

/** Minimum cosine similarity to consider a match (normalized vectors => dot = cosine). */
const CONFIDENCE_THRESHOLD = 0.25;

export function isReady(): boolean {
  return ready;
}

function tensorToFloat32Array(out: TensorLike): Float32Array {
  const d = out.data;
  return d instanceof Float32Array ? d : new Float32Array(d);
}

/**
 * Split long text into semantic chunks (by sentence) for finer retrieval.
 * Only splits when text is long enough to avoid explosion of chunks.
 */
const MIN_LENGTH_FOR_SPLIT = 180;

function semanticChunk(text: string, id: string, category: string, source: string): KnowledgeChunk[] {
  if (text.length < MIN_LENGTH_FOR_SPLIT) {
    return [{ id, text, category, source }];
  }
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 20);
  if (sentences.length <= 1) {
    return [{ id, text, category, source }];
  }
  const out: KnowledgeChunk[] = [];
  for (let i = 0; i < sentences.length; i++) {
    out.push({
      id: `${id}-${i}`,
      text: sentences[i].trim(),
      category,
      source,
    });
  }
  return out;
}

export async function loadKnowledgeEmbeddings(): Promise<void> {
  if (ready) return;

  const mod = await import("@xenova/transformers");
  const createPipeline = (mod as { pipeline: (a: string, b: string, c?: object) => Promise<unknown> }).pipeline;
  const kbRes = await fetch("/knowledgeBase.json");
  const kb = await kbRes.json();

  const extractor = (await createPipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
    progress_callback: () => {},
  })) as (text: string, opts: { pooling: string; normalize: boolean }) => Promise<TensorLike>;

  const rawChunks: KnowledgeChunk[] = kb.chunks;
  const expanded: KnowledgeChunk[] = [];
  for (const c of rawChunks) {
    const parts = semanticChunk(c.text, c.id, c.category, c.source);
    expanded.push(...parts);
  }
  chunks = expanded;
  vectors = [];
  dim = 0;

  for (let i = 0; i < chunks.length; i++) {
    const out = await extractor(chunks[i].text, { pooling: "mean", normalize: true });
    const data = tensorToFloat32Array(out);
    if (dim === 0) dim = data.length;
    vectors.push(data);
  }

  pipeline = extractor as (text: string, opts: { pooling: string; normalize: boolean }) => Promise<TensorLike>;
  ready = true;
}

function dotProduct(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

export type SearchOptions = {
  topK?: number;
  contextQueries?: string[];
  categoryFilter?: string;
  sourceFilter?: string;
};

export async function search(
  query: string,
  topK = 5,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  if (!pipeline || !ready || chunks.length === 0) return [];

  const { contextQueries = [], categoryFilter, sourceFilter } = options;
  const queryText = contextQueries.length > 0
    ? [query, ...contextQueries].join(" ")
    : query;

  const out = await pipeline(queryText, { pooling: "mean", normalize: true });
  const qVec = tensorToFloat32Array(out);

  const scored = vectors.map((v, i) => ({
    i,
    score: dotProduct(qVec, v),
  }));

  let filtered = scored;
  if (categoryFilter) {
    filtered = filtered.filter(({ i }) => chunks[i].category === categoryFilter);
  }
  if (sourceFilter) {
    filtered = filtered.filter(({ i }) =>
      chunks[i].source.toLowerCase().includes(sourceFilter.toLowerCase())
    );
  }

  filtered.sort((a, b) => b.score - a.score);
  const results: SearchResult[] = filtered.slice(0, topK).map(({ i, score }) => ({
    chunk: chunks[i],
    score,
  }));

  return results;
}

export function getConfidenceThreshold(): number {
  return CONFIDENCE_THRESHOLD;
}

export function formatReplyStructured(results: SearchResult[]): string {
  if (results.length === 0) return "";

  const threshold = CONFIDENCE_THRESHOLD;
  const best = results[0];
  if (best.score < threshold) return "";

  const bySource = new Map<string, SearchResult[]>();
  for (const r of results) {
    if (r.score < threshold) continue;
    const list = bySource.get(r.chunk.source) ?? [];
    list.push(r);
    bySource.set(r.chunk.source, list);
  }

  const sections: string[] = [];
  bySource.forEach((list, source) => {
    const texts = list.map((r) => r.chunk.text);
    const combined = Array.from(new Set(texts)).join(" ");
    sections.push(`**${source}**\n\nOverview\n${combined}`);
  });

  return sections.join("\n\n---\n\n");
}

export function formatReply(results: SearchResult[]): string {
  if (results.length === 0) return "";

  const threshold = CONFIDENCE_THRESHOLD;
  const best = results[0];
  if (best.score < threshold) return "";

  const seen = new Set<string>();
  const parts: string[] = [];

  for (const { chunk, score } of results) {
    if (score < threshold) continue;
    const key = `${chunk.source}:${chunk.text.slice(0, 50)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    parts.push(`**${chunk.source}** (${chunk.category})\n${chunk.text}`);
  }

  if (parts.length === 0) return "";
  return "Here's what I found:\n\n" + parts.join("\n\n");
}

export function getBestScore(results: SearchResult[]): number {
  return results.length > 0 ? results[0].score : 0;
}
