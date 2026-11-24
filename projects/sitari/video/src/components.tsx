import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useDelayRender } from "remotion";
import { C } from "./theme";

// ---- Font: Plus Jakarta Sans (the app's own font, TrueType, SIL OFL), loaded before the first frame ----
const FACES: Array<[string, string]> = [
  ["400", "PlusJakartaSans-400.ttf"],
  ["600", "PlusJakartaSans-600.ttf"],
  ["700", "PlusJakartaSans-700.ttf"],
  ["800", "PlusJakartaSans-800.ttf"],
];
export const FONT = '"Plus Jakarta Sans", Arial, sans-serif';

const useFont = () => {
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Plus Jakarta Sans"));
  useEffect(() => {
    Promise.all(
      FACES.map(async ([weight, file]) => {
        const face = new FontFace("Plus Jakarta Sans", `url(${staticFile("fonts/" + file)})`, { weight });
        await face.load();
        document.fonts.add(face);
      })
    ).then(() => continueRender(handle));
  }, [continueRender, handle]);
};

export const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const out = Easing.bezier(0.16, 1, 0.3, 1);
const ease = Easing.bezier(0.45, 0, 0.2, 1);

// ---- Caption under every scene: the video must make sense on mute ----
const Caption: React.FC<{ text: string; frames: number }> = ({ text, frames }) => {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [8, 22], [0, 1], { ...clampX, easing: out });
  const outT = interpolate(frame, [frames - 14, frames - 4], [1, 0], clampX);
  return (
    <div style={{ position: "absolute", left: 120, right: 120, bottom: 40, display: "flex", justifyContent: "center", opacity: inT * outT, translate: `0px ${interpolate(inT, [0, 1], [20, 0])}px` }}>
      <div style={{ background: "rgba(15,23,42,0.94)", color: C.white, borderRadius: 30, padding: "20px 44px", fontSize: 40, lineHeight: 1.28, fontWeight: 600, textAlign: "center", maxWidth: 1680 }}>{text}</div>
    </div>
  );
};

// One scene: background, a short fade in and out, and the caption.
export const SceneShell: React.FC<{ frames: number; caption: string; background: string; children: React.ReactNode }> = ({ frames, caption, background, children }) => {
  useFont();
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, frames - 8, frames], [0, 1, 1, 0], clampX);
  return (
    <AbsoluteFill style={{ background, fontFamily: FONT, opacity }}>
      {children}
      <Caption text={caption} frames={frames} />
    </AbsoluteFill>
  );
};

// Fades and slides a block in, `at` frames after the scene starts.
export const Reveal: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 16], [0, 1], { ...clampX, easing: out });
  return <div style={{ opacity: t, translate: `0px ${interpolate(t, [0, 1], [24, 0])}px`, ...style }}>{children}</div>;
};

// ---- A real screenshot (fictional data) that zooms slowly towards a focus point ----
// `shots`: one or more images; with two, the second crossfades in at `swapAt`.
export const Shot: React.FC<{
  shots: string[];
  box: { left: number; top: number; width: number; height: number };
  frames: number;
  focus?: Array<[number, number]>; // per shot, 0..1 of the image
  zoom?: [number, number];
  swapAt?: number;
  radius?: number;
}> = ({ shots, box, frames, focus = [], zoom = [1, 1.06], swapAt = 0, radius = 22 }) => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [2, 20], [0, 1], { ...clampX, easing: out });
  return (
    <div style={{ position: "absolute", ...box, opacity: enter, scale: interpolate(enter, [0, 1], [0.98, 1]) }}>
      {shots.map((s, i) => {
        const start = i === 0 ? 0 : swapAt;
        const end = i === 0 && shots.length > 1 ? swapAt + 12 : frames;
        const o = shots.length === 1 ? 1 : i === 0 ? interpolate(f, [swapAt, swapAt + 12], [1, 0], clampX) : interpolate(f, [swapAt, swapAt + 12], [0, 1], clampX);
        const z = interpolate(f, [start, end], zoom, { ...clampX, easing: ease });
        const [fx, fy] = focus[i] ?? [0.5, 0.5];
        return (
          <div key={s} style={{ position: "absolute", inset: 0, opacity: o, overflow: "hidden", borderRadius: radius }}>
            <Img src={staticFile("shots/" + s)} style={{ width: "100%", height: "100%", objectFit: "contain", scale: String(z), transformOrigin: `${fx * 100}% ${fy * 100}%` }} />
          </div>
        );
      })}
    </div>
  );
};

// A phone frame around a phone screenshot.
export const Phone: React.FC<{ shot: string; left: number; top: number; height?: number; at?: number }> = ({ shot, left, top, height = 760, at = 6 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 18], [0, 1], { ...clampX, easing: out });
  const width = Math.round(height * (1170 / 1992));
  return (
    <div style={{ position: "absolute", left, top, width: width + 24, height: height + 24, borderRadius: 48, background: C.heading, padding: 12, boxSizing: "border-box", opacity: t, translate: `0px ${interpolate(t, [0, 1], [30, 0])}px`, boxShadow: "0 30px 70px rgba(15,23,42,0.35)" }}>
      <Img src={staticFile("shots/" + shot)} style={{ width, height, borderRadius: 36, objectFit: "cover", display: "block" }} />
    </div>
  );
};

// ---- Left column of a screen scene: what this is, and the PRD features it shows ----
export const LeftInfo: React.FC<{ eyebrow: string; title: string; chips: string[]; points?: string[] }> = ({ eyebrow, title, chips, points = [] }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [4, 20], [0, 1], { ...clampX, easing: out });
  return (
    <div style={{ position: "absolute", left: 96, top: 96, width: 500, opacity: t, translate: `0px ${interpolate(t, [0, 1], [16, 0])}px` }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {chips.map((c) => (
          <div key={c} style={{ background: C.white, color: C.primary, border: "3px solid #99D5C3", borderRadius: 999, padding: "4px 20px", fontSize: 30, fontWeight: 800 }}>{c}</div>
        ))}
      </div>
      <div style={{ marginTop: 24, fontSize: 28, fontWeight: 700, letterSpacing: 2, color: C.accentStrong }}>{eyebrow}</div>
      <div style={{ marginTop: 10, fontSize: 58, lineHeight: 1.08, fontWeight: 800, color: C.heading, letterSpacing: -1 }}>{title}</div>
      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
        {points.map((p, i) => (
          <Reveal key={p} at={26 + i * 18}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", fontSize: 32, lineHeight: 1.3, color: C.body }}>
              <div style={{ marginTop: 12, width: 14, height: 14, borderRadius: 7, background: C.accentStrong, flexShrink: 0 }} />
              {p}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};
