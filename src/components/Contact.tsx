"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Mail, Phone, Linkedin } from "lucide-react";
import { contact } from "@/data/portfolio";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  const panelRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set((e.clientX - cx) / 30);
    mouseY.set((e.clientY - cy) / 30);
  };

  const reset = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-4 font-[var(--font-space-grotesk)] text-center"
        >
          Contact
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-ai-muted text-center mb-12"
        >
          Get in touch — open to AI/ML & Software opportunities
        </motion.p>

        <motion.div
          ref={panelRef}
          style={{
            x: springX,
            y: springY,
            rotateX: springY,
            rotateY: springX,
            transformStyle: "preserve-3d",
            perspective: 1000,
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 md:p-10 border border-ai-border gradient-border max-w-2xl mx-auto card-elevation"
        >
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <a
              href={`tel:${contact.mobile}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-ai-surface/30 border border-ai-border hover:border-ai-glow/40 transition-colors group"
            >
              <Phone className="w-5 h-5 text-ai-glow group-hover:scale-110 transition-transform" />
              <span className="text-white">{contact.mobile}</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-ai-surface/30 border border-ai-border hover:border-ai-glow/40 transition-colors group"
            >
              <Mail className="w-5 h-5 text-ai-glow group-hover:scale-110 transition-transform" />
              <span className="text-white truncate">{contact.email}</span>
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-ai-surface/30 border border-ai-border hover:border-ai-glow/40 transition-colors group sm:col-span-2"
            >
              <Linkedin className="w-5 h-5 text-ai-glow group-hover:scale-110 transition-transform" />
              <span className="text-white">LinkedIn — issac-sunny</span>
            </a>
          </div>

          <div className="space-y-4">
            <MagneticInput placeholder="Your name" type="text" />
            <MagneticInput placeholder="Your email" type="email" />
            <textarea
              placeholder="Message"
              rows={4}
              className="flex w-full rounded-lg border border-ai-border bg-ai-surface/50 px-4 py-3 text-sm text-white placeholder:text-ai-muted focus:outline-none focus:ring-2 focus:ring-ai-glow/40 focus:border-ai-glow/50 transition-all duration-300 backdrop-blur-sm resize-none"
            />
            <Button className="w-full" size="lg">
              Send message
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MagneticInput({
  placeholder,
  type,
}: {
  placeholder: string;
  type: "text" | "email";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.03);
    y.set((e.clientY - cy) * 0.03);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
    >
      <Input placeholder={placeholder} type={type} />
    </motion.div>
  );
}
