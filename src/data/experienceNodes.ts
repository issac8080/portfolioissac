/**
 * Honeycomb neural grid experience nodes.
 * Used for Role, Organization, Duration, Contribution, Impact, Technologies in modal.
 */

export type ExperienceNode = {
  id: string;
  role: string;
  organization: string;
  period: string;
  duration: string;
  location: string | null;
  contribution: string;
  impact: string;
  technologies: string[];
};

export const experienceNodes: ExperienceNode[] = [
  {
    id: "g10x-salesforce",
    role: "Associate - Salesforce",
    organization: "G10X",
    period: "February 2026 - Present",
    duration: "1 month",
    location: "Kochi",
    contribution: "Salesforce development, Apex automation, and client delivery as part of the G10X practice.",
    impact: "Building production-grade Salesforce solutions and supporting enterprise workflows.",
    technologies: ["Salesforce", "Apex", "Lightning", "SOQL", "Integration"],
  },
  {
    id: "whitematrix-ai",
    role: "AI Engineer Intern",
    organization: "WHITE MATRIX Software Solutions",
    period: "March 2024 - March 2025",
    duration: "1 year 1 month",
    location: "India",
    contribution: "Designed and implemented AI/ML pipelines, model training, and integration for client projects.",
    impact: "Delivered AI solutions that improved automation and decision support for production systems.",
    technologies: ["Python", "TensorFlow", "PyTorch", "MLOps", "APIs"],
  },
  {
    id: "codsoft-ml",
    role: "ML Intern",
    organization: "CodSoft",
    period: "June 2024 - July 2024",
    duration: "2 months",
    location: "India",
    contribution: "Built and trained ML models for classification and regression tasks; contributed to data pipelines.",
    impact: "Hands-on experience in end-to-end ML workflows and model deployment.",
    technologies: ["Python", "Scikit-learn", "Pandas", "NumPy", "Jupyter"],
  },
  {
    id: "ieee-chair",
    role: "IEEE Computer Society Chairman",
    organization: "Christ College of Engineering",
    period: "2022 – 2024",
    duration: "2 years",
    location: "Irinjalakuda, Kerala, India",
    contribution:
      "Led IEEE Computer Society programs: CTF 2024, AI/ML and cybersecurity webinars, React/Firebase workshop, and cloud/DevOps fundamentals — from scoping and sponsors to live labs and judging.",
    impact:
      "Grew technical participation across cohorts; strengthened secure-engineering awareness and practical build skills aligned with industry hiring bar.",
    technologies: ["Leadership", "IEEE", "Event Ops", "Cybersecurity", "Community"],
  },
  {
    id: "ziuke-web",
    role: "Web Dev Intern",
    organization: "ZIUKE INFOTECH",
    period: "July 2024 - January 2025",
    duration: "7 months",
    location: "Thrissur, Kerala, India",
    contribution: "Website design and full-stack development for client projects using modern web stack.",
    impact: "Shipped responsive, accessible sites and internal tools used in production.",
    technologies: ["React", "Node.js", "HTML/CSS", "JavaScript", "REST APIs"],
  },
  {
    id: "ict-mern",
    role: "MERN Internship",
    organization: "ICT Academy of Kerala",
    period: "May 2023 - June 2023",
    duration: "2 months",
    location: "Kerala, India",
    contribution: "Full stack development with MongoDB, Express, React, and Node.js for dynamic web applications.",
    impact: "Solidified MERN stack skills and delivered capstone-style projects.",
    technologies: ["MongoDB", "Express.js", "React", "Node.js", "MERN"],
  },
];

/**
 * Edges for the career graph (indices match `experienceNodes` order):
 * 0 G10X · 1 White Matrix · 2 CodSoft · 3 IEEE · 4 ZIUKE · 5 ICT
 *
 * Meaning: ML thread (2→1→0), web thread (5→4→0), leadership→core (3→1),
 * concurrent AI + web (1↔4).
 */
export const experienceEdges: [number, number][] = [
  [2, 1],
  [1, 0],
  [5, 4],
  [4, 0],
  [3, 1],
  [1, 4],
];
