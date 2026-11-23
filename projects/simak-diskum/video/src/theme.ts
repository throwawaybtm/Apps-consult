// Colours from ../../DESIGN.md. Placeholder look for discussion, not a final design.
export const C = {
  navy: "#0F172A",
  navy2: "#1E293B",
  brand: "#2563EB",
  heading: "#0F172A",
  halo: "#BFDBFE",
  tint: "#EFF6FF",
  page: "#F0F4F9",
  ink: "#0F172A",
  body: "#475569",
  line: "#E2E8F0",
  white: "#FFFFFF",
  gold: "#F4B400",
  goldInk: "#3D2C00",
  pin: "#C2410C",
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Storyboard: scene id, length in frames (30 fps), caption. F-numbers refer to ../../prd.md.
export const SCENES = [
  { id: "S1Title", frames: 135, caption: "SIMAK DISKUM: agenda kedinasan Dinas Koperasi dan Usaha Mikro Kota Batam. Contoh tampilan, draft v1." },
  { id: "S2Masalah", frames: 180, caption: "Sekarang agenda dicatat di Excel: jadwal bisa bentrok, laporan disusun ulang, dan masyarakat sulit tahu kegiatan Dinas." },
  { id: "S3Home", frames: 240, caption: "Portal publik: agenda hari ini urut jam, dengan ringkasan dan pencarian." },
  { id: "S4Kalender", frames: 240, caption: "Kalender bulan, minggu, hari, dan daftar, lengkap dengan pencarian dan filter." },
  { id: "S5Detail", frames: 210, caption: "Detail kegiatan, dan pemberitahuan bila dibatalkan. Alasan internal tidak pernah tampil." },
  { id: "S6Dashboard", frames: 210, caption: "Petugas melihat jumlah kegiatan per tahap dan apa yang masih perlu dilengkapi." },
  { id: "S7Form", frames: 330, caption: "Satu halaman untuk satu kegiatan: tahap administrasi, peringatan bentrok di dalam formulir, dan pratinjau publik." },
  { id: "S8Catatan", frames: 270, caption: "Tautan rapat di catatan publik ditahan. Selesai otomatis; Batalkan butuh alasan." },
  { id: "S9Laporan", frames: 270, caption: "Laporan 8 kolom dengan kop surat dan tanda tangan, siap diunduh sebagai PDF, Excel, atau gambar." },
  { id: "S10Fitur", frames: 180, caption: "Sembilan belas fitur, dari portal publik sampai cadangan data." },
  { id: "S11Keputusan", frames: 150, caption: "Ada tujuh hal yang perlu Dinas putuskan sebelum PRD disetujui." },
  { id: "S12Tutup", frames: 135, caption: "Terima kasih. Penawaran harga disampaikan terpisah." },
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
