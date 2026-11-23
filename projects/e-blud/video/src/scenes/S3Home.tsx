import React from "react";
import rects from "../rects.json";
import { BrowserFrame } from "../components/BrowserFrame";
import { Highlight } from "../components/Highlight";
import { LeftInfo } from "../components/LeftInfo";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

const R = (rects as any).home;

// F13 (situs publik) and F14 (lacak permohonan).
export const S3Home: React.FC = () => (
  <SceneShell frames={framesOf("S3Home")} caption={captionOf("S3Home")} background={`linear-gradient(180deg, ${C.tint}, #E0F2FE)`}>
    <LeftInfo eyebrow="Contoh layar 1 dari 5" title="Beranda situs publik" chips={["F13", "F14"]} />
    <BrowserFrame shot="home.png" pageHeight={R.height} panFrames={[0, 50, 100, 150, 200, 240]} panY={[0, 0, 640, 640, 1516, 1516]}>
      <Highlight rect={R.cta} label="Ajukan pembiayaan" n={1} at={14} until={62} below />
      <Highlight rect={R.stats} label="Angka gabungan, tanpa data pribadi" n={2} at={104} until={158} />
      <Highlight rect={R.track} label="Lacak permohonan dengan kode" n={3} at={204} />
    </BrowserFrame>
  </SceneShell>
);
