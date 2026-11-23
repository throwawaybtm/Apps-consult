import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { CUES } from "../sfx";

// All sound effects of the full video, placed on the main timeline (so a whoosh is not cut off
// at a scene boundary). The single-scene compositions used for stills have no sound.
export const SfxTrack: React.FC = () => (
  <>
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
