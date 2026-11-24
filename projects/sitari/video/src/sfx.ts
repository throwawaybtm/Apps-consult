import { SCENES, SceneId, startOf } from "./theme";

// Sound effects and music, all CC0 (see public/sfx/credits.json). Subtle and under the captions;
// the video works the same on mute. Everything goes through `npm run sfx`.
export const FILES = {
  whoosh: "whoosh-1-34ba7605.mp3",
  pop: "pop-2-7b1f829e.mp3",
  click: "soft-ui-button-click-aa763a9d.mp3",
  approval: "ui-sound-approval-high-pitched-bell-synt-a0bcc4b8.mp3",
  closing: "gentle-chime-tree-wav-f7ed0286.mp3",
} as const;
export const MUSIC = "april-showers-eaa82972.mp3"; // "April Showers" by kjartan_abel, CC0, 118 s; trimmed to the video
export const MUSIC_VOLUME = 0.09; // about -21 dB, well under the effects

export type SfxCue = { file: string; at: number; volume: number; frames: number; fadeOut?: number };

const local = (scene: SceneId, frames: number[], file: string, volume: number, length: number): SfxCue[] =>
  frames.map((f) => ({ file, at: startOf(scene) + f, volume, frames: length }));

// A light whoosh just before each scene change.
const whooshes: SfxCue[] = [];
let end = 0;
SCENES.slice(0, -1).forEach((s) => {
  end += s.frames;
  whooshes.push({ file: FILES.whoosh, at: end - 9, volume: 0.28, frames: 26 });
});

export const CUES: SfxCue[] = [
  ...whooshes,
  // "Sesudah" card arrives; screenshot swaps (same frames as `swapAt` in scenes.tsx); phones slide in.
  ...local("S2Sebelum", [72], FILES.pop, 0.2, 8),
  ...local("S4Tld", [130], FILES.pop, 0.2, 8),
  ...local("S5Tdd", [30], FILES.pop, 0.2, 8),
  ...local("S6Konfirmasi", [110], FILES.click, 0.3, 12),
  ...local("S9Sppd", [120], FILES.click, 0.3, 12),
  ...local("S10Rapat", [115], FILES.pop, 0.2, 8),
  ...local("S11Presensi", [60], FILES.pop, 0.2, 8),
  ...local("S12Notula", [110], FILES.pop, 0.2, 8),
  // Validation and the finished archive: a soft approval bell.
  ...local("S8Kedatangan", [150], FILES.approval, 0.25, 30),
  ...local("S9Sppd", [170], FILES.approval, 0.25, 30),
  // Closing screen: a gentle chime, faded out after about 3 seconds.
  { file: FILES.closing, at: startOf("S13Tutup") + 20, volume: 0.3, frames: 100, fadeOut: 45 },
];
