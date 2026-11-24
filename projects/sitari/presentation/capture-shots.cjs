#!/usr/bin/env node
// Captures the real SITARI UI from the local preview (seed-preview.cjs, fictional data) for the
// deck and the video. Never points at a live deployment.
//
// Usage (repo root, with seed-preview.cjs running on PORT 4174):
//   node projects/sitari/presentation/capture-shots.cjs
// Writes presentation/assets/*.png (1440 x 900 at 2x, phones at their device scale) and
// presentation/rects.json (highlight boxes in CSS px of each shot, for the video).
//
// Privacy guard: before each shot, the page text and form values are checked against every
// real name found in the SITARI repo's tracked directories and config templates. A match
// aborts the run without printing the name. Tracked files that hard-code officials
// (RAPAT_PIMPINAN_DIRECTORY) are swapped for fictional names in the browser response only.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { chromium, devices } = require('playwright');

const SITARI_DIR = process.env.SITARI_DIR || '/home/user/throwawaybtm/sitari-diskum-v3';
const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4174';
if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(BASE)) throw new Error('Captures only from the local preview.');
const OUT = path.join(__dirname, 'assets');
fs.mkdirSync(OUT, { recursive: true });
const NOW = new Date('2026-11-24T10:15:00+07:00');

// ---- privacy deny-list (values never printed) ----
function realNames() {
  const names = new Set();
  const grab = (file, re) => {
    const p = path.join(SITARI_DIR, file);
    if (!fs.existsSync(p)) return;
    for (const m of fs.readFileSync(p, 'utf8').matchAll(re)) names.add(m[1].split(',')[0].trim());
  };
  grab('Admin/RapatPimpinan.html', /nama:\s*'([^']+)'/g);
  grab('Admin/AgendaAttendanceData.js', /nama:\s*'([^']+)'/g);
  for (const f of ['Admin/VisitPicContacts.js.example', 'Tamu-FO/Destinations.js.example', 'Tamu-Luar/Destinations.js.example']) grab('config-templates/' + f, /pic:\s*'([^']+)'/g);
  return [...names].filter(n => n.length >= 5).map(n => n.toLowerCase());
}
const DENY = realNames();
if (DENY.length < 15) throw new Error('Privacy deny-list looks incomplete (' + DENY.length + ').');

const FICTIONAL_PIMPINAN = `const RAPAT_PIMPINAN_DIRECTORY = Object.freeze([
  { no: 1, nama: 'Drs. Hendra Wijaya, M.Si.', nip: '19800101 200501 1 001', pangkat_golongan: 'Pembina Utama Muda - IV/c', bidang: 'Dinas' },
  { no: 2, nama: 'Ratna Dewi, S.H., M.H.', nip: '19800102 200501 2 002', pangkat_golongan: 'Pembina Tingkat I - IV/b', bidang: 'Sekretariat' },
  { no: 3, nama: 'Indah Permatasari, S.Sos.', nip: '19800103 200501 2 003', pangkat_golongan: 'Pembina - IV/a', bidang: 'Bidang Kewirausahaan' },
  { no: 4, nama: 'Agus Setiawan, S.E., M.M.', nip: '19800104 200501 1 004', pangkat_golongan: 'Pembina - IV/a', bidang: 'Bidang Pemberdayaan dan Perlindungan Koperasi' },
  { no: 5, nama: 'Siti Rahmawati, S.E.', nip: '19800105 200501 2 005', pangkat_golongan: 'Pembina - IV/a', bidang: 'Bidang Pengawasan Koperasi' },
  { no: 6, nama: 'Budi Santoso, S.T., M.M.', nip: '19800106 200501 1 006', pangkat_golongan: 'Pembina - IV/a', bidang: 'Bidang Pengembangan Usaha Mikro' }
]);`;

async function guard(page, name) {
  const text = (await page.evaluate(() => {
    const vals = [...document.querySelectorAll('input,textarea,select')].map(e => e.tagName === 'SELECT' ? [...e.options].map(o => o.text).join(' ') : e.value);
    return document.body.innerText + ' ' + vals.join(' ');
  })).toLowerCase();
  const hit = DENY.findIndex(n => text.includes(n));
  if (hit >= 0) throw new Error(`PRIVACY: real name (deny-list entry #${hit}) visible in shot "${name}". Aborting.`);
  if (/script\.google\.com\/macros/.test(text)) throw new Error(`PRIVACY: deployment URL visible in shot "${name}".`);
}

