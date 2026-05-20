import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { caseStudies } from "@/data/caseStudies";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = caseStudies.find((c) => c.id === params.slug);
  if (!project) return { title: "Project" };
  return {
    title: `${project.productTitle} | Issac Sunny`,
    description: project.tagline,
    openGraph: {
      title: project.productTitle,
      description: project.tagline,
    },
  };
}

export default function ProjectPage({ params }: Props) {
  const project = caseStudies.find((c) => c.id === params.slug);
  if (!project) notFound();

  return (
    <main
      id="main-content"
      className="min-h-screen bg-ai-bg text-white px-6 py-16 md:py-24"
    >
      <article className="max-w-3xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-wider text-ai-glow/90 mb-2">
          {project.category}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold font-[var(--font-space-grotesk)] mb-3">
          {project.productTitle}
        </h1>
        <p className="text-lg text-ai-muted mb-10">{project.tagline}</p>

        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-10 grid sm:grid-cols-2 gap-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-ai-border bg-ai-surface/30 p-4"
              >
                <p className="text-[10px] uppercase tracking-wider text-ai-muted mb-1">
                  {m.label}
                </p>
                <p className="text-sm text-white/95">{m.value}</p>
              </div>
            ))}
          </div>
        )}

        <Block title="Problem" body={project.problemStatement} />
        <Block title="Architecture" body={project.systemArchitecture} />
        <Block title="AI workflow" body={project.aiWorkflow} />
        <Block title="Your contribution" body={project.engineeringContribution} />
        <Block title="Impact" body={project.businessImpact} />

        {project.engineeringNotes && project.engineeringNotes.length > 0 && (
          <div className="mt-10 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-ai-accent">
              Engineering notes
            </h2>
            {project.engineeringNotes.map((n) => (
              <div
                key={n.label}
                className="rounded-xl border border-ai-border/80 border-l-2 border-l-ai-accent/60 bg-ai-surface/20 p-4"
              >
                <p className="text-xs font-semibold text-ai-accent mb-1">{n.label}</p>
                <p className="text-sm text-ai-muted leading-relaxed">{n.text}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href={`/#projects`}
            className="inline-flex items-center rounded-lg border border-ai-border px-4 py-2 text-sm text-ai-glow hover:bg-ai-glow/10"
          >
            ← Back to portfolio
          </Link>
          {(project.github || project.link) && (
            <>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-ai-glow/15 px-4 py-2 text-sm text-ai-glow border border-ai-border"
                >
                  GitHub
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-ai-accent/15 px-4 py-2 text-sm text-ai-accent border border-ai-border"
                >
                  Live demo
                </a>
              )}
            </>
          )}
        </div>
      </article>
    </main>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <section className="mb-10">
      <h2 className="text-sm font-mono uppercase tracking-wider text-ai-glow mb-2">{title}</h2>
      <p className="text-sm text-ai-muted leading-relaxed whitespace-pre-wrap">{body}</p>
    </section>
  );
}
