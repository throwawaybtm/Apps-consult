// Version 3: faster pacing, zoom into the important parts, animated captions, counting numbers, music.
// F-numbers refer to ../../prd.md. About 69 seconds at 30 fps.
export const SCENES3 = [
  { id: "V1Hook", frames: 120, caption: "e-BLUD: sistem digital untuk BLUD Diskum Batam. Contoh tampilan, draft v0.", captionAt: 60 },
  { id: "V2Masalah", frames: 180, caption: "Data ganda, status sulit dicari, laporan lambat.", captionAt: 10 },
  { id: "V3Home", frames: 210, caption: "Situs publik: informasi, angka gabungan, dan tombol Ajukan pembiayaan.", captionAt: 8 }, // F13, F14
  { id: "V4Form", frames: 240, caption: "Mitra mengisi formulir sendiri, tanpa akun. Dokumen diunggah dan disimpan privat.", captionAt: 8 }, // F3, F13
  { id: "V5Kode", frames: 180, caption: "Setelah terkirim, mitra mendapat kode untuk melacak tahap permohonan.", captionAt: 8 }, // F3, F14
  { id: "V6Dashboard", frames: 150, caption: "Petugas melihat permohonan masuk dan angka pencairan serta cicilan.", captionAt: 8 }, // F9, F3, F7, F8
  { id: "V7Angka", frames: 90, caption: "Angka terlihat langsung, tanpa menunggu rekap.", captionAt: 6 }, // F9
  { id: "V8Verifikasi", frames: 240, caption: "Petugas memeriksa data dan dokumen, lalu lanjut ke survei, minta perbaikan, atau tolak.", captionAt: 8 }, // F2, F3, F4
  { id: "V9Aturan", frames: 180, caption: "Aturan pembiayaan dicek otomatis, misalnya batas tanggal pencairan (contoh).", captionAt: 8 }, // F5, F6
  { id: "V10Fitur", frames: 180, caption: "14 fitur, dari permohonan sampai lunas.", captionAt: 8 }, // F1 to F14
  { id: "V11Asumsi", frames: 150, caption: "Alur dan aturan di sini masih asumsi. Kami perlu konfirmasi BLUD.", captionAt: 8 },
  { id: "V12Tutup", frames: 150, caption: "Satu sistem, dari permohonan sampai lunas. Penawaran harga disampaikan terpisah.", captionAt: 8 },
] as const;

export type SceneId3 = (typeof SCENES3)[number]["id"];

export const TOTAL3 = SCENES3.reduce((n, s) => n + s.frames, 0);
export const meta3 = (id: SceneId3) => SCENES3.find((s) => s.id === id)!;
export const start3 = (id: SceneId3) => {
  let n = 0;
  for (const s of SCENES3) {
    if (s.id === id) return n;
    n += s.frames;
  }
  throw new Error("unknown scene " + id);
};
