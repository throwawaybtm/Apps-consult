# SIMAK DISKUM presentation (source)

The client presentation "SIMAK DISKUM: PRD dan contoh tampilan" (20 slides, Indonesian). It lives as a Slides artifact; this folder is the source, so it is versioned with the PRD.

Published at: https://claude.ai/artifact/XpG5Ab1wBd4Tr5hcLfr3h5 (private; share from the page's Share menu, export to PowerPoint or PDF from the page).

## Contents

| Path | What |
|---|---|
| `deck/project/deck.json` | Index: title, slide order, sections, typeface (Plus Jakarta Sans) |
| `deck/project/deck.css` | Shared look: tokens from `../DESIGN.md`, type scale (120 / 64 / 40 / 28 / 24), cards, pins, rows |
| `deck/project/slides/<id>.html` | One file per slide, with speaker notes in `<aside>` |
| `assets/*.png` | Mockup screenshots used by the slides |
| `capture-deck-shots.cjs` | Regenerates `assets/*.png` from `../mockups/` and writes `pins.json` |
| `pins.json` | Where each numbered pin sits on the 960 x 600 frame, measured from `data-pin` in the mockups |

## Images

Slides reference images as `/_blob/<id>`, the ids the artifact assigned on upload. When the deck is rebuilt in a new artifact, upload these files and replace the ids:

| Id in the slides | File |
|---|---|
| `17e5328c46657c7511ce02efff72e7c2` | `assets/public-home.png` |
| `252bbe1e9797b018e379460edd404610` | `assets/public-kalender.png` |
| `7263c7af152bca5726525b2fbd2e70c6` | `assets/public-detail.png` |
| `ecf117a333cccf1f5d0d7ff7395a6ba1` | `assets/admin-dashboard.png` |
| `716aa49b4344174bf8b009aca5433019` | `assets/admin-kegiatan-a.png` |
| `fe895e021a8b9931008414d2cabd38c5` | `assets/admin-kegiatan-b.png` |
| `35021568022b6a354c98c4ee8a400604` | `assets/admin-laporan.png` |
| `cebe0c48813a06fa90ed5d9e7dcf676d` | `assets/m-public-home.png` |

## Slides and PRD

Screen slides 1 to 7 (`s-home`, `s-ponsel`, `s-kalender`, `s-detail`, `s-dashboard`, `s-form-1`/`s-form-2`, `s-laporan`) show F1 to F4, F6 to F12 and F14 to F16. F5, F13 and F17 to F19 have no mockup screen; they appear in the feature grid and the PRD. The `keputusan` slide lists the PRD's open questions 1 to 7 as decisions for the client.

## Updating

1. PRD first: scope changes go into `../prd.md`, then flow down to the slides.
2. If the mockups change, run `node projects/simak-diskum/presentation/capture-deck-shots.cjs` from the repo root, re-upload the changed PNGs, and move the pins using `pins.json`.
3. Edit the slide files here, then publish the changed files to the artifact (same `deck/project/` paths).
4. Keep the rules: no pricing, every feature uses its PRD F-number, personal data only as fictional examples.
