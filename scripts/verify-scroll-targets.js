/**
 * Verifies that all Nav scroll targets (section IDs) are implemented in the codebase.
 * Run: node scripts/verify-scroll-targets.js
 */
const fs = require("fs");
const path = require("path");

const NAV_LINKS = [
  "hero",
  "projects",
  "games",
  "featured-systems",
  "experience",
  "research",
  "lab",
  "skills",
  "live-lab",
  "leadership",
  "activities",
  "testimonials",
  "security-model",
  "about-portfolio",
  "interview-issac",
  "resume-tailor",
  "contact",
];

const SRC = path.join(__dirname, "..", "src");

const idToFile = {
  hero: path.join(SRC, "components", "Hero.tsx"),
  projects: path.join(SRC, "components", "ProjectsShowcase.tsx"),
  games: path.join(SRC, "components", "GamesPlayground", "GamesPlaygroundSection.tsx"),
  "featured-systems": path.join(SRC, "components", "FeaturedSystems.tsx"),
  experience: path.join(SRC, "components", "Experience.tsx"),
  research: path.join(SRC, "components", "Research.tsx"),
  lab: path.join(SRC, "components", "LabNotebookSection.tsx"),
  skills: path.join(SRC, "components", "Skills.tsx"),
  "live-lab": path.join(SRC, "components", "EmbeddingPlayground.tsx"),
  leadership: path.join(SRC, "components", "Leadership.tsx"),
  activities: path.join(SRC, "components", "ActivitiesSection.tsx"),
  testimonials: path.join(SRC, "components", "TestimonialsSection.tsx"),
  "security-model": path.join(SRC, "components", "SecurityModelSection.tsx"),
  "about-portfolio": path.join(SRC, "components", "AboutPortfolioSection.tsx"),
  "interview-issac": path.join(SRC, "components", "InterviewIssacSection.tsx"),
  "resume-tailor": path.join(SRC, "components", "ResumeTailorSection.tsx"),
  contact: path.join(SRC, "components", "Contact.tsx"),
};

let failed = false;
for (const id of NAV_LINKS) {
  const file = idToFile[id];
  const content = fs.readFileSync(file, "utf8");
  const hasId = content.includes(`id="${id}"`) || content.includes(`id='${id}'`);
  if (!hasId) {
    console.error(`Missing id="${id}" in ${path.relative(process.cwd(), file)}`);
    failed = true;
  } else {
    console.log(`OK: id="${id}" found in ${path.basename(path.dirname(file))}/${path.basename(file)}`);
  }
}
if (failed) process.exit(1);
console.log("\nAll scroll targets verified.");
process.exit(0);
