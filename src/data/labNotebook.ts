export type LabNotebookEntry = {
  id: string;
  date: string;
  title: string;
  hypothesis: string;
  whatWeTried: string;
  outcome: string;
  /** Optional external artifact */
  link?: { label: string; href: string };
};

export const labNotebookEntries: LabNotebookEntry[] = [
  {
    id: "nb-1",
    date: "2026-04",
    title: "On-device RAG vs. latency budget",
    hypothesis: "Smaller MiniLM embeddings are enough for portfolio Q&A if chunks stay under ~200 tokens equivalent.",
    whatWeTried:
      "Sentence-split knowledge chunks, cosine retrieval with top-5 fusion, and section-aware welcome prompts.",
    outcome:
      "Acceptable quality for factual questions; low-confidence paths need explicit UI — shipped in the assistant panel.",
  },
  {
    id: "nb-2",
    date: "2026-03",
    title: "Scroll-driven nav vs. accessibility",
    hypothesis: "Hash navigation plus IntersectionObserver can stay in sync without stealing focus.",
    whatWeTried:
      "Active section highlighting with wide rootMargin; skip link to #main-content; modal Esc handling.",
    outcome:
      "Smooth for sighted users; next step is periodic axe checks on modals and the command dock.",
    link: {
      label: "Repository (good first issues)",
      href: "https://github.com/search?q=user%3Aissacsunny+portfolio&type=repositories",
    },
  },
];
