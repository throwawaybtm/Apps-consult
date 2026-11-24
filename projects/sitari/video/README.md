# SITARI demo video

A walkthrough of the finished SI-TARI DISKUM trial app with Indonesian captions, subtle sound effects and quiet music (87.5 seconds, 1920 × 1080, 30 fps), built with Remotion from the real app's screens (fictional data) in `../presentation/assets/`. It is **our own deliverable** (Remotion licence: see CLAUDE.md, "Optional: demo video"); do not build Remotion into the client's app.

Output: `out/sitari-demo.mp4` (committed; re-render it with the command below after any change).

## Rules it follows

- Only features that exist in the PRD (`../prd.md`); F-numbers are shown as chips on the screen scenes.
- Story for everyone: first why it helps (scene 2), then everyday use (scenes 3–12). Finished-product tone, no pricing.
- Fictional data only: the screenshots come from SITARI's local preview with a fictional seed (see `../presentation/README.md`); the closing caption says so.
- Colours and font follow `../DESIGN.md` (Plus Jakarta Sans, the app's own font; TrueType files in `public/fonts/`, SIL OFL).

## Storyboard

| # | Scene (id) | Sec | PRD features | Caption |
|---|---|---|---|---|
| 1 | Title (`S1Title`) | 4.5 | none | SI-TARI DISKUM: buku tamu dan rapat internal Dinas Koperasi dan Usaha Mikro Kota Batam. |
| 2 | Before and after (`S2Sebelum`) | 7 | PRD section 1 | Dulu: buku tamu kertas, jadwal manual, bukti SPPD tersebar. Kini semua tercatat di satu aplikasi. |
| 3 | Dashboard (`S3Dashboard`) | 7 | F1 | Dashboard: tamu, rapat, dan Kendali SPPD hari ini dalam satu layar. |
| 4 | TLD form → Buku Tamu (`S4Tld`) | 7 | F3, F2 | Rombongan luar daerah mengajukan kunjungan dan mengunggah surat dari formulir daring. |
| 5 | TDD walk-in, desktop + phone (`S5Tdd`) | 6 | F4, F15 | Tamu yang datang langsung cukup memindai QR. Jam kedatangan tercatat otomatis. |
| 6 | Konfirmasi → Disposisi (`S6Konfirmasi`) | 7 | F5, F6 | Admin memeriksa surat, memilih Bidang Tujuan, lalu mengunggah disposisi. |
| 7 | Notifikasi and room (`S7Notifikasi`) | 7 | F7 | WhatsApp ke penerima tamu, lalu pesan ruangan. Ruangan yang sudah terpakai ditolak. |
| 8 | Kedatangan (`S8Kedatangan`) | 7 | F8, F12 | Rombongan presensi lewat QR. Setelah kunjungan, admin memvalidasi daftar hadir. |
| 9 | SPPD → Selesai (`S9Sppd`) | 8 | F9 | Foto kegiatan dan catatan; daftar hadir PDF otomatis. Semua dokumen jadi satu arsip PDF. |
| 10 | Jadwal Rapat → Kalender (`S10Rapat`) | 7 | F10, F11 | Jadwal rapat dan kalender agenda, tanpa bentrok ruangan. |
| 11 | Presensi QR + phone (`S11Presensi`) | 8 | F12 | Peserta rapat memindai QR dan memilih namanya. Presensi ganda ditolak. |
| 12 | E-Notula → laporan (`S12Notula`) | 7 | F13, F14 | E-Notula resmi terisi dari data rapat, dan laporan tamu bulanan siap diunduh. |
| 13 | Closing (`S13Tutup`) | 5 | none | SI-TARI DISKUM. Semua nama dan data di video ini adalah contoh fiktif. |

F16 (security) has no screen and appears only in the deck. Captions and lengths live in `src/theme.ts` (`SCENES`).

## Sound

Subtle effects and quiet music (music about −21 dB, faded in and out); the video works the same on mute. Every sound is **CC0**, so **no credits are needed** (`npm run sfx -- status sitari` says so). Source pages and credit lines are in `public/sfx/credits.json`; cues and volumes are in `src/sfx.ts`.

| Moment | Sound | Creator | License |
|---|---|---|---|
| Each scene change (12) | Whoosh #1 | Kinoton | CC0 |
| A card or screenshot arriving (7 cues) | Pop 2 | greenvwbeetle | CC0 |
| Moving to the next workflow tab (2 cues) | Soft UI Button Click | Jummit | CC0 |
| Validation and the finished archive | [UI Sound] Approval - High Pitched Bell Synth | GabFitzgerald | CC0 |
| Closing screen | gentle chime tree | johnnyguitar01 | CC0 |
| Whole video (faded in and out, trimmed from 118 s) | April Showers | kjartan_abel | CC0 |

Add sounds only with `npm run sfx` (never by hand). If a CC BY sound is ever used, the video needs a credits end card that reads `credits.json`, or the sound must be swapped for a CC0 one.

## Commands

Run these from this folder (`projects/sitari/video`).

```bash
# after the screenshots change: copy the shots the scenes use
for f in dashboard tld-form tdd-form buku-tamu visit-konfirmasi-bottom-crop visit-disposisi-crop visit-notifikasi-crop visit-kedatangan-crop visit-sppd-crop visit-selesai-crop jadwal-rapat kalender-agenda-crop presensi-qr-crop e-notula-crop lainnya m-tdd-form m-presensi; do cp ../presentation/assets/$f.webp public/shots/; done
```

```bash
# check a key frame (scene id and frame number)
npm run video:still -- src/index.ts S6Konfirmasi out/check.png --frame=160 --public-dir=$PWD/public --bundle-cache=false
```

```bash
# render the full video
npm run video -- src/index.ts SitariDemo out/sitari-demo.mp4 --public-dir=$PWD/public --bundle-cache=false
```

Remotion Studio cannot be viewed from a cloud session; use stills instead.
