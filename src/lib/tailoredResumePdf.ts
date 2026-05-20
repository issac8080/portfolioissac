import { jsPDF } from "jspdf";
import { buildTailoredResume, type ResumeRoleId } from "@/lib/tailoredResume";

const MARGIN = 48;
const LINE = 13;
const LINE_TITLE = 17;

function ensureSpace(
  pdf: jsPDF,
  y: { v: number },
  need: number,
  pageH: number
): void {
  if (y.v + need > pageH - MARGIN) {
    pdf.addPage();
    y.v = MARGIN;
  }
}

function writeLines(
  pdf: jsPDF,
  lines: string | string[],
  y: { v: number },
  pageW: number,
  pageH: number,
  fontSize: number,
  style: "normal" | "bold" = "normal"
): void {
  pdf.setFont("helvetica", style);
  pdf.setFontSize(fontSize);
  const maxW = pageW - MARGIN * 2;
  const chunk = Array.isArray(lines) ? lines.join("\n") : lines;
  const split = pdf.splitTextToSize(chunk, maxW);
  for (const line of split) {
    ensureSpace(pdf, y, LINE + 2, pageH);
    pdf.text(line, MARGIN, y.v);
    y.v += LINE;
  }
  y.v += 4;
}

/** Client-side PDF export (jsPDF) — instant download, no server round-trip. */
export function downloadTailoredResumeForRole(roleId: ResumeRoleId): void {
  const d = buildTailoredResume(roleId);
  const pdf = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const y = { v: MARGIN };

  writeLines(pdf, "Issac Sunny", y, pageW, pageH, 20, "bold");
  writeLines(pdf, d.headline, y, pageW, pageH, 14, "bold");
  writeLines(pdf, d.contactLine, y, pageW, pageH, 10, "normal");

  y.v += 6;
  writeLines(pdf, "SUMMARY", y, pageW, pageH, LINE_TITLE, "bold");
  for (const p of d.summaryParagraphs) {
    writeLines(pdf, p, y, pageW, pageH, 11, "normal");
  }

  writeLines(pdf, "SKILLS & LANGUAGES", y, pageW, pageH, LINE_TITLE, "bold");
  writeLines(pdf, d.skillBullets.map((s) => `• ${s}`).join("\n"), y, pageW, pageH, 10, "normal");

  writeLines(pdf, "CERTIFICATIONS (role-selected)", y, pageW, pageH, LINE_TITLE, "bold");
  writeLines(
    pdf,
    d.certifications.length ? d.certifications.map((s) => `• ${s}`).join("\n") : "• See full list on portfolio site.",
    y,
    pageW,
    pageH,
    10,
    "normal"
  );

  writeLines(pdf, "SELECTED PROJECTS (re-ranked for role)", y, pageW, pageH, LINE_TITLE, "bold");
  for (const p of d.projects) {
    writeLines(
      pdf,
      `• ${p.title}\n  ${p.line}\n  Tech: ${p.tech.join(", ")}`,
      y,
      pageW,
      pageH,
      10,
      "normal"
    );
  }

  writeLines(pdf, "EXPERIENCE (re-ordered for emphasis)", y, pageW, pageH, LINE_TITLE, "bold");
  for (const e of d.experience) {
    const loc = e.location ? ` | ${e.location}` : "";
    writeLines(
      pdf,
      `• ${e.role} — ${e.company}\n  ${e.period}${loc}`,
      y,
      pageW,
      pageH,
      10,
      "normal"
    );
  }

  writeLines(pdf, "EDUCATION", y, pageW, pageH, LINE_TITLE, "bold");
  for (const ed of d.education) {
    writeLines(pdf, `• ${ed.degree} — ${ed.name} (${ed.period})`, y, pageW, pageH, 10, "normal");
  }

  if (d.publicationLine) {
    writeLines(pdf, "PUBLICATION", y, pageW, pageH, LINE_TITLE, "bold");
    writeLines(pdf, d.publicationLine, y, pageW, pageH, 10, "normal");
  }

  writeLines(
    pdf,
    "Generated locally from structured portfolio data. Verify facts before external distribution.",
    y,
    pageW,
    pageH,
    9,
    "normal"
  );

  const safe = roleId.replace(/[^a-z0-9_]+/gi, "_");
  pdf.save(`Issac_Sunny_${safe}_Resume.pdf`);
}
