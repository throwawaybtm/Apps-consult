// Captures the 16:10 screenshots the deck uses, from the mockups.
// Usage (from the repo root): node projects/e-blud/presentation/capture-deck-shots.cjs
// Output: projects/e-blud/presentation/assets/*.png. Uses the preinstalled Playwright Chromium.
const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs");

const mock = path.join(__dirname, "..", "mockups");
const out = path.join(__dirname, "assets");

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const n of ["public-home", "public-daftar", "admin-dashboard", "admin-verifikasi", "admin-permohonan"]) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
      const page = await ctx.newPage();
      await page.goto("file://" + path.join(mock, n + ".html"));
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(out, n + ".png") });
      await ctx.close();
    }
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto("file://" + path.join(mock, "public-daftar.html"));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(out, "m-public-daftar.png") });
    await ctx.close();
  } finally {
    await browser.close();
  }
})();
