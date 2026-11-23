import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

export const S11Tutup: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = (from: number) => interpolate(frame, [from, from + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <SceneShell frames={framesOf("S11Tutup")} caption={captionOf("S11Tutup")} background={`radial-gradient(circle at 80% 10%, rgba(125,211,252,0.25), transparent 42%), ${C.navy}`}>
      <div style={{ position: "absolute", left: 180, top: 230, opacity: fade(6) }}>
        <div style={{ width: 120, height: 120, borderRadius: 30, background: C.white, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: 700 }}>eB</div>
        <div style={{ fontSize: 170, lineHeight: 1, fontWeight: 700, color: C.white, letterSpacing: -5, marginTop: 36 }}>Terima kasih</div>
        <div style={{ fontSize: 40, color: C.halo, marginTop: 36, opacity: fade(30) }}>e-BLUD · Draft v0 · Contoh tampilan, bukan desain akhir</div>
      </div>
    </SceneShell>
  );
};
