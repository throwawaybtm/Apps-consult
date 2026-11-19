const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

function resolveInput(inputHtml) {
  const abs = path.resolve(inputHtml);
  if (!fs.existsSync(abs)) throw new Error(`Input not found: ${abs}`);
  return abs;
}

async function withLoadedPage(abs, fn) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const failed = [];
    page.on("requestfailed", (req) => failed.push(decodeURIComponent(path.basename(new URL(req.url()).pathname))));
    await page.goto(pathToFileURL(abs).href, { waitUntil: "load" });
    // Load lazy images now, so they are printed and not mistaken for broken files.
    await page.evaluate(() =>
      Promise.all([...document.images].map((img) => { img.loading = "eager"; return img.decode().catch(() => {}); }))
    );
    await page.evaluate(() => document.fonts.ready);
    return await fn(page, failed);
  } finally {
    await browser.close();
  }
}

// Images that didn't decode, fonts that failed to load, and any file request that failed (e.g. CSS backgrounds).
async function brokenAssets(page, failed) {
  const inPage = await page.evaluate(() => [
    ...[...document.images].filter((img) => img.naturalWidth === 0).map((img) => decodeURIComponent(new URL(img.src).pathname.split("/").pop())),
    ...[...document.fonts].filter((f) => f.status === "error").map((f) => `font "${f.family}"`),
  ]);
  return [...new Set([...inPage, ...failed])];
}

async function checkAssets(inputHtml) {
  return withLoadedPage(resolveInput(inputHtml), brokenAssets);
}

async function buildPdf(inputHtml, outputPdf) {
  const abs = resolveInput(inputHtml);
  const out = path.resolve(outputPdf ?? abs.replace(/\.html?$/i, "") + ".pdf");
  await withLoadedPage(abs, async (page, failed) => {
    const broken = await brokenAssets(page, failed);
    if (broken.length) throw new Error(`Broken assets: ${broken.join(", ")}`);
    await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
  });
  return out;
}

module.exports = { buildPdf, checkAssets };

if (require.main === module) {
  const [input, output] = process.argv.slice(2);
  if (!input) {
    console.error("Usage: node tools/build-pdf.cjs <input.html> [output.pdf]");
    process.exit(1);
  }
  buildPdf(input, output).then(
    (out) => console.log(out),
    (err) => {
      console.error(err.message);
      process.exit(1);
    }
  );
}
