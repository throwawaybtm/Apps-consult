# e-BLUD demo video

A walkthrough with Indonesian captions and subtle sound effects (about 82 seconds, 1920 x 1080, 30 fps), built with Remotion from the mockups in `../mockups/`. It is **our own deliverable** (Remotion licence: see CLAUDE.md, "Optional: demo video"); do not build Remotion into the client's app.

Output: `out/e-blud-demo.mp4`.

## Rules it follows

- Only features that exist in the PRD (`../prd.md`); F-numbers are in the table below and shown as chips on the screen scenes.
- Fake "contoh" data only, placeholder BLUD name and logo, no pricing.
- Nothing from the reference systems (names, crests, data). Colours and font follow `../DESIGN.md` (Inter, TrueType).
- Assumptions are labeled: the flow, roles and the "tanggal 28" rule are still open questions for the client (PRD section 9).

## Storyboard

| # | Scene (id) | Sec | PRD features | Caption |
|---|---|---|---|---|
| 1 | Title (`S1Title`) | 5 | none | e-BLUD: sistem digital untuk BLUD Diskum Batam. Contoh tampilan, draft v0. |
| 2 | The problem (`S2Masalah`) | 7 | none (PRD section 1) | Sekarang pencatatan masih manual di Excel: data mudah ganda, status sulit dicari, laporan lambat. |
| 3 | Public home (`S3Home`) | 8 | F13, F14 | Situs publik: informasi, angka gabungan tanpa data pribadi, dan tombol Ajukan pembiayaan. |
| 4 | Online form (`S4Form`) | 10 | F3, F13 | Mitra mengisi formulir sendiri, tanpa akun. Dokumen diunggah dan disimpan privat. |
| 5 | Code and tracking (`S5Kode`) | 7 | F3, F14 | Setelah terkirim, mitra mendapat kode untuk melacak tahap permohonan. |
| 6 | Staff dashboard (`S6Dashboard`) | 8 | F9, F3, F7, F8 | Petugas melihat permohonan masuk, serta angka pencairan dan cicilan. |
| 7 | Verification (`S7Verifikasi`) | 10 | F2, F3, F4 | Petugas memeriksa data dan dokumen, lalu lanjut ke survei, minta perbaikan, atau tolak. |
| 8 | Rules check (`S8Aturan`) | 7 | F5, F6 (F3) | Aturan pembiayaan dicek otomatis, misalnya batas tanggal pencairan (contoh). |
| 9 | 14 features (`S9Fitur`) | 8 | F1 to F14 | 14 fitur, dari permohonan sampai lunas. |
| 10 | Assumptions (`S10Asumsi`) | 7 | none | Alur dan aturan di sini masih asumsi. Kami perlu konfirmasi BLUD. |
| 11 | Closing (`S11Tutup`) | 5 | none | Terima kasih. Penawaran harga disampaikan terpisah. |

Captions and lengths live in `src/theme.ts` (`SCENES`). There are no cicilan, kwitansi or report screens in the mockups, so scene 9 only lists those features (F7 to F12) as text.

## Sound effects

Subtle effects, quiet and under the captions; the video works the same on mute. All six are **CC0**, so **no credits are needed** (`npm run sfx -- status e-blud` says so). Source pages and credit lines are in `public/sfx/credits.json`. Cues and volumes are in `src/sfx.ts`.

| Moment | Sound | Creator | License |
|---|---|---|---|
| Each scene change (10) | Whoosh #1 | Kinoton | CC0 |
| Each orange highlight appearing | Pop 2 | greenvwbeetle | CC0 |
| Form sent (scene 5), Verifikasi pressed (scene 7) | Soft UI Button Click | Jummit | CC0 |
| Application code appears (scene 5) | Chime Notification | Jofae | CC0 |
| Status turns to "Siap survei" (scene 7) | [UI Sound] Approval - High Pitched Bell Synth | GabFitzgerald | CC0 |
| Closing screen | gentle chime tree | johnnyguitar01 | CC0 |

Add sounds only with `npm run sfx` (never by hand). If a CC BY sound is ever used, the video needs a credits end card that reads `credits.json`, or the sound must be swapped for a CC0 one.

