#!/usr/bin/env node
// Starts SITARI's own local preview (local-test/server.js from the read-only clone) with a
// FICTIONAL week of data, driven through the app's own local API so every record goes through
// the real validation and workflow code. Nothing leaves this machine: the preview simulates
// Sheets, Drive and WhatsApp in memory.
//
// Usage (from the Apps-consult repo root):
//   node projects/sitari/presentation/fictional-config.cjs
//   node projects/sitari/presentation/seed-preview.cjs            # serves on 127.0.0.1:4174
// Env: SITARI_DIR (clone path), PORT (default 4174).
// The preview clock is frozen at TODAY 10:15 WIB after seeding, so captures are repeatable.
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const SITARI_DIR = process.env.SITARI_DIR || '/home/user/throwawaybtm/sitari-diskum-v3';
const PORT = Number(process.env.PORT || 4174);
const { createLocalTestServer } = require(path.join(SITARI_DIR, 'local-test/server.js'));
const { jsPDF } = require(path.join(SITARI_DIR, 'local-test/vendor/jspdf.umd.min.js'));

// "Today" for the story: Selasa, 24 November 2026.
const TODAY = '2026-11-24';
const at = (date, hm) => new Date(`${date}T${hm}:00+07:00`);
let clock = at('2026-11-12', '08:00');
const setClock = (date, hm) => { clock = at(date, hm); };

// Fictional staff of the Dinas. NIPs are made up and follow no real person.
const STAFF = [
  ['Drs. Hendra Wijaya, M.Si.', 'Kepala Dinas', 'Kepala Dinas', 'Pembina Utama Muda (IV/c)'],
  ['Ratna Dewi, S.H., M.H.', 'Sekretaris', 'Sekretariat', 'Pembina Tk. I (IV/b)'],
  ['Agus Setiawan, S.E., M.M.', 'Kepala Bidang Pemberdayaan dan Perlindungan Koperasi', 'Bidang Pemberdayaan dan Perlindungan Koperasi', 'Pembina (IV/a)'],
  ['Siti Rahmawati, S.E.', 'Kepala Bidang Pengawasan Koperasi', 'Bidang Pengawasan Koperasi', 'Pembina (IV/a)'],
  ['Budi Santoso, S.T., M.M.', 'Kepala Bidang Pengembangan Usaha Mikro', 'Bidang Pengembangan Usaha Mikro', 'Pembina (IV/a)'],
  ['Indah Permatasari, S.Sos.', 'Kepala Bidang Kewirausahaan', 'Bidang Kewirausahaan', 'Pembina (IV/a)'],
  ['Teguh Prasetyo, S.E.', 'Kepala UPTD PLUT KUMKM', 'UPTD PLUT KUMKM', 'Penata Tk. I (III/d)'],
  ['Wahyuni Lestari, S.E.', 'Kepala UPTD Pengelolaan Dana Bergulir', 'UPTD Pengelolaan Dana Bergulir', 'Penata Tk. I (III/d)'],
  ['Rina Wulandari, A.Md.', 'Pengelola Kepegawaian', 'Sekretariat', 'Penata Muda (III/a)'],
  ['Yusuf Pratama, S.Kom.', 'Perencana Ahli Pertama', 'Sekretariat', 'Penata Muda Tk. I (III/b)'],
  ['Sari Anggraini, S.E.', 'Pengelola Keuangan', 'Sekretariat', 'Penata Muda Tk. I (III/b)'],
  ['Dimas Saputra, S.E.', 'Penyuluh Koperasi', 'Bidang Pemberdayaan dan Perlindungan Koperasi', 'Penata Muda (III/a)'],
  ['Lestari Handayani, S.Kom.', 'Pengawas Koperasi Ahli Pertama', 'Bidang Pengawasan Koperasi', 'Penata Muda (III/a)'],
  ['Bayu Nugroho, S.E.', 'Analis Usaha Mikro', 'Bidang Pengembangan Usaha Mikro', 'Penata Muda (III/a)'],
  ['Maya Kartika, S.E.', 'Analis Kewirausahaan', 'Bidang Kewirausahaan', 'Penata Muda (III/a)'],
  ['Fajar Ramadhan, S.E.', 'Pendamping UMKM', 'UPTD PLUT KUMKM', 'Penata Muda (III/a)'],
  ['Nadia Puspita, S.E.', 'Pengelola Dana Bergulir', 'UPTD Pengelolaan Dana Bergulir', 'Penata Muda (III/a)'],
  ['Andi Firmansyah', 'Pengadministrasi Umum', 'Sekretariat', 'Pengatur (II/c)']
];
const employees = STAFF.map(([nama, jabatan, bidang, pangkat], i) => ({
  id: 10001 + i, nip: `19800${String(101 + i).padStart(3, '0')}20100${String(10 + i)}1000`.slice(0, 18),
  nama, jabatan, bidang, pangkat, is_lo: 0, status_aktif: 'Aktif'
}));

