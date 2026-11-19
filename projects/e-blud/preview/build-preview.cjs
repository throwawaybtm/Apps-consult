// Generates preview.html from ../prd.md plus the mockup screenshots.
// Usage (from the repo root):
//   node projects/e-blud/preview/build-preview.cjs
//   npm run build:pdf -- projects/e-blud/preview/preview.html
// The PRD stays the single source: edit prd.md, then re-run both commands.
const fs = require("node:fs");
const path = require("node:path");

const here = __dirname;
const prd = fs.readFileSync(path.join(here, "..", "prd.md"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inline = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

// Small Markdown subset: headings, blockquote, tables, lists, paragraphs.
// PRD "##" becomes <h3> because the page has its own h1 and h2.
function mdToHtml(md) {
  const lines = md.replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  let skippedTitle = false;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    let m;
    if ((m = /^(#{1,3}) (.*)$/.exec(line))) {
      if (m[1] === "#" && !skippedTitle) { skippedTitle = true; i++; continue; }
      const level = Math.min(m[1].length + 1, 4);
      out.push(`<h${level}>${inline(m[2])}</h${level}>`);
      i++; continue;
    }
    if (line.startsWith(">")) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<p class="banner">${inline(buf.join(" "))}</p>`);
      continue;
    }
    if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      out.push(
        "<table><thead><tr>" + head.map((c) => `<th scope="col">${inline(c)}</th>`).join("") + "</tr></thead><tbody>" +
          body.map((r) => "<tr>" + r.map((c) => `<td>${inline(c)}</td>`).join("") + "</tr>").join("") +
          "</tbody></table>"
      );
      continue;
    }
    if (/^- /.test(line)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i])) items.push(lines[i++].slice(2));
      out.push("<ul>" + items.map((t) => `<li>${inline(t)}</li>`).join("") + "</ul>");
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, ""));
      out.push("<ol>" + items.map((t) => `<li>${inline(t)}</li>`).join("") + "</ol>");
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#|>|\||- |\d+\. )/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${buf.map(inline).join("<br>")}</p>`);
  }
  return out.join("\n");
}

const screens = [
  {
    title: "Contoh tampilan 1: situs publik",
    fitur: "F13 dan F14",
    lead: "Halaman depan untuk masyarakat dan mitra. Tampilannya modern, berwarna biru muda, dan nyaman dibuka dari ponsel.",
    points: [
      "Informasi BLUD dan cara mengajukan pembiayaan (F13).",
      "Angka gabungan penyaluran pembiayaan, tanpa data pribadi mitra (F13).",
      "Kolom lacak permohonan dengan kode dari tanda terima berkas (F14, masih asumsi).",
    ],
    desktop: "../mockups/screenshots/public-home-1440.png",
    mobile: "../mockups/screenshots/public-home-360.png",
    alt: "Contoh halaman depan situs publik e-BLUD dengan judul, alur satu permohonan, kartu statistik, dua grafik, langkah pengajuan, dan kolom lacak permohonan",
  },
  {
    title: "Contoh tampilan 2: dashboard petugas",
    fitur: "F9, dengan data dari F3 sampai F8",
    lead: "Halaman awal petugas setelah login (F1). Tampilannya modern tetapi tetap bergaya aplikasi pemerintahan: menu di samping, kartu angka, dan tabel.",
    points: [
      "Angka pencairan dan cicilan hari ini, bulan ini, dan tahun ini (F9).",
      "Dua grafik, masing-masing dengan tabel data (F9).",
      "Daftar pinjaman yang dapat disaring menurut status: Berjalan, Lunas, Batal (F7, F8).",
    ],
    desktop: "../mockups/screenshots/admin-dashboard-1440.png",
    mobile: "../mockups/screenshots/admin-dashboard-360.png",
    alt: "Contoh dashboard admin e-BLUD dengan menu samping, kartu angka pencairan dan cicilan, dua grafik, dan tabel pinjaman",
  },
  {
    title: "Contoh tampilan 3: form permohonan",
    fitur: "F3, dengan aturan dari F5 dan F6",
    lead: "Petugas mencatat permohonan pembiayaan dan mencentang dokumen persyaratan yang sudah diterima.",
    points: [
      "Isian permohonan dan daftar persyaratan dokumen (F3).",
      "Contoh aturan: tanggal pencairan paling lambat tanggal 28. Jika lebih, muncul pesan kesalahan yang jelas (F5, F6).",
      "Aturan yang sebenarnya menunggu konfirmasi BLUD.",
    ],
    desktop: "../mockups/screenshots/admin-permohonan-1440.png",
    mobile: "../mockups/screenshots/admin-permohonan-360.png",
    alt: "Contoh form permohonan pembiayaan di situs admin e-BLUD dengan isian data permohonan dan daftar persyaratan",
  },
];

const screenPages = screens
  .map(
    (s) => `
<section class="page screen" aria-labelledby="${s.title.replace(/\W+/g, "-").toLowerCase()}">
  <h2 id="${s.title.replace(/\W+/g, "-").toLowerCase()}">${s.title}</h2>
  <p class="fitur">Fitur: ${s.fitur}</p>
  <p>${s.lead}</p>
  <ul>${s.points.map((p) => `<li>${p}</li>`).join("")}</ul>
  <div class="shots">
    <figure class="desk"><img src="${s.desktop}" alt="${s.alt}"><figcaption>Tampilan komputer (contoh)</figcaption></figure>
    <figure class="mob"><img src="${s.mobile}" alt="Tampilan ponsel dari halaman yang sama, bagian atas"><figcaption>Tampilan ponsel, bagian atas</figcaption></figure>
  </div>
</section>`
  )
  .join("\n");

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>e-BLUD: pratinjau rancangan dan contoh tampilan (draft v0)</title>
<style>
  @font-face { font-family: "Inter"; src: url("assets/Inter-Regular.ttf") format("truetype"); font-weight: 400; font-style: normal; }
  @font-face { font-family: "Inter"; src: url("assets/Inter-SemiBold.ttf") format("truetype"); font-weight: 600; font-style: normal; }
  @font-face { font-family: "Inter"; src: url("assets/Inter-Bold.ttf") format("truetype"); font-weight: 700; font-style: normal; }

  :root { --sky-50: #f0f9ff; --sky-100: #e0f2fe; --sky-700: #0369a1; --sky-900: #0c4a6e; --navy: #0b2540; --ink: #0f2233; --ink-2: #3b4a5a; --line: #c9d6e2; --warn: #92400e; --warn-bg: #fef3c7; }
  @page { size: A4; margin: 18mm 16mm 20mm; @bottom-center { content: "e-BLUD · pratinjau draft v0 · halaman " counter(page); font: 400 8pt Inter, sans-serif; color: #3b4a5a; } }
  @page :first { margin: 0; @bottom-center { content: none; } }

  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font: 400 10pt/1.55 "Inter", sans-serif; color: var(--ink); }
  h1, h2, h3, h4 { color: var(--sky-900); line-height: 1.2; margin: 0; break-after: avoid; }
  p { margin: 0 0 0.6em; }
  ul, ol { margin: 0 0 0.8em; padding-left: 1.3em; }
  li { margin-bottom: 0.2em; }
  strong { font-weight: 700; }
  /* No italic face: Inter Italic embeds as Type 3, so emphasis uses SemiBold instead. */
  em { font-style: normal; font-weight: 600; }

  .page { break-before: page; }

  /* Cover */
  .cover { break-before: auto; height: 297mm; padding: 30mm 22mm 24mm; background: linear-gradient(180deg, var(--sky-50), #fff 70%); display: flex; flex-direction: column; justify-content: space-between; }
  .mark { display: inline-grid; place-items: center; width: 18mm; height: 18mm; border-radius: 4mm; background: var(--sky-700); color: #fff; font-weight: 700; font-size: 16pt; }
  .cover h1 { font-size: 34pt; letter-spacing: -0.02em; margin-top: 12mm; }
  .cover .sub { font-size: 14pt; color: var(--ink-2); margin-top: 3mm; max-width: 120mm; }
  .cover .tag { display: inline-block; margin-top: 8mm; padding: 1.5mm 4mm; border: 1.5px solid var(--warn); border-radius: 99px; background: var(--warn-bg); color: var(--warn); font-weight: 600; font-size: 10pt; }
  .cover .note { max-width: 140mm; color: var(--ink-2); font-size: 10pt; border-top: 1px solid var(--line); padding-top: 5mm; }

  /* Intro */
  h2 { font-size: 18pt; margin-bottom: 4mm; }
  h3 { font-size: 12.5pt; margin: 6mm 0 2mm; padding-bottom: 1mm; border-bottom: 2px solid var(--sky-900); }
  h4 { font-size: 10.5pt; margin: 4mm 0 1mm; }
  .box { border: 1px solid var(--line); border-left: 4px solid var(--sky-700); border-radius: 2mm; padding: 3mm 4mm; margin: 0 0 5mm; background: var(--sky-50); }
  .box h3 { border: 0; margin: 0 0 1.5mm; padding: 0; font-size: 11.5pt; }
  .box ul { margin-bottom: 0; }

  /* Screens */
  .fitur { color: var(--sky-700); font-weight: 600; margin-bottom: 3mm; }
  .shots { display: grid; grid-template-columns: 1fr 38mm; gap: 6mm; align-items: start; margin-top: 4mm; }
  .shots figure { margin: 0; }
  .shots img { display: block; width: 100%; border: 1px solid var(--line); border-radius: 1.5mm; }
  .shots .desk img { max-height: 185mm; object-fit: contain; object-position: top; }
  .shots .mob img { height: 150mm; object-fit: cover; object-position: top; }
  figcaption { margin-top: 1.5mm; font-size: 8pt; color: var(--ink-2); }
  .screen .shots { break-inside: avoid; }

  /* PRD content */
  .banner { padding: 2.5mm 4mm; background: var(--warn-bg); color: var(--warn); border-radius: 2mm; font-weight: 600; }
  table { border-collapse: collapse; width: 100%; margin: 0 0 4mm; font-size: 9pt; break-inside: avoid; }
  th, td { border: 1px solid var(--line); padding: 1.6mm 2.4mm; text-align: left; vertical-align: top; }
  th { background: var(--navy); color: #fff; font-weight: 600; }
  tr { break-inside: avoid; }
  td:empty { height: 14mm; }
  tbody tr:nth-child(even) td { background: #f4f8fb; }
</style>
</head>
<body>
<main>
  <section class="cover" aria-labelledby="judul">
    <div>
      <span class="mark" aria-hidden="true">eB</span>
      <h1 id="judul">e-BLUD</h1>
      <p class="sub">Sistem digital untuk BLUD Diskum Batam: rancangan kebutuhan dan contoh tampilan</p>
      <span class="tag">Pratinjau untuk diskusi, draft v0</span>
    </div>
    <p class="note">Disiapkan 19 November 2026. Dokumen ini bukan penawaran dan bukan desain akhir. Penawaran harga akan disampaikan secara terpisah.</p>
  </section>

  <section class="page" aria-labelledby="tentang">
    <h2 id="tentang">Tentang dokumen ini</h2>
    <div class="box">
      <h3>Yang ada di dalamnya</h3>
      <ul>
        <li>Tiga contoh tampilan: satu untuk masyarakat dan mitra, dua untuk petugas BLUD.</li>
        <li>Rancangan kebutuhan (PRD draft v0): masalah, pengguna, 14 fitur (F1 sampai F14), batasan, dan pertanyaan terbuka.</li>
      </ul>
    </div>
    <div class="box">
      <h3>Yang perlu diperhatikan</h3>
      <ul>
        <li>Alur kerja di sini mengikuti contoh sistem dari Dinas lain. Semuanya masih asumsi dan perlu dikoreksi sesuai cara kerja BLUD Diskum Batam.</li>
        <li>Semua angka, nama, dan tampilan adalah contoh. Nama resmi dan logo BLUD akan menyusul.</li>
        <li>Dua tampilan: situs publik yang modern dan ringan, serta situs petugas yang modern tetapi tetap bergaya aplikasi pemerintahan.</li>
      </ul>
    </div>
    <div class="box">
      <h3>Yang paling ingin kami ketahui dari Bapak dan Ibu</h3>
      <ul>
        <li>Bagaimana pembiayaan berjalan sekarang di Excel, dari mitra mengajukan sampai lunas, dan siapa mengerjakan tiap langkah.</li>
        <li>Aturan pembiayaan yang berlaku: batas jumlah, jasa, jangka waktu, agunan, dan denda.</li>
        <li>Peran petugas yang ada, dan laporan yang benar-benar dipakai.</li>
      </ul>
      <p>Daftar lengkapnya ada di bagian "Pertanyaan terbuka" pada rancangan kebutuhan.</p>
    </div>
  </section>
${screenPages}

  <section class="page" aria-labelledby="prd">
    <h2 id="prd">Rancangan kebutuhan (PRD draft v0)</h2>
${mdToHtml(prd)}
  </section>
</main>
</body>
</html>
`;

fs.writeFileSync(path.join(here, "preview.html"), html);
console.log("wrote preview.html (" + Math.round(html.length / 1024) + " KB)");
