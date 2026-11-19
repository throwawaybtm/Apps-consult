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
    await page.goto(pathToFileURL(abs).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    return await fn(page);
  } finally {
    await browser.close();
  }
}

const brokenImages = (page) =>
  page.evaluate(() =>
    [...document.images].filter((img) => img.naturalWidth === 0).map((img) => img.getAttribute("src"))
  );

async function checkAssets(inputHtml) {
  return withLoadedPage(resolveInput(inputHtml), brokenImages);
}

async function buildPdf(inputHtml, outputPdf) {
  const abs = resolveInput(inputHtml);
  const out = path.resolve(outputPdf ?? abs.replace(/\.html?$/i, "") + ".pdf");
  await withLoadedPage(abs, async (page) => {
    const broken = await brokenImages(page);
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
