import React from "react";
import { AbsoluteFill, Composition, Folder, Series } from "remotion";
import { S1Title } from "./scenes/S1Title";
import { S2Masalah } from "./scenes/S2Masalah";
import { S3Home } from "./scenes/S3Home";
import { S4Form } from "./scenes/S4Form";
import { S5Kode } from "./scenes/S5Kode";
import { S6Dashboard } from "./scenes/S6Dashboard";
import { S7Verifikasi } from "./scenes/S7Verifikasi";
import { S8Aturan } from "./scenes/S8Aturan";
import { S9Fitur } from "./scenes/S9Fitur";
import { S10Asumsi } from "./scenes/S10Asumsi";
import { S11Tutup } from "./scenes/S11Tutup";
import { SfxTrack } from "./components/SfxTrack";
import { C, FPS, HEIGHT, SCENES, TOTAL_FRAMES, WIDTH } from "./theme";
import { V1Hook, V2Masalah } from "./v3/Intro";
import { V3Home, V4Form, V5Kode, V6Dashboard, V8Verifikasi, V9Aturan } from "./v3/Screens";
import { V7Angka, V10Fitur, V11Asumsi, V12Tutup } from "./v3/Others";
import { SfxTrack3 } from "./v3/SfxTrack3";
import { SCENES3, TOTAL3 } from "./v3/theme3";

const COMPONENTS: Record<string, React.FC> = { S1Title, S2Masalah, S3Home, S4Form, S5Kode, S6Dashboard, S7Verifikasi, S8Aturan, S9Fitur, S10Asumsi, S11Tutup };

// The whole walkthrough: scenes play one after another (about 82 seconds).
const COMPONENTS3: Record<string, React.FC> = { V1Hook, V2Masalah, V3Home, V4Form, V5Kode, V6Dashboard, V7Angka, V8Verifikasi, V9Aturan, V10Fitur, V11Asumsi, V12Tutup };

// Version 3 (about 69 s): faster pacing, zoom into the important parts, animated captions, counting numbers, music.
const EBludV3: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <SfxTrack3 />
    <Series>
      {SCENES3.map((s) => {
        const Scene = COMPONENTS3[s.id];
        return (
          <Series.Sequence key={s.id} name={s.id} durationInFrames={s.frames}>
            <Scene />
          </Series.Sequence>
        );
      })}
    </Series>
  </AbsoluteFill>
);

const EBlud: React.FC = () => (
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
    <Composition id="EBlud" component={EBlud} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="EBludV3" component={EBludV3} durationInFrames={TOTAL3} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Folder name="ScenesV3">
      {SCENES3.map((s) => (
        <Composition key={s.id} id={s.id} component={COMPONENTS3[s.id]} durationInFrames={s.frames} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
    {/* Each scene on its own, for checking key frames with `npm run video:still`. */}
    <Folder name="Scenes">
      {SCENES.map((s) => (
        <Composition key={s.id} id={s.id} component={COMPONENTS[s.id]} durationInFrames={s.frames} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
  </>
);

