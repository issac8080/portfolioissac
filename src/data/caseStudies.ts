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
    tech: ["Next.js", "FastAPI", "OpenAI API", "Tailwind CSS", "REST APIs", "Session tracking"],
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
    tech: ["Python", "AST", "NetworkX", "Graph algorithms", "Static analysis"],
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
    tech: ["FastAPI", "LangGraph", "GPT-4o Vision", "React", "ChromaDB", "SentenceTransformers", "RAG"],
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
  {
    id: "expenze",
    productTitle: "Expenze",
    tagline: "Expense Tracker with WhatsApp AI Chatbot",
    category: "FinTech & Chatbots",
    tech: ["WhatsApp Business API", "AI chatbot", "Backend APIs", "NLP", "Web dashboard"],
    problemStatement:
      "Manual expense entry in apps causes friction and abandoned habits. Users already live in messaging apps; disconnected finance UIs slow adoption and reduce visibility into spending patterns.",
    systemArchitecture:
      "WhatsApp webhook receives inbound messages; backend parses intent and structured amounts, categories, and dates. Persistence layer stores transactions and aggregates; dashboard surfaces history, budgets, and AI-generated summaries. Optional voice or media flows normalize to the same expense schema.",
    aiWorkflow:
      "Conversational NLP classifies user messages into expense events (amount, merchant, category, date). Ambiguity triggers clarifying prompts in-thread. Periodic digest jobs generate natural-language spending summaries and anomaly hints from rolling aggregates.",
    engineeringContribution:
      "Integrated WhatsApp with backend services for conversational logging, categorization, and summary generation. Built responsive web UI for review and analytics alongside chat-first capture.",
    businessImpact:
      "Lower friction increases logging consistency; categorization and summaries improve financial awareness without dedicated app sessions.",
    realWorldUseCase:
      "A user texts “Uber 320 food yesterday” on WhatsApp; the bot confirms category and stores the line item. End of week they receive an AI summary of top categories and trends.",
    keyFeatures: [
      "WhatsApp-first expense capture",
      "AI categorization and spending insights",
      "Responsive web dashboard",
      "Automated summaries and reminders",
    ],
    aiMlComponents: ["Intent and slot extraction from chat", "Spending summaries from aggregates"],
    github: null,
    link: null,
    featured: false,
  },
  {
    id: "blinkgrid",
    productTitle: "BlinkGrid",
    tagline: "Real-Time Multiplayer Reaction Game",
    category: "Real-Time Gaming",
    tech: ["React", "Node.js", "Express.js", "Socket.io", "Web Audio API"],
    problemStatement:
      "Browser multiplayer games often suffer from desync and cheating when clients own game state. Fast reaction gameplay needs low-latency sync and authoritative scoring without heavy client trust.",
    systemArchitecture:
      "Node.js/Express server hosts Socket.io rooms. Server-authoritative tile spawn, hit detection, and score application. Clients render grid and input; server validates taps against timing windows. Bot players run server-side for solo practice. Web Audio API handles short feedback cues.",
    aiWorkflow:
      "Bot opponents use lightweight policy or scripted reaction models to simulate human-like latency and target selection for single-player and fill-in multiplayer.",
    engineeringContribution:
      "Implemented server-authoritative game loop, special tiles (double points, traps, freeze), dynamic grid sizing (5×5 to 16×16), and Socket.io synchronization. Added AI bots and tuned animation and audio feedback for clarity under load.",
    businessImpact:
      "Fair competitive play with minimal cheating surface; engaging sessions for casual and ranked play with low operational complexity.",
    realWorldUseCase:
      "Four players join a room; the server emits tile coordinates and lifetimes. A trap tile penalizes the wrong tap; scores reconcile from the server only.",
    keyFeatures: [
      "Real-time multiplayer via Socket.io",
      "Server-authoritative scoring",
      "Special tiles and scalable grid sizes",
      "AI bot players for solo mode",
    ],
    aiMlComponents: ["Heuristic / policy-based bot players", "Latency-aware timing validation"],
    github: null,
    link: null,
    featured: false,
  },
  {
    id: "gotrip",
    productTitle: "GoTrip",
    tagline: "AI-Assisted Trip Booking & Itineraries",
    category: "Travel & AI",
    tech: ["React", "AI assistants", "REST APIs", "Responsive UI"],
    problemStatement:
      "Trip planning spans many tabs, opaque options, and static search. Travelers want conversational guidance and itineraries that adapt to preferences without rebuilding plans from scratch.",
    systemArchitecture:
      "React front end for search, itinerary builder, and trip history. Backend aggregates destination metadata and booking-related APIs. AI layer proposes routes, stays, and day plans from user constraints and prior trips, with guardrails for freshness and policy text.",
    aiWorkflow:
      "Assistant consumes structured trip context (dates, budget, party size) and returns ranked suggestions with rationale. Iterative refinement updates the itinerary graph; user edits are merged with model proposals.",
    engineeringContribution:
      "Designed responsive UX for discovery and itinerary editing; wired AI-assisted suggestions and preference-aware ranking into booking guidance flows.",
    businessImpact:
      "Shorter planning cycles and clearer tradeoffs for travelers; higher confidence in chosen itineraries through explainable suggestions.",
    realWorldUseCase:
      "A user asks for a 4-day Kerala hill itinerary under a set budget; the assistant proposes day blocks with travel times; the user swaps one day and the model reconciles logistics.",
    keyFeatures: [
      "Destination search and itinerary builder",
      "Personalized AI travel suggestions",
      "Trip history–aware recommendations",
      "Responsive, navigation-focused UI",
    ],
    aiMlComponents: ["Conversational trip planning", "Preference-conditioned ranking"],
    github: null,
    link: null,
    featured: false,
  },
  {
    id: "smartlead-ai",
    productTitle: "SmartLead AI",
    tagline: "Intelligent Lead Management & Conversion in Salesforce",
    category: "Salesforce & CRM",
    tech: ["Salesforce", "Apex", "LWC", "Salesforce Flows", "Web-to-Lead", "reCAPTCHA"],
    problemStatement:
      "Inbound leads arrive noisy and unevenly; manual triage delays response time. Sales teams need automated scoring, routing, and conversion with spam resistance and auditability.",
    systemArchitecture:
      "Secure Web-to-Lead with Google reCAPTCHA and Apex validation. Custom lead scoring in Apex and Flows classifies Hot/Warm/Cold. Assignment Rules and automation route by region and criteria. Dashboards and reports track funnel health; conversion flows enforce validation and follow-up tasks.",
    aiWorkflow:
      "Rule-based and threshold-driven scoring (explicit business criteria) feeds routing and prioritization; optional extensions can incorporate predictive models while keeping Flow-driven orchestration.",
    engineeringContribution:
      "Built Web-to-Lead with reCAPTCHA, Apex/LWC hardening, scoring and routing logic, dashboards, and automated conversion with validation and reminders.",
    businessImpact:
      "Faster first response, cleaner pipeline, and measurable conversion uplift through consistent qualification and routing.",
    realWorldUseCase:
      "A web form submission passes reCAPTCHA; score marks the lead Hot for enterprise SaaS; assignment rule sends it to the regional AE with a follow-up task.",
    keyFeatures: [
      "Spam-resistant Web-to-Lead",
      "Hot/Warm/Cold scoring (Apex + Flows)",
      "Automated assignment and conversion",
      "Dashboards and reporting",
    ],
    aiMlComponents: ["Extensible scoring hooks for ML", "Rule-based prioritization"],
    github: null,
    link: null,
    featured: false,
  },
  {
    id: "messy-to-neat",
    productTitle: "Messy to Neat",
    tagline: "AI Meeting Notes, Study Tools & Knowledge Maps",
    category: "Productivity & Learning",
    tech: ["React", "TypeScript", "Supabase", "AI APIs", "Voice", "PDF export"],
    problemStatement:
      "Raw meeting notes and lectures stay unstructured, hard to review, and weak for spaced practice. Users need summaries, actions, and study artifacts without manual reformatting.",
    systemArchitecture:
      "React + TypeScript client with Supabase for auth, autosave, and version history. Media ingestion (text, voice, uploads) feeds an AI pipeline that emits structured sections, action items, flashcards, and quizzes. Visualization layer renders mind maps and knowledge graphs from extracted entities and relations.",
    aiWorkflow:
      "Transcription (when voice) → segmentation → summarization and extraction of tasks, entities, and relations. Secondary passes generate flashcards/quizzes and optional study schedules. PDF export serializes the structured doc.",
    engineeringContribution:
      "Implemented multimodal capture, AI structuring pipeline, real-time transcription path, autosave/versioning, mind map and graph views, and PDF export.",
    businessImpact:
      "Higher retention and faster handoffs from meetings to execution; students and professionals reuse one source for notes, study, and sharing.",
    realWorldUseCase:
      "A user uploads a messy lecture transcript; the system returns summary, action list, and a mind map; they export a PDF for the team.",
    keyFeatures: [
      "Text, voice, and document input",
      "Summaries, action items, flashcards, quizzes",
      "Mind maps and knowledge graphs",
      "Transcription, autosave, version history, PDF export",
    ],
    aiMlComponents: ["Summarization and extraction", "Entity/relation graph construction", "Quiz/flashcard generation"],
    github: null,
    link: null,
    featured: false,
  },
  {
    id: "tripza",
    productTitle: "Tripza",
    tagline: "Travel & Vehicle Marketplace with Real-Time Messaging",
    category: "Travel Marketplace",
    tech: ["Next.js", "TypeScript", "Firebase", "Socket.io"],
    problemStatement:
      "Travelers and vehicle providers need discovery and coordination without forcing payments inside a young marketplace. Trust, messaging, and trip workflows must stay lightweight and real-time.",
    systemArchitecture:
      "Next.js + TypeScript UI; Firebase for auth, listings, and persistence. Socket.io channels power DMs and trip-thread updates. Booking requests and reviews use transactional writes with provider management surfaces.",
    aiWorkflow:
      "Optional ranking helpers can order listings by engagement and reviews; core flows remain deterministic marketplace logic with human-readable audit trails.",
    engineeringContribution:
      "Built marketplace discovery, trip posting, booking requests, reviews, provider tools, and Socket.io messaging on Firebase-backed data.",
    businessImpact:
      "Community-driven coordination with low friction; scalable path to monetization without blocking on payments on day one.",
    realWorldUseCase:
      "A traveler messages a vehicle host about luggage capacity; they confirm a booking request and track status in-app.",
    keyFeatures: [
      "Vehicle discovery and trip posts",
      "Ride-share style browsing",
      "Real-time messaging (Socket.io)",
      "Booking requests, reviews, provider management",
    ],
    aiMlComponents: ["Optional listing ranking signals"],
    github: null,
    link: null,
    featured: false,
  },
  {
    id: "sales-cloud-e2e",
    productTitle: "Sales Cloud Implementation & Lead Automation",
    tagline: "End-to-End Acquisition, Quotes, and Agentforce Automation",
    category: "Salesforce & CRM",
    tech: ["Sales Cloud", "Apex", "LWC", "Agentforce", "Experience Cloud", "Web-to-Lead", "reCAPTCHA"],
    problemStatement:
      "Growing sales orgs need a coherent object model from lead to cash, with automation that scales across regions and reduces manual quote-to-order errors.",
    systemArchitecture:
      "Sales Cloud data model spanning Accounts, Contacts, Leads, Opportunities, Products, Quotes, and Orders with validation and automation. Experience Cloud where applicable for partners or customers. Agentforce and Flows drive qualification, assignment, and conversion. Web-to-Lead with Apex/LWC + reCAPTCHA secures inbound capture.",
    aiWorkflow:
      "Agentforce assists qualification and next-best actions within guardrails; reporting surfaces pipeline and forecast health for leadership review.",
    engineeringContribution:
      "Configured core Sales Cloud relationships, regional assignment, lead conversion automation, secure Web-to-Lead, dashboards, and quote-to-order workflow streamlining.",
    businessImpact:
      "Single source of truth for revenue objects, fewer manual errors, and faster cycle times from lead capture to closed order.",
    realWorldUseCase:
      "A lead converts to Opportunity with products; quote generates and, upon acceptance, flows into order with automated tasks for fulfillment.",
    keyFeatures: [
      "Full lead-to-order object model",
      "Regional assignment and qualification automation",
      "Agentforce-assisted workflows",
      "Secure Web-to-Lead with reCAPTCHA",
      "Dashboards, forecasting, and quote-to-order automation",
    ],
    aiMlComponents: ["Agentforce for guided selling and automation", "Analytics on pipeline signals"],
    github: null,
    link: null,
    featured: false,
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
