// Captures print-quality screenshots of the mockups for the preview PDF, and measures where
// each numbered callout belongs (so the callouts sit on the real elements).
// Usage (from the repo root): node projects/e-blud/preview/capture-shots.cjs
// Output: projects/e-blud/preview/assets/shots/<page>-desktop.png, <page>-mobile.png and markers.json
// Uses the preinstalled Playwright Chromium. Never run `playwright install`.
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require("playwright");

const out = path.join(__dirname, "assets", "shots");
const mock = path.join(__dirname, "..", "mockups");

// Callouts per screen: a CSS selector on the mockup page and the legend text shown in the PDF.
const screens = {
  "public-home": [
    { sel: 'a[href="public-daftar.html"].btn-lg', text: "Tombol Ajukan pembiayaan membuka formulir online (F3, F13)." },
    { sel: "#judul-journey", text: "Perjalanan satu permohonan, supaya tahapnya jelas bagi pemohon." },
    { sel: "#statistik .grid", text: "Angka gabungan penyaluran pembiayaan, tanpa data pribadi mitra (F13)." },
    { sel: "#track-form", text: "Pemohon melacak tahap permohonan dengan kode (F14)." },
  ],
  "public-daftar": [
    { sel: "#h1-diri", text: "Pemohon mengisi data diri tanpa membuat akun (F3)." },
    { sel: "#h2-usaha", text: "Data usaha serta jumlah dan jangka waktu pembiayaan (F3)." },
    { sel: "#h3-dokumen", text: "Dokumen persyaratan diunggah sebagai foto atau scan (F3)." },
    { sel: "aside .bg-secondary", text: "Dokumen disimpan privat dan hanya dibuka petugas yang berhak." },
  ],
  "admin-dashboard": [
    { sel: "main .alert", text: "Pemberitahuan permohonan online yang menunggu verifikasi (F3)." },
    { sel: "#k-cair", text: "Kartu angka pencairan dan cicilan: hari ini, bulan ini, tahun ini (F9)." },
    { sel: "figure", text: "Grafik dengan tabel data sebagai alternatif teks (F9)." },
    { sel: "#judul-pinjaman", text: "Daftar pinjaman dengan filter status (F7, F8)." },
  ],
  "admin-verifikasi": [
    { sel: "#status-badge", side: "right", text: "Status permohonan: Menunggu verifikasi (F3)." },
    { sel: "#h-diri", text: "Data pemohon, dengan pemeriksaan NIK ganda (F2, F3)." },
    { sel: "#h-dok", text: "Petugas membuka tiap dokumen dan menandai yang sesuai (F3)." },
    { sel: "#h-putusan", text: "Keputusan: lanjut survei, minta perbaikan, atau tolak dengan catatan (F3, F4)." },
  ],
  "admin-permohonan": [
    { sel: "#h-data", text: "Petugas menginput permohonan untuk pemohon yang datang langsung (F3)." },
    { sel: "#tanggal", text: "Contoh aturan: tanggal pencairan paling lambat tanggal 28 (F5, F6)." },
    { sel: "#h-syarat", text: "Daftar persyaratan dokumen yang diterima (F3)." },
    { sel: "button[type=submit]", text: "Simpan permohonan (F3)." },
  ],
};

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const markers = {};
  const browser = await chromium.launch();
  try {
    for (const [name, defs] of Object.entries(screens)) {
      for (const [label, width, height, scale] of [["desktop", 1440, 900, 1.5], ["mobile", 390, 844, 2]]) {
        const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
        const page = await ctx.newPage();
        await page.goto("file://" + path.join(mock, name + ".html"), { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        if (label === "desktop") {
          // x and y are fractions of the page WIDTH (the image is scaled by width in the PDF).
          markers[name] = await page.evaluate((list) => list.map((d, i) => {
            const el = document.querySelector(d.sel);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const x = d.side === 'right' ? r.right + 24 : r.left - 36;
            return { n: i + 1, text: d.text, x: x / innerWidth, y: (r.top + scrollY + Math.min(r.height / 2, 14)) / innerWidth };
          }).filter(Boolean), defs);
          await page.screenshot({ path: path.join(out, `${name}-desktop.png`), fullPage: true });
        } else {
          // Only the top of the phone view is shown in the PDF.
          await page.screenshot({ path: path.join(out, `${name}-mobile.png`), fullPage: true, clip: { x: 0, y: 0, width, height: 1500 } });
        }
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(out, "markers.json"), JSON.stringify(markers, null, 2));
  for (const f of fs.readdirSync(out)) console.log(f, Math.round(fs.statSync(path.join(out, f)).size / 1024) + " KB");
})();
