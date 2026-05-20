import { buildResumeStudyContext } from "@/lib/resumeStudyContext";

/** Keyword-style answers from structured résumé text when live Q&A isn’t available. */
export function localResumeQuestionAnswer(query: string): string {
  const q = query.trim().toLowerCase();
  if (!q) {
    return "Ask about experience, education, skills, or a project name.";
  }

  if (
    /^(hi|hello|hey|good (morning|afternoon|evening)|how are you|how r you|what'?s up|sup)\b/.test(
      q
    ) ||
    (q.length <= 24 && /^(thanks|thank you|thx|bye|goodbye)\b/.test(q))
  ) {
    return (
      "Hi — happy to help. Ask about **experience**, **education**, **skills**, or projects like **Urban Place** or **AuraShop**."
    );
  }

  const ctx = buildResumeStudyContext();
  const words = q
    .split(/\W+/)
    .filter((w) => w.length > 2)
    .filter((w) => !/^(the|and|for|are|you|his|her|this|that|with|from|about|into)$/i.test(w));
  if (words.length === 0) {
    return "Try a longer question or a keyword (e.g. **Salesforce**, **G10X**, **Python**).";
  }

  const lines = ctx.split("\n");
  const scored = lines
    .map((line) => ({
      line: line.trim(),
      s: words.reduce((acc, w) => acc + (line.toLowerCase().includes(w) ? 1 : 0), 0),
    }))
    .filter((x) => x.line.length > 0 && x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 14);

  if (scored.length === 0) {
    return (
      "Nothing jumped out from that wording yet. Try a company, school, stack, or role from the PDF."
    );
  }

  return (
    "Here are lines from Issac’s résumé that line up with your question:\n\n" +
    scored.map((x) => `- ${x.line}`).join("\n")
  );
}
