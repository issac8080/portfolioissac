/**
 * Stop a stray Next.js dev server bound to 127.0.0.1:PORT (Windows).
 * Cursor / background tasks sometimes leave `node ... start-server.js` running
 * with no visible terminal — that still holds the port.
 *
 * Only kills processes whose command line includes this repo path and
 * `start-server.js` (Next dev entry).
 */
const { execSync } = require("child_process");
const path = require("path");

const port = Number(process.env.PORT) || 3000;
const projectRoot = path.resolve(path.join(__dirname, ".."));
const marker = path.join("next", "dist", "server", "lib", "start-server.js");

function winListeningPids(p) {
  const raw = execSync("netstat -ano", { encoding: "utf-8", windowsHide: true });
  const pids = new Set();
  for (const line of raw.split(/\r?\n/)) {
    const cols = line.trim().split(/\s+/);
    if (cols.length < 5 || !/LISTENING/i.test(cols[3] || "")) continue;
    const local = cols[1] || "";
    const pid = cols[4];
    if (!/^\d+$/.test(pid)) continue;
    if (!local.endsWith(":" + p)) continue;
    pids.add(pid);
  }
  return [...pids];
}

function winCommandLine(pid) {
  try {
    return execSync(
      `powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}' | Select-Object -ExpandProperty CommandLine"`,
      { encoding: "utf-8", windowsHide: true }
    ).trim();
  } catch {
    return "";
  }
}

function main() {
  if (process.platform !== "win32") {
    console.error("dev:kill-port is only implemented for Windows.");
    process.exit(1);
  }

  const pids = winListeningPids(port);
  if (!pids.length) {
    console.log(`Nothing is listening on 127.0.0.1:${port}.`);
    process.exit(0);
  }

  const rootLower = projectRoot.toLowerCase();
  const markerLower = marker.replace(/\\/g, "/").toLowerCase();

  for (const pid of pids) {
    const cmd = winCommandLine(pid);
    const cmdLower = cmd.toLowerCase().replace(/\\/g, "/");
    const looksLikeThisNext =
      cmdLower.includes(markerLower) && cmdLower.includes(rootLower.replace(/\\/g, "/"));

    if (!looksLikeThisNext) {
      console.warn(
        `PID ${pid} listens on :${port} but does not look like this repo's Next dev — not killing.\n` +
          `  ${cmd.slice(0, 160)}${cmd.length > 160 ? "…" : ""}`
      );
      continue;
    }

    console.log(`Stopping Next dev (PID ${pid}) on port ${port}…`);
    execSync(`taskkill /PID ${pid} /F`, { stdio: "inherit", windowsHide: true });
  }
}

main();
