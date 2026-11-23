import React from "react";
import rects from "../rects.json";
import { BrowserFrame } from "../components/BrowserFrame";
import { Highlight } from "../components/Highlight";
import { LeftInfo } from "../components/LeftInfo";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

const R = (rects as any).rule;

// F5 (validasi aturan) and F6 (tanggal pencairan). The 28th-of-the-month rule is an example from the
// reference system; the real Batam rule is still an open question for the client.
export const S8Aturan: React.FC = () => (
  <SceneShell frames={framesOf("S8Aturan")} caption={captionOf("S8Aturan")} background={`linear-gradient(180deg, ${C.tint}, #E0F2FE)`}>
    <LeftInfo eyebrow="Contoh layar 5 dari 5" title="Input permohonan langsung" chips={["F3", "F5", "F6"]} />
    <BrowserFrame shot="rule.png" pageHeight={R.height} panFrames={[0, 1]} panY={[0, 0]} zoom={{ frames: [0, 70, 210], scale: [1, 1.12, 1.12], origin: { x: 600, y: 690 } }}>
      <Highlight rect={R.hint} label="Aturan contoh: paling lambat tanggal 28" n={1} at={24} />
      <Highlight rect={R.error} label="Tanggal 29 ditolak otomatis" n={2} at={96} below />
    </BrowserFrame>
  </SceneShell>
);
