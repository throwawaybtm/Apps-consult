// Captures the mockup states the video shows, and measures the elements it highlights.
// Usage (from the repo root): node projects/e-blud/video/capture.cjs
// Output: public/shots/<name>.png (full page, 1440 wide at 1.5x) and src/rects.json
// (element boxes in page pixels at 1440 wide). Uses the preinstalled Playwright Chromium.
const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs");

const mock = path.join(__dirname, "..", "mockups");
const shots = path.join(__dirname, "public", "shots");

// Each job: the page, an optional scripted state, and the elements to measure.
const jobs = [
  { name: "home", page: "public-home", rects: { cta: 'a[href="public-daftar.html"].btn-lg', stats: "#statistik .grid", track: "#track-form" } },
  { name: "form", page: "public-daftar", rects: { diri: 'section[aria-labelledby="h1-diri"]', privat: "aside .bg-secondary", docs: 'section[aria-labelledby="h3-dokumen"]', setuju: 'label[for="setuju"]' } },
  {
    name: "confirm", page: "public-daftar",
    run: async (p) => {
      const v = { nik: "0000000000000007", nama: "Mitra Contoh G", tempat: "Kota Contoh", lahir: "1990-01-01", hp: "080000000007", alamat: "Jalan Contoh 1", kel: "Kelurahan Contoh", jenis: "Warung contoh", "alamat-usaha": "Jalan Contoh 2", jumlah: "15000000" };
      for (const [id, val] of Object.entries(v)) await p.fill("#" + id, val);
      await p.selectOption("#kelamin", "Perempuan"); await p.selectOption("#kec", "Kecamatan Contoh A");
      await p.selectOption("#bidang", "Perdagangan"); await p.selectOption("#tenor", "12 bulan");
      await p.check("#setuju"); await p.click("button[type=submit]");
    },
    rects: { code: "#hasil p.text-3xl", card: "#hasil .card" },
  },
  {
    name: "track", page: "public-home",
    run: async (p) => { await p.fill("#kode", "KD-2026-0001"); await p.click("#track-form button[type=submit]"); },
    rects: { form: "#track-form", result: "#track-result p" },
  },
  { name: "dashboard", page: "admin-dashboard", rects: { alert: "main .alert", kpi: 'section[aria-labelledby="k-cair"]', chart: "figure", table: 'section[aria-labelledby="judul-pinjaman"]' } },
  { name: "verifikasi", page: "admin-verifikasi", rects: { diri: 'section[aria-labelledby="h-diri"]', docs: 'section[aria-labelledby="h-dok"]', putusan: 'section[aria-labelledby="h-putusan"]' } },
  {
    name: "verifikasi-ok", page: "admin-verifikasi",
    run: async (p) => { for (const id of ["d1", "d2", "d3", "d4", "d5", "d6"]) await p.check("#" + id); await p.click("[data-aksi=lanjut]"); },
    rects: { badge: "#status-badge", notif: "#notif p" },
  },
  {
    name: "rule", page: "admin-permohonan",
    run: async (p) => {
      await p.click("button[type=submit]"); // marks fields as touched so errors can show
      await p.selectOption("#mitra", "Mitra Contoh A"); await p.fill("#jumlah", "20000000"); await p.selectOption("#tenor", "24 bulan");
      await p.fill("#tanggal", "2026-12-29"); await p.locator("#tanggal").blur();
    },
    rects: { tanggal: "#tanggal", error: "#tanggal-error", hint: "#tanggal-hint" },
  },
];

(async () => {
  fs.mkdirSync(shots, { recursive: true });
  const browser = await chromium.launch();
  const out = {};
  try {
    for (const j of jobs) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
      const p = await ctx.newPage();
      await p.goto("file://" + path.join(mock, j.page + ".html"), { waitUntil: "load" });
      await p.evaluate(() => document.fonts.ready);
      if (j.run) await j.run(p);
      out[j.name] = await p.evaluate((sels) => {
        const o = { height: document.documentElement.scrollHeight };
        for (const [k, s] of Object.entries(sels)) {
          const el = document.querySelector(s);
          if (!el) { o[k] = null; continue; }
          const r = el.getBoundingClientRect();
          o[k] = { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
        }
        return o;
      }, j.rects);
      await p.screenshot({ path: path.join(shots, j.name + ".png"), fullPage: true });
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(__dirname, "src", "rects.json"), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out));
})();
