import { SCENES } from "./theme";

// Sound effects (all CC0, see public/sfx/credits.json). Subtle and under the captions;
// the video works the same on mute. Times are local frames of a scene (30 fps) unless noted.
export const FILES = {
  whoosh: "whoosh-1-34ba7605.mp3",
  pop: "pop-2-7b1f829e.mp3",
  click: "soft-ui-button-click-aa763a9d.mp3",
  chime: "chime-notification-adb6e260.mp3",
  approval: "ui-sound-approval-high-pitched-bell-synt-a0bcc4b8.mp3",
  closing: "gentle-chime-tree-wav-f7ed0286.mp3",
} as const;

export type SfxCue = { file: string; at: number; volume: number; frames: number; fadeOut?: number };

const start = (id: string) => {
  let n = 0;
  for (const s of SCENES) {
    if (s.id === id) return n;
    n += s.frames;
  }
  throw new Error("unknown scene " + id);
};

const local = (scene: string, frames: number[], file: string, volume: number, length: number): SfxCue[] =>
  frames.map((f) => ({ file, at: start(scene) + f, volume, frames: length }));

// A light whoosh just before each scene change (9 frames ahead, so its peak lands on the cut).
const whooshes: SfxCue[] = [];
let end = 0;
SCENES.slice(0, -1).forEach((s) => {
  end += s.frames;
  whooshes.push({ file: FILES.whoosh, at: end - 9, volume: 0.3, frames: 26 });
});

export const CUES: SfxCue[] = [
  ...whooshes,
  // A very soft pop when each orange highlight appears (same frames as the Highlight `at` props).
  ...local("S3Home", [14, 104, 204], FILES.pop, 0.2, 8),
  ...local("S4Form", [16, 50, 150, 252], FILES.pop, 0.2, 8),
  ...local("S5Kode", [150], FILES.pop, 0.2, 8),
  ...local("S6Dashboard", [14, 64, 114, 200], FILES.pop, 0.2, 8),
  ...local("S7Verifikasi", [16, 70, 170, 262], FILES.pop, 0.2, 8),
  ...local("S8Aturan", [24, 96], FILES.pop, 0.2, 8),
  // Button presses: the form is sent (scene 5) and "Verifikasi" is pressed (scene 7).
  ...local("S5Kode", [4], FILES.click, 0.4, 12),
  ...local("S7Verifikasi", [222], FILES.click, 0.4, 12),
  // The application code appears (scene 5), and the status turns to "Siap survei" (scene 7).
  ...local("S5Kode", [22], FILES.chime, 0.35, 20),
  ...local("S7Verifikasi", [244], FILES.approval, 0.35, 30),
  // Closing screen: a gentle chime, faded out after about 3 seconds.
  { file: FILES.closing, at: start("S11Tutup") + 20, volume: 0.35, frames: 100, fadeOut: 45 },
];
