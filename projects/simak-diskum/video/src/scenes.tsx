import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import rects from "./rects.json";
import { BrowserFrame, FONT, Highlight, LeftInfo, SceneShell } from "./components";
import { C, captionOf, framesOf, SceneId } from "./theme";

const R = rects as any;
const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const LIGHT = `linear-gradient(180deg, ${C.tint}, #DBEAFE)`;

const Scene: React.FC<{ id: SceneId; background?: string; children: React.ReactNode }> = ({ id, background = LIGHT, children }) => (
  <SceneShell frames={framesOf(id)} caption={captionOf(id)} background={background}>{children}</SceneShell>
);

// Fades and slides a block in, `at` frames after the scene starts.
const Reveal: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 16], [0, 1], { ...clampX, easing: out });
  return <div style={{ opacity: t, translate: `0px ${interpolate(t, [0, 1], [24, 0])}px`, ...style }}>{children}</div>;
};

// ---- 1. Title ----
export const S1Title: React.FC = () => (
  <Scene id="S1Title" background={C.navy}>
    <div style={{ position: "absolute", left: 160, top: 300, width: 1400 }}>
      <Reveal at={4}><div style={{ fontSize: 34, fontWeight: 600, color: C.gold }}>Dinas Koperasi dan Usaha Mikro Kota Batam</div></Reveal>
      <Reveal at={12}><div style={{ marginTop: 18, fontSize: 150, lineHeight: 1, fontWeight: 800, color: C.white, letterSpacing: -4 }}>SIMAK DISKUM</div></Reveal>
      <Reveal at={22}><div style={{ marginTop: 26, width: 220, height: 10, borderRadius: 5, background: C.gold }} /></Reveal>
      <Reveal at={30}><div style={{ marginTop: 30, fontSize: 46, lineHeight: 1.25, color: "#CBD5E1", width: 1100 }}>Sistem Informasi Manajemen Agenda Kedinasan</div></Reveal>
    </div>
  </Scene>
);

