import React from "react";
import rects from "../rects.json";
import { BrowserFrame } from "../components/BrowserFrame";
import { Highlight } from "../components/Highlight";
import { LeftInfo } from "../components/LeftInfo";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

const R = (rects as any).dashboard;

// F9 (dashboard) with F3 (permohonan masuk) and F7, F8 (daftar pinjaman).
export const S6Dashboard: React.FC = () => (
  <SceneShell frames={framesOf("S6Dashboard")} caption={captionOf("S6Dashboard")} background={`linear-gradient(180deg, ${C.tint}, #E0F2FE)`}>
    <LeftInfo eyebrow="Contoh layar 3 dari 5" title="Dashboard petugas" chips={["F9", "F3", "F7", "F8"]} />
    <BrowserFrame shot="dashboard.png" pageHeight={R.height} panFrames={[0, 150, 190, 240]} panY={[0, 0, 698, 698]}>
      <Highlight rect={R.alert} label="Permohonan online menunggu" n={1} at={14} until={70} below />
      <Highlight rect={R.kpi} label="Angka pencairan dan cicilan" n={2} at={64} until={120} below />
      <Highlight rect={R.chart} label="Grafik dengan tabel data" n={3} at={114} until={158} />
      <Highlight rect={R.table} label="Daftar pinjaman, filter status" n={4} at={200} />
    </BrowserFrame>
  </SceneShell>
);
