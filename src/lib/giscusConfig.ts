/**
 * Giscus embed — comments are stored in GitHub Discussions (no app database).
 * Fill values from https://giscus.app (Configuration section).
 */

export type GiscusEmbedConfig = {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: "pathname" | "url" | "title" | "specific" | "number";
  term: string;
  reactionsEnabled: "0" | "1";
  emitMetadata: "0" | "1";
  inputPosition: "top" | "bottom";
  theme: string;
  lang: string;
  loading: "lazy" | "eager";
};

function env(key: string): string {
  return (
    (typeof process !== "undefined" && process.env[key]?.trim()) || ""
  );
}

/** Returns config when all required public ids are set; otherwise null (discussion block hidden). */
export function getGiscusEmbedConfig(): GiscusEmbedConfig | null {
  const repo = env("NEXT_PUBLIC_GISCUS_REPO");
  const repoId = env("NEXT_PUBLIC_GISCUS_REPO_ID");
  const category = env("NEXT_PUBLIC_GISCUS_CATEGORY");
  const categoryId = env("NEXT_PUBLIC_GISCUS_CATEGORY_ID");
  if (!repo || !repoId || !category || !categoryId) return null;

  const mappingRaw = env("NEXT_PUBLIC_GISCUS_MAPPING");
  const mapping =
    mappingRaw === "url" ||
    mappingRaw === "title" ||
    mappingRaw === "specific" ||
    mappingRaw === "number"
      ? mappingRaw
      : "pathname";

  const term = env("NEXT_PUBLIC_GISCUS_TERM") || "contact";
  const theme = env("NEXT_PUBLIC_GISCUS_THEME") || "transparent_dark";
  const lang = env("NEXT_PUBLIC_GISCUS_LANG") || "en";

  return {
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    term,
    reactionsEnabled:
      env("NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED") === "0" ? "0" : "1",
    emitMetadata: env("NEXT_PUBLIC_GISCUS_EMIT_METADATA") === "1" ? "1" : "0",
    inputPosition:
      env("NEXT_PUBLIC_GISCUS_INPUT_POSITION") === "bottom"
        ? "bottom"
        : "top",
    theme,
    lang,
    loading: env("NEXT_PUBLIC_GISCUS_LOADING") === "eager" ? "eager" : "lazy",
  };
}
