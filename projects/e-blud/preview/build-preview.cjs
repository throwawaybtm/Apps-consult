// Generates preview.html from ../prd.md plus the mockup screenshots.
// Usage (from the repo root):
//   node projects/e-blud/preview/capture-shots.cjs        (only when the mockups changed)
//   node projects/e-blud/preview/build-preview.cjs
//   npm run build:pdf -- projects/e-blud/preview/preview.html
// The PRD stays the single source: edit prd.md, then re-run the last two commands.
const fs = require("node:fs");
const path = require("node:path");

const here = __dirname;
const prd = fs.readFileSync(path.join(here, "..", "prd.md"), "utf8");
const markers = JSON.parse(fs.readFileSync(path.join(here, "assets", "shots", "markers.json"), "utf8"));

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inline = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

// Small Markdown subset: headings, blockquote, tables, lists, paragraphs.
// PRD "##" becomes <h3> because the page has its own h1 and h2.
// A paragraph that starts with "**F<n> Title.**" becomes a feature block with its criteria listed.
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
    const feat = /^\*\*(F\d+) (.+?)\.?\*\*\s*(.*)$/.exec(buf[0]);
    if (feat) {
      const [, num, title, rest] = feat;
      const crit = buf.slice(1);
      out.push(
        `<div class="feat"><div class="fnum">${num}</div><div class="fbody"><h4>${inline(title)}</h4>` +
          (rest ? `<p>${inline(rest)}</p>` : "") +
          (crit.length ? `<ul class="crit">${crit.map((c) => `<li>${inline(c)}</li>`).join("")}</ul>` : "") +
          "</div></div>"
      );
    } else {
      out.push(`<p>${buf.map(inline).join("<br>")}</p>`);
    }
  }
  return out.join("\n");
}

// ---------- content ----------

const journey = [
  ["Mitra mengisi formulir online", "Pemohon", "F3, F13", "Data diri, data usaha, dan dokumen diunggah. Tanpa membuat akun."],
  ["Mendapat kode permohonan", "Sistem", "F3, F14", "Status awal: Menunggu verifikasi. Kode dipakai untuk melacak tahap."],
  ["Petugas memverifikasi", "Petugas pelayanan", "F2, F3", "Cek identitas dan dokumen. Lanjut ke survei, minta perbaikan, atau tolak dengan catatan."],
  ["Survei lapangan", "Fasilitator", "F4", "Kunjungan ke usaha pemohon. Hasil survei tercatat pada permohonan."],
  ["Penetapan dan pencairan", "Pimpinan", "F5, F6", "Aturan pembiayaan dicek otomatis, lalu akad dan pencairan dicatat."],
  ["Cicilan dan pembayaran", "Bendahara atau kasir", "F7, F11", "Jadwal cicilan dibuat otomatis. Pembayaran dicatat dan kwitansi dicetak."],
  ["Lunas", "Sistem", "F8, F9, F12", "Pelunasan tercatat. Pimpinan memantau lewat dashboard, dan setiap perubahan ada di log aktivitas."],
];

const screens = [
  { key: "public-home", title: "Beranda situs publik", fitur: "F13, F14", lead: "Halaman depan untuk masyarakat dan mitra: modern, berwarna biru muda, dan nyaman dibuka dari ponsel.", alt: "Contoh halaman depan situs publik e-BLUD" },
  { key: "public-daftar", title: "Formulir pengajuan online", fitur: "F3, F13", lead: "Mitra mengajukan pembiayaan sendiri tanpa akun: mengisi data, mengunggah dokumen, dan menyetujui pemrosesan data pribadi.", alt: "Contoh formulir pengajuan pembiayaan online di situs publik e-BLUD" },
  { key: "admin-dashboard", title: "Dashboard petugas", fitur: "F9, F7, F8", lead: "Halaman awal petugas setelah login (F1). Modern, tetapi tetap bergaya aplikasi pemerintahan: menu di samping, kartu angka, dan tabel.", alt: "Contoh dashboard petugas e-BLUD" },
  { key: "admin-verifikasi", title: "Verifikasi permohonan masuk", fitur: "F2, F3, F4", lead: "Permohonan online masuk ke petugas. Petugas memeriksa data dan dokumen sebelum permohonan diteruskan ke survei.", alt: "Contoh layar verifikasi permohonan masuk di situs petugas e-BLUD" },
  { key: "admin-permohonan", title: "Input permohonan langsung", fitur: "F3, F5, F6", lead: "Untuk pemohon yang datang langsung ke kantor, petugas menginput permohonan. Aturan pembiayaan dicek saat disimpan.", alt: "Contoh form input permohonan pembiayaan untuk pemohon yang datang langsung" },
];

