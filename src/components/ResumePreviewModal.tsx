"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buildResumeData } from "@/lib/resumeData";
import { generateResumePdf } from "@/lib/generateResumePdf";
import type { ATSResumeData } from "@/lib/resumeData";
import {
  contact,
  summary,
  experience,
  education,
  publication,
} from "@/data/portfolio";

/* ATS-style resume preview: single column, no icons, black on white, standard headings */
const resumePreviewStyles = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "10pt",
  color: "#000",
  backgroundColor: "#fff",
  maxWidth: "210mm",
  margin: "0 auto",
  padding: "20mm",
  lineHeight: 1.4,
  overflowWrap: "break-word" as const,
};

const sectionTitleStyle = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "12pt",
  fontWeight: 700,
  marginTop: "6px",
  marginBottom: "4px",
  color: "#000",
};

const titleStyle = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "16pt",
  fontWeight: 700,
  marginBottom: "4px",
  color: "#000",
};

export default function ResumePreviewModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [data, setData] = useState<ATSResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResumeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/knowledgeBase.json");
      if (!res.ok) throw new Error("Failed to load knowledge base");
      const kb = await res.json();
      const resumeData = buildResumeData(kb, {
        contact,
        summary,
        experience,
        education,
        publication,
      });
      setData(resumeData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load resume data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) loadResumeData();
  }, [open, loadResumeData]);

  const handleDownload = useCallback(() => {
    if (!data) return;
    generateResumePdf(data);
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col border border-ai-border bg-ai-bg p-0 rounded-xl"
        style={{
          maxWidth: "min(95vw, 230mm)",
          touchAction: "manipulation",
        }}
      >
        <DialogHeader className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b border-ai-border">
          <DialogTitle className="text-white text-base sm:text-lg">
            ATS Resume Preview
          </DialogTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button
              type="button"
              onClick={handleDownload}
              disabled={!data || loading}
              className="min-h-[44px] min-w-[44px] touch-manipulation bg-ai-glow/20 text-ai-glow border border-ai-border hover:bg-ai-glow/30"
            >
              Download Resume
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-h-[44px] min-w-[44px] touch-manipulation border-ai-border text-white hover:bg-ai-surface"
            >
              Close
            </Button>
          </div>
        </DialogHeader>

        <div
          className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-4 sm:px-6 pb-6 pt-3"
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            overflowX: "hidden",
          }}
        >
          {loading && (
            <p className="text-ai-muted py-8 text-center">Loading resume…</p>
          )}
          {error && (
            <p className="text-red-400 py-8 text-center">{error}</p>
          )}
          {data && !loading && (
            <div
              className="resume-preview-document rounded shadow-lg mx-auto w-full box-border"
              style={{
                ...resumePreviewStyles,
                maxWidth: "210mm",
                minHeight: "297mm",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              <h1 style={titleStyle}>{data.name}</h1>
              <p style={{ margin: "0 0 8px 0", ...resumePreviewStyles }}>
                {[data.contact.email, data.contact.phone, data.contact.linkedin, data.contact.location]
                  .filter(Boolean)
                  .join(" | ")}
              </p>

              <h2 style={sectionTitleStyle}>SUMMARY</h2>
              <p style={{ margin: "0 0 6px 0", ...resumePreviewStyles }}>
                {data.summary}
              </p>

              <h2 style={sectionTitleStyle}>SKILLS</h2>
              <p style={{ margin: "0 0 6px 0", ...resumePreviewStyles }}>
                {data.skills.join(". ")}
              </p>

              <h2 style={sectionTitleStyle}>EXPERIENCE</h2>
              {data.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: "6px" }}>
                  <p style={{ fontWeight: 700, margin: "0 0 2px 0", ...resumePreviewStyles }}>
                    {exp.role} — {exp.company}
                  </p>
                  <p style={{ margin: "0 0 4px 0", paddingLeft: "1em", ...resumePreviewStyles }}>
                    • {exp.text}
                  </p>
                </div>
              ))}

              <h2 style={sectionTitleStyle}>PROJECTS</h2>
              {data.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: "6px" }}>
                  <p style={{ fontWeight: 700, margin: "0 0 2px 0", ...resumePreviewStyles }}>
                    {proj.title}
                  </p>
                  <p style={{ margin: "0 0 4px 0", paddingLeft: "1em", ...resumePreviewStyles }}>
                    • {proj.text}
                  </p>
                </div>
              ))}

              {data.research.length > 0 && (
                <>
                  <h2 style={sectionTitleStyle}>RESEARCH / PUBLICATION</h2>
                  {data.research.map((r, i) => (
                    <div key={i} style={{ marginBottom: "6px" }}>
                      <p style={{ fontWeight: 700, margin: "0 0 2px 0", ...resumePreviewStyles }}>
                        {r.title}
                      </p>
                      <p style={{ margin: "0 0 4px 0", paddingLeft: "1em", ...resumePreviewStyles }}>
                        • {r.text}
                      </p>
                    </div>
                  ))}
                </>
              )}

              <h2 style={sectionTitleStyle}>EDUCATION</h2>
              {data.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: "6px" }}>
                  <p style={{ fontWeight: 700, margin: "0 0 2px 0", ...resumePreviewStyles }}>
                    {edu.name}
                  </p>
                  <p style={{ margin: "0 0 4px 0", paddingLeft: "1em", ...resumePreviewStyles }}>
                    • {edu.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
