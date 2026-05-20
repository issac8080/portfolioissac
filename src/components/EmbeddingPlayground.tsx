"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAiSystemOptional } from "@/context/AiSystemContext";
import {
  loadKnowledgeEmbeddings,
  embeddingSimilarity,
  isReady,
} from "@/lib/embeddingSearch";
import { Loader2, Cpu, Binary } from "lucide-react";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";

export default function EmbeddingPlayground() {
  const ai = useAiSystemOptional();
  const [a, setA] = useState("insider threat detection");
  const [b, setB] = useState("employee behavior anomaly");
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setError(null);
    setLoading(true);
    setScore(null);
    ai?.setEmbeddingLabActive(true);
    try {
      if (!isReady()) {
        ai?.recordModelLoadStart();
        try {
          await loadKnowledgeEmbeddings();
          ai?.recordModelLoadEnd(true);
        } catch {
          ai?.recordModelLoadEnd(false);
          throw new Error("Could not load the embedding model.");
        }
      }
      const s = await embeddingSimilarity(a, b);
      if (s == null || Number.isNaN(s)) {
        setError("Model not ready. Open the portfolio assistant once to warm the pipeline, then retry.");
      } else {
        setScore(s);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to compute similarity.");
    } finally {
      ai?.setEmbeddingLabActive(false);
      ai?.refreshIndexFootprint();
      setLoading(false);
    }
  };
  return (
    <section
      id="live-lab"
      className={siteSectionClass("border-t border-ai-border/30")}
      data-cinematic-reveal
      aria-labelledby="live-lab-heading"
    >
      <LabSectionGridBg />
      <div className={SITE_SECTION_INNER}>
        <LabSectionIntro
          eyebrow="Live evidence"
          title="On-device embedding similarity"
          titleId="live-lab-heading"
          description={
            <>
              Same <code className="text-ai-glow/90 text-xs">Xenova/all-MiniLM-L6-v2</code> model as the
              assistant. Cosine similarity between two phrases runs entirely in your browser — a tiny
              slice of how retrieval scoring works.
            </>
          }
          titleClassName="!text-3xl md:!text-4xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl glass rounded-2xl border border-ai-border p-6 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-xs text-ai-muted">Phrase A</span>
              <Input
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="text-sm"
                autoComplete="off"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs text-ai-muted">Phrase B</span>
              <Input
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="text-sm"
                autoComplete="off"
              />
            </label>
          </div>
          <Button
            type="button"
            onClick={() => void run()}
            disabled={loading || !a.trim() || !b.trim()}
            className="bg-ai-glow/20 text-ai-glow border border-ai-border hover:bg-ai-glow/30"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                Loading model…
              </>
            ) : (
              "Compare embeddings"
            )}
          </Button>
          {error && <p className="text-sm text-red-400/90">{error}</p>}
          {score != null && !error && (
            <p className="text-sm text-white/95">
              Cosine similarity:{" "}
              <span className="font-mono text-ai-glow tabular-nums">
                {score.toFixed(4)}
              </span>{" "}
              <span className="text-ai-muted">(1 = identical direction in embedding space)</span>
            </p>
          )}
        </motion.div>

        <LabSectionFooterStrip
          items={[
            { icon: <Cpu className="h-4 w-4 text-cyan-400" aria-hidden />, label: "transformers.js" },
            { icon: <Binary className="h-4 w-4 text-violet-400" aria-hidden />, label: "cosine sim" },
            { icon: <Loader2 className="h-4 w-4 text-lime-400" aria-hidden />, label: "live compute" },
          ]}
        />
      </div>
    </section>
  );
}
