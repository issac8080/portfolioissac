/**
 * Generates ATS-friendly PDF resume using jsPDF.
 * Single column, no tables/icons/graphics, Arial/Helvetica, black on white.
 */

import { jsPDF } from "jspdf";
import type { ATSResumeData } from "./resumeData";

const FILENAME = "Issac_Sunny_ATS_Resume.pdf";

// A4: 210 x 297 mm
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const FONT = "helvetica"; // ATS-safe, similar to Arial
const SIZE_TITLE = 16;
const SIZE_HEADING = 12;
const SIZE_BODY = 10;
const LINE_HEIGHT_BODY = 5;
const LINE_HEIGHT_HEADING = 6;
const SECTION_GAP = 6;
const BULLET = "• ";

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  const words = text.split(/\s+/);
  let current = "";
  for (const word of words) {
    const next = current ? current + " " + word : word;
    const w = doc.getTextWidth(next);
    if (w <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont(FONT, "bold");
  doc.setFontSize(SIZE_HEADING);
  doc.text(title, MARGIN, y);
  return y + LINE_HEIGHT_HEADING;
}

function addParagraph(
  doc: jsPDF,
  text: string,
  y: number,
  indent = false
): number {
  doc.setFont(FONT, "normal");
  doc.setFontSize(SIZE_BODY);
  const maxWidth = CONTENT_WIDTH - (indent ? doc.getTextWidth(BULLET) : 0);
  const lines = wrapText(doc, text, maxWidth);
  let cy = y;
  for (const line of lines) {
    if (indent) doc.text(BULLET + line, MARGIN, cy);
    else doc.text(line, MARGIN, cy);
    cy += LINE_HEIGHT_BODY;
  }
  return cy;
}

function addBulletLines(
  doc: jsPDF,
  items: string[],
  y: number
): number {
  doc.setFont(FONT, "normal");
  doc.setFontSize(SIZE_BODY);
  const bulletWidth = doc.getTextWidth(BULLET);
  const maxWidth = CONTENT_WIDTH - bulletWidth;
  let cy = y;
  for (const item of items) {
    const lines = wrapText(doc, item.trim(), maxWidth);
    for (const line of lines) {
      doc.text(BULLET + line, MARGIN, cy);
      cy += LINE_HEIGHT_BODY;
    }
  }
  return cy;
}

function checkNewPage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

export function generateResumePdf(data: ATSResumeData): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
  doc.setTextColor(0, 0, 0);

  let y = MARGIN;

  // Name
  doc.setFont(FONT, "bold");
  doc.setFontSize(SIZE_TITLE);
  doc.text(data.name, MARGIN, y);
  y += LINE_HEIGHT_HEADING + 2;

  // Contact
  doc.setFont(FONT, "normal");
  doc.setFontSize(SIZE_BODY);
  const contactLine = [
    data.contact.email,
    data.contact.phone,
    data.contact.linkedin,
    data.contact.location,
  ]
    .filter(Boolean)
    .join(" | ");
  const contactLines = wrapText(doc, contactLine, CONTENT_WIDTH);
  for (const line of contactLines) {
    doc.text(line, MARGIN, y);
    y += LINE_HEIGHT_BODY;
  }
  y += SECTION_GAP;

  // Summary
  y = addSectionTitle(doc, "SUMMARY", y);
  y = addParagraph(doc, data.summary, y);
  y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 3);
  y += SECTION_GAP;

  // Skills
  y = addSectionTitle(doc, "SKILLS", y);
  const skillText = data.skills.join(". ");
  y = addParagraph(doc, skillText, y);
  y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 2);
  y += SECTION_GAP;

  // Experience
  y = addSectionTitle(doc, "EXPERIENCE", y);
  for (const exp of data.experience) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(SIZE_BODY);
    doc.text(`${exp.role} — ${exp.company}`, MARGIN, y);
    y += LINE_HEIGHT_BODY;
    y = addParagraph(doc, exp.text, y, true);
    y += 2;
    y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 4);
  }
  y += SECTION_GAP;

  // Projects
  y = addSectionTitle(doc, "PROJECTS", y);
  for (const proj of data.projects) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(SIZE_BODY);
    doc.text(proj.title, MARGIN, y);
    y += LINE_HEIGHT_BODY;
    y = addParagraph(doc, proj.text, y, true);
    y += 2;
    y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 4);
  }
  y += SECTION_GAP;

  // Research / Publication
  if (data.research.length > 0) {
    y = addSectionTitle(doc, "RESEARCH / PUBLICATION", y);
    for (const r of data.research) {
      doc.setFont(FONT, "bold");
      doc.setFontSize(SIZE_BODY);
      doc.text(r.title, MARGIN, y);
      y += LINE_HEIGHT_BODY;
      y = addParagraph(doc, r.text, y, true);
      y += 2;
      y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 4);
    }
    y += SECTION_GAP;
  }

  // Education
  y = addSectionTitle(doc, "EDUCATION", y);
  for (const edu of data.education) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(SIZE_BODY);
    doc.text(edu.name, MARGIN, y);
    y += LINE_HEIGHT_BODY;
    y = addParagraph(doc, edu.text, y, true);
    y += 2;
    y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 3);
  }

  doc.save(FILENAME);
}

