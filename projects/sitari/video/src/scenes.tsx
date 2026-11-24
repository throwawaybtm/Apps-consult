import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clampX, LeftInfo, out, Phone, Reveal, SceneShell, Shot } from "./components";
import { C, captionOf, DARK, framesOf, SceneId } from "./theme";

const LIGHT = `linear-gradient(180deg, ${C.page}, #E3EEEA)`;
const BOX = { left: 660, top: 56, width: 1180, height: 810 };

const Scene: React.FC<{ id: SceneId; background?: string; children: React.ReactNode }> = ({ id, background = LIGHT, children }) => (
  <SceneShell frames={framesOf(id)} caption={captionOf(id)} background={background}>{children}</SceneShell>
);

// A screen scene: left column + one or two screenshots on the right.
const ScreenScene: React.FC<{
  id: SceneId; eyebrow: string; title: string; chips: string[]; points: string[];
  shots: string[]; focus?: Array<[number, number]>; swapAt?: number; zoom?: [number, number];
}> = ({ id, eyebrow, title, chips, points, shots, focus, swapAt, zoom }) => (
  <Scene id={id}>
    <LeftInfo eyebrow={eyebrow} title={title} chips={chips} points={points} />
    <Shot shots={shots} box={BOX} frames={framesOf(id)} focus={focus} swapAt={swapAt} zoom={zoom} />
  </Scene>
);

// ---- 1. Title ----
export const S1Title: React.FC = () => (
  <Scene id="S1Title" background={DARK}>
    <div style={{ position: "absolute", left: 160, top: 250, width: 1500 }}>
      <Reveal at={4}><div style={{ display: "inline-block", fontSize: 30, fontWeight: 700, letterSpacing: 3, color: C.accentOnDark, border: `3px solid ${C.accentOnDark}`, borderRadius: 999, padding: "8px 26px" }}>DINAS KOPERASI DAN USAHA MIKRO KOTA BATAM</div></Reveal>
      <Reveal at={12}><div style={{ marginTop: 34, fontSize: 160, lineHeight: 1, fontWeight: 800, color: C.white, letterSpacing: -4 }}>SI-TARI DISKUM</div></Reveal>
      <Reveal at={24}><div style={{ marginTop: 34, fontSize: 48, lineHeight: 1.3, color: "#D1FAE5", width: 1300 }}>Sistem Informasi Tamu &amp; Rapat Internal</div></Reveal>
    </div>
  </Scene>
);

// ---- 2. Before and after (PRD section 1) ----
const BEFORE = ["Buku tamu kertas", "Permohonan lewat WhatsApp pribadi", "Ruang rapat bisa terpakai dua kali", "Daftar hadir diketik ulang", "Bukti SPPD tersebar"];
const AFTER = ["Formulir di ponsel, jam tercatat otomatis", "Satu alur dengan status yang jelas", "Ruangan ganda ditolak sistem", "Presensi QR, langsung jadi PDF", "Semua bukti dalam satu arsip PDF"];
export const S2Sebelum: React.FC = () => {
  const f = useCurrentFrame();
  const after = interpolate(f, [70, 90], [0, 1], { ...clampX, easing: out });
  const card = (bg: string, border: string): React.CSSProperties => ({ flex: 1, background: bg, border: `3px solid ${border}`, borderRadius: 28, padding: "40px 44px" });
  return (
    <Scene id="S2Sebelum">
      <div style={{ position: "absolute", left: 120, top: 90, width: 1680 }}>
        <Reveal at={2}><div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 3, color: C.accentStrong }}>MENGAPA SI-TARI MEMBANTU</div></Reveal>
        <Reveal at={8}><div style={{ marginTop: 10, fontSize: 68, fontWeight: 800, color: C.heading, letterSpacing: -1 }}>Pekerjaan sama, jauh lebih sedikit kertas</div></Reveal>
        <div style={{ marginTop: 48, display: "flex", gap: 36 }}>
          <Reveal at={20} style={card(C.paper, "#D6D3D1")}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 3, color: C.paperInk }}>SEBELUM</div>
            {BEFORE.map((t) => <div key={t} style={{ marginTop: 18, fontSize: 36, lineHeight: 1.25, color: "#44403C" }}>{t}</div>)}
          </Reveal>
          <div style={{ ...card(C.afterBg, "#A7F3D0"), opacity: after, translate: `${interpolate(after, [0, 1], [40, 0])}px 0px` }}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 3, color: C.accentStrong }}>DENGAN SI-TARI</div>
            {AFTER.map((t) => <div key={t} style={{ marginTop: 18, fontSize: 36, lineHeight: 1.25, fontWeight: 600, color: C.afterInk }}>{t}</div>)}
          </div>
        </div>
      </div>
    </Scene>
  );
};

