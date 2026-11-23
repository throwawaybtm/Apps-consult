import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { C, captionOf, framesOf } from "../theme";

const ITEMS: Array<[string, string]> = [
  ["Alur kerja", "Mengikuti sistem rujukan, perlu dikoreksi"],
  ["Aturan pembiayaan", "Batas, jasa, denda, dan tanggal pencairan"],
  ["Peran petugas", "Peran yang ada di Diskum Batam"],
];

export const S10Asumsi: React.FC = () => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const head = interpolate(frame, [6, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <SceneShell frames={framesOf("S10Asumsi")} caption={captionOf("S10Asumsi")} background={C.navy}>
      <div style={{ position: "absolute", left: 120, top: 130, opacity: head }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: C.sky }}>Sebelum PRD disetujui</div>
        <div style={{ fontSize: 120, lineHeight: 1, fontWeight: 700, color: C.white, letterSpacing: -3, marginTop: 14 }}>Masih asumsi</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 400, width: 1680, display: "flex", gap: 28 }}>
        {ITEMS.map(([title, text], i) => {
          const t = interpolate(frame, [30 + i * 36, 48 + i * 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
          return (
            <div key={title} style={{ boxSizing: "border-box", flex: 1, background: C.navy2, border: "2px solid #1E4A75", borderRadius: 26, padding: 40, opacity: t, translate: `0px ${interpolate(t, [0, 1], [28, 0])}px` }}>
              <div style={{ display: "inline-block", background: C.warnBg, color: C.warn, borderRadius: 30, padding: "4px 22px", fontSize: 30, fontWeight: 700 }}>asumsi</div>
              <div style={{ fontSize: 56, lineHeight: 1.1, fontWeight: 700, color: C.white, marginTop: 24 }}>{title}</div>
              <div style={{ fontSize: 34, lineHeight: 1.3, color: "#C9DDEB", marginTop: 16 }}>{text}</div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};
