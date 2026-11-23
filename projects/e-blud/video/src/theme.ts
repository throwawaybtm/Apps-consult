// Colours from ../../DESIGN.md. Placeholder look for discussion, not a final design.
export const C = {
  navy: "#0B2540",
  navy2: "#12365A",
  brand: "#0369A1",
  brandDark: "#0C4A6E",
  sky: "#7DD3FC",
  halo: "#BAE6FD",
  tint: "#F0F9FF",
  ink: "#0F2233",
  body: "#3B4A5A",
  line: "#D3DDE6",
  white: "#FFFFFF",
  pin: "#C2410C",
  warn: "#92400E",
  warnBg: "#FEF3C7",
  ok: "#166534",
  okBg: "#DCFCE7",
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Storyboard: scene id, length in frames (30 fps), caption. F-numbers refer to ../../prd.md.
export const SCENES = [
  { id: "S1Title", frames: 150, caption: "e-BLUD: sistem digital untuk BLUD Diskum Batam. Contoh tampilan, draft v0." },
  { id: "S2Masalah", frames: 210, caption: "Sekarang pencatatan masih manual di Excel: data mudah ganda, status sulit dicari, laporan lambat." },
  { id: "S3Home", frames: 240, caption: "Situs publik: informasi, angka gabungan tanpa data pribadi, dan tombol Ajukan pembiayaan." },
  { id: "S4Form", frames: 300, caption: "Mitra mengisi formulir sendiri, tanpa akun. Dokumen diunggah dan disimpan privat." },
  { id: "S5Kode", frames: 210, caption: "Setelah terkirim, mitra mendapat kode untuk melacak tahap permohonan." },
  { id: "S6Dashboard", frames: 240, caption: "Petugas melihat permohonan masuk, serta angka pencairan dan cicilan." },
  { id: "S7Verifikasi", frames: 300, caption: "Petugas memeriksa data dan dokumen, lalu lanjut ke survei, minta perbaikan, atau tolak." },
  { id: "S8Aturan", frames: 210, caption: "Aturan pembiayaan dicek otomatis, misalnya batas tanggal pencairan (contoh)." },
  { id: "S9Fitur", frames: 240, caption: "14 fitur, dari permohonan sampai lunas." },
  { id: "S10Asumsi", frames: 210, caption: "Alur dan aturan di sini masih asumsi. Kami perlu konfirmasi BLUD." },
  { id: "S11Tutup", frames: 150, caption: "Terima kasih. Penawaran harga disampaikan terpisah." },
] as const;

export const TOTAL_FRAMES = SCENES.reduce((n, s) => n + s.frames, 0);

export const framesOf = (id: (typeof SCENES)[number]["id"]) => SCENES.find((s) => s.id === id)!.frames;
export const captionOf = (id: (typeof SCENES)[number]["id"]) => SCENES.find((s) => s.id === id)!.caption;
