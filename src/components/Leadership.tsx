"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { leadership } from "@/data/portfolio";
import { Award } from "lucide-react";

export default function LeadershipSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="leadership" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-4 font-[var(--font-space-grotesk)]"
        >
          Leadership
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-ai-muted mb-12"
        >
          IEEE Computer Society Chair & community leadership
        </motion.p>

        <div className="relative">
          {leadership.map((item, i) => (
            <motion.div
              key={item.org}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative"
              style={{ zIndex: leadership.length - i }}
            >
              <div className="glass rounded-2xl p-8 border border-ai-border gradient-border hover:border-ai-glow/40 transition-colors card-elevation">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-ai-glow/20 flex items-center justify-center border border-ai-border">
                    <Award className="w-7 h-7 text-ai-glow" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.role}</h3>
                    <p className="text-ai-glow font-medium">{item.org}</p>
                    <p className="text-ai-muted text-sm mt-2">
                      {item.period}
                      {item.location && ` · ${item.location}`}
                    </p>
                    <p className="text-ai-muted/90 text-sm mt-3">{item.description}</p>
                  </div>
                </div>
              </div>
              {i < leadership.length - 1 && (
                <div className="absolute left-1/2 -bottom-6 w-px h-6 bg-gradient-to-b from-ai-border to-transparent -translate-x-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