// Preview-only lines that are not part of the product.
const HIDE_PREVIEW_NOTES = () => {
  for (const el of document.querySelectorAll('p,div,span,small')) {
    if (el.children.length === 0 && /^(Mode pengujian lokal|Pengujian lokal|Simulasi lokal|Jadwal disimpan sebagai simulasi|Data tamu disimpan sementara)/.test(el.textContent.trim())) {
      const toast = el.closest('[role=status],[role=alert],[id*=toast],[class*=toast]');
      if (toast) { toast.style.display = 'none'; continue; }
      const box = el.closest('.visit-panel > p, .visit-note, p, div'); (box || el).style.display = 'none';
    }
  }
};

const rects = {};
async function rectOf(page, shot, key, selectorOrFn) {
  const r = await page.evaluate(sel => {
    const el = typeof sel === 'string' ? document.querySelector(sel) : null;
    if (!el) return null; const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
  }, selectorOrFn);
  if (r) (rects[shot] ||= {})[key] = r; else console.warn(`  (no rect ${shot}.${key})`);
}
async function rectByText(page, shot, key, tag, text, up = 0) {
  const r = await page.evaluate(([tag, text, up]) => {
    let el = [...document.querySelectorAll(tag)].find(e => e.offsetParent && e.textContent.trim().startsWith(text));
    for (let i = 0; el && i < up; i++) el = el.parentElement;
    if (!el) return null; const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
  }, [tag, text, up]);
  if (r) (rects[shot] ||= {})[key] = r; else console.warn(`  (no rect ${shot}.${key})`);
}

async function newPage(browser, opts = {}) {
  const ctx = await browser.newContext({ locale: 'id-ID', timezoneId: 'Asia/Jakarta', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, ...opts });
  await ctx.route(/127\.0\.0\.1:\d+\/(\?.*)?$/, async route => {
    const res = await route.fetch(); let body = await res.text();
    const re = /const RAPAT_PIMPINAN_DIRECTORY = Object\.freeze\(\[[\s\S]*?\]\.map\(item => Object\.freeze\(item\)\)\);/;
    if (body.includes('const RAPAT_PIMPINAN_DIRECTORY')) {
      if (!re.test(body)) throw new Error('Could not swap RAPAT_PIMPINAN_DIRECTORY; refusing to load the page.');
      body = body.replace(re, () => FICTIONAL_PIMPINAN);
    }
    await route.fulfill({ response: res, body });
  });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(NOW);
  page.on('pageerror', e => console.warn('  pageerror:', e.message));
  return page;
}
async function shoot(page, name, opts = {}) {
  await page.evaluate(HIDE_PREVIEW_NOTES);
  await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
  await page.waitForTimeout(250);
  await guard(page, name);
  await page.screenshot({ path: path.join(OUT, name + '.png'), ...opts });
  console.log('shot', name);
}
async function admin(page, tab = 'dashboard') {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
  if (tab !== 'dashboard') { await page.evaluate(t => switchTab(t), tab); await page.waitForTimeout(1000); }
}
async function visit(page, code, tab) {
  await admin(page, 'tamu');
  await page.evaluate(c => openVisitWorkflow(c), code); await page.waitForTimeout(1500);
  if (tab != null) { await page.evaluate(t => selectVisitTab(t), tab); await page.waitForTimeout(1200); }
}
const calendar = page => page.evaluate(() => fetch('/api/getRapatCalendar', { method: 'POST' }).then(r => r.json()).then(j => j.data));
const pdfData = (title) => {
  const { jsPDF } = require(path.join(SITARI_DIR, 'local-test/vendor/jspdf.umd.min.js'));
  const d = new jsPDF(); d.setFontSize(16); d.text(title, 20, 30); d.setFontSize(10); d.text('Dokumen contoh (fiktif).', 20, 280);
  return Buffer.from(d.output('arraybuffer'));
};

