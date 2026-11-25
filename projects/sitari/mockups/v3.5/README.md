# SITARI v3.5 mockups

> **Superseded (2026-11-25): don't build from this folder.** The owner chose a different dashboard: v3's layout and wording in the Batam Pesisir colours, with "FO" renamed "Dalam", plus the signed-in account with sign-out next to the clock and v3's "Rapat Hari Ini" beside the visits (below them on phones). It lives in the `sitari-diskum-v3.5` repo at `docs/proposals/2026-11-25-theme-batam-pesisir/after/dashboard-final.html`, and design PR #2 §14 records it. Declined from this folder: the quick buttons and their dialogs, the Menunggu Konfirmasi chip and the Siap Diverifikasi line. The files below stay as history.
>
> Still worth carrying into the build: rows rendered with `textContent` and delegated listeners, never visitor data in `innerHTML` or `onclick` strings (see "Security" below).

Static HTML mockups for the v3.5 screens (Firebase Hosting front end, Gmail login, Apps Script API). They use **fictional data only** and carry the tokens and markup the v3.5 build should reuse.

| File | What |
|---|---|
| `dashboard.html` | Admin dashboard: today's counts, recent visits, today's meetings, and the "Catat tamu FO" and "Jadwalkan rapat" dialogs |
| `input.css` | Tailwind v4 entry with the `@theme` tokens from `../../DESIGN.md` (measured from the live v3 app) |
| `mockups.css` | Compiled output. Rebuild after any change (below). |
| `dashboard-pesisir.html` | The same dashboard in the **"Batam Pesisir"** palette (owner request, 2026-11-25). Same markup; only the stylesheet differs. |
| `input-pesisir.css` | Tailwind v4 entry with the Pesisir `@theme` tokens: deep green into sea blue on the header, warm off-white page, emblem gold for the one action button, one status colour per meaning. Codes use tabular figures instead of a monospace font. |
| `mockups-pesisir.css` | Compiled Pesisir output. |

```bash
npm run css -- -i projects/sitari/mockups/v3.5/input.css -o projects/sitari/mockups/v3.5/mockups.css --minify
```

```bash
npm run css -- -i projects/sitari/mockups/v3.5/input-pesisir.css -o projects/sitari/mockups/v3.5/mockups-pesisir.css --minify
```

```bash
npm run check:a11y -- projects/sitari/mockups/v3.5/dashboard.html projects/sitari/mockups/v3.5/dashboard-pesisir.html
```

The Pesisir palette comes from the theme proposal in the sitari-diskum-v3.5 repo (`docs/proposals/2026-11-25-theme-batam-pesisir`, revision 2). All its text and status-pill pairs are 5.9:1 or more, and the axe scan reports no violations. Whether the build uses it is the client's decision.

## Owner revision (2026-11-25): v3 wording and v3's compact layout

**The owner's rule:** change the layout, not v3's wording, and put a compact layout first. So:

- **Wording is v3's, except "FO".**
  - Labels as in v3: "Tamu Hari Ini", "Tipe Kedatangan", "Rapat Hari Ini", "Kendali SPPD", "Kunjungan Tamu Terbaru", "Pemakaian ruangan saat ini", "Semua", "Detail", "Belum Ditugaskan", "Jadwalkan Rapat".
  - The table uses v3's column titles: ID & Waktu, Asal Instansi / Pengunjung, Detail Tamu & Kontak, Bidang Tujuan & Agenda, Penerima Tamu, Status, Aksi.
  - Meeting states use v3's words: Selesai, Berlangsung, Terjadwal.
  - The owner dislikes "FO", so the walk-in type is called **Dalam** (Tamu Dalam Daerah, TDD), v3's other name for it.
- **The two dialogs use v3's forms.**
  - **Walk-in visitor:** "Pendaftaran Kunjungan Tamu Dalam Daerah". It has the TDD form's fields, labels and placeholders, and its "Kirim Pendaftaran Kunjungan" button. There is no "staf tujuan", because v3 routes by bidang. The Persetujuan Kontak box is new.
  - **Meeting:** "Buat Agenda Rapat Baru", with v3's fields in v3's order:
    - Judul Agenda Rapat, Pilih Ruangan Rapat, Tanggal, Jam Mulai, Jam Selesai;
    - Bidang Penyelenggara, then Pimpinan Rapat (filled in from Master_Pegawai but still editable);
    - Agenda / Keterangan;
    - the "Jadwalkan" button.
- **Compact layout from v3:**
  - On phones: a one-line header with the sign-out button, a 2×2 grid of the four v3 cards, and v3's bottom menu (Dashboard, Buku Tamu, Jadwal Rapat, Lainnya). The visits show as v3 cards: instansi, ketua (N Orang), status and Detail.
  - "Rapat Hari Ini" sits above the visits, as in v3; on wide screens its meetings form one row.
  - The visits table runs full width, with the agenda and address cut to one line.
- **New pieces kept small:**
  - "Menunggu Konfirmasi" is a count chip next to "Semua".
  - "Siap Diverifikasi" is one line in the Kendali SPPD card.
  - The signed-in account sits in the header.
  - The dashboard search box is gone; Buku Tamu has search.
- Both `dashboard.html` (v3 colours) and `dashboard-pesisir.html` (Batam Pesisir) use this markup. Make the Pesisir page by copying `dashboard.html` and swapping the stylesheet link, title and footer line.

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
