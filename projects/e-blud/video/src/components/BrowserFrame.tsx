import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";

// A mockup screenshot inside a browser frame. The screenshot is the full page (1440 px wide);
// the frame shows a window of it that pans (and optionally zooms) over time.
export const FW = 1216; // frame width
export const VH = 760; // visible page height inside the frame
export const BAR = 44;
export const SCALE = FW / 1440;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

type Props = {
  shot: string;
  pageHeight: number; // page height in px at 1440 wide
  panFrames: number[];
  panY: number[]; // page px at the top of the window
  zoom?: { frames: number[]; scale: number[]; origin: { x: number; y: number } };
  opacity?: number;
  children?: React.ReactNode;
};

export const BrowserFrame: React.FC<Props> = ({ shot, pageHeight, panFrames, panY, zoom, opacity = 1, children }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, panFrames, panY.map((v) => -v * SCALE), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const z = zoom ? interpolate(frame, zoom.frames, zoom.scale, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }) : 1;
  return (
    <div style={{ position: "absolute", left: 608, top: 48, width: FW, height: VH + BAR, borderRadius: 22, overflow: "hidden", background: C.white, boxShadow: "0 30px 80px rgba(11,37,64,0.35)", opacity }}>
      <div style={{ height: BAR, background: C.navy, display: "flex", alignItems: "center", gap: 10, paddingLeft: 20 }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.35)" }} />
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.35)" }} />
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.35)" }} />
        <div style={{ marginLeft: 16, fontSize: 24, color: C.halo, fontWeight: 400 }}>Contoh tampilan</div>
      </div>
      <div style={{ position: "relative", width: FW, height: VH, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: FW, height: pageHeight * SCALE, translate: `0px ${y}px`, scale: z, transformOrigin: zoom ? `${zoom.origin.x * SCALE}px ${zoom.origin.y * SCALE}px` : "0px 0px" }}>
          <Img src={staticFile("shots/" + shot)} style={{ display: "block", width: FW, height: pageHeight * SCALE }} />
          {children}
        </div>
      </div>
    </div>
  );
};
