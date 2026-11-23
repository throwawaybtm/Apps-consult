import React, { useEffect, useState } from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useDelayRender } from "remotion";
import { C } from "../theme";

// Loads the guidebook font (Inter, TrueType) from public/fonts before the first frame is drawn.
const FACES: Array<[string, string]> = [
  ["400", "Inter-Regular.ttf"],
  ["600", "Inter-SemiBold.ttf"],
  ["700", "Inter-Bold.ttf"],
];

const useInter = () => {
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Inter"));
  useEffect(() => {
    Promise.all(
      FACES.map(async ([weight, file]) => {
        const face = new FontFace("Inter", `url(${staticFile("fonts/" + file)})`, { weight });
        await face.load();
        document.fonts.add(face);
      })
    ).then(() => continueRender(handle));
  }, [continueRender, handle]);
};

const Caption: React.FC<{ text: string; frames: number }> = ({ text, frames }) => {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const outT = interpolate(frame, [frames - 14, frames - 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 120, right: 120, bottom: 44, display: "flex", justifyContent: "center", opacity: inT * outT, translate: `0px ${interpolate(inT, [0, 1], [20, 0])}px` }}>
      <div style={{ background: "rgba(11,37,64,0.94)", color: C.white, borderRadius: 30, padding: "20px 44px", fontSize: 46, lineHeight: 1.25, fontWeight: 600, textAlign: "center", maxWidth: 1680 }}>
        {text}
      </div>
    </div>
  );
};

// One scene: background, a short fade in and out, and the caption.
export const SceneShell: React.FC<{ frames: number; caption: string; background: string; children: React.ReactNode }> = ({ frames, caption, background, children }) => {
  useInter();
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, frames - 8, frames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background, fontFamily: "Inter, Arial, sans-serif", opacity }}>
      {children}
      <Caption text={caption} frames={frames} />
    </AbsoluteFill>
  );
};
