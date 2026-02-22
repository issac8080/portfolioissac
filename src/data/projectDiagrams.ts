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
};
