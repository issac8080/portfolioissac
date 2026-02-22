"use client";

import { useState, useEffect } from "react";
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
import PortfolioChatbot from "@/components/PortfolioChatbot";
import ProjectModal from "@/components/ProjectModal";
import type { CaseStudy } from "@/data/caseStudies";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);
  const projectModalOpen = !!selectedProject;

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
              projectModalOpen ? "pointer-events-none select-none" : ""
            }`}
            style={{
              filter: projectModalOpen ? "blur(8px)" : "none",
            }}
          >
            <div className="absolute inset-0 z-0">
              <AnimatedGrid />
            </div>
            <DepthFog />
            <MouseGradientLight />
            <ScrollEffects modalOpen={projectModalOpen} />
            <Nav />
            <Hero />
            <ProjectsShowcase onSelectProject={setSelectedProject} />
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
              <ContactSection />
            </section>
          </main>

          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />

          <PortfolioChatbot />
        </>
      )}
    </>
  );
}
