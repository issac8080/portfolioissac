/** Maps knowledge base `source` strings to case study ids used across the site */
export const KB_SOURCE_TO_CASE_STUDY_ID: Record<string, string> = {
  "Urban Place": "urban-place",
  AuraShop: "aurashop",
  "Code Dependency & Impact Analyzer": "code-dependency-analyzer",
  "Initra Home Inventory App": "initra",
  "Autonomous Returns Resolution System": "autonomous-returns",
  Expenze: "expenze",
  BlinkGrid: "blinkgrid",
  GoTrip: "gotrip",
  "SmartLead AI": "smartlead-ai",
  "Messy to Neat": "messy-to-neat",
  Tripza: "tripza",
  "Sales Cloud E2E Implementation": "sales-cloud-e2e",
};

export function caseStudyIdFromKbSource(source: string): string | null {
  return KB_SOURCE_TO_CASE_STUDY_ID[source] ?? null;
}
