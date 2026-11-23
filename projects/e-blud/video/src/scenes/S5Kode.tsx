import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import rects from "../rects.json";
import { BrowserFrame } from "../components/BrowserFrame";
import { Highlight } from "../components/Highlight";
import { LeftInfo } from "../components/LeftInfo";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

const A = (rects as any).confirm;
const B = (rects as any).track;

// F3 (code after sending) and F14 (tracking by code): two states, cross-faded.
export const S5Kode: React.FC = () => {
  const frame = useCurrentFrame();
  const toB = interpolate(frame, [100, 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <SceneShell frames={framesOf("S5Kode")} caption={captionOf("S5Kode")} background={`linear-gradient(180deg, ${C.tint}, #E0F2FE)`}>
      <LeftInfo eyebrow="Contoh layar 2 dan 1" title="Kode dan pelacakan" chips={["F3", "F14"]} />
      <BrowserFrame shot="confirm.png" pageHeight={A.height} panFrames={[0, 1]} panY={[0, 0]} opacity={1 - toB}>
        <Highlight rect={A.card} label="Kode permohonan, status Menunggu verifikasi" n={1} at={22} below />
      </BrowserFrame>
      <BrowserFrame shot="track.png" pageHeight={B.height} panFrames={[100, 140]} panY={[1516, 1516]} opacity={toB}>
        <Highlight rect={B.result} label="Tahap permohonan terlihat" n={2} at={150} below />
      </BrowserFrame>
    </SceneShell>
  );
};
