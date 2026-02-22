/**
 * Verifies that all Nav scroll targets (section IDs) are implemented in the codebase.
 * Run: node scripts/verify-scroll-targets.js
 */
const fs = require("fs");
const path = require("path");

const NAV_LINKS = [
  "hero",
  "projects",
  "featured-systems",
  "experience",
  "research",
  "skills",
  "leadership",
  "contact",
];

const SRC = path.join(__dirname, "..", "src");
const COMPONENTS = [
  "Hero.tsx",
  "ProjectsShowcase.tsx",
  "FeaturedSystems.tsx",
  "Experience.tsx",
  "Research.tsx",
  "Skills.tsx",
  "Leadership.tsx",
  "Contact.tsx",
];

const idToFile = {
  hero: "Hero.tsx",
  projects: "ProjectsShowcase.tsx",
  "featured-systems": "FeaturedSystems.tsx",
  experience: "Experience.tsx",
  research: "Research.tsx",
  skills: "Skills.tsx",
  leadership: "Leadership.tsx",
  contact: "Contact.tsx",
};

let failed = false;
for (const id of NAV_LINKS) {
  const file = path.join(SRC, "components", idToFile[id]);
  const content = fs.readFileSync(file, "utf8");
  const hasId = content.includes(`id="${id}"`) || content.includes(`id='${id}'`);
  if (!hasId) {
    console.error(`Missing id="${id}" in ${idToFile[id]}`);
    failed = true;
  } else {
    console.log(`OK: id="${id}" found in ${idToFile[id]}`);
  }
}
if (failed) process.exit(1);
console.log("\nAll scroll targets verified.");
process.exit(0);
