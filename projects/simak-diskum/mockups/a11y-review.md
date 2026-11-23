# Accessibility review: SIMAK DISKUM mockups

Date: 2026-11-23. Pages: `public-home`, `public-kalender`, `public-detail`, `admin-dashboard`, `admin-kegiatan`, `admin-laporan`. Standard: WCAG 2.2 AA (the project bar; the `design:accessibility-review` checklist is 2.1 AA, so 2.2's target size and focus-not-obscured were checked too).

## Method
1. `npm run check:a11y` (axe-core, WCAG 2.0 to 2.2 A/AA).
2. `node mockups/check.cjs`: no horizontal scroll at 360 px, `lang="id"`, one `main`, visible "contoh" notice.
3. A scripted manual pass in Chromium on every page: computed text contrast (every text node against its real background), a full Tab walk (order, visible focus ring, focus not hidden behind other content), target sizes, 320 px reflow with and without the WCAG text-spacing override, headings, landmarks, labels and duplicate ids, and keyboard use of the public menu and the admin drawer.

## Result after fixes
axe: **no violations** on all six pages. Contrast: **no failing text** on any page. Tab walk: logical order (skip link, header, navigation, page content), every stop has a visible 3 px ring, nothing is covered by a sticky element. 320 px: no horizontal scroll, also with text-spacing overrides. Public menu and admin drawer open from the keyboard, close with Escape and return focus to their button. One `h1` per page, headings in order, labels on every field, no duplicate ids.

## Found and fixed in this pass
| # | Finding | Criterion | Fix |
|---|---|---|---|
| 1 | Placeholder text used the stock 50% tint of the text colour, about 3.2:1 | 1.4.3 | Placeholder uses `muted-foreground`, fully opaque (`input.css`) |
| 2 | The time inputs (jam mulai, jam selesai) showed no focus ring | 2.4.7 | The focus-within rule that covered date inputs now covers time inputs |
| 3 | Calendar event links were 20 px high | 2.5.8 | Minimum height 24 px |
| 4 | Breadcrumb links, dashboard table links and the Batalkan summary were 18 to 21 px high | 2.5.8 | Minimum height 24 px |
| 5 | With text-spacing overrides at 320 px, the calendar view switch and the four stage labels overflowed by 4 to 9 px | 1.4.12, 1.4.10 | View switch wraps; stages are two columns on phones, four from 640 px |
| 6 | "Today" in the calendar was shown by a gold fill only (1.8:1 against white) | 1.4.1, 1.4.11 | Added a dark ring; it already had bold text and `aria-current="date"` |
| 7 | Out-of-month days (26 to 31 Okt, 1 to 6 Des) read as plain numbers to a screen reader | 1.3.1 | Added a visually hidden month name |

## Still open: for the real app, not fixable in static mockups
- **No real screen-reader test** (VoiceOver, NVDA). Reading order of the calendar and the live announcement of the inline bentrok warning and the meeting-link error need one.
- **Calendar on phones:** the month view shows dots only below 640 px, and events are reached through the Daftar view (the PRD's F2 says Daftar is the phone default). The app must keep that default and the Daftar view must be fully keyboard and screen-reader usable.
- **"Dihadiri oleh"** is a plain `select` in the mockup. The real field is a multi-select (shadcn combobox); it needs an accessible name, announced selected count and keyboard removal of chips.
- **Bentrok warning** has `role="status"`; in the app it must update as the fields change without moving focus (F9), and the field error for the meeting link must be linked with `aria-describedby` (already in the mockup) and announced on save.
- **Report preview** (F14) is a visual stand-in for the A4 page; the downloaded PDF, Excel and image outputs need their own checks (tagged PDF, header row in Excel, text alternative for the image).
- **Gold "now" row** on the public dashboard is supplemented by the "Berlangsung" badge text; keep that text in the app.
- Presentation and video screenshots were taken before fixes 1 and 6, so they differ slightly from the current pages (placeholder tint, today ring). They are illustrations; re-run `presentation/capture-deck-shots.cjs` and `video/capture.cjs` if exact match matters.
- **Needs a manual check (axe):** `label-content-name-mismatch` on the calendar previous and next buttons (they show ‹ and › and are spoken as "Bulan sebelumnya" and "Bulan berikutnya"). This is intended.

## Design choices that carry accessibility
- Status is text plus colour (and strikethrough for cancelled); gold is a marker only, never text on white.
- Conflict warning and the meeting-link error are inline text linked to their fields, not dialogs.
- Input border and focus ring are darker and opaque than stock shadcn (see `../DESIGN.md`).
- No animation in the mockups; `prefers-reduced-motion` is respected.
