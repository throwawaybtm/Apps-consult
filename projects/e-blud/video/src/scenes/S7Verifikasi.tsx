import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import rects from "../rects.json";
import { BrowserFrame } from "../components/BrowserFrame";
import { Highlight } from "../components/Highlight";
import { LeftInfo } from "../components/LeftInfo";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

const A = (rects as any).verifikasi;
const B = (rects as any)["verifikasi-ok"];

// F2 (data mitra), F3 (verifikasi permohonan) and F4 (lanjut ke survei): two states, cross-faded.
export const S7Verifikasi: React.FC = () => {
  const frame = useCurrentFrame();
  const toB = interpolate(frame, [228, 246], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <SceneShell frames={framesOf("S7Verifikasi")} caption={captionOf("S7Verifikasi")} background={`linear-gradient(180deg, ${C.tint}, #E0F2FE)`}>
      <LeftInfo eyebrow="Contoh layar 4 dari 5" title="Verifikasi permohonan" chips={["F2", "F3", "F4"]} />
      <BrowserFrame shot="verifikasi.png" pageHeight={A.height} panFrames={[0, 120, 160, 300]} panY={[0, 0, 445, 445]} opacity={1 - toB}>
        <Highlight rect={A.diri} label="Data pemohon, cek NIK ganda" n={1} at={16} until={76} />
        <Highlight rect={A.docs} label="Dokumen: buka, tandai sesuai" n={2} at={70} until={126} labelRight />
        <Highlight rect={A.putusan} label="Keputusan: survei, perbaikan, tolak" n={3} at={170} />
      </BrowserFrame>
      <BrowserFrame shot="verifikasi-ok.png" pageHeight={B.height} panFrames={[228, 250, 282]} panY={[445, 445, 0]} opacity={toB}>
        <Highlight rect={B.notif} label="Diverifikasi, lanjut ke survei" n={4} at={262} below />
      </BrowserFrame>
    </SceneShell>
  );
};
