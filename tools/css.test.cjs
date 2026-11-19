const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.join(__dirname, "..");
const FIXTURE = path.join(__dirname, "fixtures", "tailwind");

test("npm run css compiles Tailwind v4 with the project's @theme and only the classes used", () => {
  // The input stays inside the repo so `@import "tailwindcss"` resolves from the repo's node_modules, as it will for projects/.
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "tw-")), "out.css");
  const r = spawnSync("npm", ["run", "-s", "css", "--", "-i", path.join(FIXTURE, "input.css"), "-o", out, "--minify"], { cwd: ROOT, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  const css = fs.readFileSync(out, "utf8");
  assert.match(css, /\.bg-guide-600\{/);
  assert.match(css, /#0369a1/);
  assert.match(css, /\.rounded-xl\{/);
  assert.doesNotMatch(css, /\.bg-red-500\{/, "unused classes are not emitted");
});
