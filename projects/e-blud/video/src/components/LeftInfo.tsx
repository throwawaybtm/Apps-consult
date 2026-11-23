import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

// Left column of the screen scenes: which screen, and which PRD features it shows.
export const LeftInfo: React.FC<{ eyebrow: string; title: string; chips: string[] }> = ({ eyebrow, title, chips }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  return (
    <div style={{ position: "absolute", left: 96, top: 120, width: 470, opacity: t, translate: `${interpolate(t, [0, 1], [-30, 0])}px 0px` }}>
      <div style={{ fontSize: 32, fontWeight: 600, color: C.brand }}>{eyebrow}</div>
      <div style={{ fontSize: 68, lineHeight: 1.08, fontWeight: 700, color: C.navy, letterSpacing: -1.5, marginTop: 14 }}>{title}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
        {chips.map((c) => (
          <div key={c} style={{ background: C.halo, color: C.brandDark, borderRadius: 30, padding: "6px 22px", fontSize: 32, fontWeight: 600 }}>{c}</div>
        ))}
      </div>
    </div>
  );
};
