# SITARI: design

Date: 2026-11-24
Status: Draft. Confirm with the user before building (in the "SITARI Project" session).

## Intent

SI-TARI DISKUM (Sistem Informasi Tamu & Rapat Internal) is the user's **finished trial app** for Dinas Koperasi dan Usaha Mikro Kota Batam. It is a Google Apps Script web app: Google Sheets is the database, Drive holds the uploads, and WhatsApp messages go through Fonnte.

- Source: `throwawaybtm/sitari-diskum-v3` (public; clone it read-only). Its `.claude/skills/sitari-knowledge/` holds the architecture, data model and code map; `GLOSSARY.md` holds the domain terms.
- Live: a GAS `/exec` deployment the user shared. **Do not capture or copy anything from it** (see Privacy).

Unlike simak-diskum, this is **not a proposal for approval**. The presentation and video tell the story of a finished product.

## Audience and story

Everyone watches: leadership (Kepala Dinas) and the staff who use it daily. The user wants two threads, in this order:

1. **Why this helps:** the problem before (paper guest book, schedules and attendance by hand, SPPD evidence scattered), and what SITARI changes.
2. **Everyday staff use:** the main workflows step by step, as a staff member would do them.

## Deliverables (this round)

1. `research/codebase-map.md`: what the app does, mapped from the repo (surfaces, features, workflows, statuses). English.
2. `prd.md`: an **as-built** Indonesian PRD per `docs/checklists/prd.md`, with features numbered F1…Fn taken from the code. The deck and video cite these numbers. It records what exists; it is not waiting for client approval. Mark sections that don't apply to an as-built app as such instead of inventing content.
3. `DESIGN.md`: tokens taken from SITARI's real look (dark green gradient header, emerald accents, white cards, the Dinas logo), so the deck and video match the app.
4. Screenshots of the real app UI with **fictional data**, captured from the repo's local preview (`local-test/server.js`, synthetic fixtures; see its `docs/LOCAL_SETUP.md`), at desktop and phone widths.
5. **Presentation**: a Slides artifact, with its source in `presentation/` (same setup as `projects/simak-diskum/presentation/`). Indonesian, no pricing.
6. **Video**: Remotion, 60–90 seconds, Indonesian captions, CC0 sound and quiet music through `npm run sfx`, in `video/` (same setup as `projects/simak-diskum/video/`). Render with `npm run video`.

## Feature areas to cover (confirm against the code)

- Dashboard: guests today, TDD vs TLD, meetings today, Kendali SPPD status.
- Buku Tamu: Tamu FO walk-in check-in (TDD) and Tamu Luar planned visits (TLD), with the Surat Permohonan upload.
- Visit workflow: Menunggu Konfirmasi → Dikonfirmasi / Ditolak / Dibatalkan → Selesai, staff assignment, staff-clash warning, WhatsApp notifications, the visitor's cancellation link.
- Jadwal Rapat: calendar, room booking, Rapat Pimpinan.
- Presensi: QR attendance per agenda, admin-entered attendance, Lihat Presensi.
- Kendali SPPD: three evidence files, verification, reopening with a reason and audit note.
- E-Notula and the A4 PDFs, meeting photos, document sharing, archive.

## Non-goals

- Guidebook, dev handbook and agent kit: not this round.
- Rebuilding or changing the app. Nothing is pushed, deployed or written to the live Sheets, Drive or Fonnte.
- Pricing anywhere.

## Anti-goals

- Any real name, phone number, NIP or visitor data in the repo, deck or video.
- Showing a feature the code doesn't have.
- A "please approve" tone. This is a finished product.

## Privacy and security (checkpoint 3)

The shared `/exec` link opens the **Admin dashboard without a login** and shows real visitors' names and WhatsApp numbers. The repo notes say Admin must be restricted before the official release. Tell the user once in the new session; the fix is theirs to make in the GAS deployment settings. All captures use the local preview's fictional data.

## Approaches

- **Chosen:** capture the real UI from the local preview with synthetic data. It looks exactly like the product and is safe to share.
- Rejected: screenshots from the live app with blurred data. One missed blur leaks personal data, and the files can't be shared freely.
- Rejected: redrawn HTML mockups (the simak-diskum way). There is no need: the product exists, and redrawing it can drift from the real thing.

## Left to the builder

- The exact F-list, slide order and video storyboard (around 12 scenes, as in simak-diskum).
- If the local preview can't run without the gitignored private config, build fictional config from `config-templates/` (the `.example` files). Never ask for the real files.
- Run `npm run check:a11y` on any HTML page you produce, and follow the "Optional: demo video" rules in `CLAUDE.md`, including asking about credits before the final render.
