# e-BLUD First Round Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce research notes, a draft PRD v0 (Indonesian) and three static mockup screens that show the client the e-Dagulir-style workflow in two looks (public: modern; admin: modern government style).

**Architecture:** Documents are Markdown in `projects/e-blud/`. Mockups are static HTML, CSS and a little vanilla JS in `projects/e-blud/mockups/`, no build step, fake data only. Screenshots are taken with the preinstalled Playwright Chromium.

**Tech Stack:** Markdown, HTML/CSS/JS (Baseline Widely available only), Inter font, Chart.js 4.4.0 from cdnjs for the charts, Playwright (already installed; never run `playwright install`).

**Spec:** `projects/e-blud/design.md` (approved 2026-11-19)

## Global Constraints

- Project folder is `projects/e-blud/`; plans live in `projects/e-blud/plans/`, never `docs/superpowers/`.
- PRD and anything the client sees: Indonesian; technical terms (API, login, dashboard) untranslated. Research notes and plan: English.
- PRD follows `docs/checklists/prd.md` (about 3–5 pages); features numbered F1…F14 as in the design.
- Every assumption taken from e-Dagulir is labeled "Asumsi" and listed under "Open questions" (10 items in the design).
- No pricing anywhere.
- Mockups: fake data only, labeled "contoh"; BLUD name and logo are placeholders; no Payakumbuh coat of arms, names, NIK or photos.
- Public site shows aggregate numbers only, never anything about an individual mitra.
- Quality bars: WCAG 2.2 AA, Core Web Vitals good (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1), Baseline Widely available.
- Public look: sky-blue (`sky-600` to `sky-900` over `sky-50`), Inter, rounded cards 0.5rem–15px. Admin look: sidebar layout, KPI cards, tables, government style.
- Before writing any HTML, CSS or JS, load `modern-web-guidance`; use `frontend-design` for the look.
- When finished (`npm test` passes, `git status` clean), merge into `main` and push `main`, per CLAUDE.md.

## Review Focus

- Mitra data leaking onto the public page (name, NIK, photo): public page must contain none; test greps for them.
- Payakumbuh identity leaking into mockups or PRD (name "Payakumbuh", coat of arms, "e-Dagulir" as the product name): only allowed in `research/`.
- Narrow phone width (360px): no horizontal page scroll on any mockup.
- Keyboard-only use: skip link, visible focus, charts have a text alternative.
- Fonts or CDN unreachable: page still readable with fallback fonts and without Chart.js (charts show their data table).

## File Structure

- `projects/e-blud/research/e-dagulir-analysis.md`: what e-Dagulir does (PPTX + PDF), flow, roles, controls.
- `projects/e-blud/research/simantab-look.md`: Simantab look and public-page pattern.
- `projects/e-blud/research/simplification.md`: e-Dagulir modules mapped to F1–F14, what was merged or dropped.
- `projects/e-blud/prd.md`: PRD v0, Indonesian.
- `projects/e-blud/mockups/shared.css`: tokens (colors, type, spacing) shared by the three pages.
- `projects/e-blud/mockups/public-home.html`: screen 1.
- `projects/e-blud/mockups/admin-dashboard.html`: screen 2.
- `projects/e-blud/mockups/admin-permohonan.html`: screen 3.
- `projects/e-blud/mockups/check.cjs`: node script that screenshots and checks the three pages.
- `projects/e-blud/mockups/screenshots/`: PNG output at 1440px and 360px wide.

---

### Task 1: Research notes

**Files:**
- Create: `projects/e-blud/research/e-dagulir-analysis.md`, `projects/e-blud/research/simantab-look.md`, `projects/e-blud/research/simplification.md`

**Interfaces:**
- Produces: the F1–F14 table in `simplification.md` (columns: ID, name, e-Dagulir source module, change). Task 2 copies the IDs and names from it verbatim.

- [ ] **Step 1: Write `e-dagulir-analysis.md`** from the design's "What the references show" section, expanded: the 26-step flow of the PDF in order, the roles, the SOP controls, the dashboard cards, the 18 report groups from PPTX slides 15–18. Include a "Sources" list (PPTX, PDF, with page or slide numbers). Contain no personal data from the PDF's screenshots.
- [ ] **Step 2: Write `simantab-look.md`**: section list, color tokens (`sky-*`), font, radii, libraries, hero and CTA pattern, tracking pattern. State plainly that it was read from source, not rendered.
- [ ] **Step 3: Write `simplification.md`**: the F1–F14 table, then the merges (five loan list pages into one "Pinjaman" with status filters, "Pelayanan Batal" as a status, reports reduced to a core set) and the Batam-specific unknowns, each tagged "Asumsi".
- [ ] **Step 4: Verify** with `grep -c "F1[0-4]\|F[1-9]\b" projects/e-blud/research/simplification.md`. Expected: at least 14 lines. Verify no real personal data: `grep -rniE "SINDY|EKA BUDY|IHSANUL|ARIS PRATAMA" projects/e-blud/research`. Expected: no output.
- [ ] **Step 5: Commit** `git add projects/e-blud/research && git commit -m "docs(e-blud): add research notes"`