const features = [
  ["F1", "Login dan peran", "Petugas masuk dengan akun; hak akses sesuai peran. Mitra tidak perlu akun.", "Admin"],
  ["F2", "Data mitra", "Data identitas dan foto mitra, hanya terlihat oleh yang berhak.", "Admin"],
  ["F3", "Permohonan pembiayaan", "Diajukan online oleh mitra atau diinput petugas, lalu diverifikasi sebelum survei.", "Admin dan publik"],
  ["F4", "Survei dan analisa", "Hasil survei fasilitator tercatat pada permohonan yang sama.", "Admin"],
  ["F5", "Penetapan dan validasi SOP", "Pimpinan menetapkan; aturan pembiayaan dicek otomatis.", "Admin"],
  ["F6", "Akad dan pencairan", "Nomor akad, tanggal realisasi, dan pencairan dana.", "Admin"],
  ["F7", "Jadwal cicilan dan pembayaran", "Jadwal otomatis; pokok, jasa, dan denda dicatat.", "Admin"],
  ["F8", "Pelunasan dan penyesuaian", "Pelunasan dipercepat dengan penyesuaian sisa jasa.", "Admin"],
  ["F9", "Dashboard", "Angka pencairan dan cicilan, dua grafik, filter tanggal.", "Admin"],
  ["F10", "Laporan inti", "Laporan per periode, dapat dicetak PDF dan Excel.", "Admin"],
  ["F11", "Cetak dokumen", "Formulir, tanda terima, rincian biaya, dan kwitansi ber-QR.", "Admin"],
  ["F12", "Log aktivitas", "Siapa mengubah apa dan kapan, tidak dapat diubah.", "Admin"],
  ["F13", "Situs publik", "Informasi, statistik gabungan, dan formulir pengajuan.", "Publik"],
  ["F14", "Lacak permohonan", "Pemohon melacak tahap permohonan dengan kode.", "Publik"],
];

const shot = (name, kind) => `assets/shots/${name}-${kind}.png`;

const markerHtml = (name) =>
  (markers[name] || [])
    .map((m) => `<span class="pin" style="--x:${m.x.toFixed(4)};--y:${m.y.toFixed(4)}" aria-hidden="true">${m.n}</span>`)
    .join("");

const legendHtml = (name) =>
  `<ol class="legend">${(markers[name] || []).map((m) => `<li><span class="lnum" aria-hidden="true">${m.n}</span><span>${esc(m.text)}</span></li>`).join("")}</ol>`;

const screenPages = screens
  .map(
    (s, i) => `
<section class="page screen" aria-labelledby="s-${s.key}">
  <header class="sh">
    <p class="count">Contoh layar ${i + 1} dari ${screens.length}</p>
    <h2 id="s-${s.key}">${s.title}</h2>
    <p class="fchips">Fitur ${s.fitur}</p>
  </header>
  <p class="lead">${s.lead}</p>
  <div class="stage ${s.key.startsWith("admin") ? "wide" : ""}">
    <figure class="browser">
      <div class="bar" aria-hidden="true"><i></i><i></i><i></i><span>Contoh tampilan komputer</span></div>
      <div class="shotbox ${["admin-dashboard", "admin-verifikasi", "admin-permohonan"].includes(s.key) ? "natural" : "crop"}">
        <img src="${shot(s.key, "desktop")}" alt="${s.alt}">
        ${markerHtml(s.key)}
      </div>
    </figure>
    ${s.key.startsWith("admin") ? "" : `<figure class="phone">
      <div class="screen-m"><img src="${shot(s.key, "mobile")}" alt="Tampilan ponsel dari halaman yang sama, bagian atas"></div>
      <figcaption>Tampilan ponsel</figcaption>
    </figure>`}
  </div>
  ${legendHtml(s.key)}
</section>`
  )
  .join("\n");

