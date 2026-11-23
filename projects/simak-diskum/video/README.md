# SIMAK DISKUM demo video

A walkthrough with Indonesian captions, subtle sound effects and quiet music (85 seconds, 1920 x 1080, 30 fps), built with Remotion from the mockups in `../mockups/`. It is **our own deliverable** (Remotion licence: see CLAUDE.md, "Optional: demo video"); do not build Remotion into the client's app.

Output: `out/simak-demo.mp4` (committed, like e-BLUD; re-render it with the command below after any change).

## Rules it follows

- Only features that exist in the PRD (`../prd.md`); F-numbers are shown as gold chips on the screen scenes and in the feature grid.
- Fictional "contoh" data only; officials appear as job titles ("Nama Pejabat, NIP 19xxxxxx"); "Dihadiri Oleh" shows job titles (PRD question 7 is open). No pricing.
- Colours and font follow `../DESIGN.md` (Plus Jakarta Sans, TrueType files in `public/fonts/`, SIL OFL).
- The ending lists the PRD's seven open questions as decisions for the client; the PRD is not approved until the client signs it.

## Storyboard

| # | Scene (id) | Sec | PRD features | Caption |
|---|---|---|---|---|
| 1 | Title (`S1Title`) | 4.5 | none | SIMAK DISKUM: agenda kedinasan Dinas Koperasi dan Usaha Mikro Kota Batam. Contoh tampilan, draft v1. |
| 2 | The problem (`S2Masalah`) | 6 | none (PRD section 1) | Sekarang agenda dicatat di Excel: jadwal bisa bentrok, laporan disusun ulang, dan masyarakat sulit tahu kegiatan Dinas. |
| 3 | Public dashboard (`S3Home`) | 8 | F1, F3 | Portal publik: agenda hari ini urut jam, dengan ringkasan dan pencarian. |
| 4 | Calendar (`S4Kalender`) | 8 | F2, F3 | Kalender bulan, minggu, hari, dan daftar, lengkap dengan pencarian dan filter. |
| 5 | Detail (`S5Detail`) | 7 | F4, F10, F11 | Detail kegiatan, dan pemberitahuan bila dibatalkan. Alasan internal tidak pernah tampil. |
| 6 | Admin dashboard (`S6Dashboard`) | 7 | F6, F8 | Petugas melihat jumlah kegiatan per tahap dan apa yang masih perlu dilengkapi. |
| 7 | Form, top (`S7Form`) | 11 | F7, F8, F9 | Satu halaman untuk satu kegiatan: tahap administrasi, peringatan bentrok di dalam formulir, dan pratinjau publik. |
| 8 | Form, notes and status (`S8Catatan`) | 9 | F8, F10, F11 | Tautan rapat di catatan publik ditahan. Selesai otomatis; Batalkan butuh alasan. |
| 9 | Report (`S9Laporan`) | 9 | F14, F15, F16 | Laporan 8 kolom dengan kop surat dan tanda tangan, siap diunduh sebagai PDF, Excel, atau gambar. |
| 10 | 19 features (`S10Fitur`) | 6 | F1 to F19 | Sembilan belas fitur, dari portal publik sampai cadangan data. |
| 11 | Seven decisions (`S11Keputusan`) | 5 | none (PRD section 8) | Ada tujuh hal yang perlu Dinas putuskan sebelum PRD disetujui. |
| 12 | Closing (`S12Tutup`) | 4.5 | none | Terima kasih. Penawaran harga disampaikan terpisah. |

F5, F12, F13 and F17 to F19 have no mockup screen; they appear only in the feature grid (scene 10). Captions and lengths live in `src/theme.ts` (`SCENES`).

## Sound

Subtle effects and quiet music (music about -21 dB, effects quieter than a spoken voice would be); the video works the same on mute. Every sound is **CC0**, so **no credits are needed** (`npm run sfx -- status simak-diskum` says so). Source pages and credit lines are in `public/sfx/credits.json`. Cues and volumes are in `src/sfx.ts`.

| Moment | Sound | Creator | License |
|---|---|---|---|
| Each scene change (11) | Whoosh #1 | Kinoton | CC0 |
| Each orange highlight appearing | Pop 2 | greenvwbeetle | CC0 |
| Report offered for download (scene 9) | Soft UI Button Click | Jummit | CC0 |
| Signature block shown (scene 9) | [UI Sound] Approval - High Pitched Bell Synth | GabFitzgerald | CC0 |
| Closing screen | gentle chime tree | johnnyguitar01 | CC0 |
| Whole video (faded in and out, trimmed from 118 s) | April Showers | kjartan_abel | CC0 |

`chime-notification-adb6e260.mp3` was downloaded but is not used. Add sounds only with `npm run sfx` (never by hand). If a CC BY sound is ever used, the video needs a credits end card that reads `credits.json`, or the sound must be swapped for a CC0 one.

## Commands

Run these from this folder (`projects/simak-diskum/video`).

```bash
# after the mockups change: refresh screenshots and highlight boxes (from the repo root)
node projects/simak-diskum/video/capture.cjs
```

```bash
# check a key frame (scene id and frame number)
npm run video:still -- src/index.ts S7Form out/check.png --frame=140 --public-dir=$PWD/public --bundle-cache=false
```

```bash
# render the full video
npm run video -- src/index.ts SimakDemo out/simak-demo.mp4 --public-dir=$PWD/public --bundle-cache=false
```

Remotion Studio cannot be viewed from a cloud session; use stills instead.
