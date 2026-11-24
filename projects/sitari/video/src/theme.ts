// Colours from ../../DESIGN.md (measured from the real SITARI app).
export const C = {
  headerFrom: "#064E3B",
  headerVia: "#134E4A",
  headerTo: "#0F172A",
  primary: "#11504A",
  accent: "#10B981",
  accentStrong: "#047857",
  accentOnDark: "#A7F3D0",
  page: "#F4F7FA",
  white: "#FFFFFF",
  line: "#E2E8F0",
  heading: "#0F172A",
  body: "#475569",
  paper: "#E7E5E4",
  paperInk: "#57534E",
  afterBg: "#ECFDF5",
  afterInk: "#134E4A",
};
export const DARK = `linear-gradient(110deg, ${C.headerFrom} 0%, ${C.headerVia} 45%, ${C.headerTo} 100%)`;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Storyboard: scene id, length in frames (30 fps), caption. F-numbers refer to ../../prd.md.
export const SCENES = [
  { id: "S1Title", frames: 135, caption: "SI-TARI DISKUM: buku tamu dan rapat internal Dinas Koperasi dan Usaha Mikro Kota Batam." },
  { id: "S2Sebelum", frames: 210, caption: "Dulu: buku tamu kertas, jadwal manual, bukti SPPD tersebar. Kini semua tercatat di satu aplikasi." },
  { id: "S3Dashboard", frames: 210, caption: "Dashboard: tamu, rapat, dan Kendali SPPD hari ini dalam satu layar." },
  { id: "S4Tld", frames: 210, caption: "Rombongan luar daerah mengajukan kunjungan dan mengunggah surat dari formulir daring." },
  { id: "S5Tdd", frames: 180, caption: "Tamu yang datang langsung cukup memindai QR. Jam kedatangan tercatat otomatis." },
  { id: "S6Konfirmasi", frames: 210, caption: "Admin memeriksa surat, memilih Bidang Tujuan, lalu mengunggah disposisi." },
  { id: "S7Notifikasi", frames: 210, caption: "WhatsApp ke penerima tamu, lalu pesan ruangan. Ruangan yang sudah terpakai ditolak." },
  { id: "S8Kedatangan", frames: 210, caption: "Rombongan presensi lewat QR. Setelah kunjungan, admin memvalidasi daftar hadir." },
  { id: "S9Sppd", frames: 240, caption: "Foto kegiatan dan catatan; daftar hadir PDF otomatis. Semua dokumen jadi satu arsip PDF." },
  { id: "S10Rapat", frames: 210, caption: "Jadwal rapat dan kalender agenda, tanpa bentrok ruangan." },
  { id: "S11Presensi", frames: 240, caption: "Peserta rapat memindai QR dan memilih namanya. Presensi ganda ditolak." },
  { id: "S12Notula", frames: 210, caption: "E-Notula resmi terisi dari data rapat, dan laporan tamu bulanan siap diunduh." },
  { id: "S13Tutup", frames: 150, caption: "SI-TARI DISKUM. Semua nama dan data di video ini adalah contoh fiktif." },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];
export const TOTAL_FRAMES = SCENES.reduce((n, s) => n + s.frames, 0);
export const framesOf = (id: SceneId) => SCENES.find((s) => s.id === id)!.frames;
export const captionOf = (id: SceneId) => SCENES.find((s) => s.id === id)!.caption;
export const startOf = (id: SceneId) => {
  let n = 0;
  for (const s of SCENES) {
    if (s.id === id) return n;
    n += s.frames;
  }
  throw new Error("unknown scene " + id);
};
