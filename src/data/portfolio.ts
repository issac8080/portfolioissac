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
    id: "code-dependency-impact",
    title: "Code Dependency & Impact Analyzer",
    subtitle: "November 2025 · Static analysis & blast radius",
    category: "Developer Tools",
    description:
      "Production-grade static analysis for large Python codebases: AST import graphs, dependency visualization, transitive impact, and low-to-critical risk scoring for safer deploys and refactors.",
    tech: ["Python", "AST", "NetworkX", "Graph algorithms", "Static analysis"],
    github: null,
    link: null,
  },
  {
    id: "aurashop",
    title: "AuraShop",
    subtitle: "December 2025 · AI e-commerce",
    category: "AI E-Commerce",
    description:
      "Full-stack AI shopping: recommendations, streaming assistant (OpenAI), wallet/rewards, QR pickup, gamified discounts, order tracking, glassmorphism UI with offline fallback; FastAPI backend.",
    tech: ["Next.js", "FastAPI", "OpenAI API", "Tailwind CSS", "REST APIs"],
    github: null,
    link: null,
  },
  {
    id: "autonomous-returns",
    title: "Autonomous Returns & Exchange Resolution",
    subtitle: "January 2026 · Agentic commerce ops",
    category: "AI Operations",
    description:
      "GPT-4o Vision defect analysis, LangGraph policy agents, RAG over policies (ChromaDB, SentenceTransformers), and automated customer comms for returns and exchanges.",
    tech: ["LangGraph", "GPT-4o Vision", "React", "ChromaDB", "RAG"],
    github: null,
    link: null,
  },
  {
    id: "expenze",
    title: "Expenze",
    subtitle: "January 2026 · WhatsApp expense bot",
    category: "FinTech & Chatbots",
    description:
      "Expense tracking with a WhatsApp AI chatbot: conversational logging, categorization, spending insights, and a clean responsive UI wired to backend automation.",
    tech: ["WhatsApp", "AI chatbot", "NLP", "Backend", "UI/UX"],
    github: null,
    link: null,
  },
  {
    id: "blinkgrid",
    title: "BlinkGrid",
    subtitle: "February 2026 · Multiplayer reaction game",
    category: "Real-Time Gaming",
    description:
      "Real-time tile tapping with Socket.io, server-authoritative fairness, grids 5×5–16×16, special tiles, AI bots, Web Audio feedback.",
    tech: ["React", "Node.js", "Express.js", "Socket.io", "Web Audio API"],
    github: null,
    link: null,
  },
  {
    id: "gotrip",
    title: "GoTrip",
    subtitle: "February 2026 · AI trip booking",
    category: "Travel & AI",
    description:
      "AI-assisted destinations, itineraries, and personalized travel suggestions with a responsive, usability-first UI.",
    tech: ["React", "AI integration", "APIs", "UI/UX"],
    github: null,
    link: null,
  },
  {
    id: "smartlead-ai",
    title: "SmartLead AI",
    subtitle: "March 2026 · Salesforce lead automation",
    category: "Salesforce & CRM",
    description:
      "Lead capture, Hot/Warm/Cold scoring (Apex + Flows), assignment rules, Web-to-Lead + reCAPTCHA, dashboards, and automated conversion with validation.",
    tech: ["Salesforce", "Apex", "LWC", "Flows", "Web-to-Lead", "reCAPTCHA"],
    github: null,
    link: null,
  },
  {
    id: "messy-to-neat",
    title: "Messy to Neat",
    subtitle: "March 2026 · AI meeting & study notes",
    category: "Productivity & Learning",
    description:
      "Notes from text, voice, or uploads into summaries, action items, flashcards, quizzes, mind maps, knowledge graphs, transcription, autosave, versions, PDF export.",
    tech: ["React", "TypeScript", "Supabase", "AI", "Voice"],
    github: null,
    link: null,
  },
  {
    id: "tripza",
    title: "Tripza",
    subtitle: "April 2026 · Travel & vehicle marketplace",
    category: "Travel Marketplace",
    description:
      "Next.js + Firebase marketplace: vehicles, trips, ride-sharing discovery, real-time messaging (Socket.io), booking requests, reviews, provider tools—coordination-first without in-app payments.",
    tech: ["Next.js", "TypeScript", "Firebase", "Socket.io"],
    github: null,
    link: null,
  },
  {
    id: "urban-place",
    title: "Urban Place",
    subtitle: "April 2026 · AI services & tutor marketplace",
    category: "AI Marketplace",
    description:
      "AI identity verification, tutor qualification evaluation, role dashboards, JWT auth, trust scores, commission bookings—FastAPI + Next.js.",
    tech: ["FastAPI", "Next.js", "AI", "JWT", "SQLAlchemy"],
    github: null,
    link: null,
  },
  {
    id: "sales-cloud-e2e",
    title: "Sales Cloud & Lead Automation (E2E)",
    subtitle: "May 2026 · Full Sales Cloud rollout",
    category: "Salesforce & CRM",
    description:
      "Accounts through Orders, qualification, regional assignment, Agentforce automation, secure Web-to-Lead (Apex/LWC + reCAPTCHA), dashboards, forecasting, quote-to-order flows.",
    tech: ["Sales Cloud", "Apex", "LWC", "Agentforce", "Experience Cloud"],
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