## Version 3 (more engaging, with music)

`out/demo-v3.mp4` (about 69 seconds) sits next to the 82-second `out/e-blud-demo.mp4` so the two can be compared. Composition `EBludV3`; scenes in `src/v3/`, timings and captions in `src/v3/theme3.ts`, sounds in `src/v3/sfx3.ts`. Changes: a hook in the first seconds ("Masih pakai Excel?"), faster pacing, zoom into the important parts, captions that pop in word by word, dashboard numbers that count up (contoh data), and an ending with the benefit and next steps. Same rules as above; features shown are F1 to F14 from the PRD, no pricing.

| # | Scene (id) | Frames | PRD features |
|---|---|---|---|
| 1 | Hook, then title (`V1Hook`) | 120 | none |
| 2 | The problem (`V2Masalah`) | 180 | none |
| 3 | Public home (`V3Home`) | 210 | F13, F14 |
| 4 | Online form (`V4Form`) | 240 | F3, F13 |
| 5 | Code and tracking (`V5Kode`) | 180 | F3, F14 |
| 6 | Staff dashboard (`V6Dashboard`) | 150 | F9, F3, F7, F8 |
| 7 | Counting numbers (`V7Angka`) | 90 | F9 |
| 8 | Verification (`V8Verifikasi`) | 240 | F2, F3, F4 |
| 9 | Rules check (`V9Aturan`) | 180 | F3, F5, F6 |
| 10 | 14 features (`V10Fitur`) | 180 | F1 to F14 |
| 11 | Assumptions (`V11Asumsi`) | 150 | none |
| 12 | Benefit and next steps (`V12Tutup`) | 150 | none |

Background music: "April Showers" by kjartan_abel, **CC0** (https://freesound.org/people/kjartan_abel/sounds/608392), at about -21 dB, fading in over 1.5 s and out over the last 2.5 s, trimmed to the video length. No credits needed. Other CC0 options already searched: "Positive Acoustic Guitar Background Music" (guitarman213), "Tropicorp Advertisement" (code_box). Render: `npm run video -- src/index.ts EBludV3 out/demo-v3.mp4 --public-dir=$PWD/public --bundle-cache=false` (from this folder).

## Files

| Path | What |
|---|---|
| `src/index.ts`, `src/Root.tsx` | Registers the `EBlud` composition (all scenes) and one composition per scene |
| `src/theme.ts` | Colours (from DESIGN.md), storyboard table, caption text |
| `src/components/` | Scene shell with captions and font loading, browser frame with pan and zoom, highlights |
| `src/scenes/` | One file per scene |
| `src/rects.json` | Element boxes the highlights point at (generated by `capture.cjs`) |
| `public/shots/` | Full-page screenshots of the mockup states (generated by `capture.cjs`) |
| `public/fonts/` | Inter TrueType, with its OFL licence |
| `public/sfx/` | Sound effects (CC0) and `credits.json` |
| `src/sfx.ts`, `src/components/SfxTrack.tsx` | Sound cues and the sound track |
| `capture.cjs` | Captures the screenshots and measures the highlighted elements from `../mockups/` |
| `out/` | Rendered MP4 |

## Commands

Run these from `projects/e-blud/video/`. Always use `--public-dir` (Remotion otherwise looks for `public/` at the repo root) and `--bundle-cache=false` after changing assets (the cache can hold a stale copy).

```bash
# after the mockups change: refresh screenshots and highlight boxes (from the repo root)
node projects/e-blud/video/capture.cjs
```

```bash
# check a key frame (scene id and frame number)
npm run video:still -- src/index.ts S3Home out/check.png --frame=120 --public-dir=$PWD/public --bundle-cache=false
```

```bash
# render the full video
npm run video -- src/index.ts EBlud out/e-blud-demo.mp4 --public-dir=$PWD/public --bundle-cache=false
```

Remotion Studio cannot be viewed from a cloud session; use stills instead.

## Changing it

1. PRD first: a changed or new feature goes into `../prd.md`, then into the mockups, then here.
2. Edit the caption or timing in `src/theme.ts` and the scene file; keep a scene's highlight times inside its length.
3. Re-check key frames, render, then commit the MP4 if it stays under about 20 MB.