(async () => {
  const browser = await chromium.launch({ args: ['--lang=id'], env: { ...process.env, LANG: 'id_ID.UTF-8', LANGUAGE: 'id' } });
  const page = await newPage(browser);

  // 1 Dashboard
  await admin(page);
  await rectOf(page, 'dashboard', 'cards', 'main .grid');
  await rectByText(page, 'dashboard', 'recent', 'h3', 'Kunjungan Tamu Terbaru', 3);
  await rectByText(page, 'dashboard', 'today', 'h3', 'Rapat Hari Ini', 3);
  await shoot(page, 'dashboard');
  await shoot(page, 'dashboard-full', { fullPage: true });

  // 2 Buku Tamu
  await admin(page, 'tamu');
  await rectOf(page, 'buku-tamu', 'table', '#tamu-table-container, table');
  await rectByText(page, 'buku-tamu', 'buttons', 'button', 'Form Tamu Luar Daerah', 1);
  await shoot(page, 'buku-tamu');

  // 3 TLD form, filled with a fictional delegation
  await page.goto(BASE + '/tamu-luar', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  await page.fill('#instansiLuar', 'Dinas Koperasi dan UKM Kota Dumai');
  await page.fill('#alamatLuar', 'Jl. Sultan Syarif Kasim No. 21, Dumai');
  await page.fill('#agendaLuar', 'Studi tiru penerapan buku tamu dan presensi digital.');
  await page.fill('#ketuaLuar', 'Dra. Mariani Siregar, M.Si.');
  await page.fill('#jumlahLuar', '3');
  await page.fill('#anggotaLuar', 'Andre Wijaya, S.E.\nRika Amalia, S.Kom.');
  await page.fill('#inputTglLuar', '2026-12-03').catch(() => {});
  await page.fill('#jamLuar', '10:00').catch(() => {});
  await page.fill('#whatsappLuar', '081200003301');
  const tmp = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'sitari-'));
  fs.writeFileSync(path.join(tmp, 'Surat_Permohonan_Kunjungan.pdf'), pdfData('Surat Permohonan Kunjungan'));
  fs.writeFileSync(path.join(tmp, 'Surat_Tugas_Rombongan.pdf'), pdfData('Surat Tugas Rombongan'));
  await page.setInputFiles('#fileSuratKunjungan', path.join(tmp, 'Surat_Permohonan_Kunjungan.pdf')).catch(e => console.warn('  upload1', e.message));
  await page.setInputFiles('#fileSuratTugas', path.join(tmp, 'Surat_Tugas_Rombongan.pdf')).catch(e => console.warn('  upload2', e.message));
  await page.waitForTimeout(800);
  await rectOf(page, 'tld-form', 'uploads', '#fileSuratKunjungan');
  await shoot(page, 'tld-form');
  await shoot(page, 'tld-form-full', { fullPage: true });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(300);
  await shoot(page, 'tld-form-bottom');

  // 4 TDD form, filled
  await page.goto(BASE + '/tamu-fo', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  await page.fill('#foNama', 'Desi Ratnasari');
  await page.fill('#foJumlah', '2');
  await page.fill('#foAnggota', 'Desi Ratnasari\nYoga Permana');
  await page.fill('#foInstansi', 'UMKM Kue Bangkit Tiban');
  await page.fill('#foWhatsapp', '081200003302');
  await page.fill('#foAlamat', 'Tiban Indah, Sekupang');
  await page.check('input[value="Bidang Pengembangan Usaha Mikro"]').catch(e => console.warn('  tdd check', e.message));
  await page.fill('#foAgenda', 'Konsultasi sertifikasi halal dan izin edar produk.');
  await rectByText(page, 'tdd-form', 'bidang', 'label', 'Bidang Pengembangan Usaha Mikro');
  await shoot(page, 'tdd-form');
  await shoot(page, 'tdd-form-full', { fullPage: true });

  // 5 Visit workflow tabs
  await visit(page, 'TLD-01122026-001', 0);
  await rectOf(page, 'visit-konfirmasi', 'tabs', '#visitModalTabs');
  await shoot(page, 'visit-konfirmasi');
  await page.evaluate(() => { const el = [...document.querySelectorAll('#visitWorkflowModal *')].find(e => e.children.length === 0 && e.textContent.trim() === 'Surat Permohonan Kunjungan'); if (el) el.scrollIntoView({ block: 'start' }); });
  await page.waitForTimeout(400);
  await shoot(page, 'visit-konfirmasi-bottom');

  await visit(page, 'TLD-26112026-005', 1);
  await shoot(page, 'visit-disposisi');
  await visit(page, 'TLD-26112026-005', 2);
  await page.getByRole('button', { name: 'Kirim Notifikasi' }).click().catch(e => console.warn('  notify', e.message));
  await page.waitForTimeout(1500);
  const sel = await page.$('#visitWorkflowModal select'); if (sel) await sel.selectOption({ index: 1 }).catch(() => {});
  const times = await page.$$('#visitWorkflowModal input[type=time]'); if (times[1]) await times[1].fill('11:00').catch(() => {});
  await page.waitForTimeout(500);
  await shoot(page, 'visit-notifikasi');

  await visit(page, 'TLD-24112026-004', 3);
  await rectOf(page, 'visit-kedatangan', 'roster', '#visit-panel table');
  await shoot(page, 'visit-kedatangan');

  await visit(page, 'TLD-23112026-003', 4);
  const photo = path.join(__dirname, 'seed-photos', '1-kunjungan.png');
  const inp = await page.$('#visitFoto'); if (inp) await inp.setInputFiles(photo).catch(() => {}); else console.warn('  no #visitFoto');
  await page.fill('#visitNote', 'Rombongan menerima materi penilaian kesehatan koperasi; tindak lanjut pendampingan Januari 2027.').catch(() => {});
  await page.waitForTimeout(800);
  await shoot(page, 'visit-sppd');

  await visit(page, 'TLD-17112026-001', 5);
  await rectByText(page, 'visit-selesai', 'archive', 'button', 'Unduh Arsip Kunjungan');
  await shoot(page, 'visit-selesai');

  // TDD detail
  await admin(page, 'tamu');
  await page.evaluate(() => openTddEdit('TDD-24112026-008')); await page.waitForTimeout(1500);
  await shoot(page, 'tdd-detail');

  // 6 Jadwal Rapat
  await admin(page, 'calendar');
  await rectByText(page, 'jadwal-rapat', 'actions', 'button', 'Kalender Agenda', 1);
  await shoot(page, 'jadwal-rapat');
  await page.evaluate(() => openBookingCalendar()); await page.waitForTimeout(1200);
  await shoot(page, 'kalender-agenda');

  // No "rapat-baru" shot: the new-meeting form wrongly shows the lock notice (app bug, reported).

  const cal = await calendar(page);
  const find = (t, d) => cal.find(m => m.judul_rapat.startsWith(t) && m.tanggal === d);
  await admin(page, 'calendar');
  await page.evaluate(id => bukaModalPresensi(String(id)), find('Koordinasi Pendataan', '2026-11-24').id); await page.waitForTimeout(1500);
  await shoot(page, 'presensi-qr');

  await admin(page, 'calendar');
  await page.evaluate(id => openAgendaAttendance(String(id)), find('Rapat Pimpinan', '2026-11-24').id); await page.waitForTimeout(1500);
  await shoot(page, 'presensi-daftar');

  await admin(page, 'calendar');
  await page.evaluate(id => bukaModalEditRapat(String(id)), find('Evaluasi', '2026-11-18').id); await page.waitForTimeout(1800);
  await page.evaluate(() => { const s = [...document.querySelectorAll('*')].find(e => e.textContent.trim() === 'FOTO RAPAT INTERNAL'); if (s) s.scrollIntoView({ block: 'center' }); });
  await page.waitForTimeout(600);
  await shoot(page, 'rapat-lampiran');

  await admin(page, 'calendar');
  await page.evaluate(id => openNotulaComposer(String(id)), find('Rapat Pimpinan', '2026-11-24').id); await page.waitForTimeout(2000);
  await shoot(page, 'e-notula');

  // 7 Presensi (participant view)
  await page.goto(`${BASE}/?page=presensi&id=${find('Koordinasi Pendataan', '2026-11-24').id}`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
  await page.selectOption('#selectBidangDiskum', 'Bidang Pengawasan Koperasi').catch(e => console.warn('  bidang', e.message));
  await page.waitForTimeout(400);
  await page.selectOption('#selectPegawaiDiskum', { index: 1 }).catch(e => console.warn('  pegawai', e.message));
  await page.waitForTimeout(600);
  await rectOf(page, 'presensi-form', 'categories', '#participantCategories');
  await shoot(page, 'presensi-form');

  // 8 Lainnya
  await admin(page, 'qrcode');
  await shoot(page, 'lainnya');

  // 9 Phones
  const phone = await newPage(browser, { ...devices['iPhone 13'] });
  await phone.goto(BASE + '/', { waitUntil: 'networkidle' }); await phone.waitForTimeout(1500);
  await shoot(phone, 'm-dashboard');
  await phone.goto(BASE + '/tamu-fo', { waitUntil: 'networkidle' }); await phone.waitForTimeout(800);
  await phone.fill('#foNama', 'Desi Ratnasari'); await phone.fill('#foJumlah', '2');
  await shoot(phone, 'm-tdd-form');
  await phone.goto(`${BASE}/?page=presensi&id=${find('Koordinasi Pendataan', '2026-11-24').id}`, { waitUntil: 'networkidle' }); await phone.waitForTimeout(1200);
  await phone.selectOption('#selectBidangDiskum', 'Bidang Pengawasan Koperasi').catch(() => {});
  await phone.waitForTimeout(300); await phone.selectOption('#selectPegawaiDiskum', { index: 1 }).catch(() => {});
  await shoot(phone, 'm-presensi');

  fs.writeFileSync(path.join(__dirname, 'rects.json'), JSON.stringify(rects, null, 1) + '\n');
  fs.rmSync(tmp, { recursive: true, force: true });
  await browser.close();
  console.log('done:', fs.readdirSync(OUT).length, 'files');
})().catch(e => { console.error(e.message); process.exit(1); });
