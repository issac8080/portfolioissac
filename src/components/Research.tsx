"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, LineChart, Microscope } from "lucide-react";
import MermaidChart from "@/components/MermaidChart";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { siteSectionClass, SITE_SECTION_INNER } from "@/lib/siteSectionLayout";
import { publication } from "@/data/portfolio";
import { researchArchitectureDiagram } from "@/data/researchDiagram";

const steps = [
  { id: 1, label: "Data Ingestion", desc: "User behavior logs & audit trails" },
  { id: 2, label: "Feature Extraction", desc: "Temporal & sequence features" },
  { id: 3, label: "Transformer Encoder", desc: "Self-attention over sequences" },
  { id: 4, label: "LSTM Autoencoder", desc: "Reconstruction & anomaly score" },
  { id: 5, label: "Explainability", desc: "Attention weights & attribution" },
];

const metrics = [
  { label: "AUC-ROC", value: "0.94", unit: "" },
  { label: "Precision", value: "0.89", unit: "" },
  { label: "Recall", value: "0.87", unit: "" },
  { label: "F1", value: "0.88", unit: "" },
];

export default function ResearchSection() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section id="research" className={siteSectionClass()} data-cinematic-reveal>
      <LabSectionGridBg />
      <div className={SITE_SECTION_INNER}>
        <LabSectionIntro
          eyebrow="Research lab"
          title="Research"
          description="Featured work: Insider Threat Detection — hybrid Transformer–LSTM autoencoder with explainability and production-minded metrics."
          titleClassName="!text-3xl md:!text-5xl"
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border border-ai-border gradient-border card-elevation"
          >
            <h3 className="text-ai-glow font-mono text-sm uppercase tracking-wider mb-4">
              Featured Publication
            </h3>
            <h4 className="text-xl md:text-2xl font-semibold text-white mb-4 leading-tight">
              Behavioral Insider Threat Detection using a Hybrid Transformer-LSTM
              Autoencoder Architecture with Enhanced Explainability and Scalability
            </h4>
            <p className="text-ai-muted text-sm mb-4">{publication.author}</p>
            <p className="text-ai-muted/80 text-sm">{publication.role} · {publication.location}</p>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 border border-ai-border card-elevation"
            >
              <h4 className="text-ai-glow font-mono text-sm uppercase tracking-wider mb-4">
                Model Workflow
              </h4>
              <div className="flex flex-col gap-2">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`text-left px-4 py-3 rounded-lg border transition-all ${
                      activeStep === step.id
                        ? "border-ai-glow/50 bg-ai-glow/10 text-ai-glow"
                        : "border-ai-border/50 text-ai-muted hover:border-ai-border"
                    }`}
                  >
                    <span className="font-medium">{step.id}. {step.label}</span>
                    <span className="block text-xs mt-0.5 opacity-80">{step.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 border border-ai-border card-elevation"
            >
              <h4 className="text-ai-glow font-mono text-sm uppercase tracking-wider mb-4">
                Metrics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-lg bg-ai-bg/50 border border-ai-border p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-ai-glow">{m.value}</div>
                    <div className="text-xs text-ai-muted">{m.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 glass rounded-2xl p-6 md:p-8 border border-ai-border"
        >
          <h4 className="text-ai-glow font-mono text-sm uppercase tracking-wider mb-2">
            Architecture Diagram
          </h4>
          <p className="text-ai-muted text-sm mb-6 max-w-2xl">
            Hybrid encoder: temporal attention feeds an LSTM autoencoder; anomaly
            signal combines reconstruction error with attribution paths for analyst
            review.
          </p>
          <div className="w-full min-h-[280px] max-h-[min(70vh,640px)] overflow-x-auto overflow-y-auto touch-pan-x rounded-xl border border-ai-border/50 bg-ai-bg/30 p-4 sm:p-5">
            <MermaidChart
              code={researchArchitectureDiagram}
              instanceId="research-insider-threat"
              className="!rounded-none !border-0 !bg-transparent !p-0 !min-h-0"
            />
          </div>
        </motion.div>

        <LabSectionFooterStrip
          items={[
            { icon: <Microscope className="h-4 w-4 text-cyan-400" aria-hidden />, label: "model graph" },
            { icon: <BookOpen className="h-4 w-4 text-violet-400" aria-hidden />, label: "publication" },
            { icon: <LineChart className="h-4 w-4 text-lime-400" aria-hidden />, label: "metrics board" },
          ]}
        />
      </div>
    </section>
  );
}
