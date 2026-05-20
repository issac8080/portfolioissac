"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Mail, Phone, Linkedin, FileText, Download, Calendar, MessageCircle } from "lucide-react";
import { contact } from "@/data/portfolio";
import { getCalendlyUrl } from "@/data/siteMeta";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ContactDiscussions from "@/components/ContactDiscussions";
import {
  LabSectionGridBg,
  LabSectionIntro,
  LabSectionFooterStrip,
} from "@/components/section-hud/LabSectionChrome";
import { siteSectionClass, SITE_SECTION_INNER_NARROW } from "@/lib/siteSectionLayout";

/** `tel:` works more reliably on mobile with E.164 for India when we only have 10 digits. */
function buildTelHref(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+91${digits}`;
  return `tel:${encodeURIComponent(mobile.replace(/\s/g, ""))}`;
}

type ContactSectionProps = {
  onPreviewResume?: () => void;
  onDownloadResume?: () => void;
};

export default function ContactSection({
  onPreviewResume,
  onDownloadResume,
}: ContactSectionProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<"idle" | "sent" | "error">("idle");
  const [formNote, setFormNote] = useState<string | null>(null);
  /** 3D tilt breaks tap targets on some mobile WebKit builds — enable only fine pointer + hover. */
  const [enableCardTilt, setEnableCardTilt] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnableCardTilt(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const calendly = getCalendlyUrl();
  const telHref = buildTelHref(contact.mobile);

  const resetFormStatus = () => {
    setFormState("idle");
    setFormNote(null);
  };

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

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 8) {
      setFormState("error");
      setFormNote("Please write at least a short message (8+ characters).");
      return;
    }

    const subject = `[Portfolio] ${name.trim() || "Website visitor"}`;
    const body = [
      message.trim(),
      "",
      "---",
      name.trim() ? `Name: ${name.trim()}` : null,
      email.trim() ? `Their email: ${email.trim()}` : null,
      typeof window !== "undefined" ? `Page: ${window.location.href}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const maxUri = 1950;
    const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (mailto.length > maxUri) {
      setFormState("error");
      setFormNote(
        "That message is a bit long for auto-open in email apps. Shorten it slightly, or copy/paste into email manually."
      );
      return;
    }

    void fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    }).catch(() => {
      /* optional webhook — ignore network errors for UX */
    });

    /* Full user-gesture navigation opens mail clients more reliably than a synthetic <a> click (esp. iOS). */
    window.location.href = mailto;

    setFormState("sent");
    setFormNote(
      "Your mail app should open with this message ready to send. Tap Send there to deliver it."
    );
  };

  return (
    <section
      id="contact"
      className={siteSectionClass()}
      data-cinematic-reveal
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
    >
      <LabSectionGridBg />
      <div className={SITE_SECTION_INNER_NARROW}>
        <LabSectionIntro
          eyebrow="Comms array"
          title="Contact"
          description="Get in touch — open to AI/ML & software opportunities. Book time, call, mail, or drop a note below."
          titleClassName="!text-3xl md:!text-5xl"
          className="mx-auto mb-12 max-w-2xl flex-col items-center text-center lg:mx-auto lg:block"
        />

        <motion.div
          ref={panelRef}
          style={
            enableCardTilt
              ? {
                  x: springX,
                  y: springY,
                  rotateX: springY,
                  rotateY: springX,
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                }
              : undefined
          }
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 glass rounded-2xl p-8 md:p-10 border border-ai-border gradient-border max-w-2xl mx-auto card-elevation"
        >
          {calendly && (
            <a
              href={calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 mb-8 flex items-center justify-center gap-2 rounded-xl border border-ai-glow/40 bg-ai-glow/10 px-4 py-3 text-sm font-medium text-ai-glow hover:bg-ai-glow/20 transition-colors touch-manipulation"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              Book a time (Calendly)
            </a>
          )}

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <a
              href={telHref}
              className="relative z-10 flex items-center gap-3 p-4 rounded-xl bg-ai-surface/30 border border-ai-border hover:border-ai-glow/40 transition-colors group touch-manipulation"
            >
              <Phone className="w-5 h-5 text-ai-glow group-hover:scale-110 transition-transform" />
              <span className="text-white">{contact.mobile}</span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="relative z-10 flex items-center gap-3 p-4 rounded-xl bg-ai-surface/30 border border-ai-border hover:border-ai-glow/40 transition-colors group touch-manipulation"
            >
              <Mail className="w-5 h-5 text-ai-glow group-hover:scale-110 transition-transform" />
              <span className="text-white truncate">{contact.email}</span>
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center gap-3 p-4 rounded-xl bg-ai-surface/30 border border-ai-border hover:border-ai-glow/40 transition-colors group sm:col-span-2 touch-manipulation"
            >
              <Linkedin className="w-5 h-5 text-ai-glow group-hover:scale-110 transition-transform" />
              <span className="text-white">LinkedIn — issac-sunny</span>
            </a>
          </div>

          {(onPreviewResume ?? onDownloadResume) && (
            <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-ai-border/60">
              {onPreviewResume && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPreviewResume}
                  className="flex items-center gap-2 border-ai-border text-white hover:bg-ai-surface hover:border-ai-glow/40"
                >
                  <FileText className="w-4 h-4" />
                  Preview résumé & Q&A
                </Button>
              )}
              {onDownloadResume && (
                <Button
                  type="button"
                  onClick={onDownloadResume}
                  className="flex items-center gap-2 bg-ai-glow/20 text-ai-glow border border-ai-glow/40 hover:bg-ai-glow/30"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </Button>
              )}
            </div>
          )}

          <form className="space-y-4" onSubmit={sendMessage}>
            <div>
              <label htmlFor="contact-name" className="sr-only">
                Your name
              </label>
              <Input
                id="contact-name"
                placeholder="Your name (optional)"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="sr-only">
                Your email
              </label>
              <Input
                id="contact-email"
                placeholder="Your email (optional)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="sr-only">
                Message
              </label>
              <textarea
                id="contact-message"
                placeholder="Message — what role, stack, or timeline?"
                rows={4}
                required
                minLength={8}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (formState !== "idle" || formNote) resetFormStatus();
                }}
                className="flex w-full rounded-lg border border-ai-border bg-ai-surface/50 px-4 py-3 text-sm text-white placeholder:text-ai-muted focus:outline-none focus:ring-2 focus:ring-ai-glow/40 focus:border-ai-glow/50 transition-all duration-300 backdrop-blur-sm resize-none"
              />
            </div>
            {formNote && (
              <p
                className={`text-sm ${
                  formState === "error" ? "text-red-400/90" : "text-ai-glow/90"
                }`}
                role="status"
              >
                {formNote}
              </p>
            )}
            <Button
              className="w-full"
              size="lg"
              type="submit"
            >
              Send message (open in email)
            </Button>
            <p className="text-center text-[11px] leading-snug text-ai-muted/85">
              Opens your default mail app to <span className="text-ai-glow/90">{contact.email}</span>{" "}
              with your text pre-filled. If the server has{" "}
              <code className="text-white/70">CONTACT_WEBHOOK_URL</code>, a copy is posted in the
              background.
            </p>
          </form>
        </motion.div>

        <LabSectionFooterStrip
          items={[
            { icon: <Mail className="h-4 w-4 text-cyan-400" aria-hidden />, label: "inbox" },
            { icon: <Phone className="h-4 w-4 text-lime-400" aria-hidden />, label: "direct line" },
            { icon: <MessageCircle className="h-4 w-4 text-fuchsia-400" aria-hidden />, label: "async note" },
          ]}
        />

        <ContactDiscussions />
      </div>
    </section>
  );
}
