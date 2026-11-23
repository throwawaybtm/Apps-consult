import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { CUES3, MUSIC, MUSIC_VOLUME } from "./sfx3";
import { TOTAL3 } from "./theme3";

// Sound effects and the quiet music bed of version 3, on the main timeline.
export const SfxTrack3: React.FC = () => (
  <>
    {/* Music: fades in over 1.5 s and out over the last 2.5 s, trimmed to the video's length. */}
    <Sequence from={0} durationInFrames={TOTAL3} layout="none" name="Musik">
      <Audio
        src={staticFile("sfx/" + MUSIC)}
        volume={(f) => MUSIC_VOLUME * interpolate(f, [0, 45, TOTAL3 - 75, TOTAL3], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </Sequence>
    {CUES3.map((c, i) => (
      <Sequence key={i} from={c.at} durationInFrames={c.frames} layout="none" name={c.file}>
        <Audio
          src={staticFile("sfx/" + c.file)}
          volume={(f) => (c.fadeOut ? c.volume * interpolate(f, [c.frames - c.fadeOut, c.frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : c.volume)}
        />
      </Sequence>
    ))}
  </>
);
