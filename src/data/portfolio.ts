export const contact = {
  mobile: "9072185621",
  email: "issacsunny@icloud.com",
  linkedin: "https://www.linkedin.com/in/issac-sunny/",
};

export const skills = {
  top: ["Salesforce Training", "Salesforce.com Development", "Apex Programming"],
  languages: [
    { name: "Malayalam", level: "Native or Bilingual" },
    { name: "English", level: "Native or Bilingual" },
    { name: "Hindi", level: "Professional Working" },
  ],
  certifications: [
    "Python & TensorFlow: Deep Dive into Machine Learning",
    "Introduction to Conversational AI",
    "Build a resume review Agentic system with crew AI",
    "CSS, Bootstrap And JavaScript And Python Stack Course",
    "Basics of Cloud Computing | Fundamentals of Cloud Computing",
  ],
};

export const publication = {
  title:
    "Behavioral Insider Threat Detection using a Hybrid Transformer-LSTM Autoencoder Architecture with Enhanced Explainability and Scalability",
  author: "Issac Sunny",
  role: "Associate - Salesforce | G10X",
  location: "Thrissur, Kerala, India",
};

export const summary =
  "Computer Science Engineering graduate from Christ College of Engineering with hands-on experience in AI, Machine Learning, and Full-Stack Development. Completed internships at WhiteMatrix, CodSoft, and ZIUKE INFOTECH, contributing to projects in AI solutions, web development, and backend systems. Proficient in Python, C, and ML frameworks, with a strong focus on building efficient, real-world tech solutions. Fluent in English, Malayalam, and Hindi, and passionate about working in dynamic, innovation-driven environments. Open to opportunities in AI Engineering, ML, or Software Development.";

export const experience = [
  {
    company: "G10X",
    role: "Associate - Salesforce",
    period: "February 2026 - Present",
    duration: "1 month",
    location: "Kochi",
    description: null,
  },
  {
    company: "G10X",
    role: "Internal trainee",
    period: "November 2025 - February 2026",
    duration: "4 months",
    location: "Kochi, Kerala, India",
    description: null,
  },
  {
    company: "PKJ INTERNATIONAL LLC",
    role: "Technical Sourcing Intern",
    period: "January 2025 - March 2025",
    duration: "3 months",
    location: "Kinfra park, Koratty",
    description: null,
  },
  {
    company: "WHITE MATRIX Software solutions",
    role: "A.I Engineer Intern",
    period: "March 2024 - March 2025",
    duration: "1 year 1 month",
    location: "India",
    description: null,
  },
  {
    company: "ZIUKE INFOTECH",
    role: "Website Design and Development Intern",
    period: "July 2024 - January 2025",
    duration: "7 months",
    location: "Thrissur, Kerala, India",
    description: null,
  },
  {
    company: "SnagPro Inspector",
    role: "Website Designer",
    period: "September 2024 - October 2024",
    duration: "2 months",
    location: "Renfrewshire, Scotland, United Kingdom",
    description: null,
  },
  {
    company: "CodSoft",
    role: "Machine Learning Intern",
    period: "June 2024 - July 2024",
    duration: "2 months",
    location: "India",
    description: null,
  },
  {
    company: "IEEE Computer Society",
    role: "Chair",
    period: "March 2023 - March 2024",
    duration: "1 year 1 month",
    location: "Irinjalakuda, Kerala, India",
    description:
      "Led a thriving community of technology enthusiasts, fostering innovation and professional growth. Impactful events and collaborations, knowledge sharing and networking.",
  },
  {
    company: "Internshala",
    role: "Campus Ambassador",
    period: "May 2023 - June 2023",
    duration: "2 months",
    location: "India",
    description: null,
  },
  {
    company: "ICT Academy of Kerala",
    role: "Summer Intern",
    period: "May 2023 - June 2023",
    duration: "2 months",
    location: "Kerala, India",
    description: "Full Stack Development (MERN) — MongoDB, Express.js, React.js, Node.js.",
  },
  {
    company: "Steyp",
    role: "Program Associate",
    period: "April 2023 - May 2023",
    duration: "2 months",
    location: null,
    description: null,
  },
  {
    company: "Tutedude",
    role: "Marketing Intern",
    period: "December 2021 - January 2022",
    duration: "2 months",
    location: "India",
    description: null,
  },
  {
    company: "Ever Green Group",
    role: "Web Designer",
    period: "November 2021",
    duration: "1 month",
    location: "Qatar",
    description: null,
  },
];

export const education = [
  {
    name: "Christ College of Engineering",
    degree: "Bachelor of Technology - BTech, Computer science and engineering",
    period: "November 2021 - May 2025",
  },
  {
    name: "APJ Abdul Kalam Technological University",
    degree: "Bachelor of Technology - BTech, Computer Engineering",
    period: "November 2021 - January 2025",
  },
  {
    name: "Christ Vidyanikethan, Irinjalakuda",
    degree: "Science",
    period: "January 2006 - July 2021",
  },
];

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  tech: string[];
  github: string | null;
  link: string | null;
};

export const projects: Project[] = [
  {
    id: "insider-threat",
    title: "Behavioral Insider Threat Detection",
    subtitle: "Hybrid Transformer-LSTM Autoencoder",
    category: "AI Research",
    description:
      "Research on insider threat detection using a hybrid Transformer-LSTM autoencoder with enhanced explainability and scalability.",
    tech: ["PyTorch", "Transformer", "LSTM", "Autoencoder", "Explainability"],
    github: null,
    link: null,
  },
  {
    id: "salesforce",
    title: "Salesforce Solutions",
    category: "Salesforce",
    subtitle: "Development & Automation",
    description: "Salesforce.com development, Apex programming, and training solutions at G10X.",
    tech: ["Salesforce", "Apex", "Lightning", "Integration"],
    github: null,
    link: null,
  },
  {
    id: "ml-intern",
    title: "ML & AI Solutions",
    category: "Machine Learning",
    subtitle: "WhiteMatrix & CodSoft",
    description: "AI/ML projects during internships: model training, data pipelines, and deployment.",
    tech: ["Python", "TensorFlow", "Scikit-learn", "MLOps"],
    github: null,
    link: null,
  },
  {
    id: "web-dev",
    title: "Web Design & Development",
    category: "Full-Stack",
    subtitle: "ZIUKE, SnagPro, Ever Green",
    description: "Website design and development across multiple internships and roles.",
    tech: ["React", "Node.js", "MongoDB", "CSS", "JavaScript"],
    github: null,
    link: null,
  },
];

export const leadership = [
  {
    org: "IEEE Computer Society",
    role: "Chair",
    period: "March 2023 - March 2024",
    location: "Irinjalakuda, Kerala, India",
    description:
      "Led the community of technology enthusiasts, fostering innovation and professional growth. Drove strategic direction and empowered members in computer science.",
  },
];
