import { NextResponse } from "next/server";
import { caseStudies } from "@/data/caseStudies";
import {
  contact,
  publication,
  summary,
  skills,
  experience,
} from "@/data/portfolio";
import { siteMeta } from "@/data/siteMeta";
import { labNotebookEntries } from "@/data/labNotebook";

export const dynamic = "force-static";

export function GET() {
  const body = {
    version: 1,
    updated: siteMeta.lastContentUpdate,
    person: {
      name: "Issac Sunny",
      headline: summary.slice(0, 280),
      contact,
      publication,
      skills,
      experience,
    },
    projects: caseStudies.map((c) => ({
      id: c.id,
      title: c.productTitle,
      tagline: c.tagline,
      category: c.category,
      tech: c.tech,
      github: c.github,
      link: c.link,
      featured: c.featured ?? false,
    })),
    labNotebook: labNotebookEntries,
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
