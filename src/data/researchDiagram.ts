/** Insider threat hybrid model — rendered in Research section */
export const researchArchitectureDiagram = `
flowchart TB
  subgraph ingest["Data plane"]
    direction LR
    L[(Behavior logs)] --> F[Feature extraction]
    A[(Audit trails)] --> F
  end

  subgraph model["Hybrid encoder"]
    direction TB
    F --> T[Transformer encoder]
    T --> Z[Latent sequence]
    Z --> AE[LSTM autoencoder]
    AE --> R[Reconstruction error]
  end

  subgraph out["Detection & explainability"]
    direction LR
    R --> S[Anomaly score]
    S --> X[Attention / attribution]
    X --> AL[Alert pipeline]
  end
`.trim();
