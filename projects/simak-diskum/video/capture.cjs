// Captures the mockup pages the video shows, and measures the numbered elements (data-pin in the mockups).
// Usage (from the repo root): node projects/simak-diskum/video/capture.cjs
// Output: public/shots/<name>.png (full page, 1440 wide at 1.5x) and src/rects.json
// (element boxes in page pixels at 1440 wide, keyed p1, p2, ... by data-pin). Uses the preinstalled Playwright Chromium.
const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs");

const mock = path.join(__dirname, "..", "mockups");
const shots = path.join(__dirname, "public", "shots");
const pages = ["public-home", "public-kalender", "public-detail", "admin-dashboard", "admin-kegiatan", "admin-laporan"];

(async () => {
  fs.mkdirSync(shots, { recursive: true });
  const browser = await chromium.launch();
  const out = {};
  try {
    for (const name of pages) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
      const p = await ctx.newPage();
      await p.goto("file://" + path.join(mock, name + ".html"), { waitUntil: "load" });
      await p.evaluate(() => document.fonts.ready);
      out[name] = await p.evaluate(() => {
        const o = { height: document.documentElement.scrollHeight };
        for (const el of document.querySelectorAll("[data-pin]")) {
          const r = el.getBoundingClientRect();
          o["p" + el.dataset.pin] = { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
        }
        return o;
      });
      await p.screenshot({ path: path.join(shots, name + ".png"), fullPage: true });
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(__dirname, "src", "rects.json"), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out));
})();
