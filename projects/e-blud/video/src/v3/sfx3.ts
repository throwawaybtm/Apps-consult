import { FILES, SfxCue } from "../sfx";
import { SCENES3, start3, SceneId3 } from "./theme3";

// Version 3 sounds: the same six CC0 effects, retimed to the faster scenes, plus quiet background music.
export const MUSIC = "april-showers-eaa82972.mp3"; // "April Showers" by kjartan_abel, CC0
export const MUSIC_VOLUME = 0.09; // about -21 dB, well under the effects

const local = (scene: SceneId3, frames: number[], file: string, volume: number, length: number): SfxCue[] =>
  frames.map((f) => ({ file, at: start3(scene) + f, volume, frames: length }));

const whooshes: SfxCue[] = [];
let end = 0;
SCENES3.slice(0, -1).forEach((s) => {
  end += s.frames;
  whooshes.push({ file: FILES.whoosh, at: end - 8, volume: 0.3, frames: 24 });
});

export const CUES3: SfxCue[] = [
  ...whooshes,
  // Hook words, and each orange highlight appearing: very soft pops.
  ...local("V1Hook", [2, 12], FILES.pop, 0.25, 8),
  ...local("V3Home", [10, 68, 150], FILES.pop, 0.2, 8),
  ...local("V4Form", [8, 36, 104, 196], FILES.pop, 0.2, 8),
  ...local("V5Kode", [112], FILES.pop, 0.2, 8),
  ...local("V6Dashboard", [6, 32, 60, 108], FILES.pop, 0.2, 8),
  ...local("V7Angka", [6, 16, 26, 36], FILES.pop, 0.2, 8),
  ...local("V8Verifikasi", [8, 48, 112, 196], FILES.pop, 0.2, 8),
  ...local("V9Aturan", [10, 66], FILES.pop, 0.2, 8),
  // Button presses: form sent (scene 5) and Verifikasi pressed (scene 8).
  ...local("V5Kode", [4], FILES.click, 0.4, 12),
  ...local("V8Verifikasi", [162], FILES.click, 0.4, 12),
  // Application code appears; status turns to "Siap survei".
  ...local("V5Kode", [14], FILES.chime, 0.35, 20),
  ...local("V8Verifikasi", [184], FILES.approval, 0.35, 30),
  // Closing chime, faded out after about 3 seconds.
  { file: FILES.closing, at: start3("V12Tutup") + 12, volume: 0.35, frames: 100, fadeOut: 45 },
];
