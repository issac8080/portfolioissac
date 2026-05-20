/**
 * Start Next.js dev server.
 *
 * Port guard: if the dev port is already in use, we exit instead of letting Next
 * fall back to 3001 — two processes share one `.next` and corrupt chunks / 404
 * `/_next/static/*`.
 *
 * Optional clean: pass `--clean` (or run `npm run dev:clean`) to delete `.next`
 * and `%TEMP%\\next-dist-portfolio-issac` before start (OneDrive-safe).
 * Do NOT clean on every start — that invalidates chunk URLs while the browser may still request old
 * scripts → 404 on main-app.js / app-pages-internals.js until a hard refresh.
 */
const { spawn, execSync } = require("child_process");
const fs = require("fs");
const net = require("net");
const path = require("path");
const os = require("os");

const nextDir = path.join(__dirname, "..", ".next");
const tempDevDist = path.join(os.tmpdir(), "next-dist-portfolio-issac");

/** Best-effort clean: OneDrive can leave .next half-deleted or race with rm. */
function rmNextDir() {
  for (const dir of [nextDir, tempDevDist]) {
    if (!require("fs").existsSync(dir)) continue;
    for (let i = 0; i < 5; i++) {
      try {
        require("fs").rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
        break;
      } catch (_) {
        if (i === 4) break;
        try {
          require("child_process").execSync(`rd /s /q "${dir}"`, {
            stdio: "ignore",
            windowsHide: true,
          });
        } catch (_) {
          /* ignore */
        }
      }
    }
  }
}

function portAvailable(port, host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (err) => {
      if (err && err.code === "EADDRINUSE") resolve(false);
      else reject(err);
    });
    server.listen(port, host, () => {
      server.close(() => resolve(true));
    });
  });
}

/** Windows: list PIDs listening on `port` (English netstat columns). */
function windowsListeningPids(port) {
  if (process.platform !== "win32") return [];
  try {
    const raw = execSync("netstat -ano", { encoding: "utf-8", windowsHide: true });
    const pids = new Set();
    for (const line of raw.split(/\r?\n/)) {
      const cols = line.trim().split(/\s+/);
      if (cols.length < 5 || !/LISTENING/i.test(cols[3] || "")) continue;
      const local = cols[1] || "";
      const pid = cols[4];
      if (!/^\d+$/.test(pid)) continue;
      if (!local.endsWith(":" + port)) continue;
      pids.add(pid);
    }
    return [...pids];
  } catch {
    return [];
  }
}

function formatPortConflictHint(port) {
  const pids = windowsListeningPids(port);
  if (!pids.length) return "";
  const lines = pids.map((pid) => {
    try {
      const out = execSync(`tasklist /FI "PID eq ${pid}" /NH`, {
        encoding: "utf-8",
        windowsHide: true,
      }).trim();
      return `  PID ${pid} — ${out || "(unknown)"}`;
    } catch {
      return `  PID ${pid}`;
    }
  });
  return (
    `\nWho is using port ${port} (Windows):\n` +
    lines.join("\n") +
    `\n\nFree it: close that terminal, or run  taskkill /PID ${pids[0]} /F  (only if it is a stray Node/Next process).\n`
  );
}

const argv = process.argv.slice(2);
const shouldCleanNext =
  argv.includes("--clean") || process.env.CLEAN_NEXT === "1";

const devPort = Number(process.env.PORT) || 3000;

(async () => {
  try {
    if (!(await portAvailable(devPort))) {
      console.error(
        `\nPort ${devPort} is already in use (another \`next dev\` or app?).\n` +
          `Stop that process (Ctrl+C), then run npm run dev again.\n\n` +
          `No terminal open? A background Next process may still be running (e.g. from Cursor). Try:  npm run dev:kill-port\n\n` +
          `If Next auto-switched to 3001, you had two servers sharing one .next folder — that causes missing chunks and 404 on /_next/static files.\n` +
          formatPortConflictHint(devPort)
      );
      process.exit(1);
    }
  } catch (e) {
    console.error("Could not verify dev port:", e);
    process.exit(1);
  }

  if (shouldCleanNext) {
    rmNextDir();
  }

  const cwd = path.join(__dirname, "..");
  const nextCli = path.join(cwd, "node_modules", "next", "dist", "bin", "next");
  // When distDir is outside the repo (OneDrive → %TEMP%), compiled server chunks live under Temp and
  // `require("next/...")` would never walk up to this project's node_modules. NODE_PATH fixes resolution.
  const nodeModulesRoot = path.join(cwd, "node_modules");
  const nodePath = [nodeModulesRoot, process.env.NODE_PATH].filter(Boolean).join(path.delimiter);
  // No shell: avoids DEP0190 (spawn + shell:true + args) and keeps argv exact.
  const child = spawn(
    process.execPath,
    // Bind to loopback so the browser and chunk URLs match one listener (avoids odd proxy/host splits on Windows).
    [nextCli, "dev", "-H", "127.0.0.1", "-p", String(devPort)],
    { stdio: "inherit", cwd, env: { ...process.env, NODE_PATH: nodePath } }
  );
  child.on("exit", (code) => process.exit(code ?? 0));
})();