### Task 2: PRD v0

**Files:**
- Create: `projects/e-blud/prd.md`

**Interfaces:**
- Consumes: F1–F14 names from `research/simplification.md`.
- Produces: feature IDs F1–F14 that the mockups reference by label.

- [ ] **Step 1: Write `prd.md`** in Indonesian following every item of `docs/checklists/prd.md`: problem and goals, users (roles marked Asumsi), features F1–F14 each with requirements and "Given … when … then …" acceptance criteria, out of scope (pricing, Excel import, online payment, mobile app), success measures, constraints (free-first, personal-data rule), open questions (the 10 from the design, each with who answers), approval block left blank. Put a banner at the top: "DRAFT v0: alur mengikuti asumsi, belum divalidasi dengan klien".
- [ ] **Step 2: Verify coverage:** `for i in $(seq 1 14); do grep -q "F$i\b" projects/e-blud/prd.md || echo "missing F$i"; done`. Expected: no output. Verify no pricing: `grep -niE "Rp ?[0-9]|harga|biaya pembuatan" projects/e-blud/prd.md`. Expected: no output.
- [ ] **Step 3: Verify identity rule:** `grep -niE "payakumbuh|dagulir" projects/e-blud/prd.md`. Expected: no output.
- [ ] **Step 4: Commit** `git add projects/e-blud/prd.md && git commit -m "docs(e-blud): add draft PRD v0"`

### Task 3: Shared tokens and public home mockup

**Files:**
- Create: `projects/e-blud/mockups/shared.css`, `projects/e-blud/mockups/public-home.html`, `projects/e-blud/mockups/check.cjs`

**Interfaces:**
- Produces: CSS custom properties in `shared.css`: `--sky-50`, `--sky-600`, `--sky-700`, `--sky-900`, `--ink`, `--radius-card`, `--font-sans`; classes `.card`, `.stat`, `.sr-only`, `.skip-link`. Task 4 reuses them.
- Produces: `check.cjs` exposing `node check.cjs <page.html>...`, which writes `screenshots/<name>-1440.png` and `-360.png` and exits non-zero on failure (see step 1).

- [ ] **Step 1: Write `check.cjs` first.** It opens each page given as an argument with Playwright Chromium and fails when: `document.documentElement.scrollWidth > innerWidth` at 360px; any `<img>` lacks `alt`; the page has no `<main>`, no `<title>` or no `lang="id"`; the page contains no visible text "contoh". Write the screenshots.
- [ ] **Step 2: Run it against a missing file** `node projects/e-blud/mockups/check.cjs projects/e-blud/mockups/public-home.html`. Expected: FAIL (file not found).
- [ ] **Step 3: Implement `public-home.html`** with `shared.css`: skip link, header nav (Beranda, Profil, Layanan, Berita, Kontak), hero with "Ajukan Pembiayaan" and "Lacak Permohonan" buttons, three aggregate stat cards (total mitra, pembiayaan tersalurkan, pembiayaan lunas), a bar chart and a donut chart with a visually hidden data table each, a tracking-code form, footer. Placeholder logo is a text monogram "e-BLUD". Fake aggregate numbers labeled "contoh data". Chart.js loads from cdnjs; without it the data tables stay visible.
- [ ] **Step 4: Run `check.cjs` on it.** Expected: PASS, two PNGs written. Open both PNGs and confirm the layout by eye.
- [ ] **Step 5: Run the public-data test:** `grep -niE "nik|[0-9]{16}|\.jpg|\.png" projects/e-blud/mockups/public-home.html`. Expected: no output.
- [ ] **Step 6: Commit** `git add projects/e-blud/mockups && git commit -m "feat(e-blud): add shared tokens and public home mockup"`

### Task 4: Admin mockups

**Files:**
- Create: `projects/e-blud/mockups/admin-dashboard.html`, `projects/e-blud/mockups/admin-permohonan.html`

**Interfaces:**
- Consumes: tokens and classes from `shared.css`; `check.cjs`.

