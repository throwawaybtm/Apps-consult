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
  // The fixture loads Caladea from assets/ via @font-face; finding it means the fallback font wasn't used.
  assert.match(bytes, /\/(FontName|BaseFont) ?\/[A-Z]{6}\+Caladea/);
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

const page = (dir, html) => {
  fs.mkdirSync(path.join(dir, "assets"), { recursive: true });
  const file = path.join(dir, "g.html");
  fs.writeFileSync(file, `<!doctype html><html lang="id"><head><meta charset="utf-8"></head><body>${html}</body></html>`);
  return file;
};

test("buildPdf fails on a missing @font-face file", async () => {
  const file = page(tmp(), '<style>@font-face{font-family:X;src:url("assets/missing.ttf")} p{font-family:X}</style><p>Halo</p>');
  await assert.rejects(buildPdf(file), /Broken assets: .*missing\.ttf/);
});

test("buildPdf fails on a missing CSS background image", async () => {
  const file = page(tmp(), '<div style="width:50px;height:50px;background:url(assets/missing-bg.png)"></div>');
  await assert.rejects(buildPdf(file), /Broken assets: .*missing-bg\.png/);
});

test("buildPdf accepts lazy-loaded images below the fold", async () => {
  const dir = tmp();
  const file = page(dir, '<div style="height:5000px"></div><img loading="lazy" src="assets/dot.svg">');
  fs.copyFileSync(path.join(FIXTURE_DIR, "assets", "dot.svg"), path.join(dir, "assets", "dot.svg"));
  assert.ok(fs.existsSync(await buildPdf(file)));
});

test("buildPdf rejects a directory or non-HTML input", async () => {
  await assert.rejects(buildPdf(FIXTURE_DIR), /must be an \.html file/);
  await assert.rejects(buildPdf(path.join(FIXTURE_DIR, "assets", "dot.svg")), /must be an \.html file/);
});

test("buildPdf resolves relative paths from the caller's folder (INIT_CWD)", async () => {
  const dir = tmp();
  fs.cpSync(FIXTURE_DIR, dir, { recursive: true });
  const saved = process.env.INIT_CWD;
  process.env.INIT_CWD = dir;
  try {
    const out = await buildPdf("guidebook.html", "rel.pdf");
    assert.equal(out, path.join(dir, "rel.pdf"));
    assert.ok(fs.existsSync(out));
  } finally {
    if (saved === undefined) delete process.env.INIT_CWD; else process.env.INIT_CWD = saved;
  }
});
