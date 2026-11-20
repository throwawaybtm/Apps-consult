# e-BLUD presentation (source)

The client presentation "e-BLUD: PRD dan contoh tampilan" (20 slides, Indonesian). It lives as a Slides artifact; this folder is the source, so it is versioned with the PRD.

Published at: https://claude.ai/artifact/FdXBFybQm1WCVoLktg34Jv (private; share from the page's Share menu, export to PowerPoint or PDF from the page).

## Contents

| Path | What |
|---|---|
| `deck/project/deck.json` | Index: title, slide order, sections, typeface (Inter) |
| `deck/project/deck.css` | Shared look: tokens, type scale (120 / 64 / 40 / 28 / 24), cards, pins, rows |
| `deck/project/slides/<id>.html` | One file per slide, with speaker notes in `<aside>` |
| `assets/*.png` | Mockup screenshots used by the slides |
| `capture-deck-shots.cjs` | Regenerates `assets/*.png` from `../mockups/` |

## Images

Slides reference images as `/_blob/<id>`, the ids the artifact assigned on upload. When the deck is rebuilt in a new artifact, upload these files and replace the ids:

| Id in the slides | File |
|---|---|
| `2b0f74f6082ffb41612c5318366d537d` | `assets/public-home.png` |
| `81cf8f04b621993343c243e86394e917` | `assets/public-daftar.png` |
| `2b1d2eba0c7805447d8c70b7d85f01f7` | `assets/admin-dashboard.png` |
| `9239880995c46e98ca5b86ac277f6d2a` | `assets/admin-verifikasi.png` |
| `6e96b4965344ca0a89124788dba3f99f` | `assets/admin-permohonan.png` |
| `2eeaae9670400c7985b12952b38410e7` | `assets/m-public-daftar.png` |

The numbered pins on the screen slides are placed by hand (pixel positions on the 960 x 600 frame). If the mockups change, re-capture the screenshots and re-check the pins.

## Updating

1. PRD first: scope changes go into `../prd.md`, then flow down to the slides.
2. Edit the slide files here, then publish the changed files to the artifact (same `deck/project/` paths).
3. Keep the rules: no pricing, every feature uses its PRD F-number, assumptions labeled.