- [ ] **Step 1: Run `check.cjs` on both missing files.** Expected: FAIL.
- [ ] **Step 2: Implement `admin-dashboard.html`:** government-style layout with dark sidebar (Dashboard, Mitra, Permohonan, Pencairan, Pembayaran, Laporan; collapses to a menu button below 768px), KPI cards for today, this month and this year, a bar chart and a donut chart with data tables, a small "Pinjaman" table with status filter chips (Berjalan, Lunas, Batal) and fake rows with placeholder avatars (initials, no photos).
- [ ] **Step 3: Implement `admin-permohonan.html`:** the F3 form: pilih mitra, jumlah pembiayaan, jangka waktu, jenis usaha, 10-item persyaratan checklist (labels taken from the PDF's list: foto copy KTP, Kartu Keluarga, proposal, rekomendasi kelurahan, bukti PBB, rekening listrik atau air, surat jaminan, sertifikat; reworded generically), tanggal rencana pencairan with an inline validation message for the "maksimal tanggal 28" assumption, Simpan and Kembali buttons. Every label tied to its input; the error message is announced (`aria-live="polite"`).
- [ ] **Step 5: Run `check.cjs` on both.** Expected: PASS, four PNGs written. View them.
- [ ] **Step 6: Verify identity rule:** `grep -rniE "payakumbuh|dagulir" projects/e-blud/mockups --include=*.html --include=*.css`. Expected: no output.
- [ ] **Step 7: Commit** `git add projects/e-blud/mockups && git commit -m "feat(e-blud): add admin dashboard and permohonan mockups"`

### Task 5: Accessibility pass and handover

**Files:**
- Modify: any file under `projects/e-blud/mockups/` where an issue is found.

- [ ] **Step 1: Run `design:accessibility-review`** on the three pages (Axe MCP is not connected in this session, so say so). Check keyboard order, visible focus, contrast of every text and background pair, target size 24px, reduced-motion handling for any animation.
- [ ] **Step 2: Fix every finding** in place and re-run `node projects/e-blud/mockups/check.cjs` on all three pages. Expected: PASS.
- [ ] **Step 3: Verify budget:** `du -ch projects/e-blud/mockups/*.html projects/e-blud/mockups/*.css | tail -1`. Expected: under 200K, and no image over 200K in `screenshots/`.
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Mark** the "Next steps" in `design.md` as done and add a "Status" line in `prd.md`: "DRAFT v0, belum dikirim ke klien".
- [ ] **Step 6: Commit, merge to `main`, push both:** `git add -A && git commit -m "docs(e-blud): finish first round" && git fetch origin main && git merge origin/main && npm test && git push origin claude/loving-carson-t0hprb && git push origin HEAD:main`. Expected: `git status` clean.
- [ ] **Step 7: Report to the user** with the PRD path, the screenshots, the list of assumptions, and the note that nothing goes to the client until they say so.

---

## Self-Review

- Spec coverage: research (T1), PRD v0 with open questions (T2), three mockups (T3–T4), accessibility (T5), non-goals untouched, merge rule (T5).
- Anti-goals covered: identity and personal data greps (T1, T2, T3, T4), "contoh" labels (T3 check), assumptions flagged (T2).
- Names consistent: `shared.css` tokens, `check.cjs`, F1–F14.

## Deviations made while executing (2026-11-19)

- Charts are CSS-only bars (monthly columns and horizontal bars), not Chart.js and not a donut. Reason: single-series magnitude comparisons need no library, no CDN and no categorical palette; each chart has a "Lihat tabel data" table. No third-party script is loaded.
- Added `mockups/admin.css` (admin layout) next to `shared.css` so the public page does not carry admin styles.
- The persyaratan checklist has 8 generic items, not 10 (the reference's three collateral items are merged into two).
- Task 5 used `npm run check:a11y` (axe-core, WCAG 2.2 AA) for automation, plus a manual pass for keyboard, focus, target size, reflow and contrast. Axe MCP is not used.
- Screenshots are palette-optimised PNGs to stay under 200K each.
- 2026-11-20: the mockups were moved to Tailwind CSS v4 (repo default). `shared.css` and `admin.css` are gone; tokens live in `DESIGN.md` and the `@theme` block of `mockups/input.css`, compiled with `npm run css` to `mockups/mockups.css` (committed, so the HTML opens as plain files). Pixel comparison against the plain-CSS version: public page identical at 1440px, dashboard within 0.02%; the permohonan form shifts by a few pixels because Tailwind's preflight resets browser default margins (checkbox, date input).
- 2026-11-20: after the repo's frontend default became React + Vite + Tailwind v4 + shadcn/ui, the mockups were restyled to the shadcn/ui components (Button, Card, Badge, Input, Label, Checkbox, Table, Alert, Toggle group, Sidebar/Sheet, Chart) using shadcn's semantic tokens in the `@theme` block. Layout and content are unchanged. The React stack is the planned frontend, pending checkpoint 2 (stack approval). Table headers are now light (shadcn data table) instead of navy; status chips are shadcn badges.
