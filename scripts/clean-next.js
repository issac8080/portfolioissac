/**
 * Remove .next and webpack tooling caches (no readlink). Fixes EINVAL readlink on
 * Windows/OneDrive when Next cleans the build cache, and stale caches that can
 * yield 404 on /_next/static/chunks/* in dev.
 * Also removes tsconfig.tsbuildinfo so incremental TS does not reference deleted .next/types.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const nextDir = path.join(root, ".next");
const tsBuildInfo = path.join(root, "tsconfig.tsbuildinfo");
const webpackPersistentCache = path.join(
  root,
  "node_modules",
  ".cache",
  "webpack"
);
/** Must match basename in next.config.mjs (OneDrive dev output under %TEMP%) */
const tempDevDist = path.join(require("os").tmpdir(), "next-dist-portfolio-issac");

function rmSafe(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
  } catch (_) {
    /* ignore */
  }
}

rmSafe(nextDir);
rmSafe(webpackPersistentCache);
rmSafe(tempDevDist);
try {
  if (fs.existsSync(tsBuildInfo)) fs.rmSync(tsBuildInfo, { force: true });
} catch (_) {
  /* ignore */
}
