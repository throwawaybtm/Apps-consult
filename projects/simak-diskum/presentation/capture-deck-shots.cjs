// Captures the 16:10 screenshots the deck uses, from the mockups, and prints where each numbered pin goes.
// Usage (from the repo root): node projects/simak-diskum/presentation/capture-deck-shots.cjs
// Output: projects/simak-diskum/presentation/assets/*.png and pins.json (pin positions on the 960 x 600 frame).
// Elements with data-pin="N" in the mockups get pin N. Uses the preinstalled Playwright Chromium.
const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs");

const mock = path.join(__dirname, "..", "mockups");
const out = path.join(__dirname, "assets");
const S = 960 / 1440;

// name, page, optional zoom, optional element to scroll to (selector, y offset from top of viewport)
const jobs = [
  { name: "public-home", page: "public-home" },
  { name: "public-kalender", page: "public-kalender" },
  { name: "public-detail", page: "public-detail" },
  { name: "admin-dashboard", page: "admin-dashboard" },
  { name: "admin-kegiatan-a", page: "admin-kegiatan", scrollTo: '[aria-labelledby="h-tahap"]', offset: 16 },
  { name: "admin-kegiatan-b", page: "admin-kegiatan", zoom: 0.78, scrollTo: '[aria-labelledby="h-catatan"]', offset: 24 },
  { name: "admin-laporan", page: "admin-laporan", scrollTo: "form[aria-label='Pilihan laporan']", offset: 20 },
];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const pins = {};
  try {
    for (const j of jobs) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
      const page = await ctx.newPage();
      await page.goto("file://" + path.join(mock, j.page + ".html"));
      await page.evaluate(() => document.fonts.ready);
      if (j.zoom) await page.evaluate((z) => { document.documentElement.style.zoom = z; }, j.zoom);
      if (j.scrollTo) {
        await page.evaluate(({ sel, off }) => {
          const r = document.querySelector(sel).getBoundingClientRect();
          window.scrollTo(0, window.scrollY + r.top - off);
        }, { sel: j.scrollTo, off: j.offset });
      }
      await page.screenshot({ path: path.join(out, j.name + ".png") });
      pins[j.name] = await page.evaluate((s) => [...document.querySelectorAll("[data-pin]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { n: el.dataset.pin, x: Math.round(Math.max(0, Math.min(r.x * s + 6, 904))), y: Math.round(Math.max(0, Math.min(r.y * s + 6, 544))), visible: r.bottom > 0 && r.top < 900 };
      }), S);
      await ctx.close();
    }
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto("file://" + path.join(mock, "public-home.html"));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(out, "m-public-home.png") });
    await ctx.close();
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(__dirname, "pins.json"), JSON.stringify(pins, null, 1));
  console.log(JSON.stringify(pins));
})();