export function getResumePdfBlob(data: ATSResumeData): Blob {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
  doc.setTextColor(0, 0, 0);
  let y = MARGIN;
  doc.setFont(FONT, "bold");
  doc.setFontSize(SIZE_TITLE);
  doc.text(data.name, MARGIN, y);
  y += LINE_HEIGHT_HEADING + 2;
  doc.setFont(FONT, "normal");
  doc.setFontSize(SIZE_BODY);
  const contactLine = [data.contact.email, data.contact.phone, data.contact.linkedin, data.contact.location].filter(Boolean).join(" | ");
  for (const line of wrapText(doc, contactLine, CONTENT_WIDTH)) {
    doc.text(line, MARGIN, y);
    y += LINE_HEIGHT_BODY;
  }
  y += SECTION_GAP;
  y = addSectionTitle(doc, "SUMMARY", y);
  y = addParagraph(doc, data.summary, y);
  y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 3);
  y += SECTION_GAP;
  y = addSectionTitle(doc, "SKILLS", y);
  y = addParagraph(doc, data.skills.join(". "), y);
  y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 2);
  y += SECTION_GAP;
  y = addSectionTitle(doc, "EXPERIENCE", y);
  for (const exp of data.experience) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(SIZE_BODY);
    doc.text(`${exp.role} — ${exp.company}`, MARGIN, y);
    y += LINE_HEIGHT_BODY;
    y = addParagraph(doc, exp.text, y, true);
    y += 2;
    y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 4);
  }
  y += SECTION_GAP;
  y = addSectionTitle(doc, "PROJECTS", y);
  for (const proj of data.projects) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(SIZE_BODY);
    doc.text(proj.title, MARGIN, y);
    y += LINE_HEIGHT_BODY;
    y = addParagraph(doc, proj.text, y, true);
    y += 2;
    y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 4);
  }
  y += SECTION_GAP;
  if (data.research.length > 0) {
    y = addSectionTitle(doc, "RESEARCH / PUBLICATION", y);
    for (const r of data.research) {
      doc.setFont(FONT, "bold");
      doc.setFontSize(SIZE_BODY);
      doc.text(r.title, MARGIN, y);
      y += LINE_HEIGHT_BODY;
      y = addParagraph(doc, r.text, y, true);
      y += 2;
      y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 4);
    }
    y += SECTION_GAP;
  }
  y = addSectionTitle(doc, "EDUCATION", y);
  for (const edu of data.education) {
    doc.setFont(FONT, "bold");
    doc.setFontSize(SIZE_BODY);
    doc.text(edu.name, MARGIN, y);
    y += LINE_HEIGHT_BODY;
    y = addParagraph(doc, edu.text, y, true);
    y += 2;
    y = checkNewPage(doc, y, LINE_HEIGHT_BODY * 3);
  }
  return doc.output("blob");
}

export { FILENAME as RESUME_FILENAME };

/**
 * Fetch knowledgeBase, build resume data, and trigger PDF download.
 * Call from Nav or Contact "Download Resume" button.
 */
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
