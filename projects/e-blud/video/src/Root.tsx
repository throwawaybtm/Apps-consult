import React from "react";
import { Composition, Folder, Series } from "remotion";
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
import { FPS, HEIGHT, SCENES, TOTAL_FRAMES, WIDTH } from "./theme";

const COMPONENTS: Record<string, React.FC> = { S1Title, S2Masalah, S3Home, S4Form, S5Kode, S6Dashboard, S7Verifikasi, S8Aturan, S9Fitur, S10Asumsi, S11Tutup };

// The whole walkthrough: scenes play one after another (about 82 seconds).
const EBlud: React.FC = () => (
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
);

export const Root: React.FC = () => (
  <>
    <Composition id="EBlud" component={EBlud} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    {/* Each scene on its own, for checking key frames with `npm run video:still`. */}
    <Folder name="Scenes">
      {SCENES.map((s) => (
        <Composition key={s.id} id={s.id} component={COMPONENTS[s.id]} durationInFrames={s.frames} fps={FPS} width={WIDTH} height={HEIGHT} />
      ))}
    </Folder>
  </>
);

