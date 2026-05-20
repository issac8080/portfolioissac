import fs from "fs";
import path from "path";
import os from "os";

/** Basename under os.tmpdir() when cwd is under OneDrive — keep in sync with scripts/clean-next.js */
const NEXT_DEV_TEMP_DIST_NAME = "next-dist-portfolio-issac";

/** @see next/constants PHASE_DEVELOPMENT_SERVER — avoid ESM import resolution for next.config.mjs */
const PHASE_DEVELOPMENT_SERVER = "phase-development-server";

/** OneDrive for Business / consumer paths: `...\OneDrive\...` or `...\OneDrive - Contoso\...` */
function isOneDrivePath(dir) {
  return /[\\/]OneDrive(?:[\\/]|\s*-)/i.test(dir);
}

/** @param {string | undefined} phase */
function resolveDistDir(phase) {
  if (process.env.NEXT_DIST_DIR) return process.env.NEXT_DIST_DIR;
  if (
    process.env.NEXT_DIST_IN_PROJECT === "1" ||
    process.env.NEXT_DEV_DIST_IN_PROJECT === "1"
  ) {
    return ".next";
  }
  // Dev only: keep hot-reload output under %TEMP% so OneDrive sync does not corrupt chunks.
  // Next resolves `distDir` relative to the project root — an absolute path is wrongly joined with cwd
  // (ENOENT: mkdir ...\portfolioissac\C:\Users\...\Temp\...). Use path.relative to %TEMP% instead.
  // Production build must use `.next` so generated `types/` matches tsconfig + `next build` typecheck.
  if (isOneDrivePath(process.cwd()) && phase === PHASE_DEVELOPMENT_SERVER) {
    // Canonical temp path so `path.relative` does not embed 8.3 segments (ISSACS~1) in distDir / tsconfig.
    let tmpRoot = os.tmpdir();
    try {
      tmpRoot = fs.realpathSync.native(tmpRoot);
    } catch {
      /* keep os.tmpdir() */
    }
    const absTempDist = path.join(tmpRoot, NEXT_DEV_TEMP_DIST_NAME);
    const rel = path.relative(process.cwd(), absTempDist);
    if (rel && !path.isAbsolute(rel)) {
      return rel;
    }
  }
  return ".next";
}

/** @type {import('next').NextConfig | ((phase: string) => import('next').NextConfig)} */
export default (phase) => {
  const distDir = resolveDistDir(phase);

  return {
    reactStrictMode: true,
    transpilePackages: ["three", "@xenova/transformers"],
    distDir,
    webpack: (config, { dev }) => {
      if (dev) {
        // Memory cache avoids persistent webpack cache under node_modules on synced folders.
        config.cache = { type: "memory" };
        if (process.env.NEXT_WEBPACK_POLL) {
          const ms = Number(process.env.NEXT_WEBPACK_POLL) || 1000;
          config.watchOptions = {
            ...config.watchOptions,
            poll: ms,
          };
        }
      }
      config.resolve.alias = {
        ...config.resolve.alias,
        "onnxruntime-node$": false,
      };
      return config;
    },
  };
};
