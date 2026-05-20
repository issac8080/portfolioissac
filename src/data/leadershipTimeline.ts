import type { LucideIcon } from "lucide-react";
import {
  Flag,
  Shield,
  Cpu,
  Cloud,
  Code2,
  Users,
  Bot,
  Trophy,
} from "lucide-react";

export type LeadershipEvent = {
  id: string;
  title: string;
  kind: "ctf" | "webinar" | "workshop" | "participation";
  summary: string;
  detail?: string;
  icon: LucideIcon;
};

export const ieeeLeadershipMeta = {
  role: "IEEE Computer Society Chairman",
  period: "2022–2024",
  org: "Christ College of Engineering",
  location: "Irinjalakuda, Kerala, India",
  tagline:
    "Led the student chapter’s technical calendar — workshops, competitions, and sponsorship-ready execution with a security and AI lens.",
  responsibilities: [
    "Led and coordinated technical activities under the IEEE Computer Society student chapter",
    "Organized workshops, hackathons, webinars, coding competitions, and cybersecurity events",
    "Managed event planning, student coordination, sponsorship outreach, and technical execution",
    "Encouraged participation in emerging technologies, secure engineering practice, and innovation programs",
  ],
};

export const ieeeLeadershipEvents: LeadershipEvent[] = [
  {
    id: "ctf-2024",
    title: "CTF 2024 — Capture The Flag",
    kind: "ctf",
    summary:
      "College-level cybersecurity competition spanning ethical hacking, OSINT, web security, reverse engineering, and cryptography.",
    detail:
      "Owned challenge scoping, infra coordination, onboarding, and judging; prioritized safe, isolated environments and clear write-up style scoring.",
    icon: Shield,
  },
  {
    id: "webinar-ai-ml",
    title: "Webinar — AI & Machine Learning Fundamentals",
    kind: "webinar",
    summary:
      "Technical session on ML workflows, neural network intuition, data hygiene, training loops, and career pathways in AI engineering.",
    icon: Cpu,
  },
  {
    id: "webinar-cyber",
    title: "Webinar — Cybersecurity & Ethical Hacking",
    kind: "webinar",
    summary:
      "Hands-on awareness session on threat models, recon basics, pentesting etiquette, common web flaws, and defensive hygiene for student builders.",
    icon: Shield,
  },
  {
    id: "workshop-react",
    title: "Workshop — React & Firebase Apps",
    kind: "workshop",
    summary:
      "Guided build of a responsive web app with auth, Firestore reads/writes, and deployment — emphasizing component structure and error states.",
    icon: Code2,
  },
  {
    id: "webinar-devops",
    title: "Webinar — Cloud & DevOps Fundamentals",
    kind: "webinar",
    summary:
      "Covered cloud primitives, CI/CD mental models, containers at a glance, and how teams ship safely with automation and observability hooks.",
    icon: Cloud,
  },
  {
    id: "robotics-cet",
    title: "Robotics — Gesture Control Computing",
    kind: "participation",
    summary: "Participated at CET Trivandrum (2022); exposure to embedded sensing, HCI, and on-stage system demos.",
    icon: Bot,
  },
  {
    id: "hackathon-stthomas",
    title: "Hackathon — St. Thomas Institute of Technology",
    kind: "participation",
    summary: "Built and pitched under time pressure; practiced rapid prototyping, git hygiene, and stakeholder storytelling.",
    icon: Trophy,
  },
];

export const communityHighlights = [
  {
    id: "ctf-2024-short",
    title: "CTF 2024 (IEEE Computer Society)",
    description:
      "Flagship cybersecurity competition for peers — challenges, infra, and judging coordinated end to end.",
    icon: Flag,
  },
  {
    id: "webinars",
    title: "Technical webinars & events",
    description:
      "Recurring sessions on AI/ML, security, web engineering, and cloud — structured labs, Q&A, and follow-on resources.",
    icon: Users,
  },
];
