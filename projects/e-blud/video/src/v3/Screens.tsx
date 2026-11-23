import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import rects from "../rects.json";
import { BrowserFrame } from "../components/BrowserFrame";
import { Highlight } from "../components/Highlight";
import { LeftInfo } from "../components/LeftInfo";
import { C } from "../theme";
import { SceneShell3 } from "./SceneShell3";

const BG = `linear-gradient(180deg, ${C.tint}, #E0F2FE)`;
const R = rects as any;
const fade = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Scene 3: public home. F13 (situs publik), F14 (lacak permohonan).
export const V3Home: React.FC = () => (
  <SceneShell3 id="V3Home" background={BG}>
    <LeftInfo eyebrow="Contoh layar 1 dari 5" title="Beranda situs publik" chips={["F13", "F14"]} />
    <BrowserFrame
      shot="home.png" pageHeight={R.home.height}
      panFrames={[0, 28, 56, 110, 138, 210]} panY={[0, 0, 640, 640, 1516, 1516]}
      zoomKeys={{ frames: [0, 10, 34, 60, 70, 104, 134, 146, 210], scale: [1, 1.22, 1.22, 1, 1.16, 1.16, 1, 1.2, 1.2], ox: [244, 244, 244, 720, 720, 720, 426, 426, 426], oy: [555, 555, 555, 943, 943, 943, 2141, 2141, 2141] }}
    >
      <Highlight rect={R.home.cta} label="Ajukan pembiayaan" n={1} at={10} until={46} below />
      <Highlight rect={R.home.stats} label="Angka gabungan, tanpa data pribadi" n={2} at={68} until={114} />
      <Highlight rect={R.home.track} label="Lacak permohonan dengan kode" n={3} at={150} />
    </BrowserFrame>
  </SceneShell3>
);

// Scene 4: online form. F3 (permohonan), F13.
export const V4Form: React.FC = () => (
  <SceneShell3 id="V4Form" background={BG}>
    <LeftInfo eyebrow="Contoh layar 2 dari 5" title="Formulir pengajuan online" chips={["F3", "F13"]} />
    <BrowserFrame
      shot="form.png" pageHeight={R.form.height}
      panFrames={[0, 64, 96, 150, 182, 240]} panY={[0, 0, 1000, 1000, 2043, 2043]}
      zoomKeys={{ frames: [0, 8, 58, 70, 100, 108, 150, 176, 190, 240], scale: [1, 1.12, 1.12, 1, 1, 1.2, 1.2, 1, 1.22, 1.22], ox: [548, 548, 548, 548, 548, 548, 548, 562, 562, 562], oy: [630, 630, 630, 1468, 1468, 1468, 1468, 2588, 2588, 2588] }}
    >
      <Highlight rect={R.form.diri} label="Data diri, tanpa akun" n={1} at={8} until={64} />
      <Highlight rect={R.form.privat} label="Dokumen disimpan privat" n={2} at={36} until={68} />
      <Highlight rect={{ ...R.form.docs, h: 118 }} label="Unggah dokumen persyaratan" n={3} at={104} until={170} below />
      <Highlight rect={R.form.setuju} label="Persetujuan data pribadi" n={4} at={196} />
    </BrowserFrame>
  </SceneShell3>
);

// Scene 5: code after sending (F3) and tracking by code (F14), cross-faded.
export const V5Kode: React.FC = () => {
  const frame = useCurrentFrame();
  const toB = fade(frame, 80, 96);
  return (
    <SceneShell3 id="V5Kode" background={BG}>
      <LeftInfo eyebrow="Contoh layar 2 dan 1" title="Kode dan pelacakan" chips={["F3", "F14"]} />
      <BrowserFrame shot="confirm.png" pageHeight={R.confirm.height} panFrames={[0, 1]} panY={[0, 0]} opacity={1 - toB}
        zoomKeys={{ frames: [0, 12, 70], scale: [1, 1.15, 1.15], ox: [720, 720, 720], oy: [440, 440, 440] }}>
        <Highlight rect={R.confirm.card} label="Kode permohonan, status Menunggu verifikasi" n={1} at={12} below />
      </BrowserFrame>
      <BrowserFrame shot="track.png" pageHeight={R.track.height} panFrames={[0, 1]} panY={[1516, 1516]} opacity={toB}
        zoomKeys={{ frames: [92, 108, 170], scale: [1, 1.1, 1.1], ox: [900, 900, 900], oy: [2127, 2127, 2127] }}>
        <Highlight rect={R.track.result} label="Tahap permohonan terlihat" n={2} at={112} below />
      </BrowserFrame>
    </SceneShell3>
  );
};

