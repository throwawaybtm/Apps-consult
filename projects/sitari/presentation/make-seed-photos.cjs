#!/usr/bin/env node
// Draws two flat illustrations used as fictional "photos" in the preview seed. No real people.
'use strict';
const path = require('node:path');
const { chromium } = require('playwright');
const scene = (title, table, chairs) => `<!doctype html><html><body style="margin:0">
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640">
<defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f3ef"/><stop offset="1" stop-color="#d4e7e0"/></linearGradient></defs>
<rect width="960" height="640" fill="url(#w)"/><rect y="430" width="960" height="210" fill="#c9ddd5"/>
<rect x="300" y="70" width="360" height="190" rx="10" fill="#0f3d38"/><rect x="316" y="86" width="328" height="158" rx="4" fill="#134e4a"/>
<text x="480" y="150" fill="#a7f3d0" font-family="Arial" font-size="26" font-weight="700" text-anchor="middle">${title}</text>
<text x="480" y="190" fill="#d1fae5" font-family="Arial" font-size="18" text-anchor="middle">Dinas Koperasi dan Usaha Mikro</text>
<ellipse cx="480" cy="430" rx="${table}" ry="70" fill="#7c5a3c"/><ellipse cx="480" cy="422" rx="${table - 8}" ry="62" fill="#9a7350"/>
${chairs.map(([x, y, c]) => `<g><circle cx="${x}" cy="${y - 52}" r="24" fill="#f1c9a5"/><path d="M${x - 34} ${y + 10} q34 -60 68 0 z" fill="${c}"/></g>`).join('')}
<text x="940" y="620" fill="#475569" font-family="Arial" font-size="16" text-anchor="end">Ilustrasi contoh</text></svg></body></html>`;

const letter = (kop, title, lines) => `<!doctype html><html><body style="margin:0;background:#fff;font-family:'Times New Roman',serif;color:#111">
<div style="width:794px;height:1123px;box-sizing:border-box;padding:56px 70px;position:relative">
<div style="text-align:center;border-bottom:3px double #111;padding-bottom:10px"><div style="font-size:17px;font-weight:700">${kop[0]}</div><div style="font-size:21px;font-weight:700">${kop[1]}</div><div style="font-size:13px">${kop[2]}</div></div>
<div style="text-align:center;margin:26px 0 18px;font-size:18px;font-weight:700;text-decoration:underline">${title}</div>
${lines.map(l => `<p style="font-size:15px;line-height:1.6;margin:0 0 10px">${l}</p>`).join('')}
<div style="position:absolute;right:80px;bottom:200px;text-align:center;font-size:15px">Kepala Dinas,<br><br><br><br><b>(contoh tanda tangan)</b></div>
<div style="position:absolute;left:70px;bottom:40px;font-size:12px;color:#555">Dokumen contoh (fiktif) untuk presentasi.</div></div></body></html>`;
const LETTERS = [
  ['surat-permohonan.png', letter(['PEMERINTAH KABUPATEN (CONTOH)', 'DINAS KOPERASI DAN UKM', 'Alamat kantor contoh'], 'SURAT PERMOHONAN KUNJUNGAN', ['Nomor: 500/123/DKUKM/XI/2026', 'Kepada Yth. Kepala Dinas Koperasi dan Usaha Mikro Kota Batam', 'Dengan hormat, bersama ini kami mengajukan permohonan kunjungan kerja rombongan kami untuk studi tiru dan koordinasi program koperasi dan usaha mikro.', 'Demikian permohonan ini kami sampaikan. Atas perhatian dan kerja samanya kami ucapkan terima kasih.'])],
  ['surat-tugas.png', letter(['PEMERINTAH KABUPATEN (CONTOH)', 'DINAS KOPERASI DAN UKM', 'Alamat kantor contoh'], 'SURAT TUGAS', ['Nomor: 094/456/DKUKM/XI/2026', 'Menugaskan nama-nama terlampir untuk melaksanakan kunjungan kerja ke Dinas Koperasi dan Usaha Mikro Kota Batam.', 'Surat tugas ini dibuat untuk dipergunakan sebagaimana mestinya.'])],
  ['disposisi.png', letter(['PEMERINTAH KOTA BATAM', 'DINAS KOPERASI DAN USAHA MIKRO', 'Lembar disposisi (contoh)'], 'LEMBAR DISPOSISI', ['Surat dari: Dinas Koperasi dan UKM (contoh)', 'Perihal: Permohonan kunjungan kerja', 'Diteruskan kepada: Kepala Bidang terkait', 'Isi disposisi: Mohon diterima dan disiapkan materi.'])]
];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 960, height: 640 } });
  const shots = [
    ['1-kunjungan.png', scene('Kunjungan Kerja', 250, [[260, 400, '#1d4ed8'], [360, 372, '#0f766e'], [480, 364, '#b45309'], [600, 372, '#0f766e'], [700, 400, '#1d4ed8']])],
    ['2-rapat.png', scene('Rapat Internal', 290, [[230, 410, '#334155'], [330, 376, '#0f766e'], [430, 364, '#475569'], [530, 364, '#0f766e'], [630, 376, '#334155'], [730, 410, '#475569']])]
  ];
  for (const [f, html] of shots) { await p.setContent(html); await p.screenshot({ path: path.join(__dirname, 'seed-photos', f) }); }
  const fs = require('node:fs'); fs.mkdirSync(path.join(__dirname, 'seed-letters'), { recursive: true });
  await p.setViewportSize({ width: 794, height: 1123 });
  for (const [f, html] of LETTERS) { await p.setContent(html); await p.screenshot({ path: path.join(__dirname, 'seed-letters', f) }); }
  await b.close(); console.log('ok');
})();
