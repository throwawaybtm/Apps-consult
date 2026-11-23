const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.join(__dirname, "..");

// Remotion normally downloads its own headless Chrome, which the cloud proxy blocks.
// Use the preinstalled Playwright headless shell instead (newest version first).
function findHeadlessShell({ base = "/opt/pw-browsers", env = process.env } = {}) {
  if (env.REMOTION_BROWSER_EXECUTABLE) return env.REMOTION_BROWSER_EXECUTABLE;
  let dirs;
  try {
    dirs = fs.readdirSync(base);
  } catch {
    return null;
  }
  const versions = dirs
    .map((d) => d.match(/^chromium_headless_shell-(\d+)$/))
    .filter(Boolean)
    .sort((a, b) => Number(b[1]) - Number(a[1]));
  for (const [dir] of versions) {
    const bin = path.join(base, dir, "chrome-headless-shell-linux64", "chrome-headless-shell");
    if (fs.existsSync(bin)) return bin;
  }
  return null;
}

module.exports = { findHeadlessShell };

if (require.main === module) {
  const [mode, ...args] = process.argv.slice(2);
  if (!["render", "still"].includes(mode) || args.length < 3) {
    console.error("Usage: npm run video -- <entry.ts> <composition-id> <out.mp4> [remotion flags]");
    console.error("       npm run video:still -- <entry.ts> <composition-id> <out.png> --frame=<n> [remotion flags]");
    process.exit(1);
  }
  const browser = findHeadlessShell();
  const flags = browser ? [`--browser-executable=${browser}`] : [];
  const r = spawnSync(path.join(ROOT, "node_modules", ".bin", "remotion"), [mode, ...args, ...flags], {
    cwd: process.env.INIT_CWD || process.cwd(),
    stdio: "inherit",
  });
  process.exit(r.status ?? 1);
}