// ---- 2. The problem (PRD section 1) ----
const PROBLEMS = [
  ["Catatan di Excel", "Jadwal dicatat manual, masyarakat sulit tahu kegiatan Dinas."],
  ["Bentrok baru ketahuan belakangan", "Ruangan atau pegawai yang sama terjadwal ganda."],
  ["Laporan dibuat ulang", "Laporan jadwal resmi disusun lagi setiap kali diminta."],
];
export const S2Masalah: React.FC = () => (
  <Scene id="S2Masalah">
    <div style={{ position: "absolute", left: 160, top: 120, width: 1600 }}>
      <Reveal at={2}><div style={{ fontSize: 32, fontWeight: 600, color: C.brand }}>Masalah sekarang</div></Reveal>
      <Reveal at={8}><div style={{ marginTop: 8, fontSize: 68, fontWeight: 800, color: C.heading, letterSpacing: -1 }}>Agenda tersebar, laporan berulang</div></Reveal>
      <div style={{ marginTop: 56, display: "flex", gap: 28 }}>
        {PROBLEMS.map(([h, p], i) => (
          <Reveal key={h} at={30 + i * 22} style={{ flex: 1, background: C.white, border: `2px solid ${C.line}`, borderRadius: 24, padding: 40, minHeight: 320 }}>
            <div style={{ fontSize: 40, lineHeight: 1.15, fontWeight: 700, color: C.heading }}>{h}</div>
            <div style={{ marginTop: 18, fontSize: 32, lineHeight: 1.4, color: C.body }}>{p}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </Scene>
);

// ---- 3 to 9: screens of the mockups ----
// 3. Public dashboard (F1, F3)
const H = R["public-home"];
export const S3Home: React.FC = () => (
  <Scene id="S3Home">
    <LeftInfo eyebrow="Contoh layar 1 dari 7" title="Dashboard publik" chips={["F1", "F3"]} />
    <BrowserFrame shot="public-home.png" pageHeight={H.height} panFrames={[0, 70, 110, 150, 200, 240]} panY={[0, 0, 200, 200, 289, 289]}>
      <Highlight rect={H.p2} label="Ringkasan (F1)" n={1} at={14} until={84} />
      <Highlight rect={H.p1} label="Agenda hari ini (F1)" n={2} at={92} until={164} below />
      <Highlight rect={H.p3} label="Pencarian dan filter (F3)" n={3} at={174} />
    </BrowserFrame>
  </Scene>
);

// 4. Calendar and filters (F2, F3)
const K = R["public-kalender"];
export const S4Kalender: React.FC = () => (
  <Scene id="S4Kalender">
    <LeftInfo eyebrow="Contoh layar 2 dari 7" title="Kalender dan pencarian" chips={["F2", "F3"]} />
    <BrowserFrame shot="public-kalender.png" pageHeight={K.height} panFrames={[0, 240]} panY={[0, 0]}>
      <Highlight rect={K.p1} label="Pilih tampilan (F2)" n={1} at={14} until={84} labelRight />
      <Highlight rect={K.p2} label="Kalender bulan (F2)" n={2} at={84} until={164} />
      <Highlight rect={K.p3} label="Cari dan saring (F3)" n={3} at={164} labelRight />
    </BrowserFrame>
  </Scene>
);

// 5. Detail and cancellation (F4, F10, F11)
const D = R["public-detail"];
export const S5Detail: React.FC = () => (
  <Scene id="S5Detail">
    <LeftInfo eyebrow="Contoh layar 3 dari 7" title="Detail kegiatan" chips={["F4", "F10", "F11"]} />
    <BrowserFrame shot="public-detail.png" pageHeight={D.height} panFrames={[0, 210]} panY={[0, 0]}>
      <Highlight rect={D.p1} label="Nama dan status (F4)" n={1} at={14} until={74} below />
      <Highlight rect={D.p2} label="Waktu, tempat, penyelenggara (F4)" n={2} at={74} until={144} below />
      <Highlight rect={D.p3} label="Pemberitahuan pembatalan (F10)" n={3} at={144} labelRight />
    </BrowserFrame>
  </Scene>
);

// 6. Admin dashboard (F6)
const A = R["admin-dashboard"];
export const S6Dashboard: React.FC = () => (
  <Scene id="S6Dashboard">
    <LeftInfo eyebrow="Contoh layar 4 dari 7" title="Dashboard admin" chips={["F6", "F8"]} />
    <BrowserFrame shot="admin-dashboard.png" pageHeight={A.height} panFrames={[0, 120, 170, 210]} panY={[0, 0, 307, 307]}>
      <Highlight rect={A.p1} label="Jumlah per tahap administrasi (F6)" n={1} at={14} until={84} />
      <Highlight rect={A.p2} label="Belum lengkap, terdekat dulu (F6)" n={2} at={84} until={150} />
      <Highlight rect={A.p3} label="Agenda minggu ini, warna per kategori (F6)" n={3} at={164} />
    </BrowserFrame>
  </Scene>
);

// 7. Activity form, top (F7, F8, F9)
const F = R["admin-kegiatan"];
export const S7Form: React.FC = () => (
  <Scene id="S7Form">
    <LeftInfo eyebrow="Contoh layar 5 dari 7" title="Satu halaman untuk satu kegiatan" chips={["F7", "F8", "F9"]} />
    <BrowserFrame shot="admin-kegiatan.png" pageHeight={F.height} panFrames={[0, 50, 330]} panY={[0, 110, 110]}>
      <Highlight rect={F.p1} label="Tahap administrasi (F8)" n={1} at={16} until={120} />
      <Highlight rect={F.p2} label="Peringatan bentrok, tetap bisa disimpan (F9)" n={2} at={120} until={228} below />
      <Highlight rect={F.p6} label="Pratinjau publik (F7)" n={3} at={230} labelRight />
    </BrowserFrame>
  </Scene>
);

// 8. Activity form, notes and status (F11, F8, F10)
export const S8Catatan: React.FC = () => (
  <Scene id="S8Catatan">
    <LeftInfo eyebrow="Contoh layar 5 dari 7" title="Catatan, surat, dan status" chips={["F8", "F10", "F11"]} />
    <BrowserFrame shot="admin-kegiatan.png" pageHeight={F.height} panFrames={[0, 60, 270]} panY={[650, 700, 700]}>
      <Highlight rect={F.p3} label="Catatan publik dan internal (F11)" n={1} at={20} until={112} below />
      <Highlight rect={F.p4} label="Surat undangan, tertutup (F8)" n={2} at={112} until={192} below />
      <Highlight rect={F.p5} label="Status di kolom kanan (F10)" n={3} at={192} below labelRight />
    </BrowserFrame>
  </Scene>
);

// 9. Report (F14, F15, F16)
const L = R["admin-laporan"];
export const S9Laporan: React.FC = () => (
  <Scene id="S9Laporan">
    <LeftInfo eyebrow="Contoh layar 6 dari 7" title="Laporan 8 kolom" chips={["F14", "F15", "F16"]} />
    <BrowserFrame shot="admin-laporan.png" pageHeight={L.height} panFrames={[0, 100, 150, 270]} panY={[0, 0, 220, 220]}>
      <Highlight rect={L.p1} label="Unduh PDF, Excel, gambar (F14)" n={1} at={14} until={90} labelRight />
      <Highlight rect={L.p2} label="Kop surat (F15)" n={2} at={84} until={190} />
      <Highlight rect={L.p3} label="Tanda tangan (F16)" n={3} at={176} below />
    </BrowserFrame>
  </Scene>
);

// ---- 10. The 19 features ----
const FEATURES = ["Dashboard publik", "Kalender", "Pencarian dan filter", "Detail kegiatan", "Login dan peran", "Dashboard admin", "Formulir satu halaman", "Tahap administrasi", "Peringatan bentrok", "Status kegiatan", "Data publik dan internal", "Edit bersamaan", "Data master", "Laporan 8 kolom", "Kop surat", "Pejabat penandatangan", "Riwayat perubahan", "Kelola pengguna", "Cadangan data"];
export const S10Fitur: React.FC = () => (
  <Scene id="S10Fitur" background={C.navy}>
    <div style={{ position: "absolute", left: 160, top: 100, width: 1600 }}>
      <Reveal at={2}><div style={{ fontSize: 32, fontWeight: 600, color: C.gold }}>Cakupan PRD</div></Reveal>
      <Reveal at={6}><div style={{ marginTop: 8, fontSize: 64, fontWeight: 800, color: C.white, letterSpacing: -1 }}>19 fitur, satu nomor di semua dokumen</div></Reveal>
      <div style={{ marginTop: 44, display: "flex", flexWrap: "wrap", gap: 14 }}>
        {FEATURES.map((name, i) => (
          <Reveal key={name} at={14 + i * 4} style={{ width: 380, boxSizing: "border-box", background: C.navy2, border: "2px solid #334155", borderRadius: 16, padding: "14px 20px", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: C.gold, width: 70 }}>F{i + 1}</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: "#F5F7FC", lineHeight: 1.15 }}>{name}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </Scene>
);

// ---- 11. The seven decisions (PRD section 8) ----
const DECISIONS = ["Siapa yang menandatangani laporan", "Verifikasi daftar 70 pegawai", "Pemegang akun admin dan editor", "Laporan: potret atau lanskap", "Sumber berkas kop surat resmi", "Siapa boleh membatalkan kegiatan", "Kolom Dihadiri Oleh di portal publik"];
export const S11Keputusan: React.FC = () => (
  <Scene id="S11Keputusan">
    <div style={{ position: "absolute", left: 160, top: 120, width: 1600 }}>
      <Reveal at={2}><div style={{ fontSize: 32, fontWeight: 600, color: C.brand }}>Sebelum PRD disetujui</div></Reveal>
      <Reveal at={6}><div style={{ marginTop: 8, fontSize: 64, fontWeight: 800, color: C.heading, letterSpacing: -1 }}>Tujuh keputusan untuk Dinas</div></Reveal>
      <div style={{ marginTop: 40 }}>
        {DECISIONS.map((d, i) => (
          <Reveal key={d} at={14 + i * 8} style={{ display: "flex", alignItems: "center", gap: 24, padding: "10px 0", borderBottom: `2px solid ${C.line}` }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: C.brand, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>{i + 1}</div>
            <div style={{ fontSize: 38, fontWeight: 600, color: C.ink }}>{d}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </Scene>
);

// ---- 12. Closing ----
export const S12Tutup: React.FC = () => (
  <Scene id="S12Tutup" background={C.navy}>
    <div style={{ position: "absolute", left: 160, top: 330, width: 1500, fontFamily: FONT }}>
      <Reveal at={4}><div style={{ fontSize: 110, fontWeight: 800, color: C.white, letterSpacing: -3 }}>Terima kasih</div></Reveal>
      <Reveal at={14}><div style={{ marginTop: 22, width: 220, height: 10, borderRadius: 5, background: C.gold }} /></Reveal>
      <Reveal at={22}><div style={{ marginTop: 28, fontSize: 44, lineHeight: 1.3, color: "#CBD5E1" }}>Penawaran harga disampaikan terpisah.</div></Reveal>
    </div>
  </Scene>
);
