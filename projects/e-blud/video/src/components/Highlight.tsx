import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { FW, SCALE } from "./BrowserFrame";

export type Rect = { x: number; y: number; w: number; h: number };

// An orange outline around an element of the screenshot, with a numbered label. Place it inside
// BrowserFrame so it moves with the page. `at` is the frame where it appears.
export const Highlight: React.FC<{ rect: Rect; label: string; n: number; at: number; until?: number; pad?: number; below?: boolean; labelRight?: boolean }> = ({ rect, label, n, at, until, pad = 10, below = false, labelRight = false }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const out = until === undefined ? 1 : interpolate(frame, [until - 10, until], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = (rect.x - pad) * SCALE;
  const y = (rect.y - pad) * SCALE;
  const w = (rect.w + pad * 2) * SCALE;
  const h = (rect.h + pad * 2) * SCALE;
  const labelTop = below ? y + h + 10 : y - 64;
  return (
    <div style={{ opacity: t * out }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", border: `6px solid ${C.pin}`, borderRadius: 16, scale: interpolate(t, [0, 1], [0.97, 1]) }} />
      <div style={{ position: "absolute", ...(labelRight ? { right: FW - (x + w) } : { left: x }), top: labelTop, display: "flex", alignItems: "center", gap: 12, background: C.pin, color: C.white, borderRadius: 32, padding: "8px 24px 8px 8px", fontSize: 32, fontWeight: 600, whiteSpace: "nowrap", translate: `0px ${interpolate(t, [0, 1], [10, 0])}px` }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: C.white, color: C.pin, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700 }}>{n}</div>
        {label}
      </div>
    </div>
  );
};
