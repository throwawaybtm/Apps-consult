# SITARI v3.5 mockups

Static HTML mockups for the v3.5 screens (Firebase Hosting front end, Gmail login, Apps Script API). They use **fictional data only** and carry the tokens and markup the v3.5 build should reuse.

| File | What |
|---|---|
| `dashboard.html` | Admin dashboard: today's counts, recent visits, today's meetings, and the "Catat tamu FO" and "Jadwalkan rapat" dialogs |
| `input.css` | Tailwind v4 entry with the `@theme` tokens from `../../DESIGN.md` (measured from the live v3 app) |
| `mockups.css` | Compiled output. Rebuild after any change (below). |

```bash
npm run css -- -i projects/sitari/mockups/v3.5/input.css -o projects/sitari/mockups/v3.5/mockups.css --minify
```

```bash
npm run check:a11y -- projects/sitari/mockups/v3.5/dashboard.html
```

## Dashboard: what changed from the first draft, and why

The first draft (Tailwind CDN, Lucide from unpkg, sample data) was reviewed on 2026-11-25. This version fixes:

- **Security:** rows are built with `textContent` and one delegated click listener that looks the visit up by its code. The draft put visitor names into `onclick="…"` strings, so a name from the public TLD form could break out and run script in the admin's browser.
- **Real SITARI data:** statuses from `GLOSSARY.md` with the app's pill colours, the nine real bidang, `TLD-`/`TDD-ddmmyyyy-nnn` codes, Kendali SPPD with counts, and "today" vs "total" kept apart.
- **Real flows:**
  - "Catat tamu FO" only records walk-ins, with the TDD fields: ketua and anggota rombongan, jumlah, WhatsApp, bidang and staf tujuan, keperluan, and the contact consent. TLD requests stay on the public form.
  - "Jadwalkan rapat" has a date, start and end times (end must be after start), a room, the bidang penyelenggara, and the pimpinan filled in from Master_Pegawai.
- **v3.5:** shows the signed-in Gmail account with a sign-out button (Firebase Auth).
- **Phones:** the visits table is a real `<table>` that turns into labelled cards when its own container is narrow (container query). The navigation wraps.
- **Accessibility (WCAG 2.2 AA):**
  - Native `<dialog>` with `showModal()`, so focus stays in the dialog, Esc closes it and focus goes back to the button.
  - Labelled fields. Errors show only after interaction (`:user-invalid`), with text, and are linked for screen readers.
  - Icon buttons have `aria-label`, and the menu marks the current page with `aria-current`.
  - The table scroll region can be reached by keyboard.
  - The action button is darkened to `#b45309`.
  - Reduced motion stops the shimmer and the blinking dot.
- **Our rules:** compiled Tailwind v4 with the project's `@theme` (no CDN script), and icons inlined as SVG (no unpinned CDN). The "Preview Skeleton" developer toggle and the tech label in the footer are gone.

`npm run check:a11y`: no violations. Colour contrast on tinted backgrounds is listed for a manual check; the status pill pairs are measured in `DESIGN.md`.

## Not decided here

- **Scope:** the v3.5 design keeps the client-approved screens. A redesigned dashboard is a scope change, so it needs the client's approval before the build uses it.
- **Fictional content:** the rooms, staff and the counts are placeholders. The real ones come from `getMeetingRoomOptions`, `getMasterData` and `getDashboardSummary`.
