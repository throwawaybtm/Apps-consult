# Accessibility review: SIMAK DISKUM mockups

Date: 2026-11-23. Pages: `public-home`, `public-kalender`, `public-detail`, `admin-dashboard`, `admin-kegiatan`, `admin-laporan`. Standard: WCAG 2.2 AA.

## Automated
`npm run check:a11y` (axe-core, WCAG 2.0–2.2 A/AA): **no violations** on all six pages. One finding was fixed on the first run: the calendar used `role="grid"` without rows; it is now a plain labelled group. `node mockups/check.cjs`: no horizontal scroll at 360 px, `lang="id"`, one `main`, visible "contoh" notice on every page.

## Open item for the manual pass
`design:accessibility-review` has **not** been run yet. Still to judge by hand: reading order of the calendar cells, the focus order of the form (conflict warning and field error placement), keyboard use of the view switch, and a 320 px pass with text-spacing overrides. The "needs manual check" item `label-content-name-mismatch` (calendar previous/next buttons show ‹ and › with a spoken label) is intended.

## Design choices that carry accessibility
- Status is text plus colour (and strikethrough for cancelled); gold is a marker only, never text on white.
- Conflict warning and the meeting-link error are inline text linked to their fields, not dialogs.
- Input border and focus ring are darker and opaque than stock shadcn (see `../DESIGN.md`).
