/** Mermaid flowchart code per project id. Rendered client-side in project modal. */
export const projectMermaidDiagrams: Record<string, string> = {
  "urban-place": `
flowchart LR
  A[User] --> B[Auth Service]
  B --> C[AI Verification Engine]
  C --> D[Provider Approval]
  D --> E[Booking Engine]
  E --> F[Trust Score System]
  F --> G[(Database)]
  `.trim(),

  aurashop: `
flowchart LR
  A[User] --> B[Behavior Tracker]
  B --> C[Recommendation Engine]
  C --> D[Product Ranking]
  D --> E[AI Chat]
  E --> F[Order System]
  F --> G[Wallet Engine]
  `.trim(),

  "autonomous-returns": `
flowchart LR
  A[User] --> B[VisionAgent]
  B --> C[Description Comparison]
  C --> D[PolicyAgent\n(RAG)]
  D --> E[ResolutionAgent]
  E --> F[CommunicationAgent]
  `.trim(),

  "code-dependency-analyzer": `
flowchart LR
  A[File Scanner] --> B[AST Parser]
  B --> C[Dependency Graph]
  C --> D[Impact Analyzer]
  D --> E[Risk Scorer]
  E --> F[Visualizer]
  `.trim(),

  expenze: `
flowchart LR
  A[WhatsApp] --> B[Webhook]
  B --> C[Intent Parser]
  C --> D[Expense Store]
  D --> E[Dashboard]
  E --> F[AI Summaries]
  `.trim(),

  blinkgrid: `
flowchart LR
  A[Clients] --> B[Socket.io]
  B --> C[Game Server]
  C --> D[Spawn & Hit Rules]
  D --> E[Scores]
  E --> F[Bot Players]
  `.trim(),

  gotrip: `
flowchart LR
  A[User] --> B[Search UI]
  B --> C[Trip Context]
  C --> D[AI Planner]
  D --> E[Itinerary]
  E --> F[Booking APIs]
  `.trim(),

  "smartlead-ai": `
flowchart LR
  A[Web-to-Lead] --> B[reCAPTCHA]
  B --> C[Apex Validation]
  C --> D[Score & Flows]
  D --> E[Assignment Rules]
  E --> F[Dashboards]
  `.trim(),

  "messy-to-neat": `
flowchart LR
  A[Input] --> B[Transcribe]
  B --> C[Structure AI]
  C --> D[Actions & Cards]
  D --> E[Mind Map]
  E --> F[PDF Export]
  `.trim(),

  tripza: `
flowchart LR
  A[Next.js] --> B[Firebase Auth]
  B --> C[Listings]
  C --> D[Socket.io Chat]
  D --> E[Booking Request]
  E --> F[Reviews]
  `.trim(),

  "sales-cloud-e2e": `
flowchart LR
  A[Lead] --> B[Qualify]
  B --> C[Opportunity]
  C --> D[Quote]
  D --> E[Order]
  E --> F[Agentforce]
  `.trim(),
};
