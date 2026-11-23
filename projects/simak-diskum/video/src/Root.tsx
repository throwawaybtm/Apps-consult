import React from "react";
import { AbsoluteFill, Composition, Folder, Series } from "remotion";
import { S1Title, S2Masalah, S3Home, S4Kalender, S5Detail, S6Dashboard, S7Form, S8Catatan, S9Laporan, S10Fitur, S11Keputusan, S12Tutup } from "./scenes";
import { SfxTrack } from "./SfxTrack";
import { C, FPS, HEIGHT, SCENES, TOTAL_FRAMES, WIDTH } from "./theme";

const COMPONENTS: Record<string, React.FC> = { S1Title, S2Masalah, S3Home, S4Kalender, S5Detail, S6Dashboard, S7Form, S8Catatan, S9Laporan, S10Fitur, S11Keputusan, S12Tutup };

// The whole walkthrough: scenes play one after another (about 85 seconds).
const SimakDemo: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <SfxTrack />
    <Series>
      {SCENES.map((s) => {
        const Scene = COMPONENTS[s.id];
        return (
          <Series.Sequence key={s.id} name={s.id} durationInFrames={s.frames}>
            <Scene />
          </Series.Sequence>
        );
      })}
    </Series>
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="SimakDemo" component={SimakDemo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* Each scene on its own, for checking key frames with `npm run video:still`. */}
    <Folder name="Scenes">
      {SCENES.map((s) => (
        <Composition key={s.id} id={s.id} component={COMPONENTS[s.id]} durationInFrames={s.frames} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
  </>
);
