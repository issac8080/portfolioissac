import {
  contact,
  summary,
  experience,
  education,
  skills,
  publication,
  projects,
} from "@/data/portfolio";

/**
 * Plain-text resume facts for the resume-study OpenAI route (structured site data;
 * wording may differ slightly from the PDF).
 */
export function buildResumeStudyContext(): string {
  const blocks: string[] = [];

  blocks.push("# Issac Sunny — structured resume context\n");

  blocks.push("## Contact\n");
  blocks.push(`- Email: ${contact.email}`);
  blocks.push(`- Mobile: ${contact.mobile}`);
  blocks.push(`- LinkedIn: ${contact.linkedin}\n`);

  blocks.push("## Professional summary\n");
  blocks.push(summary + "\n");

  blocks.push("## Experience\n");
  for (const e of experience) {
    blocks.push(
      `- **${e.role}** at ${e.company} (${e.period})${e.location ? ` — ${e.location}` : ""}` +
        (e.description ? `\n  ${e.description}` : "")
    );
  }
  blocks.push("");

  blocks.push("## Education\n");
  for (const ed of education) {
    blocks.push(`- ${ed.degree} — ${ed.name} (${ed.period})`);
  }
  blocks.push("");

  blocks.push("## Skills & certifications\n");
  blocks.push(`- Top: ${skills.top.join(", ")}`);
  blocks.push("- Certifications:");
  for (const c of skills.certifications) {
    blocks.push(`  - ${c}`);
  }
  blocks.push("");

  blocks.push("## Publication\n");
  blocks.push(`- ${publication.title}`);
  blocks.push(`  (${publication.role}, ${publication.location})\n`);

  blocks.push("## Selected projects (portfolio site)\n");
  for (const p of projects.slice(0, 16)) {
    blocks.push(`- **${p.title}** (${p.category}): ${p.description}`);
  }

  return blocks.join("\n");
}
