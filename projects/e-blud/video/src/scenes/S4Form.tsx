import React from "react";
import rects from "../rects.json";
import { BrowserFrame } from "../components/BrowserFrame";
import { Highlight } from "../components/Highlight";
import { LeftInfo } from "../components/LeftInfo";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

const R = (rects as any).form;

// F3 (permohonan pembiayaan, filled in by the mitra) and F13 (public site).
export const S4Form: React.FC = () => (
  <SceneShell frames={framesOf("S4Form")} caption={captionOf("S4Form")} background={`linear-gradient(180deg, ${C.tint}, #E0F2FE)`}>
    <LeftInfo eyebrow="Contoh layar 2 dari 5" title="Formulir pengajuan online" chips={["F3", "F13"]} />
    <BrowserFrame shot="form.png" pageHeight={R.height} panFrames={[0, 100, 140, 200, 240, 300]} panY={[0, 0, 1000, 1000, 2043, 2043]}>
      <Highlight rect={R.diri} label="Data diri, tanpa akun" n={1} at={16} until={96} />
      <Highlight rect={R.privat} label="Dokumen disimpan privat" n={2} at={50} until={96} />
      <Highlight rect={{ ...R.docs, h: 150 }} label="Unggah dokumen persyaratan" n={3} at={150} until={208} below />
      <Highlight rect={R.setuju} label="Persetujuan data pribadi" n={4} at={252} />
    </BrowserFrame>
  </SceneShell>
);