const journeyHtml = journey
  .map(
    ([t, who, f, d], i) => `
    <li>
      <span class="jn" aria-hidden="true">${i + 1}</span>
      <div class="jb"><h3>${t}</h3><p class="jwho"><span class="role">${who}</span><span class="fchip">${f}</span></p><p>${d}</p></div>
    </li>`
  )
  .join("");

const featureHtml = features
  .map(([n, t, d, who]) => `<li class="fcard"><span class="fnum">${n}</span><div><h3>${t}</h3><p>${d}</p><p class="fwho">${who}</p></div></li>`)
  .join("");

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

  :root {
    --navy: #0b2540; --navy-2: #12365a; --brand: #0369a1; --brand-d: #0c4a6e; --sky: #7dd3fc; --halo: #bae6fd;
    --tint: #f0f9ff; --ink: #0f2233; --ink-2: #3b4a5a; --line: #d3dde6; --stripe: #f4f8fb;
    --warn: #92400e; --warn-bg: #fef3c7;
  }
  @page { size: A4; margin: 18mm 16mm 20mm;
    @top-left { content: "e-BLUD"; font: 600 8pt Inter, sans-serif; color: #0369a1; }
    @top-right { content: "Pratinjau draft v0"; font: 400 8pt Inter, sans-serif; color: #3b4a5a; }
    @bottom-right { content: counter(page); font: 600 8pt Inter, sans-serif; color: #0c4a6e; } }
  @page :first { margin: 0; @top-left { content: none; } @top-right { content: none; } @bottom-right { content: none; } }

  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font: 400 9.5pt/1.55 "Inter", sans-serif; color: var(--ink); }
  h1, h2, h3, h4 { color: var(--brand-d); line-height: 1.2; margin: 0; break-after: avoid; }
  p { margin: 0 0 0.55em; }
  ul, ol { margin: 0 0 0.8em; padding-left: 1.25em; }
  li { margin-bottom: 0.2em; }
  strong { font-weight: 700; }
  /* No italic face: Inter Italic embeds as Type 3, so emphasis uses SemiBold instead. */
  em { font-style: normal; font-weight: 600; color: var(--brand); }

  .page { break-before: page; }
  h2 { font-size: 20pt; letter-spacing: -0.01em; }
  .kicker { font-size: 8.5pt; font-weight: 600; color: var(--brand); margin-bottom: 1.5mm; }

  /* ---------- Cover ---------- */
  .cover { break-before: auto; height: 297mm; position: relative; overflow: hidden; color: #fff; padding: 24mm 20mm;
    background: radial-gradient(circle at 85% 8%, rgba(125,211,252,0.28), transparent 38%), radial-gradient(circle at 5% 95%, rgba(3,105,161,0.55), transparent 45%), var(--navy); }
  .cover::before { content: ""; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.13) 1px, transparent 1px); background-size: 6mm 6mm; mask-image: linear-gradient(180deg, #000, transparent 55%); }
  .cover > * { position: relative; }
  .mark { display: inline-grid; place-items: center; width: 16mm; height: 16mm; border-radius: 4mm; background: #fff; color: var(--brand); font-weight: 700; font-size: 15pt; }
  .cover h1 { color: #fff; font-size: 66pt; letter-spacing: -0.035em; line-height: 1; margin-top: 10mm; }
  .cover .sub { font-size: 14pt; line-height: 1.35; color: var(--halo); margin-top: 5mm; max-width: 125mm; }
  .cover .tag { display: inline-block; margin-top: 7mm; padding: 1.4mm 4mm; border-radius: 99px; background: var(--warn-bg); color: var(--warn); font-weight: 600; font-size: 9.5pt; }
  .collage { position: absolute; left: 14mm; right: 14mm; bottom: 38mm; height: 128mm; }
  .collage .f { position: absolute; border-radius: 3mm; overflow: hidden; background: #fff; box-shadow: 0 6mm 14mm rgba(0,0,0,0.38); border: 0.4mm solid rgba(255,255,255,0.5); }
  .collage .f img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .collage .a { left: 0; top: 4mm; width: 112mm; height: 80mm; transform: rotate(-3deg); }
  .collage .b { right: 0; top: 30mm; width: 104mm; height: 84mm; transform: rotate(2.5deg); }
  .collage .c { left: 78mm; bottom: -6mm; width: 30mm; height: 62mm; border-radius: 5mm; border: 1.2mm solid var(--navy-2); transform: rotate(-1deg); z-index: 2; }
  .cover .note { position: absolute; left: 20mm; right: 20mm; bottom: 16mm; font-size: 9pt; color: var(--halo); border-top: 1px solid rgba(186,230,253,0.35); padding-top: 4mm; }

  /* ---------- Summary ---------- */
  .three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; margin: 6mm 0; }
  .col { border: 1px solid var(--line); border-top: 1.2mm solid var(--brand); border-radius: 2mm; padding: 4mm; background: #fff; }
  .col h3 { font-size: 11pt; margin-bottom: 2mm; }
  .col ul { padding-left: 1.1em; margin: 0; font-size: 9.6pt; }
  .col li { margin-bottom: 1.4mm; }
  .strip { display: grid; grid-template-columns: repeat(4, 1fr); border-radius: 2mm; overflow: hidden; background: var(--navy); color: #fff; margin-bottom: 6mm; }
  .strip div { padding: 4mm; border-right: 1px solid rgba(255,255,255,0.15); }
  .strip div:last-child { border-right: 0; }
  .strip b { display: block; font-size: 18pt; letter-spacing: -0.02em; color: #fff; }
  .strip span { font-size: 8.5pt; color: var(--halo); }
  .box { border: 1px solid var(--line); border-left: 1.2mm solid var(--brand); border-radius: 2mm; padding: 4.5mm 5mm; margin: 0 0 5mm; background: var(--tint); }
  .box h3 { font-size: 10.5pt; margin-bottom: 1.5mm; }
  .box ul { margin: 0; }

  /* ---------- Journey ---------- */
  .journey { list-style: none; padding: 0; margin: 6mm 0 0; }
  .journey > li { position: relative; display: grid; grid-template-columns: 11mm 1fr; gap: 5mm; padding-bottom: 9mm; margin: 0; break-inside: avoid; }
  .journey > li::before { content: ""; position: absolute; left: 5.1mm; top: 9mm; bottom: -1mm; width: 0.5mm; background: var(--halo); }
  .journey > li:last-child::before { display: none; }
  .jn { display: grid; place-items: center; width: 11mm; height: 11mm; border-radius: 50%; background: var(--brand); color: #fff; font-weight: 700; font-size: 11pt; }
  .jb h3 { font-size: 13pt; margin-bottom: 1.2mm; }
  .jb p { margin: 0 0 1.2mm; color: var(--ink-2); font-size: 10pt; }
  .jwho { display: flex; gap: 2mm; align-items: center; }
  .role { font-weight: 600; color: var(--ink); }
  .fchip, .fchips { display: inline-block; padding: 0.4mm 2.2mm; border-radius: 99px; background: var(--halo); color: var(--brand-d); font-size: 8pt; font-weight: 600; }

  /* ---------- Screen pages ---------- */
  .sh { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2mm 4mm; margin-bottom: 3mm; }
  .sh .count { flex-basis: 100%; margin: 0; font-size: 8.5pt; font-weight: 600; color: var(--brand); }
  .lead { color: var(--ink-2); max-width: 150mm; margin-bottom: 4mm; font-size: 10pt; }
  .stage { display: grid; grid-template-columns: 1fr 38mm; gap: 6mm; align-items: start; }
  .stage.wide { grid-template-columns: 1fr; }
  .stage.wide .browser { width: 150mm; margin-inline: auto; }
  figure { margin: 0; }
  .browser { border: 0.3mm solid var(--line); border-radius: 2.5mm; overflow: hidden; background: #fff; box-shadow: 0 2mm 6mm rgba(11,37,64,0.14); }
  .bar { display: flex; align-items: center; gap: 1.4mm; padding: 2mm 3mm; background: var(--navy); }
  .bar i { width: 2mm; height: 2mm; border-radius: 50%; background: rgba(255,255,255,0.35); }
  .bar span { margin-left: 3mm; font-size: 7.5pt; color: var(--halo); }
  .shotbox { position: relative; container-type: inline-size; overflow: hidden; }
  .shotbox img { display: block; width: 100%; }
  .shotbox.crop { height: 150mm; }
  .shotbox.crop img { height: 100%; object-fit: cover; object-position: top; }
  .pin { position: absolute; left: calc(var(--x) * 100%); top: calc(var(--y) * 100cqw); transform: translate(-50%, -50%); display: grid; place-items: center; width: 5.2mm; height: 5.2mm; border-radius: 50%; background: #c2410c; color: #fff; font-size: 8pt; font-weight: 700; box-shadow: 0 0 0 0.7mm #fff; }
  .phone { border: 1.6mm solid var(--navy); border-radius: 6mm; background: var(--navy); overflow: hidden; box-shadow: 0 2mm 6mm rgba(11,37,64,0.2); }
  .screen-m { height: 130mm; overflow: hidden; border-radius: 4mm; background: #fff; }
  .screen-m img { display: block; width: 100%; }
  .phone figcaption { text-align: center; font-size: 7.5pt; color: var(--halo); padding: 1.2mm 0 0.6mm; }
  .legend { list-style: none; padding: 0; margin: 5mm 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 2.5mm 6mm; }
  .legend li { display: flex; gap: 2.5mm; align-items: flex-start; margin: 0; font-size: 9pt; color: var(--ink); break-inside: avoid; }
  .lnum { flex: none; display: grid; place-items: center; width: 5mm; height: 5mm; border-radius: 50%; background: #c2410c; color: #fff; font-size: 8pt; font-weight: 700; }

  /* ---------- Features ---------- */
  .fgrid { list-style: none; padding: 0; margin: 5mm 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 4mm; }
  .fcard { display: flex; gap: 3mm; margin: 0; padding: 3mm; border: 1px solid var(--line); border-radius: 2mm; background: #fff; break-inside: avoid; }
  .fnum { flex: none; display: grid; place-items: center; min-width: 10mm; height: 7mm; padding: 0 1.5mm; border-radius: 1.5mm; background: var(--brand); color: #fff; font-weight: 700; font-size: 9pt; }
  .fcard h3 { font-size: 10pt; margin-bottom: 0.8mm; }
  .fcard p { margin: 0; font-size: 8.8pt; color: var(--ink-2); }
  .fcard .fwho { margin-top: 1mm; font-size: 8pt; font-weight: 600; color: var(--brand); }

  /* ---------- Next steps ---------- */
  .steps { list-style: none; padding: 0; margin: 5mm 0 6mm; display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; counter-reset: s; }
  .steps li { counter-increment: s; margin: 0; padding: 4mm; border-radius: 2mm; background: var(--tint); border: 1px solid var(--halo); }
  .steps li::before { content: counter(s); display: grid; place-items: center; width: 7mm; height: 7mm; border-radius: 50%; background: var(--brand); color: #fff; font-weight: 700; margin-bottom: 2mm; }
  .steps h3 { font-size: 10pt; margin-bottom: 1mm; }
  .steps p { margin: 0; font-size: 8.8pt; color: var(--ink-2); }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }

  /* ---------- PRD appendix ---------- */
  .prd h3 { font-size: 13pt; margin: 7mm 0 2.5mm; padding-bottom: 1.2mm; border-bottom: 0.6mm solid var(--brand-d); }
  .prd h4 { font-size: 10.5pt; margin-bottom: 1mm; }
  .prd h3 + p { break-after: avoid; }
  .banner { padding: 2.5mm 4mm; background: var(--warn-bg); color: var(--warn); border-radius: 2mm; font-weight: 600; }
  table { border-collapse: collapse; width: 100%; margin: 0 0 4mm; font-size: 9pt; break-inside: avoid; }
  th, td { border: 1px solid var(--line); padding: 1.6mm 2.4mm; text-align: left; vertical-align: top; }
  th { background: var(--navy); color: #fff; font-weight: 600; }
  tr { break-inside: avoid; }
  tbody tr:nth-child(even) td { background: var(--stripe); }
  td:empty { height: 14mm; }
  .feat { display: grid; grid-template-columns: 12mm 1fr; gap: 3.5mm; margin: 0 0 3.5mm; padding: 3.5mm; border: 1px solid var(--line); border-left: 1.2mm solid var(--brand); border-radius: 2mm; break-inside: avoid; }
  .feat .fnum { align-self: start; }
  .feat p { margin: 0 0 1.5mm; font-size: 9.2pt; }
  .crit { margin: 1.5mm 0 0; padding: 2.5mm 3mm 2.5mm 5mm; list-style: disc; background: var(--stripe); border-radius: 1.5mm; font-size: 8.6pt; color: var(--ink-2); }
  .crit li { margin-bottom: 1mm; }
</style>
</head>
<body>
<main>
  <section class="cover" aria-labelledby="judul">
    <span class="mark" aria-hidden="true">eB</span>
    <h1 id="judul">e-BLUD</h1>
    <p class="sub">Sistem digital untuk BLUD Diskum Batam: rancangan kebutuhan dan contoh tampilan</p>
    <span class="tag">Pratinjau untuk diskusi, draft v0</span>
    <div class="collage" aria-hidden="true">
      <div class="f a"><img src="${shot("public-home", "desktop")}" alt=""></div>
      <div class="f b"><img src="${shot("admin-dashboard", "desktop")}" alt=""></div>
      <div class="f c"><img src="${shot("public-daftar", "mobile")}" alt=""></div>
    </div>
    <p class="note">Disiapkan 20 November 2026. Dokumen ini bukan penawaran dan bukan desain akhir. Penawaran harga akan disampaikan secara terpisah.</p>
  </section>

  <section class="page" aria-labelledby="ringkas">
    <p class="kicker">Gambaran singkat</p>
    <h2 id="ringkas">Dari Excel ke satu sistem</h2>
    <div class="three">
      <div class="col"><h3>Masalah sekarang</h3><ul>
        <li>Pencatatan masih manual di lembar Excel.</li><li>Data mudah ganda atau berbeda versi.</li><li>Mencari status pencairan dan cicilan memakan waktu.</li><li>Laporan lambat dibuat, dan sulit diketahui siapa mengubah apa.</li></ul></div>
      <div class="col"><h3>Yang kami usulkan</h3><ul>
        <li>Satu sistem dari permohonan sampai lunas.</li><li>Situs publik yang modern, tempat mitra mengajukan sendiri.</li><li>Situs petugas untuk memverifikasi, mencairkan, dan mencatat cicilan.</li><li>Aturan pembiayaan dicek otomatis.</li></ul></div>
      <div class="col"><h3>Yang diharapkan</h3><ul>
        <li>Rekap pencairan dan cicilan dalam hitungan menit.</li><li>Data diketik sekali, tidak dua kali.</li><li>Setiap perubahan dapat ditelusuri ke satu pengguna.</li><li>Dashboard untuk pimpinan.</li></ul></div>
    </div>
    <div class="strip">
      <div><b>14</b><span>fitur (F1 sampai F14)</span></div>
      <div><b>2</b><span>tampilan: publik dan petugas</span></div>
      <div><b>5</b><span>contoh layar di dokumen ini</span></div>
      <div><b>1</b><span>sistem, dari permohonan sampai lunas</span></div>
    </div>
    <div class="box">
      <h3>Yang perlu diperhatikan</h3>
      <ul>
        <li>Alur kerja di sini mengikuti contoh sistem dari Dinas lain. Semuanya masih asumsi dan perlu dikoreksi sesuai cara kerja BLUD Diskum Batam.</li>
        <li>Semua angka, nama, dan tampilan adalah contoh. Nama resmi dan logo BLUD akan menyusul.</li>
        <li>Mitra mengajukan sendiri lewat formulir online tanpa akun. Ini juga masih perlu dikonfirmasi.</li>
      </ul>
    </div>
    <div class="box">
      <h3>Yang paling ingin kami ketahui dari Bapak dan Ibu</h3>
      <ul>
        <li>Bagaimana pembiayaan berjalan sekarang di Excel, dari mitra mengajukan sampai lunas, dan siapa mengerjakan tiap langkah.</li>
        <li>Aturan pembiayaan yang berlaku: batas jumlah, jasa, jangka waktu, agunan, dan denda.</li>
        <li>Peran petugas yang ada, dan laporan yang benar-benar dipakai.</li>
      </ul>
    </div>
  </section>

  <section class="page" aria-labelledby="alur">
    <p class="kicker">Alur contoh</p>
    <h2 id="alur">Perjalanan satu permohonan</h2>
    <p class="lead">Dari formulir online sampai lunas. Peran dan langkah di bawah ini asumsi sampai dikonfirmasi BLUD. Pemohon yang datang langsung diinput petugas (F3).</p>
    <ol class="journey">${journeyHtml}
    </ol>
  </section>
${screenPages}

  <section class="page" aria-labelledby="fitur">
    <p class="kicker">Cakupan</p>
    <h2 id="fitur">14 fitur dalam satu pandangan</h2>
    <p class="lead">Nomor fitur sama di semua dokumen. Rincian dan kriteria penerimaan ada di lampiran.</p>
    <ul class="fgrid">${featureHtml}</ul>
  </section>

  <section class="page" aria-labelledby="langkah">
    <p class="kicker">Selanjutnya</p>
    <h2 id="langkah">Langkah berikut</h2>
    <ol class="steps">
      <li><h3>Bapak dan Ibu meninjau</h3><p>Contoh tampilan dan daftar fitur. Tandai yang perlu diubah.</p></li>
      <li><h3>Kami memperbarui PRD</h3><p>Sesuai masukan dan jawaban atas pertanyaan terbuka.</p></li>
      <li><h3>PRD disetujui</h3><p>Persetujuan klien diperlukan sebelum tahap berikutnya.</p></li>
      <li><h3>Panduan lengkap dan penawaran</h3><p>Panduan final disiapkan. Penawaran harga disampaikan terpisah.</p></li>
    </ol>
    <div class="two">
      <div class="box">
        <h3>Yang kami butuhkan dari BLUD</h3>
        <ul>
          <li>Penjelasan alur kerja dan aturan pembiayaan yang berlaku.</li>
          <li>Contoh formulir dan lembar Excel yang dipakai sekarang.</li>
          <li>Nama resmi dan logo BLUD.</li>
          <li>Akun Google milik BLUD untuk penyimpanan dokumen.</li>
          <li>Daftar laporan yang benar-benar dipakai.</li>
        </ul>
      </div>
      <div class="box">
        <h3>Pertanyaan terbuka</h3>
        <ul>
          <li>Apakah mitra mengajukan sendiri tanpa akun?</li>
          <li>Bagaimana petugas memverifikasi identitas pemohon online?</li>
          <li>Dokumen mana yang wajib diunggah, dan batas ukuran berkas?</li>
          <li>Teks persetujuan data pribadi dan lama data disimpan.</li>
          <li>Daftar lengkap ada di bagian 9 lampiran.</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="page prd" aria-labelledby="prd">
    <p class="kicker">Lampiran</p>
    <h2 id="prd">Rancangan kebutuhan (PRD draft v0)</h2>
${mdToHtml(prd)}
  </section>
</main>
</body>
</html>
`;

fs.writeFileSync(path.join(here, "preview.html"), html);
console.log("wrote preview.html (" + Math.round(html.length / 1024) + " KB)");