function pdf(title, lines) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFont('times', 'bold'); doc.setFontSize(15); doc.text(title, 20, 28);
  doc.setFont('times', 'normal'); doc.setFontSize(11);
  let y = 42; for (const l of lines) { doc.text(String(l), 20, y); y += 7; }
  doc.setFontSize(9); doc.text('Dokumen contoh (fiktif) untuk presentasi.', 20, 285);
  return 'data:application/pdf;base64,' + Buffer.from(doc.output('arraybuffer')).toString('base64');
}
const PHOTO = (() => {
  const p = path.join(__dirname, 'seed-photos');
  const files = fs.existsSync(p) ? fs.readdirSync(p).filter(f => /\.(png|jpe?g)$/i.test(f)).sort() : [];
  const list = files.map(f => ({ name: f, data: `data:image/${/png$/i.test(f) ? 'png' : 'jpeg'};base64,` + fs.readFileSync(path.join(p, f)).toString('base64') }));
  if (!list.length) list.push({ name: 'foto-kegiatan.png', data: 'data:image/png;base64,' + fs.readFileSync(path.join(SITARI_DIR, 'local-test/previews/meeting-preview.png')).toString('base64') });
  return list;
})();

const LETTER = f => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'seed-letters', f)).toString('base64');
let base;
async function api(fn, payload = {}) {
  const res = await fetch(`${base}/api/${fn}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  const json = await res.json();
  if (!json.success) throw new Error(`${fn}: ${json.error || JSON.stringify(json)}`);
  return json;
}
async function wf(kode, action, extra = {}) {
  const cur = (await api('getVisitWorkflow', { kode_kunjungan: kode })).data;
  return api('saveVisitWorkflow', { kode_kunjungan: kode, version: cur.workflow.version, action, ...extra });
}
async function meetingByVisit(kode) {
  return (await api('getRapatCalendar')).data.find(m => m.kode_kunjungan === kode && m.status !== 'Dibatalkan');
}

// --- Fictional delegations (Tamu Luar Daerah) ---------------------------------------------
const TLD = [
  { key: 'bintan', instansi: 'Dinas Koperasi dan UKM Kabupaten Bintan', alamat: 'Jl. Raya Tanjung Uban No. 12, Bintan',
    ketua_nama: 'Hj. Nurhayati, S.E., M.M.', pengikut_list: 'Rizky Maulana, S.E.\nDewi Sartika, S.H.\nArif Hidayat, A.Md.', jumlah_orang: 4,
    keperluan: 'Studi tiru pengelolaan Koperasi Merah Putih dan pendampingan UMKM.', narahubung_hp: '081200001101', bidang: ['Bidang Pemberdayaan dan Perlindungan Koperasi'] },
  { key: 'karimun', instansi: 'Dinas Perindustrian, Koperasi dan UKM Kabupaten Karimun', alamat: 'Jl. Poros No. 5, Tanjung Balai Karimun',
    ketua_nama: 'Ir. Syahrial Effendi', pengikut_list: 'Putri Amelia, S.E.\nHendri Kurniawan', jumlah_orang: 3,
    keperluan: 'Koordinasi program inkubasi wirausaha baru.', narahubung_hp: '081200001102', bidang: ['Bidang Kewirausahaan'] },
  { key: 'lingga', instansi: 'Dinas Koperasi dan UMKM Kabupaten Lingga', alamat: 'Jl. Istana Damnah, Daik Lingga',
    ketua_nama: 'Muhammad Fadli, S.Sos.', pengikut_list: 'Yuliana, S.E.\nRahmat Hidayat\nSiska Amelia, S.Kom.\nTaufik Hamzah', jumlah_orang: 5,
    keperluan: 'Konsultasi pengawasan dan penilaian kesehatan koperasi.', narahubung_hp: '081200001103', bidang: ['Bidang Pengawasan Koperasi'] },
  { key: 'natuna', instansi: 'Dinas Koperasi, UKM dan Perdagangan Kabupaten Natuna', alamat: 'Jl. Pramuka No. 3, Ranai',
    ketua_nama: 'Drs. Zulkarnain', pengikut_list: 'Wulan Sari, S.E.\nIrwan Saputra, S.T.', jumlah_orang: 3,
    keperluan: 'Studi tiru layanan PLUT KUMKM dan klinik usaha.', narahubung_hp: '081200001104', bidang: ['UPTD PLUT KUMKM'] },
  { key: 'anambas', instansi: 'Dinas Koperasi dan UKM Kabupaten Kepulauan Anambas', alamat: 'Jl. Imam Bonjol, Tarempa',
    ketua_nama: 'Rosmawati, S.E.', pengikut_list: 'Andika Pratama\nNurul Huda, S.E.', jumlah_orang: 3,
    keperluan: 'Konsultasi penyaluran dana bergulir bagi usaha mikro.', narahubung_hp: '081200001105', bidang: ['UPTD Pengelolaan Dana Bergulir'] },
  { key: 'tanjungpinang', instansi: 'Dinas Tenaga Kerja, Koperasi dan UKM Kota Tanjungpinang', alamat: 'Jl. Basuki Rahmat No. 9, Tanjungpinang',
    ketua_nama: 'Fitri Handayani, S.E., M.Si.', pengikut_list: 'Rudi Hartono, S.E.\nMelati Ayu, S.Kom.\nAgung Wibowo', jumlah_orang: 4,
    keperluan: 'Berbagi praktik digitalisasi data pelaku usaha mikro.', narahubung_hp: '081200001106', bidang: ['Bidang Pengembangan Usaha Mikro'] },
  { key: 'pekanbaru', instansi: 'Dinas Koperasi dan UKM Kota Pekanbaru', alamat: 'Jl. Jend. Sudirman No. 120, Pekanbaru',
    ketua_nama: 'H. Edi Suryanto, S.E.', pengikut_list: 'Lina Marlina, S.E.\nFerry Gunawan', jumlah_orang: 3,
    keperluan: 'Koordinasi pameran produk UMKM antardaerah.', narahubung_hp: '081200001107', bidang: ['Bidang Kewirausahaan'] }
];
function tldPayload(v, tanggal, jam) {
  return {
    instansi: v.instansi, alamat: v.alamat, ketua_nama: v.ketua_nama, pengikut_list: v.pengikut_list, jumlah_orang: v.jumlah_orang,
    keperluan: v.keperluan, narahubung_hp: v.narahubung_hp, tanggal_kunjungan: tanggal, jam_kunjungan: jam, tujuan_bidang: v.bidang, bawa_sppd: 0,
    surat_kunjungan_base64: LETTER('surat-permohonan.png'),
    surat_tugas_base64: LETTER('surat-tugas.png')
  };
}
const roomUtama = '6001', roomBidang = '6002', roomPimpinan = '6003', roomPlut = '6005';

// Runs one delegation through the real workflow up to `until` (stage name).
async function runTld(v, { submitOn, tanggal, jam, end, room, until }) {
  setClock(submitOn, '09:20');
  const reg = await api('registerTamuLuar', tldPayload(v, tanggal, jam));
  const kode = reg.data.kode_kunjungan; v.kode = kode;
  if (until === 'Menunggu Konfirmasi') return kode;
  await wf(kode, 'destinations', { destinations: v.bidang });
  setClock(submitOn, '10:05');
  await wf(kode, 'confirm');
  if (until === 'Dikonfirmasi') return kode;
  setClock(submitOn, '13:30');
  await wf(kode, 'disposisi', { file: { name: 'Lembar Disposisi.png', data: LETTER('disposisi.png') } });
  if (until === 'Sudah Disposisi') return kode;
  await wf(kode, 'notify');
  await wf(kode, 'book', { booking: { ruangan_id: room, tanggal, jam_mulai: jam, jam_selesai: end } });
  if (until === 'Menunggu Kedatangan') return kode;
  // Arrival: every member scans the agenda QR during the visit.
  const m = await meetingByVisit(kode);
  const [h, mm] = jam.split(':').map(Number);
  setClock(tanggal, `${String(h).padStart(2, '0')}:${String(mm + 4).padStart(2, '0')}`);
  const roster = (await api('getVisitAttendanceRoster', { rapat_id: m.id })).data.roster;
  const jobs = ['Kepala Bidang', 'Analis', 'Staf', 'Staf', 'Staf'];
  for (const [i, r] of roster.entries()) {
    await api('submitPresensiRapat', { rapat_id: m.id, kategori_peserta: 'Tamu_Luar', member_id: r.id, nama: r.nama, nama_opd: v.instansi, jabatan: i === 0 ? 'Ketua Rombongan' : jobs[i] });
  }
  setClock(tanggal, end.replace(/:(\d\d)$/, (x, s) => ':' + String(Number(s) + 10).padStart(2, '0')));
  await wf(kode, 'arrival');
  if (until === 'Kelola SPPD') return kode;
  await wf(kode, 'evidence', { files: { foto: PHOTO[0] } });
  await wf(kode, 'finish', { note: 'Kunjungan berjalan lancar; materi dan tindak lanjut telah disampaikan kepada rombongan.' });
  return kode;
}

async function seed() {
  // Visits completed last week.
  await runTld(TLD[0], { submitOn: '2026-11-12', tanggal: '2026-11-17', jam: '09:00', end: '11:00', room: roomUtama, until: 'Selesai' });
  await runTld(TLD[1], { submitOn: '2026-11-13', tanggal: '2026-11-19', jam: '13:30', end: '15:00', room: roomBidang, until: 'Selesai' });
  // Visit done yesterday, SPPD evidence still to complete.
  await runTld(TLD[2], { submitOn: '2026-11-16', tanggal: '2026-11-23', jam: '10:00', end: '12:00', room: roomUtama, until: 'Kelola SPPD' });
  // Visit happening today, room booked; guests arrive at 10:00.
  await runTld(TLD[3], { submitOn: '2026-11-18', tanggal: TODAY, jam: '10:00', end: '11:30', room: roomPlut, until: 'Menunggu Kedatangan' });
  // Upcoming: disposition done, then a fresh confirmation, then two new requests.
  await runTld(TLD[4], { submitOn: '2026-11-20', tanggal: '2026-11-26', jam: '09:30', end: '11:00', room: roomUtama, until: 'Sudah Disposisi' });
  await runTld(TLD[5], { submitOn: '2026-11-23', tanggal: '2026-11-27', jam: '10:00', end: '11:30', room: roomUtama, until: 'Dikonfirmasi' });
  await runTld(TLD[6], { submitOn: TODAY, tanggal: '2026-12-01', jam: '09:00', end: '10:30', room: roomUtama, until: 'Menunggu Konfirmasi' });

  // Two people from TLD[3] already scanned the QR this morning.
  setClock(TODAY, '10:03');
  const m3 = await meetingByVisit(TLD[3].kode);
  const roster3 = (await api('getVisitAttendanceRoster', { rapat_id: m3.id })).data.roster;
  for (const [i, r] of roster3.slice(0, 2).entries()) {
    await api('submitPresensiRapat', { rapat_id: m3.id, kategori_peserta: 'Tamu_Luar', member_id: r.id, nama: r.nama, nama_opd: TLD[3].instansi, jabatan: i === 0 ? 'Ketua Rombongan' : 'Kepala Seksi' });
  }

  // --- Walk-in visitors (Tamu Dalam Daerah) this morning ---
  const TDD = [
    { t: '08:12', ketua_nama: 'Rahmat Siregar', pengikut_list: 'Rahmat Siregar', jumlah_orang: 1, narahubung_hp: '081200002201', tujuan_bidang: ['Bidang Pengembangan Usaha Mikro'], keperluan: 'Konsultasi pendaftaran NIB usaha kuliner rumahan.', instansi: 'Perorangan' },
    { t: '08:47', ketua_nama: 'Yanti Simanjuntak', pengikut_list: 'Yanti Simanjuntak\nErwin Tambunan', jumlah_orang: 2, narahubung_hp: '081200002202', tujuan_bidang: ['Bidang Pemberdayaan dan Perlindungan Koperasi'], keperluan: 'Konsultasi pembentukan koperasi nelayan Belakang Padang.', instansi: 'Kelompok Nelayan Belakang Padang' },
    { t: '09:31', ketua_nama: 'Hasan Basri', pengikut_list: 'Hasan Basri', jumlah_orang: 1, narahubung_hp: '081200002203', tujuan_bidang: ['UPTD PLUT KUMKM'], keperluan: 'Mendaftar pelatihan pemasaran digital.', instansi: 'Perorangan' },
    { t: '09:58', ketua_nama: 'Kartini Lubis', pengikut_list: 'Kartini Lubis\nSiti Aminah\nDewi Rahayu', jumlah_orang: 3, narahubung_hp: '081200002204', tujuan_bidang: ['UPTD Pengelolaan Dana Bergulir'], keperluan: 'Menanyakan syarat pinjaman dana bergulir.', instansi: 'Koperasi Wanita Sejahtera Batu Aji' }
  ];
  for (const v of TDD) { setClock(TODAY, v.t); const { t, ...p } = v; await api('registerTamuFo', p); }

  // --- Internal meetings ---
  const meet = async (tanggal, judul, ruangan, jam_mulai, jam_selesai, bidang, pimpinan, agenda) => {
    const r = await api('simpanJadwalRapat', { judul, ruangan, tanggal, jam_mulai, jam_selesai, bidang, pimpinan, agenda });
    return (await api('getRapatCalendar')).data.find(m => m.kode_rapat === r.data.kode_rapat);
  };
  setClock('2026-11-16', '08:00');
  const rapim = await meet('2026-11-16', 'Rapat Pimpinan Mingguan', `${roomPimpinan}|Ruang Rapat Pimpinan / Kadis`, '08:30', '10:00', 'Sekretariat', STAFF[0][0], 'Evaluasi kegiatan pekan lalu dan rencana pekan ini.');
  const evalRapat = await meet('2026-11-18', 'Evaluasi Realisasi Anggaran Triwulan IV', `${roomUtama}|Ruang Rapat Utama Diskum`, '13:30', '15:30', 'Sekretariat', STAFF[1][0], 'Realisasi anggaran per bidang dan rencana penyerapan Desember.');
  setClock('2026-11-20', '08:00');
  const pagi = await meet(TODAY, 'Rapat Pimpinan Mingguan', `${roomPimpinan}|Ruang Rapat Pimpinan / Kadis`, '08:00', '09:30', 'Sekretariat', STAFF[0][0], 'Evaluasi pekan lalu, persiapan pameran UMKM akhir tahun.');
  await meet(TODAY, 'Koordinasi Pendataan Koperasi Aktif 2026', `${roomUtama}|Ruang Rapat Utama Diskum`, '13:30', '15:00', 'Bidang Pengawasan Koperasi', STAFF[3][0], 'Pemutakhiran data koperasi aktif dan jadwal pemeriksaan.');
  await meet('2026-11-25', 'Persiapan Pameran Produk UMKM Akhir Tahun', `${roomUtama}|Ruang Rapat Utama Diskum`, '09:00', '11:00', 'Bidang Kewirausahaan', STAFF[5][0], 'Pembagian tugas, daftar peserta pameran, dan anggaran.');
  const tunda = await meet('2026-11-26', 'Sosialisasi Penilaian Kesehatan Koperasi', `${roomBidang}|Ruangan Bidang Koperasi & UMKM`, '13:00', '14:30', 'Bidang Pengawasan Koperasi', STAFF[3][0], 'Materi penilaian kesehatan KSP/USP.');
  await meet('2026-11-27', 'Rapat Teknis Dana Bergulir', `${roomBidang}|Ruangan Bidang Koperasi & UMKM`, '09:00', '10:30', 'UPTD Pengelolaan Dana Bergulir', STAFF[7][0], 'Evaluasi pengembalian pinjaman dan calon penerima baru.');
  setClock('2026-11-21', '09:00');
  await api('postponeAgendaRapat', { rapat_id: tunda.id, alasan: 'Narasumber berhalangan hadir.' }).catch(e => console.warn('postpone:', e.message));

  // Attendance for past and current internal meetings (QR scans by staff).
  const scan = async (m, date, times, people) => {
    for (const [i, s] of people.entries()) {
      setClock(date, times[i % times.length]);
      await api('submitPresensiRapat', { rapat_id: m.id, kategori_peserta: 'Pegawai', nama: s.nama, nip: s.nip, jabatan: s.jabatan, nama_opd: s.bidang });
    }
  };
  await scan(rapim, '2026-11-16', ['08:22', '08:25', '08:27', '08:29', '08:31', '08:33'], employees.slice(0, 8));
  await scan(evalRapat, '2026-11-18', ['13:20', '13:24', '13:28', '13:31'], [employees[1], ...employees.slice(8, 11), employees[2], employees[4]]);
  await scan(pagi, TODAY, ['07:52', '07:55', '07:58', '08:01'], employees.slice(0, 8));

  // Photos and E-Notula for the two finished meetings, then lock last week's Rapat Pimpinan.
  for (const [m, date, hm] of [[rapim, '2026-11-16', '10:30'], [evalRapat, '2026-11-18', '16:00']]) {
    setClock(date, hm);
    await api('saveAgendaPhotos', { rapat_id: m.id, files: [PHOTO[PHOTO.length - 1]] });
    await api('saveAgendaNotula', { rapat_id: m.id, file: { name: 'E-Notula.pdf', data: pdf('Notula Rapat', [m.judul_rapat, 'Tanggal: ' + date, 'Ringkasan dan tindak lanjut.']) } });
  }
  // Today's Rapat Pimpinan has its photo, so the E-Notula composer can open.
  setClock(TODAY, '09:40');
  await api('saveAgendaPhotos', { rapat_id: pagi.id, files: [PHOTO[PHOTO.length - 1]] });
  setClock('2026-11-17', '08:00');
  await api('lockAgendaRapat', { rapat_id: rapim.id }).catch(e => console.warn('lock:', e.message));

  setClock(TODAY, '10:15');
}

const server = createLocalTestServer({ now: () => new Date(clock), employees });
server.listen(PORT, '127.0.0.1', async () => {
  base = `http://127.0.0.1:${PORT}`;
  try {
    await seed();
    const tamu = (await api('getTamuList')).data;
    const cal = (await api('getRapatCalendar')).data;
    console.log(`SEEDED ${tamu.length} visits (${tamu.map(t => t.status_kunjungan).join(', ')}), ${cal.length} agendas (${cal.map(c => c.status).join(', ')})`);
    console.log(`READY ${base}/  (clock frozen at ${clock.toISOString()})`);
  } catch (e) {
    console.error('SEED FAILED', e.stack || e.message);
    process.exit(1);
  }
});
