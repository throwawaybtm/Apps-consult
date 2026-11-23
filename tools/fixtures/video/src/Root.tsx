import { AbsoluteFill, Composition, interpolate, useCurrentFrame } from "remotion";

const Card = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#e0f2fe", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity, color: "#0c4a6e", fontSize: 14 }}>Uji video</div>
    </AbsoluteFill>
  );
};

// Tiny on purpose: keeps the test render to a few seconds.
export const Root = () => <Composition id="Fixture" component={Card} durationInFrames={10} fps={10} width={160} height={90} />;
