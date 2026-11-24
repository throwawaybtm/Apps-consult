# SITARI presentation (source)

"SI-TARI DISKUM: aplikasi tamu dan rapat", 25 slides in Indonesian, no pricing. It presents the **finished trial app** to everyone at the Dinas: first why it helps, then everyday staff use. It lives as a Slides artifact; this folder is the source, versioned with the PRD.

Published at: https://claude.ai/artifact/Uia2HBiooywZR7bKedqzch (private; share it from the page's Share menu, export to PowerPoint or PDF from the page).

## Contents

| Path | What |
|---|---|
| `deck/project/deck.json` | Index: title, slide order, sections, typeface (Plus Jakarta Sans, the app's own font) |
| `deck/project/deck.css` | Shared look, tokens from `../DESIGN.md` |
| `deck/project/slides/<id>.html` | One file per slide, speaker notes in `<aside>` |
| `assets/*.webp` | Screenshots of the real app UI with fictional data |
| `rects.json` | Highlight boxes measured during capture (CSS px of the 1440 × 900 shots), used by the video |
| `fictional-config.cjs` | Writes the SITARI clone's gitignored config with fictional PIC names |
| `seed-preview.cjs` | Runs SITARI's own local preview with a fictional week of data, driven through the app's local API |
| `make-seed-photos.cjs` | Draws the fictional "photos" (`seed-photos/`) and letters (`seed-letters/`) the seed uploads |
| `capture-shots.cjs` | Captures the screenshots, with a privacy guard (see below) |
| `to-webp.py` | Converts the captured PNGs to WebP (31 MB → 3 MB) |
| `preview-deck.cjs` | Renders each slide locally to PNG to check layout (an approximation of the Slides renderer) |

## Rebuilding the screenshots

```bash
# from the repo root; the SITARI repo cloned read-only at $SITARI_DIR (default /home/user/throwawaybtm/sitari-diskum-v3)
node "$SITARI_DIR/local-test/setup-local.js" --from-templates   # run inside $SITARI_DIR
node projects/sitari/presentation/fictional-config.cjs
node projects/sitari/presentation/make-seed-photos.cjs
node projects/sitari/presentation/seed-preview.cjs &               # 127.0.0.1:4174, clock frozen at Selasa 24-11-2026 10.15 WIB
node projects/sitari/presentation/capture-shots.cjs
python3 -I projects/sitari/presentation/to-webp.py
```

Rules the scripts enforce:
- **Never the live deployment.** `capture-shots.cjs` refuses any URL other than `127.0.0.1`/`localhost`. Nothing writes to the SITARI app's Sheets, Drive or Fonnte, and nothing is pushed to its repo; only gitignored local config in the clone is written, and the script checks the clone has no tracked changes.
- **Fictional data only.** The SITARI repo's config templates carry real PIC names, and `Admin/RapatPimpinan.html` and `Admin/AgendaAttendanceData.js` hard-code 13 officials' names and NIPs. The PIC names are replaced in the gitignored local copies; the officials list is swapped for fictional names in the browser response only. Before every shot, the page text and form values are checked against all those real names, and the run aborts on a match without printing the name.
- **Preview-only lines are hidden** ("Mode pengujian lokal…", "Simulasi lokal…" toasts), because they are not part of the product. The deck's NOTIFIKASI slide says in its footer that WhatsApp is simulated in the preview.
- **Not captured:** the "Buat Agenda Rapat Baru" form, because it wrongly shows the "Agenda rapat ini sudah dikunci" notice on a new meeting (`#meetingEditLockBanner` has `hidden`, but its Tailwind `flex` class overrides it). This is a bug in the app, reported to the owner, not hidden in our captures.

## Images

Slides reference images as `/_blob/<id>`, the ids the artifact assigned on upload. When the deck is rebuilt in a new artifact, upload these files and replace the ids:

| Id in the slides | File |
|---|---|
| `88584be820c4e60f05061b1840c53267` | `assets/dashboard.webp` |
| `053c732c390f137d6a288a36798cfd8a` | `assets/buku-tamu.webp` |
| `08ffcbd0a8d7dce88818f37249367aa2` | `assets/tld-form.webp` |
| `bc2e08cfc70d6e30330d24e4672db557` | `assets/tdd-form.webp` |
| `194dd03a14fa17f0100fd047422697e9` | `assets/visit-konfirmasi.webp` |
| `36ff54c452ab3c06414121af76101864` | `assets/visit-konfirmasi-bottom.webp` |
| `ebda74e0b7d0478febada8c78d619a64` | `assets/visit-disposisi.webp` |
| `7f2d322dc0873f2d4e07014f3f213961` | `assets/visit-notifikasi.webp` |
| `9c0999b3fac329389c4e28f4b93b4648` | `assets/visit-kedatangan.webp` |
| `e664790cfc687405fb271d1379c59bbc` | `assets/visit-sppd.webp` |
| `408fa297dc200e3184f59d75326b4ce0` | `assets/visit-selesai.webp` |
| `6827fee5b2d4e6a7a5ecebec22fd92bb` | `assets/jadwal-rapat.webp` |
| `aef86fdbe413241bc358b692114f5dca` | `assets/kalender-agenda.webp` |
| `deb7adcd9bed8463620807cdac22ee71` | `assets/presensi-qr.webp` |
| `1b760e482000544e03ecaad03c537317` | `assets/presensi-form.webp` |
| `c05b92af6d17757ab439f199c6486435` | `assets/presensi-daftar.webp` |
| `36303649171b6e28f38444211e190049` | `assets/e-notula.webp` |
| `4784712512c7fcdcb9444f55dffc4e88` | `assets/lainnya.webp` |
| `144a65526cc077461a453a56a3137b27` | `assets/m-tdd-form.webp` |
| `6724151ae26b1c93ed522ed7d44f107e` | `assets/m-presensi.webp` |
| `554f7458e6239f572482c3fb29f8a6e5` | `assets/tdd-detail.webp` |
| `8a309ea5340804db4944ce004d5d01c7` | `assets/rapat-lampiran.webp` |
| `81e49065621b80bf600c343acfd6be37` | `assets/visit-konfirmasi-bottom-crop.webp` |
| `064026891add81853b4f7222eed50985` | `assets/visit-disposisi-crop.webp` |
| `ef1cec508cc85c0c3a4afb64a0ac2f6f` | `assets/visit-notifikasi-crop.webp` |
| `b8ec001d9ff73abfed8950dfc01c1444` | `assets/visit-kedatangan-crop.webp` |
| `e12f086e658380c700ac448739df1822` | `assets/visit-sppd-crop.webp` |
| `8a103fa3d0a64eadc3afacaf45978856` | `assets/visit-selesai-crop.webp` |
| `c4304646168dfe157d0705646ee5cc01` | `assets/kalender-agenda-crop.webp` |
| `dd4b12fa5cbab37a056eb8dc151e4f69` | `assets/presensi-qr-crop.webp` |
| `30efb967b7d1f6327e15910b16fca507` | `assets/presensi-daftar-crop.webp` |
| `6cde970412830dddfc17860a94319085` | `assets/e-notula-crop.webp` |

The `-crop` files are the dialogs cut from their full screenshots by `crop-modals.py` (run it after `to-webp.py`).

## Slides and PRD

Bagian 1 (`sebelum` … `fitur`) covers PRD section 1 (problem and goals), section 2 (users), F1 and the F1–F16 grid. Bagian 2 shows F2–F15 on the real screens, each with its F-chip. `keamanan` is F16; `status` lists PRD section 8 (what remains before the official release). Every feature shown exists in `../prd.md`.

## Updating

1. PRD first: changes go into `../prd.md`, then flow down to the slides.
2. If the app changes, rebuild the screenshots (above), re-upload the changed files and update the ids.
3. Edit the slide files here, check with `node projects/sitari/presentation/preview-deck.cjs <out-dir>`, then publish the changed files to the artifact (same `deck/project/` paths).
4. Keep the rules: no pricing, every feature uses its PRD F-number, fictional data only.
