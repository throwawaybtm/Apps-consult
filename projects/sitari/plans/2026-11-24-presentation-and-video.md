# SITARI presentation and video: implementation plan

Date: 2026-11-24
Design: `../design.md` (confirmed by the user on 2026-11-24: audience everyone, story "why this helps" then "everyday staff use", finished-product tone, Indonesian, no pricing, real UI from the local preview with fictional data).

**Goal:** a Slides deck and a 60–90 s Remotion video that present the finished SITARI DISKUM trial app, built from screenshots of the real UI with fictional data.

**Source app:** `throwawaybtm/sitari-diskum-v3` `main`, cloned read-only to `/home/user/throwawaybtm/sitari-diskum-v3` (outside this repo). Its local preview (`local-test/server.js`) runs on Node built-ins with in-memory data. Gitignored config is bootstrapped from `config-templates/` (`node local-test/setup-local.js --from-templates`); real config files are never requested.

**Safety rules (every task):** never open the live `/exec` deployment; never run clasp, push to the SITARI repo, or touch its Sheets, Drive or Fonnte; every name, phone number, NIP and institution in a capture is fictional; no pricing.

## Task 1: codebase map

- Write `research/codebase-map.md` (English): surfaces (Admin, Public TDD/TLD forms, Presensi), each Admin tab and modal, the visit workflow as the code has it (`Admin/VisitWorkflow.js`: Menunggu Konfirmasi → Sudah Disposisi → Menunggu Kedatangan → Kelola SPPD → Selesai; TDD = Non-SPPD), meetings (rooms, postpone/reschedule/lock/cancel, Rapat Pimpinan), attendance (QR, manual, cutoff rule), SPPD, E-Notula and PDFs, photos, document sharing, archive, monthly tools, notifications.
- Where `GLOSSARY.md` and the code disagree, the code wins; record the difference (for example, glossary statuses Ditolak/Dibatalkan for visits).
- Done when every feature area in `design.md` is either confirmed with a file reference or marked "not in code".

## Task 2: as-built PRD

- Write `prd.md` (Indonesian) per `docs/checklists/prd.md`, features F1…Fn from Task 1, each with requirements and acceptance criteria describing current behaviour.
- "Approval" and "Open questions" become as-built notes (status: trial app, not yet released; Release Gate items such as Admin access, Fonnte number, retention policy).
- Done when every checklist section is present or marked not applicable.

## Task 3: DESIGN.md

- Take tokens from `Admin/Stylesheet.html` and `Index.html` (dark green gradient header, emerald accents, white cards, page background, status badge colours, font). Check text contrast against WCAG 2.2 AA; note any deviations used in the deck/video.
- Font: the app's font if it is free and has TrueType files; otherwise Plus Jakarta Sans (as simak-diskum) and say why.

## Task 4: fictional seed and screenshots

- `presentation/seed-preview.cjs`: starts the SITARI preview via `createLocalTestServer({ seed, employees })` with fictional staff and a fictional day of visits, meetings, attendance and SPPD in every status. Path to the clone comes from `SITARI_DIR`.
- `presentation/capture-shots.cjs`: Playwright captures at 1440 × 900 (desktop, deviceScaleFactor 2) and 390 × 844 (phone): dashboard, Buku Tamu, TLD form, TDD form, visit modal per stage, Jadwal Rapat calendar, Presensi QR form, Kendali SPPD, E-Notula, Lainnya tools. Writes `presentation/assets/*.png` and highlight boxes (`rects.json`) for the video.
- Done when every screenshot has been looked at and shows no empty state that should be full, and no real data.

## Task 5: Slides deck

- Source in `presentation/deck/project/` (deck.json, deck.css, one HTML per slide with speaker notes), same structure as `projects/simak-diskum/presentation/`.
- Order: cover → agenda → before SITARI → what changes → who uses it → feature overview (F-numbers) → everyday use, one slide per workflow with screenshots → on the phone → data and privacy safeguards → status and next steps (no pricing) → closing.
- Publish as a Slides artifact; record the URL and image ids in `presentation/README.md`.

## Task 6: Remotion video

- `video/` copied in structure from `projects/simak-diskum/video/` (Root, scenes, components, theme with SCENES captions, sfx). About 12 scenes, 75–90 s, 1920 × 1080, 30 fps, Indonesian captions, F-chips.
- Sounds via `npm run sfx` (CC0 only by preference), music about −20 dB with fades.
- Check stills with `npm run video:still`, run `npm run sfx -- status sitari`, **ask the user about credits**, then render with `npm run video` to `video/out/sitari-demo.mp4`.

## Task 7: checks and hand-off

- `npm run check:a11y` on every HTML page produced (slides rendered standalone if possible).
- `npm test`, clean `git status`, push the `claude/...` branch, fast-forward `main` and push it (CLAUDE.md branch rule). Report that `main` was updated.
