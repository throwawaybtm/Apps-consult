const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { checkA11y } = require("./check-a11y.cjs");

const FIXTURE = path.join(__dirname, "fixtures", "sample-guidebook", "guidebook.html");
const CLI = path.join(__dirname, "check-a11y.cjs");

const badPage = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "a11y-"));
  const file = path.join(dir, "bad.html");
  // No lang, no title, an image without alt text, and grey-on-white text that fails contrast.
  fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"></head><body><main><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="20" height="20"><p style="color:#bbb;background:#fff">Teks pucat</p></main></body></html>');
  return file;
};

test("checkA11y finds no WCAG violations on an accessible page", async () => {
  const result = await checkA11y(FIXTURE);
  assert.deepEqual(result.violations.map((v) => v.id), []);
});

test("checkA11y reports WCAG violations with their rule ids", async () => {
  const ids = (await checkA11y(badPage())).violations.map((v) => v.id);
  for (const id of ["html-has-lang", "document-title", "image-alt", "color-contrast"]) {
    assert.ok(ids.includes(id), `expected ${id} in ${ids.join(", ")}`);
  }
});

test("checkA11y rejects a missing input", async () => {
  await assert.rejects(checkA11y("nope.html"), /Input not found/);
});

test("check:a11y CLI exits 1 and names the rule when a page has violations", () => {
  const r = spawnSync(process.execPath, [CLI, FIXTURE, badPage()], { encoding: "utf8" });
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stdout, /image-alt/);
  assert.match(r.stdout, /guidebook\.html: no violations/);
});

test("check:a11y CLI exits 0 when every page passes", () => {
  const r = spawnSync(process.execPath, [CLI, FIXTURE], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
