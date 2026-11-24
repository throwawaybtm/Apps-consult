# SI-TARI DISKUM design tokens

Source of truth for the look of the SITARI **presentation** (`presentation/deck/project/deck.css`) and **video** (`video/src/theme.ts`). The app already exists, so these tokens are **measured from the real app** (computed styles in the local preview, `Admin/Stylesheet.html`, Tailwind classes in `Admin/Index.html`), not designed fresh. The deck and video should feel like the app the audience will open.

No Tailwind build here: the deck is plain CSS (Slides artifact) and the video is Remotion inline styles. If the Dinas later rebuilds SITARI on the default stack, these tokens go into its `@theme` block unchanged.

## Character

Civic and calm: a **deep green-to-navy header** (the Dinas' green), white rounded cards on a cool light-grey page, **emerald** accents, bold **amber** action buttons, and soft-tinted status pills. Codes and the WIB clock use a monospace face. The Kota Batam crest sits in a rounded tile on the header.

## Colours (from the app)

| Token | Value | Where in the app | Deck / video use |
|---|---|---|---|
| `header-from` → `header-via` → `header-to` | `#064e3b` → `#134e4a` → `#0f172a` | Header gradient (`from-emerald-900 via-teal-900 to-slate-900`), form page backgrounds | Cover, section dividers, video title and closing scenes |
| `primary` / `primary-to` | `#11504a` / `#143238` | Dark buttons ("Kirim Pendaftaran", "Jadwalkan", VALIDASI) | Primary chips and rules |
| `accent` | `#10b981` | Emerald icons and highlights | Large numerals, icon tiles on dark (not small text on white) |
| `accent-strong` | `#047857` | Emerald text links ("Semua") | Accent text on white (5.5:1) |
| `accent-soft` | `#d1fae5` | Selesai pill, info banners (`#ecfdf5`) | Soft fills |
| `accent-on-dark` | `#a7f3d0` | Date under the clock in the header | Captions/eyebrows on the dark gradient |
| `page` | `#f4f7fa` | Page background (`slate-100` at 70% on white) | Slide background |
| `surface` | `#ffffff` | Cards, modals | Cards |
| `border` | `#e2e8f0` | Card and table borders | Card borders |
| `foreground` | `#1e293b` | Body text | Body text (14.6:1) |
| `heading` | `#0f172a` | Headings, codes | Headings |
| `muted` | `#64748b` | Table headers, secondary text | Secondary text on white only (4.8:1); on `page` use `#475569` (`muted-on-page`, 7.0:1), because `#64748b` is 4.4:1 there |
| `action` | `#d97706` | EDIT / Edit Rapat buttons (white text) | **Large** shapes only; see deviations |
| `action-text` | `#b45309` | (darker amber) | Amber text or small-text buttons in the deck (5.0:1 with white) |

### Status pills (exact app pairs)

| Status | Background | Text | Contrast |
|---|---|---|---|
| Menunggu Konfirmasi | `#fef3c7` | `#78350f` | 8.2:1 |
| Sudah Disposisi | `#e0f2fe` | `#075985` | 6.6:1 |
| Menunggu Kedatangan | `#ede9fe` | `#5b21b6` | 7.6:1 |
| Kelola SPPD | `#ffedd5` | `#7c2d12` | 8.2:1 |
| Selesai | `#d1fae5` | `#065f46` | 6.8:1 |
| Non-SPPD | `#f1f5f9` | `#475569` | 6.9:1 |

The pills always carry the status word; colour is never the only signal.

### Deviations (accessibility, deck/video only)

- The app's amber buttons (`#d97706`, white text) are 3.2:1, below WCAG 2.2 AA for small text. In screenshots they stay as the app shows them. In our own deck/video elements, amber is used for large shapes or with `#b45309`.
- `accent` `#10b981` is 2.5:1 on white, so it is never text on white. On `#064e3b` it is 3.8:1: large numerals only. Small text on the dark gradient uses `#a7f3d0` (7.6:1) or white.
- `muted` `#64748b` is 4.4:1 on the `page` grey, so secondary text placed directly on the page uses `#475569`.

## Type

| Role | Face | Notes |
|---|---|---|
| Everything | **Plus Jakarta Sans** 400/600/700/800 | The app's own font (Google Fonts, SIL OFL). Video uses the TrueType files already in `projects/simak-diskum/video/public/fonts/` (copied to `video/public/fonts/`). |
| Codes, clock | **JetBrains Mono** 600/700 | The app's mono face (SIL OFL) for `TLD-24112026-004` style codes and "10:15:00 WIB". In the video, Plus Jakarta Sans with tabular numbers is used instead to avoid shipping another font. |

Deck scale (1920 × 1080 frame): 120 / 72 / 48 / 32 / 26. Video captions 40 px, 600 weight, on a dark translucent bar.

## Shape and depth

| Token | Value | App use |
|---|---|---|
| `radius-card` | 24 px | Cards and modals |
| `radius-control` | 12 px | Buttons, inputs, nav pills |
| `radius-pill` | 999 px | Status pills |
| `shadow` | `0 20px 40px -24px rgb(15 23 42 / .35)` | Raised cards on the deck (the app uses borders more than shadows) |

## Iconography

The app uses Font Awesome Free (solid). The deck uses simple inline SVG line icons of our own (no icon font), in emerald tiles, so the slides stay lightweight. The Kota Batam crest is not redrawn; it appears only inside screenshots.

## Our touches (deck and video only)

- **"Hari ini" frame:** the story takes place on Selasa, 24 November 2026, 10.15 WIB (the frozen preview clock), so every screen agrees.
- **Feature chips:** `F1`…`F16` in a white pill with `primary` text, matching the PRD numbers.
- **Before / after:** paper-grey (`#e7e5e4`, `#57534e`) for "sebelum", the app's green for "sesudah".
