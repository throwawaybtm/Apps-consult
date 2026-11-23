import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { useInter } from "../components/SceneShell";
import { C } from "../theme";
import { meta3, SceneId3 } from "./theme3";

// Caption that pops in word by word. All words are laid out from the start, so nothing jumps.
const Caption3: React.FC<{ text: string; at: number; frames: number }> = ({ text, at, frames }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const box = interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [frames - 12, frames - 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", justifyContent: "center", opacity: box * out }}>
      <div style={{ background: "rgba(11,37,64,0.94)", borderRadius: 30, padding: "20px 44px", maxWidth: 1680, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 14, rowGap: 0, fontSize: 46, lineHeight: 1.25, fontWeight: 600, color: C.white }}>
        {words.map((w, i) => {
          const t = interpolate(frame, [at + 3 + i * 2, at + 11 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
          return (
            <span key={i} style={{ opacity: t, translate: `0px ${interpolate(t, [0, 1], [14, 0])}px`, display: "inline-block" }}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// One scene of version 3: background, a quick fade, and the animated caption.
export const SceneShell3: React.FC<{ id: SceneId3; background: string; children: React.ReactNode }> = ({ id, background, children }) => {
  useInter();
  const { frames, caption, captionAt } = meta3(id);
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 5, frames - 5, frames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background, fontFamily: "Inter, Arial, sans-serif", opacity }}>
      {children}
      <Caption3 text={caption} at={captionAt} frames={frames} />
    </AbsoluteFill>
  );
};
