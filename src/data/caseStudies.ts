export type CaseStudy = {
  id: string;
  productTitle: string;
  tagline: string;
  category: string;
  tech: string[];
  problemStatement: string;
  systemArchitecture: string;
  aiWorkflow: string;
  engineeringContribution: string;
  businessImpact: string;
  realWorldUseCase: string;
  keyFeatures: string[];
  aiMlComponents: string[];
  github: string | null;
  link: string | null;
  featured?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "urban-place",
    productTitle: "Urban Place",
    tagline: "AI-Governed Home Services & Tutor Marketplace",
    category: "AI Marketplace",
    tech: ["FastAPI", "SQLAlchemy", "SQLite", "JWT", "OpenAI API", "Next.js", "TailwindCSS"],
    problemStatement:
      "Marketplaces for home services and tutoring suffer from trust asymmetry: customers cannot verify provider identity or qualifications at scale, and platforms lack objective signals beyond star ratings. Manual verification does not scale; subjective reviews are easily gamed.",
    systemArchitecture:
      "FastAPI backend with SQLAlchemy ORM and SQLite for transactional and profile data. Next.js App Router front end with TailwindCSS. JWT-based auth with role separation (customer, provider, admin). Policy engine evaluates provider listing eligibility; booking service applies commission and state transitions. Trust score is computed server-side from completion rate, cancellation rate, and ratings.",
    aiWorkflow:
      "Identity verification: providers submit documents; OpenAI-powered extraction and consistency checks feed a verification pipeline. Qualification and skill evaluation for tutors: structured prompts and scoring rubrics assess subject mastery and pedagogy; results are stored and used for ranking and policy-based listing. Trust score is updated on each completed or cancelled booking and used for discovery ordering and policy gating.",
    engineeringContribution:
      "Designed and implemented the AI identity verification pipeline and tutor qualification evaluation flow. Built the trust score model (completion rate, cancellation rate, ratings) and wired it into policy-based listing and discovery. Implemented the 30% commission booking state machine and provider listing policy engine.",
    businessImpact:
      "Reduced manual verification load while improving trust signals. Policy-based listing and trust score improved discovery quality and reduced dispute risk. Commission model aligned platform revenue with completed bookings.",
    realWorldUseCase:
      "A customer books a math tutor; the platform shows only tutors who passed AI qualification and identity verification, ordered by trust score. After the session, completion and rating update the tutor’s score and feed future ranking.",
    keyFeatures: [
      "AI identity verification for workers",
      "AI qualification and skill evaluation for tutors",
      "Trust score (completion, cancellation, ratings)",
      "Policy-based provider listing",
      "30% commission booking system",
    ],
    aiMlComponents: ["OpenAI API for verification and qualification", "Trust score aggregation", "Policy-based ranking"],
    github: null,
    link: null,
    featured: true,
  },
  {
    id: "aurashop",
    productTitle: "AuraShop",
    tagline: "AI-Powered Personalized E-Commerce Assistant",
    category: "AI E-Commerce",
    tech: ["FastAPI", "Next.js 14", "OpenAI GPT-4o-mini", "Session tracking"],
    problemStatement:
      "E-commerce conversion drops when shoppers cannot quickly compare options or get personalized guidance. Generic recommendations and static filters do not reflect in-session intent, and in-store pickup workflows often lack digital verification.",
    systemArchitecture:
      "FastAPI serves recommendations and chat; Next.js 14 front end with session-based behavioral tracking. Session store captures clicks, views, and time-on-product. Recommendation engine consumes session context and product catalog; GPT-4o-mini powers the chatbot with product context. QR code flow ties in-store pickup to order state; AuraPoints wallet is backed by transaction and reward rules.",
    aiWorkflow:
      "Real-time recommendation engine: session events are aggregated into a context vector; model returns ranked product IDs with optional reasoning. Chatbot receives current product focus and cart; GPT-4o-mini answers comparison and recommendation questions with citations. Fallback AI handles degraded or rate-limited scenarios with cached or rule-based responses. AuraPoints rules are applied at checkout and redemption.",
    engineeringContribution:
      "Built the session-based behavioral tracking pipeline and real-time recommendation API. Implemented the contextual chatbot with product comparison and fallback behavior. Designed QR code–based in-store pickup verification and the AuraPoints wallet and redemption flow.",
    businessImpact:
      "Higher engagement and conversion through personalized recommendations and in-session chat. In-store pickup verification reduced support and fraud. AuraPoints increased repeat visits and basket size.",
    realWorldUseCase:
      "A user browses laptops; session tracking feeds the recommendation engine. They ask the chatbot to compare two models; GPT-4o-mini returns a structured comparison. They choose in-store pickup and verify at the store via QR code; AuraPoints are credited post-purchase.",
    keyFeatures: [
      "Real-time AI recommendation engine",
      "Contextual AI chatbot with product comparison",
      "QR code in-store pickup verification",
      "Session-based behavioral tracking",
      "AuraPoints wallet system",
      "Fallback AI system",
    ],
    aiMlComponents: ["GPT-4o-mini for chat and comparison", "Session-context recommendations", "Fallback AI pipeline"],
    github: null,
    link: null,
    featured: false,
  },
  {
    id: "code-dependency-analyzer",
    productTitle: "Code Dependency & Impact Analyzer",
    tagline: "Static Analysis for Change Risk and Blast Radius",
    category: "Developer Tools",
    tech: ["Python", "AST", "Static analysis", "Graph computation"],
    problemStatement:
      "Refactors and feature work in large codebases carry hidden risk: a small change can break distant modules. Teams lack quantified blast radius and risk scores, leading to over-testing or under-testing and delayed releases.",
    systemArchitecture:
      "Python static analysis pipeline: source is parsed into ASTs; import and call graphs are extracted and stored in a directed graph. Blast radius is computed via graph traversal from changed nodes. Risk score combines graph metrics (fan-out, depth, centrality) and optional heuristics. Results are exposed for CI or a visualization layer.",
    aiWorkflow:
      "Parsing and graph construction are deterministic. Risk scoring can use rule-based metrics (e.g., fan-out, depth) or optional ML-based predictors trained on historical failure data. The primary value is the dependency graph and blast-radius computation; AI augments risk quantification where training data exists.",
    engineeringContribution:
      "Designed and implemented the AST parsing and dependency graph construction. Built blast-radius computation and the quantified risk score model. Delivered graph and risk outputs for risk assessment, change impact analysis, testing prioritization, and refactoring safety.",
    businessImpact:
      "Teams prioritize tests and reviews based on blast radius and risk score. Refactoring decisions are data-driven; release risk is reduced and cycle time improved.",
    realWorldUseCase:
      "A developer changes a shared utility; the analyzer computes blast radius and risk score. CI uses the output to run only impacted tests; the team reviews the dependency graph before merging.",
    keyFeatures: [
      "AST-based parsing",
      "Dependency graph construction",
      "Blast radius computation",
      "Quantified risk score",
      "Impacted module visualization",
    ],
    aiMlComponents: ["Graph-based blast radius", "Risk score (rule-based or ML-augmented)", "Impact visualization"],
    github: null,
    link: null,
    featured: true,
  },
  {
    id: "initra",
    productTitle: "Initra",
    tagline: "Offline-First Home Inventory PWA",
    category: "PWA",
    tech: ["React", "TypeScript", "IndexedDB", "Tesseract.js", "Barcode", "Voice", "QR"],
    problemStatement:
      "Households, especially elderly users, need a simple way to catalog possessions for insurance, moves, or family. Existing tools assume always-on connectivity and complex UX; offline and accessibility are afterthoughts.",
    systemArchitecture:
      "React + TypeScript PWA with IndexedDB as the primary store for offline-first behavior. Tesseract.js runs in-worker for OCR; barcode scanning uses device camera and a lightweight decoder. Voice commands are captured and mapped to actions via browser APIs. QR code generation and scan support audit and sharing. Warranty management stores dates and documents linked to items.",
    aiWorkflow:
      "OCR (Tesseract.js) extracts text from item photos for pre-filling name and details. No cloud AI; all processing is local for privacy and offline. Future extensions could add optional cloud-based categorization or valuation.",
    engineeringContribution:
      "Architected the offline-first PWA and IndexedDB schema. Integrated Tesseract.js for OCR, barcode scanning, voice commands, and QR-based audit flows. Implemented warranty management and elderly-friendly UX with clear typography and minimal steps.",
    businessImpact:
      "Usable inventory without internet; elderly users can adopt it without dependency on support. Audit and warranty features support insurance and resale use cases.",
    realWorldUseCase:
      "A user photographs a receipt; OCR fills item name and price. They add a warranty end date. Later, they run a QR-based audit to confirm items in a room; the app works fully offline.",
    keyFeatures: [
      "Offline-first PWA with IndexedDB",
      "OCR (Tesseract.js) for item details",
      "Barcode scanning",
      "Voice commands",
      "QR code audit",
      "Warranty management",
    ],
    aiMlComponents: ["Tesseract.js OCR for local text extraction", "Structured item and warranty data"],
    github: null,
    link: null,
    featured: false,
  },
  {
    id: "autonomous-returns",
    productTitle: "Autonomous Returns & Exchange Resolution System",
    tagline: "Multi-Agent AI for Policy-Based Resolution",
    category: "AI Operations",
    tech: ["FastAPI", "LangGraph", "GPT-4o Vision", "SentenceTransformers", "ChromaDB"],
    problemStatement:
      "Returns and exchanges tie up support teams and create inconsistency when humans interpret policy and product condition subjectively. Scaling requires automated, policy-grounded decisions with clear audit trails.",
    systemArchitecture:
      "FastAPI orchestrates the workflow. LangGraph defines agent nodes and edges: VisionAgent (image analysis), PolicyAgent (RAG over policy docs), ResolutionAgent (approve/reject/escalate), CommunicationAgent (customer messaging). ChromaDB stores policy embeddings; SentenceTransformers encode queries and retrieve clauses. GPT-4o Vision analyzes return request images; GPT-4o reasons over evidence and policy to decide.",
    aiWorkflow:
      "Customer submits return with images. VisionAgent uses GPT-4o Vision to describe condition and damage. PolicyAgent retrieves relevant clauses from ChromaDB via semantic search (SentenceTransformers). ResolutionAgent receives vision output and policy excerpts and decides approve/reject/escalate with reasoning. CommunicationAgent drafts the response. Each step is logged for audit and tuning.",
    engineeringContribution:
      "Designed the LangGraph agent topology and handoffs. Implemented VisionAgent (image analysis) and PolicyAgent (RAG with ChromaDB and SentenceTransformers). Built ResolutionAgent logic and confidence scoring and wired CommunicationAgent for customer-facing output. Integrated the pipeline in FastAPI with structured logging and error handling.",
    businessImpact:
      "Faster, consistent resolution and lower support cost. Policy-grounded decisions reduce disputes; escalation path remains for edge cases. Audit trail supports compliance and model improvement.",
    realWorldUseCase:
      "A customer uploads a photo of a damaged item. VisionAgent classifies condition; PolicyAgent retrieves the relevant return policy. ResolutionAgent approves the return with high confidence; CommunicationAgent sends the confirmation and return label.",
    keyFeatures: [
      "Multi-agent workflow (Vision, Policy, Resolution, Communication)",
      "GPT-4o Vision for image analysis",
      "RAG over policy with ChromaDB",
      "Approve / reject / escalate decisions",
      "Structured audit and reasoning",
    ],
    aiMlComponents: [
      "GPT-4o Vision (condition analysis)",
      "SentenceTransformers + ChromaDB (policy RAG)",
      "LangGraph (agent orchestration)",
      "Resolution reasoning and confidence",
    ],
    github: null,
    link: null,
    featured: true,
  },
];

export const featuredCaseStudyIds = [
  "autonomous-returns",
  "code-dependency-analyzer",
  "urban-place",
];

export function getFeaturedCaseStudies(): CaseStudy[] {
  const order = featuredCaseStudyIds;
  return caseStudies
    .filter((c) => c.featured)
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.id === id);
}
