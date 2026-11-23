// Usage: node check.cjs <page.html> [more.html ...]
// Screenshots each page at 1440px and 360px and fails on the mockup rules below.
// Uses the preinstalled Playwright Chromium. Never run `playwright install`.
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require("playwright");

const OUT = path.join(__dirname, "screenshots");

async function checkPage(browser, file) {
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) return [`${file}: file not found`];
  const name = path.basename(abs, ".html");
  const problems = [];
  fs.mkdirSync(OUT, { recursive: true });

  for (const [label, width, height] of [["1440", 1440, 900], ["360", 360, 780]]) {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto("file://" + abs, { waitUntil: "load" });
    await page.screenshot({ path: path.join(OUT, `${name}-${label}.png`), fullPage: true });

    if (label === "360") {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) problems.push(`${name}: horizontal page scroll of ${overflow}px at 360px`);
    }
    if (label === "1440") {
      const facts = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        title: document.title.trim(),
        main: !!document.querySelector("main"),
        noAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
        contoh: /contoh/i.test(document.body.innerText),
      }));
      if (facts.lang !== "id") problems.push(`${name}: <html lang> is "${facts.lang}", expected "id"`);
      if (!facts.title) problems.push(`${name}: empty <title>`);
      if (!facts.main) problems.push(`${name}: no <main>`);
      if (facts.noAlt) problems.push(`${name}: ${facts.noAlt} <img> without alt`);
      if (!facts.contoh) problems.push(`${name}: no visible text "contoh"`);
    }
    await ctx.close();
  }
  return problems;
}

(async () => {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Usage: node check.cjs <page.html> [more.html ...]");
    process.exit(1);
  }
  const browser = await chromium.launch();
  let failed = false;
  try {
    for (const f of files) {
      const problems = await checkPage(browser, f);
      if (problems.length) {
        failed = true;
        problems.forEach((p) => console.error("FAIL " + p));
      } else {
        console.log("PASS " + path.basename(f));
      }
    }
  } finally {
    await browser.close();
  }
  process.exit(failed ? 1 : 0);
})();
