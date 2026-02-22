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

type TensorLike = { data: Float32Array | number[]; dims?: number[] };

let pipeline: ((text: string, opts: { pooling: string; normalize: boolean }) => Promise<TensorLike>) | null = null;
let vectors: Float32Array[] = [];
let chunks: KnowledgeChunk[] = [];
let dim = 0;
let ready = false;

export function isReady(): boolean {
  return ready;
}

function tensorToFloat32Array(out: TensorLike): Float32Array {
  const d = out.data;
  return d instanceof Float32Array ? d : new Float32Array(d);
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
  chunks = rawChunks;
  vectors = [];
  dim = 0;

  for (let i = 0; i < rawChunks.length; i++) {
    const out = await extractor(rawChunks[i].text, { pooling: "mean", normalize: true });
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

export async function search(query: string, topK = 3): Promise<KnowledgeChunk[]> {
  if (!pipeline || !ready || chunks.length === 0) return [];

  const out = await pipeline(query, { pooling: "mean", normalize: true });
  const qVec = tensorToFloat32Array(out);

  const scores = vectors.map((v, i) => ({ i, score: dotProduct(qVec, v) }));
  scores.sort((a, b) => b.score - a.score);

  return scores.slice(0, topK).map(({ i }) => chunks[i]);
}

export function formatReply(results: KnowledgeChunk[]): string {
  if (results.length === 0) {
    return "I couldn't find a direct match in my portfolio knowledge. Try asking about my projects (Urban Place, AuraShop, Code Dependency Analyzer, Initra, Autonomous Returns), experience (G10X, AI Engineer Intern, ML Intern, IEEE Chair), research (Behavioral Insider Threat Detection), or skills (Python, ML, Salesforce, MERN, Cloud).";
  }

  const parts: string[] = ["Here's what I found from my portfolio:\n\n"];
  results.forEach((r) => {
    parts.push(`${r.source} (${r.category})\n${r.text}\n\n`);
  });
  return parts.join("");
}
