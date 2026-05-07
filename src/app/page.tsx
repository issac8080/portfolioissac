"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import FeaturedSystems from "@/components/FeaturedSystems";
import ExperienceSection from "@/components/Experience";
import ResearchSection from "@/components/Research";
import SkillsSection from "@/components/Skills";
import LeadershipSection from "@/components/Leadership";
import ContactSection from "@/components/Contact";
import ScrollEffects from "@/components/ScrollEffects";
import BootScreen from "@/components/BootScreen";
import MouseGradientLight from "@/components/MouseGradientLight";
import AnimatedGrid from "@/components/background/AnimatedGrid";
import DepthFog from "@/components/background/DepthFog";
import type { CaseStudy } from "@/data/caseStudies";

const GamesPlaygroundSection = dynamic(
  () => import("@/components/GamesPlayground/GamesPlaygroundSection"),
  { ssr: true, loading: () => <section id="games" className="relative py-24 md:py-32 min-h-[200px]" /> }
);

const ProjectModal = dynamic(() => import("@/components/ProjectModal"), { ssr: false });
const ResumePreviewModal = dynamic(() => import("@/components/ResumePreviewModal"), { ssr: false });
const PortfolioChatbot = dynamic(() => import("@/components/PortfolioChatbot"), { ssr: false });

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);
  const projectModalOpen = !!selectedProject;
  const [gamesModalOpen, setGamesModalOpen] = useState(false);
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const anyModalOpen = projectModalOpen || gamesModalOpen;

  useEffect(() => {
    if (projectModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-modal-open", "true");
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal-open");
    };
  }, [projectModalOpen]);

  return (
    <>
      <AnimatePresence mode="wait">
        {!bootComplete && (
          <BootScreen onComplete={() => setBootComplete(true)} />
        )}
      </AnimatePresence>

      {bootComplete && (
        <>
          <main
            className={`relative min-h-screen bg-ai-bg text-white transition-[filter,pointer-events] duration-300 ${
              anyModalOpen ? "pointer-events-none select-none" : ""
            }`}
            style={{
              filter: anyModalOpen ? "blur(8px)" : "none",
            }}
          >
            <div className="absolute inset-0 z-0">
              <AnimatedGrid />
            </div>
            <DepthFog />
            <MouseGradientLight />
            <ScrollEffects modalOpen={anyModalOpen} />
            <Nav
              onPreviewResume={() => setResumePreviewOpen(true)}
              onDownloadResume={() => import("@/lib/generateResumePdf").then((m) => m.downloadResumePdf())}
            />
            <Hero />
            <ProjectsShowcase onSelectProject={setSelectedProject} />
            <GamesPlaygroundSection
              onGameModalOpenChange={setGamesModalOpen}
            />
            <section data-cinematic-reveal className="relative py-24 md:py-32">
              <FeaturedSystems />
            </section>
            <section data-cinematic-reveal className="relative py-24 md:py-32">
              <ExperienceSection />
            </section>
            <section data-cinematic-reveal className="relative py-24 md:py-32">
              <ResearchSection />
            </section>
            <section data-cinematic-reveal className="relative py-24 md:py-32">
              <SkillsSection />
            </section>
            <section data-cinematic-reveal className="relative py-24 md:py-32">
              <LeadershipSection />
            </section>
            <section data-cinematic-reveal className="relative py-24 md:py-32 pb-24">
              <ContactSection
              onPreviewResume={() => setResumePreviewOpen(true)}
              onDownloadResume={() => import("@/lib/generateResumePdf").then((m) => m.downloadResumePdf())}
            />
            </section>
          </main>

          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />

          <ResumePreviewModal
            open={resumePreviewOpen}
            onOpenChange={setResumePreviewOpen}
          />

          <PortfolioChatbot currentProjectId={selectedProject?.id ?? null} />
        </>
      )}
    </>
  );
}
