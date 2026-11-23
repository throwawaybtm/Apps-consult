import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { CUES, MUSIC, MUSIC_VOLUME } from "./sfx";
import { TOTAL_FRAMES } from "./theme";

// Music (faded in and out) plus all effects, placed on the main timeline so a whoosh is not cut off
// at a scene boundary. The single-scene compositions used for stills have no sound.
export const SfxTrack: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={TOTAL_FRAMES} layout="none" name="music">
      <Audio
        src={staticFile("sfx/" + MUSIC)}
        volume={(f) => MUSIC_VOLUME * interpolate(f, [0, 45, TOTAL_FRAMES - 75, TOTAL_FRAMES], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </Sequence>
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.at} durationInFrames={c.frames} layout="none" name={c.file}>
        <Audio
          src={staticFile("sfx/" + c.file)}
          volume={(f) => (c.fadeOut ? c.volume * interpolate(f, [c.frames - c.fadeOut, c.frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : c.volume)}
        />
      </Sequence>
    ))}
  </>
);