// Scene 6: staff dashboard. F9, with F3 (permohonan masuk) and F7, F8 (daftar pinjaman).
export const V6Dashboard: React.FC = () => (
  <SceneShell3 id="V6Dashboard" background={BG}>
    <LeftInfo eyebrow="Contoh layar 3 dari 5" title="Dashboard petugas" chips={["F9", "F3", "F7", "F8"]} />
    <BrowserFrame
      shot="dashboard.png" pageHeight={R.dashboard.height}
      panFrames={[0, 76, 104, 150]} panY={[0, 0, 698, 698]}
      zoomKeys={{ frames: [0, 8, 34, 60, 76, 106, 120, 150], scale: [1, 1.15, 1.15, 1, 1, 1, 1.12, 1.12], ox: [848, 848, 848, 848, 848, 848, 848, 848], oy: [230, 230, 230, 352, 352, 352, 1250, 1250] }}
    >
      <Highlight rect={R.dashboard.alert} label="Permohonan online menunggu" n={1} at={6} until={38} below />
      <Highlight rect={R.dashboard.kpi} label="Angka pencairan dan cicilan" n={2} at={32} until={68} below />
      <Highlight rect={R.dashboard.chart} label="Grafik dengan tabel data" n={3} at={60} until={86} />
      <Highlight rect={R.dashboard.table} label="Daftar pinjaman, filter status" n={4} at={108} />
    </BrowserFrame>
  </SceneShell3>
);

// Scene 8: verification. F2 (data mitra), F3 (verifikasi) and F4 (lanjut ke survei), cross-faded.
export const V8Verifikasi: React.FC = () => {
  const frame = useCurrentFrame();
  const toB = fade(frame, 166, 180);
  const A = R.verifikasi;
  const B = R["verifikasi-ok"];
  return (
    <SceneShell3 id="V8Verifikasi" background={BG}>
      <LeftInfo eyebrow="Contoh layar 4 dari 5" title="Verifikasi permohonan" chips={["F2", "F3", "F4"]} />
      <BrowserFrame shot="verifikasi.png" pageHeight={A.height} panFrames={[0, 70, 96, 170]} panY={[0, 0, 445, 445]} opacity={1 - toB}
        zoomKeys={{ frames: [0, 8, 50, 56, 98, 106, 114, 176], scale: [1, 1.15, 1.15, 1.12, 1.12, 1, 1.18, 1.18], ox: [589, 589, 589, 1157, 1157, 848, 848, 848], oy: [443, 443, 443, 545, 545, 1131, 1131, 1131] }}>
        <Highlight rect={A.diri} label="Data pemohon, cek NIK ganda" n={1} at={8} until={54} />
        <Highlight rect={A.docs} label="Dokumen: buka, tandai sesuai" n={2} at={48} until={102} labelRight />
        <Highlight rect={A.putusan} label="Keputusan: survei, perbaikan, tolak" n={3} at={112} />
      </BrowserFrame>
      <BrowserFrame shot="verifikasi-ok.png" pageHeight={B.height} panFrames={[166, 190, 220]} panY={[445, 445, 0]} opacity={toB}>
        <Highlight rect={B.notif} label="Diverifikasi, lanjut ke survei" n={4} at={196} below />
      </BrowserFrame>
    </SceneShell3>
  );
};

// Scene 9: rule check. F5 (validasi aturan), F6 (tanggal pencairan). The 28th-of-the-month rule is an
// example from the reference system; the real Batam rule is an open question for the client.
export const V9Aturan: React.FC = () => (
  <SceneShell3 id="V9Aturan" background={BG}>
    <LeftInfo eyebrow="Contoh layar 5 dari 5" title="Input permohonan langsung" chips={["F3", "F5", "F6"]} />
    <BrowserFrame shot="rule.png" pageHeight={R.rule.height} panFrames={[0, 1]} panY={[0, 0]}
      zoomKeys={{ frames: [0, 28, 180], scale: [1, 1.25, 1.25], ox: [600, 600, 600], oy: [690, 690, 690] }}>
      <Highlight rect={R.rule.hint} label="Aturan contoh: paling lambat tanggal 28" n={1} at={10} />
      <Highlight rect={R.rule.error} label="Tanggal 29 ditolak otomatis" n={2} at={66} below />
    </BrowserFrame>
  </SceneShell3>
);
