import React from "react";
import { AbsoluteFill, Composition, Folder, Series } from "remotion";
import { S1Title, S2Sebelum, S3Dashboard, S4Tld, S5Tdd, S6Konfirmasi, S7Notifikasi, S8Kedatangan, S9Sppd, S10Rapat, S11Presensi, S12Notula, S13Tutup } from "./scenes";
import { SfxTrack } from "./SfxTrack";
import { C, FPS, HEIGHT, SCENES, TOTAL_FRAMES, WIDTH } from "./theme";

const COMPONENTS: Record<string, React.FC> = { S1Title, S2Sebelum, S3Dashboard, S4Tld, S5Tdd, S6Konfirmasi, S7Notifikasi, S8Kedatangan, S9Sppd, S10Rapat, S11Presensi, S12Notula, S13Tutup };

// The whole walkthrough: scenes play one after another (about 89 seconds).
const SitariDemo: React.FC = () => (
  <AbsoluteFill style={{ background: C.headerTo }}>
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
    <Composition id="SitariDemo" component={SitariDemo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* Each scene on its own, for checking key frames with `npm run video:still`. */}
    <Folder name="Scenes">
      {SCENES.map((s) => (
        <Composition key={s.id} id={s.id} component={COMPONENTS[s.id]} durationInFrames={s.frames} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
  </>
);
