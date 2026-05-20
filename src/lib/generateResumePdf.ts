/**
 * ATS-targeted PDF resume (jsPDF): single column, Helvetica, black on white,
 * standard section labels, comma-separated skills, reverse-chronological experience.
 */

import { jsPDF } from "jspdf";
import type { ATSResumeData } from "./resumeData";

export const RESUME_FILENAME = "Issac_Sunny_ATS_Resume.pdf";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const FONT = "helvetica";
const SIZE_NAME = 14;
const SIZE_SECTION = 11;
const SIZE_BODY = 10;
/** Tight line spacing (ATS one-page density) */
const LINE_BODY = 4;
const LINE_SECTION = 5;
const SECTION_AFTER = 3;
const BLOCK_GAP = 2;
const BULLET = "- ";

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  const words = text.split(/\s+/);
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (doc.getTextWidth(next) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function titleSection(doc: jsPDF, label: string, y: number): number {
  doc.setFont(FONT, "bold");
  doc.setFontSize(SIZE_SECTION);
  doc.text(label.toUpperCase(), MARGIN, y);
  return y + LINE_SECTION;
}

function flowParagraph(
  doc: jsPDF,
  text: string,
  y: number,
  indentBullet: boolean
): number {
  doc.setFont(FONT, "normal");
  doc.setFontSize(SIZE_BODY);
  const bulletW = indentBullet ? doc.getTextWidth(BULLET) : 0;
  const maxW = CONTENT_WIDTH - bulletW;
  let cy = y;
  for (const line of wrapText(doc, text, maxW)) {
    doc.text(
      indentBullet ? `${BULLET}${line}` : line,
      MARGIN,
      cy
    );
    cy += LINE_BODY;
  }
  return cy;
}

function flowBullets(doc: jsPDF, items: string[], y: number): number {
  let cy = y;
  for (const item of items) {
    cy = flowParagraph(doc, item.trim(), cy, true);
  }
  return cy;
}

function needPage(doc: jsPDF, y: number, reserveMm: number): number {
  if (y + reserveMm > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function paintResume(doc: jsPDF, data: ATSResumeData): void {
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
  doc.setTextColor(0, 0, 0);

  let y = MARGIN;

  doc.setFont(FONT, "bold");
  doc.setFontSize(SIZE_NAME);
  doc.text(data.name, MARGIN, y);
  y += LINE_SECTION + 1;

  doc.setFont(FONT, "normal");
  doc.setFontSize(SIZE_BODY);
  const contactStr = [
    data.contact.email,
    data.contact.phone,
    data.contact.linkedin,
    data.contact.location,
  ]
    .filter(Boolean)
    .join(" | ");
  for (const line of wrapText(doc, contactStr, CONTENT_WIDTH)) {
    doc.text(line, MARGIN, y);
    y += LINE_BODY;
  }
  y += SECTION_AFTER;

  y = titleSection(doc, "Professional Summary", y);
  y = flowParagraph(doc, data.summary, y, false);
  y = needPage(doc, y, LINE_BODY * 4);
  y += SECTION_AFTER;

  y = titleSection(doc, "Core Competencies", y);
  y = flowParagraph(doc, data.skillsLine, y, false);
  y = needPage(doc, y, LINE_BODY * 3);
  y += SECTION_AFTER;

  y = titleSection(doc, "Professional Experience", y);
  for (const exp of data.experience) {
    y = needPage(doc, y, LINE_BODY * 6);
    doc.setFont(FONT, "bold");
    doc.setFontSize(SIZE_BODY);
    doc.text(exp.role, MARGIN, y);
    y += LINE_BODY;
    doc.setFont(FONT, "normal");
    doc.setFontSize(SIZE_BODY);
    const meta = [exp.company, exp.location, exp.period]
      .filter((x) => x && x.length > 0)
      .join(" | ");
    for (const line of wrapText(doc, meta, CONTENT_WIDTH)) {
      doc.text(line, MARGIN, y);
      y += LINE_BODY;
    }
    y = flowBullets(doc, exp.bullets, y);
    y += BLOCK_GAP;
  }
  y += SECTION_AFTER;

  if (data.projects.length > 0) {
    y = titleSection(doc, "Selected Projects", y);
    for (const proj of data.projects) {
      y = needPage(doc, y, LINE_BODY * 5);
      doc.setFont(FONT, "bold");
      doc.setFontSize(SIZE_BODY);
      doc.text(proj.title, MARGIN, y);
      y += LINE_BODY;
      y = flowBullets(doc, proj.bullets, y);
      y += BLOCK_GAP;
    }
    y += SECTION_AFTER;
  }

  if (data.research.length > 0) {
    y = titleSection(doc, "Research and Publications", y);
    for (const r of data.research) {
      y = needPage(doc, y, LINE_BODY * 6);
      doc.setFont(FONT, "bold");
      doc.setFontSize(SIZE_BODY);
      for (const line of wrapText(doc, r.title, CONTENT_WIDTH)) {
        doc.text(line, MARGIN, y);
        y += LINE_BODY;
      }
      doc.setFont(FONT, "normal");
      y = flowBullets(doc, r.bullets, y);
      y += BLOCK_GAP;
    }
    y += SECTION_AFTER;
  }

  y = titleSection(doc, "Education", y);
  for (const edu of data.education) {
    y = needPage(doc, y, LINE_BODY * 4);
    doc.setFont(FONT, "bold");
    doc.setFontSize(SIZE_BODY);
    for (const line of wrapText(doc, edu.institution, CONTENT_WIDTH)) {
      doc.text(line, MARGIN, y);
      y += LINE_BODY;
    }
    doc.setFont(FONT, "normal");
    for (const line of wrapText(doc, edu.detailLine, CONTENT_WIDTH)) {
      doc.text(line, MARGIN, y);
      y += LINE_BODY;
    }
    y += BLOCK_GAP;
  }
}

export function generateResumePdf(data: ATSResumeData): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  paintResume(doc, data);
  doc.save(RESUME_FILENAME);
}

export function getResumePdfBlob(data: ATSResumeData): Blob {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  paintResume(doc, data);
  return doc.output("blob");
}

export async function downloadResumePdf(): Promise<void> {
  const res = await fetch("/knowledgeBase.json");
  if (!res.ok) throw new Error("Failed to load knowledge base");
  const kb = await res.json();
  const { buildResumeData } = await import("./resumeData");
  const portfolio = await import("@/data/portfolio").then((m) => ({
    contact: m.contact,
    summary: m.summary,
    experience: m.experience,
    education: m.education,
    publication: m.publication,
  }));
  const data = buildResumeData(kb, portfolio);
  generateResumePdf(data);
}
