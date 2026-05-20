/** Strip BOM, outer quotes, and whitespace from env-style API keys. */
export function normalizeOpenAiApiKey(raw: string | undefined | null): string {
  if (raw == null) return "";
  let k = String(raw).trim();
  k = k.replace(/^\uFEFF/, "");
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1).trim();
  }
  return k.replace(/\s+/g, "");
}