// ---- 3 to 12: the real screens (fictional data) ----
export const S3Dashboard: React.FC = () => (
  <ScreenScene id="S3Dashboard" eyebrow="DASHBOARD" title="Satu layar untuk hari ini" chips={["F1"]}
    points={["Tamu hari ini", "Rapat hari ini", "Kendali SPPD"]} shots={["dashboard.webp"]} focus={[[0.5, 0.2]]} zoom={[1, 1.12]} />
);
export const S4Tld: React.FC = () => (
  <ScreenScene id="S4Tld" eyebrow="TAMU LUAR DAERAH" title="Pengajuan kunjungan" chips={["F3", "F2"]}
    points={["Data rombongan", "Tanggal dan jam", "Surat permohonan dan surat tugas"]} shots={["tld-form.webp", "buku-tamu.webp"]} swapAt={130} focus={[[0.5, 0.8], [0.5, 0.4]]} />
);
export const S5Tdd: React.FC = () => (
  <Scene id="S5Tdd">
    <LeftInfo eyebrow="TAMU DALAM DAERAH" title="Datang langsung, pindai QR" chips={["F4", "F15"]} points={["Pilih Bidang Tujuan", "Nama PIC terlihat", "Jam tercatat otomatis"]} />
    <Shot shots={["tdd-form.webp"]} box={{ left: 640, top: 110, width: 760, height: 700 }} frames={framesOf("S5Tdd")} focus={[[0.5, 0.55]]} zoom={[1, 1.04]} />
    <Phone shot="m-tdd-form.webp" left={1430} top={140} height={680} at={30} />
  </Scene>
);
export const S6Konfirmasi: React.FC = () => (
  <ScreenScene id="S6Konfirmasi" eyebrow="ALUR KUNJUNGAN 1–2" title="Konfirmasi dan disposisi" chips={["F5", "F6"]}
    points={["Periksa surat", "Pilih Bidang Tujuan", "Unggah disposisi"]} shots={["visit-konfirmasi-bottom-crop.webp", "visit-disposisi-crop.webp"]} swapAt={110} />
);
export const S7Notifikasi: React.FC = () => (
  <ScreenScene id="S7Notifikasi" eyebrow="ALUR KUNJUNGAN 3" title="WhatsApp dan ruangan" chips={["F7"]}
    points={["Kabari setiap PIC", "Pesan ruangan dan jam", "Bentrok ditolak"]} shots={["visit-notifikasi-crop.webp"]} focus={[[0.5, 0.75]]} />
);
export const S8Kedatangan: React.FC = () => (
  <ScreenScene id="S8Kedatangan" eyebrow="ALUR KUNJUNGAN 4" title="Kedatangan rombongan" chips={["F8", "F12"]}
    points={["Hadir lewat QR", "Belum hadir terlihat", "VALIDASI setelah selesai"]} shots={["visit-kedatangan-crop.webp"]} focus={[[0.5, 0.75]]} />
);
export const S9Sppd: React.FC = () => (
  <ScreenScene id="S9Sppd" eyebrow="ALUR KUNJUNGAN 5–6" title="SPPD dan arsip" chips={["F9"]}
    points={["Foto kegiatan", "Daftar hadir otomatis", "Unduh satu PDF"]} shots={["visit-sppd-crop.webp", "visit-selesai-crop.webp"]} swapAt={120} />
);
export const S10Rapat: React.FC = () => (
  <ScreenScene id="S10Rapat" eyebrow="JADWAL RAPAT" title="Rapat tanpa bentrok" chips={["F10", "F11"]}
    points={["Empat ruangan", "Tunda, ulang, kunci, batal", "Kalender agenda"]} shots={["jadwal-rapat.webp", "kalender-agenda-crop.webp"]} swapAt={115} focus={[[0.5, 0.3], [0.5, 0.5]]} />
);
export const S11Presensi: React.FC = () => (
  <Scene id="S11Presensi">
    <LeftInfo eyebrow="PRESENSI" title="Cukup pindai QR" chips={["F12"]} points={["QR di layar rapat", "Pilih nama sendiri", "NIP dan jabatan terisi"]} />
    <Shot shots={["presensi-qr-crop.webp"]} box={{ left: 680, top: 110, width: 700, height: 720 }} frames={framesOf("S11Presensi")} />
    <Phone shot="m-presensi.webp" left={1420} top={110} height={700} at={60} />
  </Scene>
);
export const S12Notula: React.FC = () => (
  <ScreenScene id="S12Notula" eyebrow="NOTULA DAN LAPORAN" title="E-Notula dan laporan bulanan" chips={["F13", "F14"]}
    points={["Template resmi A4", "Peserta dari presensi", "Laporan PDF atau PNG"]} shots={["e-notula-crop.webp", "lainnya.webp"]} swapAt={110} focus={[[0.5, 0.3], [0.5, 0.45]]} />
);

// ---- 13. Closing ----
export const S13Tutup: React.FC = () => (
  <Scene id="S13Tutup" background={DARK}>
    <div style={{ position: "absolute", left: 160, top: 270, width: 1500 }}>
      <Reveal at={4}><div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 3, color: C.accentOnDark }}>TERIMA KASIH</div></Reveal>
      <Reveal at={12}><div style={{ marginTop: 24, fontSize: 130, lineHeight: 1, fontWeight: 800, color: C.white, letterSpacing: -3 }}>SI-TARI DISKUM</div></Reveal>
      <Reveal at={24}><div style={{ marginTop: 34, fontSize: 46, lineHeight: 1.3, color: "#D1FAE5", width: 1300 }}>Tamu tercatat, rapat tertata, bukti kegiatan lengkap.</div></Reveal>
    </div>
  </Scene>
);
