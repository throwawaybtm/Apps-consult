import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useDelayRender } from "remotion";
import { C } from "./theme";

// ---- Font: Plus Jakarta Sans (TrueType) from public/fonts, loaded before the first frame ----
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

const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

// ---- Caption under every scene ----
const Caption: React.FC<{ text: string; frames: number }> = ({ text, frames }) => {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [8, 22], [0, 1], { ...clampX, easing: out });
  const outT = interpolate(frame, [frames - 14, frames - 4], [1, 0], clampX);
  return (
    <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", justifyContent: "center", opacity: inT * outT, translate: `0px ${interpolate(inT, [0, 1], [20, 0])}px` }}>
      <div style={{ background: "rgba(15,31,77,0.94)", color: C.white, borderRadius: 30, padding: "20px 44px", fontSize: 44, lineHeight: 1.25, fontWeight: 600, textAlign: "center", maxWidth: 1680 }}>{text}</div>
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

// ---- Mockup screenshot in a browser frame that pans over time ----
export const FW = 1216;
export const VH = 760;
export const BAR = 44;
export const SCALE = FW / 1440;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

export const BrowserFrame: React.FC<{ shot: string; pageHeight: number; panFrames: number[]; panY: number[]; children?: React.ReactNode }> = ({ shot, pageHeight, panFrames, panY, children }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, panFrames, panY.map((v) => -v * SCALE), { ...clampX, easing: ease });
  return (
    <div style={{ position: "absolute", left: 608, top: 48, width: FW, height: VH + BAR, borderRadius: 22, overflow: "hidden", background: C.white, boxShadow: "0 30px 80px rgba(15,31,77,0.35)" }}>
      <div style={{ height: BAR, background: C.navy, display: "flex", alignItems: "center", gap: 10, paddingLeft: 20 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.35)" }} />)}
        <div style={{ marginLeft: 16, fontSize: 24, color: C.halo }}>Contoh tampilan</div>
      </div>
      <div style={{ position: "relative", width: FW, height: VH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: FW, height: pageHeight * SCALE, translate: `0px ${y}px` }}>
          <Img src={staticFile("shots/" + shot)} style={{ display: "block", width: FW, height: pageHeight * SCALE }} />
          {children}
        </div>
      </div>
    </div>
  );
};

export type Rect = { x: number; y: number; w: number; h: number };

// An orange outline around an element of the screenshot, with a numbered label. Place it inside BrowserFrame.
export const Highlight: React.FC<{ rect: Rect; label: string; n: number; at: number; until?: number; pad?: number; below?: boolean; labelRight?: boolean }> = ({ rect, label, n, at, until, pad = 10, below = false, labelRight = false }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 14], [0, 1], { ...clampX, easing: out });
  const o = until === undefined ? 1 : interpolate(frame, [until - 10, until], [1, 0], clampX);
  const x = (rect.x - pad) * SCALE;
  const y = (rect.y - pad) * SCALE;
  const w = (rect.w + pad * 2) * SCALE;
  const h = (rect.h + pad * 2) * SCALE;
  const labelTop = below ? y + h + 10 : y - 64;
  return (
    <div style={{ opacity: t * o }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", border: `6px solid ${C.pin}`, borderRadius: 16, scale: interpolate(t, [0, 1], [0.97, 1]) }} />
      <div style={{ position: "absolute", ...(labelRight ? { right: FW - (x + w) } : { left: x }), top: labelTop, display: "flex", alignItems: "center", gap: 12, background: C.pin, color: C.white, borderRadius: 32, padding: "8px 24px 8px 8px", fontSize: 30, fontWeight: 600, whiteSpace: "nowrap", translate: `0px ${interpolate(t, [0, 1], [10, 0])}px` }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: C.white, color: C.pin, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>{n}</div>
        {label}
      </div>
    </div>
  );
};

// ---- Left column of a screen scene: which screen, and the PRD features it shows ----
export const LeftInfo: React.FC<{ eyebrow: string; title: string; chips: string[] }> = ({ eyebrow, title, chips }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [4, 20], [0, 1], { ...clampX, easing: out });
  return (
    <div style={{ position: "absolute", left: 96, top: 120, width: 460, opacity: t, translate: `0px ${interpolate(t, [0, 1], [16, 0])}px` }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: C.brand }}>{eyebrow}</div>
      <div style={{ marginTop: 12, fontSize: 60, lineHeight: 1.08, fontWeight: 800, color: C.heading, letterSpacing: -1 }}>{title}</div>
      <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12 }}>
        {chips.map((c) => (
          <div key={c} style={{ background: C.gold, color: C.goldInk, borderRadius: 14, padding: "6px 18px", fontSize: 30, fontWeight: 800 }}>{c}</div>
        ))}
      </div>
    </div>
  );
};
