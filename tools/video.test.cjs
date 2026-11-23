const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { findHeadlessShell } = require("./video.cjs");

const ROOT = path.join(__dirname, "..");
const ENTRY = path.join(__dirname, "fixtures", "video", "src", "index.ts");
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "vid-"));

function fakeBrowsers(version) {
  const base = tmp();
  const bin = path.join(base, `chromium_headless_shell-${version}`, "chrome-headless-shell-linux64", "chrome-headless-shell");
  fs.mkdirSync(path.dirname(bin), { recursive: true });
  fs.writeFileSync(bin, "");
  return { base, bin };
}

test("findHeadlessShell finds the preinstalled headless shell", () => {
  const { base, bin } = fakeBrowsers("1243");
  assert.equal(findHeadlessShell({ base, env: {} }), bin);
});

test("findHeadlessShell returns null when no headless shell is installed", () => {
  assert.equal(findHeadlessShell({ base: tmp(), env: {} }), null);
});

test("findHeadlessShell prefers REMOTION_BROWSER_EXECUTABLE", () => {
  const { base } = fakeBrowsers("1243");
  assert.equal(findHeadlessShell({ base, env: { REMOTION_BROWSER_EXECUTABLE: "/custom/chrome" } }), "/custom/chrome");
});

const run = (args) => spawnSync("npm", ["run", "-s", ...args], { cwd: ROOT, encoding: "utf8", timeout: 240000 });

test("npm run video renders an MP4 without downloading a browser", () => {
  const out = path.join(tmp(), "fixture.mp4");
  const r = run(["video", "--", ENTRY, "Fixture", out]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const head = fs.readFileSync(out).subarray(4, 8).toString("latin1");
  assert.equal(head, "ftyp", "MP4 container");
});

test("npm run video:still renders one frame as a PNG", () => {
  const out = path.join(tmp(), "frame.png");
  const r = run(["video:still", "--", ENTRY, "Fixture", out, "--frame=5"]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.deepEqual([...fs.readFileSync(out).subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
});
