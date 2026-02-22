/**
 * Builds ATS resume data from knowledgeBase.json and portfolio data.
 */

export interface ATSResumeData {
  name: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    location?: string;
  };
  summary: string;
  skills: string[];
  experience: { role: string; company: string; text: string }[];
  projects: { title: string; text: string }[];
  research: { title: string; text: string }[];
  education: { name: string; text: string }[];
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

export function buildResumeData(
  knowledgeBase: KnowledgeBase,
  portfolio: {
    contact: { mobile: string; email: string; linkedin: string };
    summary: string;
    experience: { company: string; role: string; period: string; location: string | null; description: string | null }[];
    education: { name: string; degree: string; period: string }[];
    publication: { title: string; author: string; role: string; location: string };
  }
): ATSResumeData {
  const chunks = knowledgeBase.chunks ?? [];
  const byCategory = (cat: string) => chunks.filter((c) => c.category === cat);

  const name = "Issac Sunny";
  const contact = {
    email: portfolio.contact.email,
    phone: portfolio.contact.mobile,
    linkedin: portfolio.contact.linkedin,
    location: "Thrissur, Kerala, India",
  };
  const summary = portfolio.summary;

  const skillChunks = byCategory("skills");
  const skills: string[] = [];
  const skillText = skillChunks.map((c) => c.text).join(" ");
  if (skillText) {
    const parts = skillText.replace(/Technologies:\s*/i, "").split(/[.,;]/).map((s) => s.trim()).filter((s) => s.length > 2);
    const seen = new Set<string>();
    for (const p of parts) {
      const n = p.replace(/\s+/g, " ").trim();
      if (n.length > 3 && n.length < 80 && !seen.has(n)) {
        seen.add(n);
        skills.push(n);
      }
    }
  }
  if (skills.length === 0) {
    skills.push("Salesforce Training, Salesforce.com Development, Apex Programming", "Python, Machine Learning, TensorFlow", "MERN Stack, React, Node.js, MongoDB", "Cloud Computing, Full-stack and AI engineering");
  }

  const expChunks = byCategory("experience");
  const experience =
    expChunks.length > 0
      ? expChunks.map((c) => ({ role: c.source, company: c.source, text: c.text }))
      : portfolio.experience.map((e) => ({
          role: e.role,
          company: e.company,
          text: [e.role, e.company, e.period, e.location, e.description].filter(Boolean).join(". "),
        }));

  const projChunks = byCategory("projects");
  const projects = projChunks.map((c) => ({ title: c.source, text: c.text }));

  const researchChunks = byCategory("research");
  const research = researchChunks.map((c) => ({ title: c.source, text: c.text }));

  const education = portfolio.education.map((e) => ({
    name: e.name,
    text: [e.degree, e.period].filter(Boolean).join(". "),
  }));

  return { name, contact, summary, skills, experience, projects, research, education };
}
