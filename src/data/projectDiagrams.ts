/**
 * Mermaid architecture diagrams per project id. Shown in project modals.
 * Layout: 3 layers (edge / application / data), linear edges, short labels.
 */

export const projectMermaidDiagrams: Record<string, string> = {
  "urban-place": `
flowchart LR
  subgraph E["User & client"]
    U[Host / customer]
  end
  subgraph A["API & policy"]
    AUTH[JWT auth]
    AI_V[OpenAI verify]
    BOOK[Booking FSM]
    TRUST[Trust score]
  end
  subgraph D["Persistence"]
    DB[(SQLite + ORM)]
  end
  U --> AUTH --> AI_V --> BOOK --> TRUST --> DB
`.trim(),

  aurashop: `
flowchart TB
  subgraph E["Shopper"]
    U[Browser session]
  end
  subgraph A["Commerce stack"]
    BEH[Behavior + session]
    REC[Rank + recommend]
    CHAT[GPT chat assist]
    ORD[Checkout + QR pickup]
    WAL[AuraPoints wallet]
  end
  subgraph D["Backend"]
    API[FastAPI services]
  end
  U --> BEH
  BEH --> REC
  REC --> CHAT
  CHAT --> ORD
  ORD --> WAL
  WAL --> API
`.trim(),

  initra: `
flowchart LR
  subgraph E["Capture"]
    CAM[Camera / mic / barcode]
  end
  subgraph A["On-device / PWA"]
    OCR[Tesseract worker]
    UI[React shell]
    QR[QR audit trail]
    WM[Warranty + alerts]
  end
  subgraph D["Local"]
    IDB[(IndexedDB)]
  end
  CAM --> OCR
  OCR --> IDB
  IDB --> UI
  UI --> QR
  UI --> WM
`.trim(),

  "autonomous-returns": `
flowchart LR
  subgraph E["User evidence"]
    U[Return photos + text]
  end
  subgraph A["Agentic resolution"]
    VA[Vision analysis]
    RAG[Policy RAG · Chroma]
    PA[Policy + resolution]
    CA[Customer comms]
  end
  U --> VA --> PA
  RAG <--> PA
  PA --> CA
`.trim(),

  "code-dependency-analyzer": `
flowchart LR
  subgraph E["Input"]
    REPO[Repository tree]
  end
  subgraph A["Static analysis"]
    SCAN[File scan]
    AST[AST + imports]
    G[Dependency graph]
    I[Impact + risk]
  end
  subgraph D["Output"]
    VIZ[Graph UI]
  end
  REPO --> SCAN
  SCAN --> AST
  AST --> G
  G --> I
  I --> VIZ
`.trim(),

  expenze: `
flowchart TB
  subgraph E["Channel"]
    WA[WhatsApp]
  end
  subgraph A["Core"]
    WH[Webhook ingress]
    IP[Intent + parse]
    LED[Ledger + rules]
  end
  subgraph D["Storage"]
    DB[(Expense DB)]
  end
  subgraph O["Insight"]
    DSH[Dashboard + AI sum]
  end
  WA --> WH
  WH --> IP
  IP --> LED
  LED --> DB
  LED --> DSH
`.trim(),

  blinkgrid: `
flowchart TB
  subgraph E["Players"]
    CL[Human clients]
    BOT[AI bots]
  end
  subgraph A["Realtime core"]
    SK[Socket.io]
    GS[Authoritative game]
    SR[Grid + hit rules]
  end
  subgraph D["State"]
    SC[Scores + rooms]
  end
  CL --> SK
  BOT --> SK
  SK --> GS
  GS --> SR
  SR --> SC
`.trim(),

  gotrip: `
flowchart TB
  subgraph E["Intent"]
    U[Traveler]
  end
  subgraph A["Planning"]
    SU[Search UI]
    CTX[Context pack]
    PLN[AI itinerary]
  end
  subgraph D["Fulfillment"]
    API[Booking APIs]
  end
  U --> SU
  SU --> CTX
  CTX --> PLN
  PLN --> API
`.trim(),

  "smartlead-ai": `
flowchart TB
  subgraph E["Web capture"]
    W2L[Web-to-Lead]
  end
  subgraph A["Salesforce"]
    CAP[reCAPTCHA + Apex]
    SF[Lead + score]
    AR[Assignment rules]
  end
  subgraph D["Ops"]
    REP[Reports + dashboards]
  end
  W2L --> CAP
  CAP --> SF
  SF --> AR
  AR --> REP
`.trim(),

  "messy-to-neat": `
flowchart TB
  subgraph E["Input"]
    IN[Notes / voice / paste]
  end
  subgraph A["AI structure"]
    TR[Transcribe]
    ST[Structure + actions]
  end
  subgraph D["UX"]
    MM[Mind map]
    PDF[Export PDF]
  end
  IN --> TR
  TR --> ST
  ST --> MM
  ST --> PDF
`.trim(),

  tripza: `
flowchart TB
  subgraph E["App"]
    FE[Next.js UI]
  end
  subgraph A["Services"]
    AUTH[Firebase Auth]
    LST[Listings + search]
    CH[Socket.io chat]
    BOOK[Booking flow]
  end
  subgraph D["Trust"]
    REV[Reviews]
  end
  FE --> AUTH
  AUTH --> LST
  LST --> CH
  CH --> BOOK
  BOOK --> REV
`.trim(),

  "sales-cloud-e2e": `
flowchart LR
  subgraph E["Demand"]
    L[Lead]
  end
  subgraph A["Revenue path"]
    Q[Qualify]
    O[Opportunity]
    QT[Quote]
    ORD[Order]
  end
  subgraph D["AI assist"]
    AF[Agentforce]
  end
  L --> Q
  Q --> O
  O --> QT
  QT --> ORD
  ORD --> AF
`.trim(),

  "facial-attendance-system": `
flowchart TB
  subgraph C["Capture"]
    CAM[Camera / batch images]
  end
  subgraph P["CV pipeline"]
    DET[Detect faces]
    EMB[Embeddings]
    MATCH[Match roster]
  end
  subgraph O["Output"]
    LOG[Attendance log]
    CSV[Export / LMS]
  end
  CAM --> DET --> EMB --> MATCH --> LOG --> CSV
`.trim(),

  "lumos-student-network": `
flowchart TB
  subgraph M["Flutter clients"]
    IOS[iOS / Android]
  end
  subgraph B["Backend"]
    AUTH[Firebase Auth]
    DATA[Profiles + groups]
    JOB[Jobs board]
    CHAT[Chat / mentor]
  end
  subgraph V["Trust"]
    NFT[NFT cert verify]
  end
  IOS --> AUTH
  AUTH --> DATA
  DATA --> CHAT
  DATA --> JOB
  DATA --> NFT
`.trim(),
};
