const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { buildPdf, checkAssets } = require("./build-pdf.cjs");

const FIXTURE_DIR = path.join(__dirname, "fixtures", "sample-guidebook");
const FIXTURE = path.join(FIXTURE_DIR, "guidebook.html");
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "pdf-"));

test("buildPdf writes an A4 PDF", async () => {
  const out = path.join(tmp(), "out.pdf");
  await buildPdf(FIXTURE, out);
  const bytes = fs.readFileSync(out, "latin1");
  assert.ok(bytes.startsWith("%PDF-"));
  const m = bytes.match(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/);
  assert.ok(m, "MediaBox found");
  const [w, h] = [Number(m[1]), Number(m[2])];
  assert.ok(w > 593 && w < 597, `width ${w}`);
  assert.ok(h > 840 && h < 844, `height ${h}`);
});

test("buildPdf embeds fonts", async () => {
  const out = path.join(tmp(), "out.pdf");
  await buildPdf(FIXTURE, out);
  const bytes = fs.readFileSync(out, "latin1");
  // Chromium embeds fonts either as font files (/FontFile*) or as Type 3 glyph outlines (/CharProcs).
  assert.match(bytes, /\/FontFile[23]?\b|\/CharProcs/);
  // The fixture asks for Inter; finding it proves fonts loaded before printing (no fallback font).
  assert.match(bytes, /\/(FontName|BaseFont) ?\/[A-Z]{6}\+Inter-/);
});

test("buildPdf renders a relative asset", async () => {
  assert.deepEqual(await checkAssets(FIXTURE), []);
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "broken.html"), '<img src="assets/missing.png">');
  assert.deepEqual((await checkAssets(path.join(dir, "broken.html"))).length, 1);
  await assert.rejects(buildPdf(path.join(dir, "broken.html")), /Broken assets/);
});

test("buildPdf rejects a missing input", async () => {
  await assert.rejects(buildPdf("nope.html"), /Input not found/);
});

test("buildPdf defaults the output path", async () => {
  const dir = tmp();
  fs.cpSync(FIXTURE_DIR, dir, { recursive: true });
  const input = path.join(dir, "guidebook.html");
  const out = await buildPdf(input);
  assert.equal(out, path.join(dir, "guidebook.pdf"));
  assert.ok(fs.existsSync(out));
});
