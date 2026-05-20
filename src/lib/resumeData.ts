/**
 * Builds ATS-friendly resume data from knowledgeBase.json and portfolio data.
 * Structured for parsers: consistent headings, comma-separated skills, reverse-chronological
 * experience with location/dates on one line, hyphen bullets (no special Unicode dashes).
 */

export interface ATSExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface ATSProjectEntry {
  title: string;
  bullets: string[];
}

export interface ATSResearchEntry {
  title: string;
  bullets: string[];
}

export interface ATSEducationEntry {
  institution: string;
  detailLine: string;
}

export interface ATSResumeData {
  name: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    location?: string;
  };
  summary: string;
  /** Single comma-separated line for ATS parsers */
  skillsLine: string;
  experience: ATSExperienceEntry[];
  projects: ATSProjectEntry[];
  research: ATSResearchEntry[];
  education: ATSEducationEntry[];
}

interface KnowledgeChunk {
  id: string;
  text: string;
  category: string;
  source: string;
}

interface KnowledgeBase {
  chunks: KnowledgeChunk[];
}

/** Replace em/en dashes and fancy punctuation with ATS-safe ASCII */
export function sanitizeAtsText(s: string): string {
  return s
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/\u2022/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function splitIntoBullets(text: string, maxBullets = 5): string[] {
  const t = sanitizeAtsText(text);
  if (!t) return [];
  const parts = t
    .split(/(?<=[.!?])\s+/)
    .map((x) => sanitizeAtsText(x))
    .filter((x) => x.length > 2);
  const out = parts.length > 0 ? parts : [t];
  return out.slice(0, maxBullets);
}

function skillsFromKnowledge(chunks: KnowledgeChunk[]): string[] {
  const skillChunks = chunks.filter((c) => c.category === "skills");
  const skillText = skillChunks.map((c) => c.text).join(" ");
  const skills: string[] = [];
  if (skillText) {
    const parts = skillText
      .replace(/Technologies:\s*/i, "")
      .split(/[.,;]/)
      .map((s) => sanitizeAtsText(s))
      .filter((s) => s.length > 2 && s.length < 90);
    const seen = new Set<string>();
    for (const p of parts) {
      const n = p;
      if (!seen.has(n.toLowerCase())) {
        seen.add(n.toLowerCase());
        skills.push(n);
      }
    }
  }
  if (skills.length === 0) {
    return [
      "Salesforce",
      "Apex",
      "Lightning Web Components",
      "Python",
      "Machine Learning",
      "TensorFlow",
      "PyTorch",
      "React",
      "Node.js",
      "MongoDB",
      "REST APIs",
      "MLOps",
    ];
  }
  return skills;
}

export function buildResumeData(
  knowledgeBase: KnowledgeBase,
  portfolio: {
    contact: { mobile: string; email: string; linkedin: string };
    summary: string;
    experience: {
      company: string;
      role: string;
      period: string;
      duration: string;
      location: string | null;
      description: string | null;
    }[];
    education: { name: string; degree: string; period: string }[];
    publication: {
      title: string;
      author: string;
      role: string;
      location: string;
    };
  }
): ATSResumeData {
  const chunks = knowledgeBase.chunks ?? [];

  const name = "Issac Sunny";
  const contact = {
    email: portfolio.contact.email,
    phone: portfolio.contact.mobile,
    linkedin: portfolio.contact.linkedin,
    location: "Thrissur, Kerala, India",
  };

  const summary = sanitizeAtsText(portfolio.summary);

  const skillsArr = skillsFromKnowledge(chunks);
  const skillsLine = skillsArr.join(", ");

  const experience: ATSExperienceEntry[] = portfolio.experience.map((e) => {
    const loc = e.location ? sanitizeAtsText(e.location) : "";
    const bullets: string[] = e.description
      ? splitIntoBullets(e.description, 5)
      : [
          sanitizeAtsText(
            `${e.period} (${e.duration})${loc ? ` - ${loc}` : ""}`
          ),
        ];
    return {
      role: sanitizeAtsText(e.role),
      company: sanitizeAtsText(e.company),
      location: loc,
      period: sanitizeAtsText(e.period),
      bullets,
    };
  });

  const projChunks = chunks.filter((c) => c.category === "projects");
  const projects: ATSProjectEntry[] = projChunks.map((c) => ({
    title: sanitizeAtsText(c.source),
    bullets: splitIntoBullets(c.text, 4).length
      ? splitIntoBullets(c.text, 4)
      : [sanitizeAtsText(c.text)],
  }));

  const researchChunks = chunks.filter((c) => c.category === "research");
  const research: ATSResearchEntry[] = [];

  research.push({
    title: sanitizeAtsText(portfolio.publication.title),
    bullets: [
      sanitizeAtsText(
        `Author: ${portfolio.publication.author}. ${portfolio.publication.role}. ${portfolio.publication.location}.`
      ),
    ],
  });

  for (const c of researchChunks) {
    research.push({
      title: sanitizeAtsText(c.source),
      bullets: splitIntoBullets(c.text, 4).length
        ? splitIntoBullets(c.text, 4)
        : [sanitizeAtsText(c.text)],
    });
  }

  const education: ATSEducationEntry[] = portfolio.education.map((edu) => ({
    institution: sanitizeAtsText(edu.name),
    detailLine: sanitizeAtsText(`${edu.degree} | ${edu.period}`),
  }));

  return {
    name,
    contact,
    summary,
    skillsLine,
    experience,
    projects,
    research,
    education,
  };
}
