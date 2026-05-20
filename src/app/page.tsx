"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ExperiencePreferencesProvider } from "@/context/ExperiencePreferences";
import { useExperiencePreferences } from "@/context/ExperiencePreferences";
import { AiSystemProvider } from "@/context/AiSystemContext";
import AiSystemShell from "@/components/ai-os/AiSystemShell";
import AiAmbientNeuralLayer from "@/components/ai-os/AiAmbientNeuralLayer";
import { LenisProvider, useLenisScroll } from "@/context/LenisContext";
import { trackPortfolioEvent } from "@/lib/analytics";
import { downloadResumePdfAsset } from "@/lib/resumeAsset";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HomeQuickStats from "@/components/HomeQuickStats";
import HomeExpLeadPreview from "@/components/HomeExpLeadPreview";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import FeaturedSystems from "@/components/FeaturedSystems";
import ExperienceSection from "@/components/Experience";
import ResearchSection from "@/components/Research";
import SkillsSection from "@/components/Skills";
import LeadershipSection from "@/components/Leadership";
import ActivitiesSection from "@/components/ActivitiesSection";
import ContactSection from "@/components/Contact";
import ScrollEffects from "@/components/ScrollEffects";
import PremiumCursorLab from "@/components/PremiumCursorLab";
import MouseGradientLight from "@/components/MouseGradientLight";
import AnimatedGrid from "@/components/background/AnimatedGrid";
import DepthFog from "@/components/background/DepthFog";
import LabNotebookSection from "@/components/LabNotebookSection";
import EmbeddingPlayground from "@/components/EmbeddingPlayground";
import SecurityModelSection from "@/components/SecurityModelSection";
import AboutPortfolioSection from "@/components/AboutPortfolioSection";
import InterviewIssacSection from "@/components/InterviewIssacSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ResumeTailorSection from "@/components/ResumeTailorSection";
import SiteFooter from "@/components/SiteFooter";
import type { CaseStudy } from "@/data/caseStudies";
import { caseStudies } from "@/data/caseStudies";

const GamesPlaygroundSection = dynamic(
  () => import("@/components/GamesPlayground/GamesPlaygroundSection"),
  {
    ssr: true,
    loading: () => (
      <section id="games" className="relative min-h-[200px] py-20 md:py-24 lg:py-28" />
    ),
  }
);

const ProjectModal = dynamic(() => import("@/components/ProjectModal"), { ssr: false });
const ResumeStudyModal = dynamic(() => import("@/components/ResumeStudyModal"), { ssr: false });
const PortfolioChatbot = dynamic(() => import("@/components/PortfolioChatbot"), { ssr: false });
const AmbientMusicFab = dynamic(() => import("@/components/AmbientMusicFab"), { ssr: false });

export default function Home() {
  return (
    <ExperiencePreferencesProvider>
      <LenisProvider>
        <AiSystemProvider>
          <HomePageInner />
        </AiSystemProvider>
      </LenisProvider>
    </ExperiencePreferencesProvider>
  );
}

function HomePageInner() {
  const { effectiveMinimalUI } = useExperiencePreferences();
  const lenisApi = useLenisScroll();
  const [selectedProject, setSelectedProject] = useState<CaseStudy | null>(null);
  const projectModalOpen = !!selectedProject;
  const [gamesModalOpen, setGamesModalOpen] = useState(false);
  const [resumeStudyOpen, setResumeStudyOpen] = useState(false);
  const anyModalOpen = projectModalOpen || gamesModalOpen || resumeStudyOpen;

  const handlePreviewResume = useCallback(() => {
    trackPortfolioEvent("Resume Preview");
    setResumeStudyOpen(true);
  }, []);

  const handleDownloadResume = useCallback(() => {
    trackPortfolioEvent("Resume Download");
    void downloadResumePdfAsset();
  }, []);

  useEffect(() => {
    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-modal-open", "true");
      lenisApi?.lenis?.stop();
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal-open");
      lenisApi?.lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal-open");
      lenisApi?.lenis?.start();
    };
  }, [anyModalOpen, lenisApi?.lenis]);

  useEffect(() => {
    const openCase = (e: Event) => {
      const ce = e as CustomEvent<{ caseStudyId?: string }>;
      const id = ce.detail?.caseStudyId;
      if (!id) return;
      const cs = caseStudies.find((c) => c.id === id);
      if (cs) setSelectedProject(cs);
    };
    window.addEventListener("portfolio-open-case-study", openCase as EventListener);
    return () =>
      window.removeEventListener("portfolio-open-case-study", openCase as EventListener);
  }, []);

  useEffect(() => {
    const openResume = () => setResumeStudyOpen(true);
    window.addEventListener("portfolio-open-resume-preview", openResume);
    return () => window.removeEventListener("portfolio-open-resume-preview", openResume);
  }, []);

  /** Deep link from legacy `/resume-study` → `/?resumeStudy=1` */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("resumeStudy") !== "1") return;
    setResumeStudyOpen(true);
    sp.delete("resumeStudy");
    const qs = sp.toString();
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`
    );
  }, []);

  return (
    <>
      <PremiumCursorLab enabled={!effectiveMinimalUI && !anyModalOpen} />
      <Nav onPreviewResume={handlePreviewResume} onDownloadResume={handleDownloadResume} />
      <main
        id="main-content"
        className={`relative min-h-screen bg-ai-bg text-white transition-[filter,pointer-events] duration-300 pb-28 md:pb-0 max-md:pt-[calc(3.25rem+env(safe-area-inset-top,0px))] ${
          anyModalOpen ? "pointer-events-none select-none" : ""
        }`}
        style={{
          filter: anyModalOpen ? "blur(8px)" : "none",
        }}
      >
        <AiSystemShell />
        {!effectiveMinimalUI && (
          <div data-rich-page className="absolute inset-0 z-0 pointer-events-none">
            <AiAmbientNeuralLayer />
            <div
              className="absolute inset-0 overflow-hidden will-change-transform"
              data-parallax-scroll="0.14"
            >
              <AnimatedGrid />
            </div>
            <DepthFog />
            <div
              className="absolute inset-0 will-change-transform"
              data-parallax-scroll="0.22"
            >
              <MouseGradientLight />
            </div>
          </div>
        )}
        {effectiveMinimalUI && (
          <div
            className="absolute inset-0 z-0 bg-gradient-to-b from-ai-bg via-[#0a0a12] to-ai-bg opacity-90"
            aria-hidden
          />
        )}
        <ScrollEffects modalOpen={anyModalOpen} />
        <Hero />
        <HomeQuickStats />
        <HomeExpLeadPreview />
        <SkillsSection />
        <ProjectsShowcase onSelectProject={setSelectedProject} />
        <GamesPlaygroundSection onGameModalOpenChange={setGamesModalOpen} />
        <FeaturedSystems />
        <ExperienceSection />
        <ResearchSection />
        <LabNotebookSection />
        <EmbeddingPlayground />
        <LeadershipSection />
        <ActivitiesSection />
        <SecurityModelSection />
        <AboutPortfolioSection />
        <ResumeTailorSection />
        <InterviewIssacSection />
        <TestimonialsSection />
        <ContactSection
          onPreviewResume={handlePreviewResume}
          onDownloadResume={handleDownloadResume}
        />
        <SiteFooter />
      </main>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <ResumeStudyModal open={resumeStudyOpen} onOpenChange={setResumeStudyOpen} />

      <AmbientMusicFab />
      <PortfolioChatbot currentProjectId={selectedProject?.id ?? null} />
    </>
  );
}
