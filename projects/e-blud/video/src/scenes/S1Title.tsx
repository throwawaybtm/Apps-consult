import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

export const S1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = (from: number) => interpolate(frame, [from, from + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const markScale = spring({ frame: frame - 6, fps, config: { damping: 14 } });
  return (
    <SceneShell frames={framesOf("S1Title")} caption={captionOf("S1Title")} background={`radial-gradient(circle at 82% 12%, rgba(125,211,252,0.28), transparent 40%), radial-gradient(circle at 8% 92%, rgba(3,105,161,0.55), transparent 48%), ${C.navy}`}>
      <div style={{ position: "absolute", left: 180, top: 110 }}>
        <div style={{ width: 150, height: 150, borderRadius: 38, background: C.white, color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, fontWeight: 700, scale: markScale }}>eB</div>
        <div style={{ fontSize: 230, lineHeight: 1, fontWeight: 700, color: C.white, letterSpacing: -8, marginTop: 40, opacity: fade(14), translate: `0px ${interpolate(fade(14), [0, 1], [24, 0])}px` }}>e-BLUD</div>
        <div style={{ fontSize: 62, lineHeight: 1.2, color: C.halo, marginTop: 26, width: 1500, opacity: fade(30) }}>Sistem digital untuk BLUD Diskum Batam</div>
        <div style={{ display: "inline-block", marginTop: 44, background: C.warnBg, color: C.warn, borderRadius: 40, padding: "10px 34px", fontSize: 40, fontWeight: 600, opacity: fade(46) }}>Contoh tampilan · Draft v0</div>
      </div>
    </SceneShell>
  );
};
