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
  whooshes.push({ file: FILES.whoosh, at: end - 9, volume: 0.3, frames: 26 });
});

export const CUES: SfxCue[] = [
  ...whooshes,
  // A very soft pop whenever an orange highlight appears (same frames as the Highlight `at` props).
  ...local("S3Home", [14, 96, 166], FILES.pop, 0.2, 8),
  ...local("S4Kalender", [14, 84, 164], FILES.pop, 0.2, 8),
  ...local("S5Detail", [14, 74, 144], FILES.pop, 0.2, 8),
  ...local("S6Dashboard", [14, 104], FILES.pop, 0.2, 8),
  ...local("S7Form", [16, 120, 230], FILES.pop, 0.2, 8),
  ...local("S8Catatan", [20, 112, 192], FILES.pop, 0.2, 8),
  ...local("S9Laporan", [14, 84, 176], FILES.pop, 0.2, 8),
  // A soft click as the report is offered for download; an approval bell when the signature block shows.
  ...local("S9Laporan", [8], FILES.click, 0.35, 12),
  ...local("S9Laporan", [178], FILES.approval, 0.3, 30),
  // Closing screen: a gentle chime, faded out after about 3 seconds.
  { file: FILES.closing, at: startOf("S12Tutup") + 20, volume: 0.3, frames: 100, fadeOut: 45 },
];
