# BLUD Digital System (Diskum Batam): Design for the First Round

Date: 2026-11-19
Status: Approved 2026-11-19 (project name changed to e-blud)
Project folder: `projects/e-blud/`

## Intent and why

BLUD Diskum Batam lends money to its mitra (borrowers) and today tracks everything in Excel sheets. They have no digital system. Their technical contact supplied a reference from another Dinas: **e-Dagulir** (UPTD Fasilitasi Pembiayaan, Kota Payakumbuh), plus a reference for the look: **simantabnongsa.id** (Simantab Nongsa, Kecamatan Nongsa, Kota Batam).

The client wants a system **like e-Dagulir, wrapped in a modern look like Simantab**. The consultant has not yet talked to the client about their real workflow, so the e-Dagulir flow is used as a **placeholder**. This round exists to show the client a rough picture of what they could get, so they can react and correct it. Nothing here is a commitment.

## What the references show (research summary)

**e-Dagulir** (from the PPTX and the PDF user guide, 16 pages, 30 figures):
- Purpose: replace Excel for a revolving-fund lending BLUD (1,000+ mitra). Real-time dashboard, no repeated data entry, SOP-enforced validation, audit trail.
- Flow: Mitra → Pendataan (application, 10-item document requirements checklist, survey by field facilitator, printed forms) → Pencairan (akad number, realization date capped at the 28th so installment dates exist every month) → Cicilan (schedule, adjustment, settlement) → Pembayaran (pokok, jasa, denda) → Pelaporan (kwitansi with QR, 30+ reports in PDF/Excel).
- Roles seen: admin, pelayanan staff, facilitator (pemasaran), kasubag TU, kasir, bendahara.
- Controls: loan ceiling per loan type (for example a beginner ceiling), loan cannot exceed collateral value, daily automatic denda that respects a working-day calendar, activity log (who, when), multi-user access, daily backup, GIS map and photo of each mitra.
- Look: classic admin template, dark sidebar, KPI cards, bar and donut charts, green and blue action buttons, tables with photo thumbnails.
- Its stack is Oracle on an internal server. That conflicts with this repo's free-first rule and is **not** being copied.

**simantabnongsa.id** (read from its HTML and CSS; not yet seen rendered):
- Single-page public site with eight sections: Beranda, Profil, Tentang, Berita, Laporan, Tracking, Galeri, Kontak.
- Hero with two calls to action ("Laporkan Pengaduan", "Lacak Laporan"), live stat cards, trend and category charts, a tracking-code lookup.
- Look: sky-blue primary (`sky-600` to `sky-900`) over light `sky-50` gradients, Inter, rounded cards (0.5rem to 15px), Font Awesome icons. Built with Tailwind, Chart.js, Swiper.
- It is a complaint-reporting site, so only its **look and public-page pattern** are relevant, not its function.

## Goals

1. A **draft PRD v0** in Indonesian that lists features as F1, F2, … simplified from e-Dagulir, with every placeholder assumption marked and collected under "Open questions".
2. **Research notes** in `research/` so the reasoning is traceable.
3. **Mockup screens** (five after the 2026-11-20 flow change) that show the client the two looks: modern public site, modern-but-government-style admin.
4. A feature list the client can cross out, add to, or correct.

## Non-goals

- Pricing or a quote (kept separate by repo rule).
- The guidebook PDF, dev handbook and agent kit. They come after the client approves the PRD.
- Any working software, database or backend.
- Deciding the final stack. That goes in the decision record at the top of the dev handbook. The repo default is React + Vite + Tailwind CSS v4 + shadcn/ui; for e-blud that is the **planned** frontend, **pending checkpoint 2 (stack approval)**, and the mockups are styled to match it.
- Migrating their existing Excel data.

## Anti-goals (what would make this round a failure)

- The client reads the mockups or the placeholder flow as agreed scope.
- Payakumbuh's identity or real data leaks into the output: its coat of arms, its mitra names, NIK or photos. The PDF contains real personal data; none of it is copied. All mockup data is obviously fake.
- The public site shows anything about individual mitra.
- A guess is presented as a fact. Every assumption is labeled.

## Constraints

- Repo rules apply: documents in Indonesian for client-facing material, technical terms stay untranslated; Baseline Widely available web features; WCAG 2.2 AA; Core Web Vitals "good"; free-first stack.
- Personal data (NIK, photos, addresses) and loan and payment records are checkpoint 3 when real building starts.
- Mockups must be built with `modern-web-guidance` for the HTML, CSS and JS.
- Branding: BLUD Diskum Batam's name, logo and exact legal naming have not been provided. Placeholders only, no invented official identity.

## Approaches considered

| | What | Trade-off |
|---|---|---|
| A | Research + draft PRD only | Cheapest; text only |
| **B (chosen)** | A + 2–3 mockup screens | Clients react to pictures. Risk: the design may change when the real flow is known |
| C | Full pipeline now | Too early; PRD must be approved first |

The user chose **B** directly. Mockups are kept in a separate `mockups/` folder so they can be reused in the guidebook later.

## Decisions for this round

Decided by the user:
- Placeholder flow follows e-Dagulir; the system should be somewhat simpler.
- Two surfaces: a **public site** (modern, Simantab style) and an **admin site** (modern, but government style).
- BLUD lends money to mitra; today they use Excel.
- Go with option B.
- **Online self-registration (2026-11-20, still an assumption until the client confirms):** the mitra applies by themself on the public site with an **online form and no account**. Documents are **uploaded** (scans or photos) and stored privately in Google Drive. After submitting, staff **verify, then the facilitator surveys**. The mitra tracks the application with a code (F14).
- Project name is **e-blud** (folder `projects/e-blud/`).

My calls (the user can reject any of these):
- **Starting feature list (all placeholders):**
  - F1 Login and roles
  - F2 Data mitra (with photo)
  - F3 Permohonan pembiayaan with a requirements checklist
  - F4 Survei and analisa by facilitator
  - F5 Penetapan with SOP validation (ceilings, collateral)
  - F6 Akad and pencairan
  - F7 Jadwal cicilan and pembayaran (pokok, jasa, denda)
  - F8 Pelunasan and adjustment
  - F9 Dashboard
  - F10 Laporan, a core set only, PDF and Excel
  - F11 Cetak dokumen (formulir, tanda terima, kwitansi)
  - F12 Log aktivitas
  - F13 Public site: profil, berita, galeri, kontak, aggregate statistics
  - F14 Lacak permohonan by code
- **Simplification of e-Dagulir:** the five loan list pages (Pencairan, Pencairan Pinjaman, Pinjaman Lunas, Cicilan, Cicilan Lunas) become one "Pinjaman" page with status filters; "Pelayanan Batal" becomes a status; 30+ reports reduced to a core set.
- **Mockup screens (five):** (1) public home page, (2) public application form (mitra self-registration, F3), (3) admin dashboard, (4) admin "Permohonan masuk" verification screen (F3), (5) admin form for walk-in applications entered by staff (F3, F5, F6). All with fake data and a "contoh" label.
- **Walk-ins:** staff can still enter applications for people who come in person (proposal, to confirm).
- **Public form safeguards (proposal):** consent before sending, CAPTCHA against bots, private Drive storage, file type and size limits. The public form collects NIK, photos and documents, so it is **checkpoint 3 (personal data)** before any real build.
- **Public site data:** aggregate numbers only.
- **Planned frontend (pending checkpoint 2):** React + Vite + Tailwind CSS v4 + shadcn/ui, from the repo default. The mockups use the same tokens and shadcn-style components so they carry straight into the real build.
- **Fonts:** Inter, self-hosted as TrueType when the guidebook PDF is built (repo font rule). Mockups may load it from Google Fonts meanwhile.

## Open questions (carried into the PRD)

Each is an assumption from e-Dagulir that must be confirmed with the client:
1. The real loan workflow and who does each step.
2. Roles: which of admin, pelayanan, facilitator, kasubag TU, kasir, bendahara exist in Batam.
3. Loan rules: ceilings per loan type, interest or jasa rates, tenor options, collateral rule, denda rule, the "realization date by the 28th" rule.
4. Whether mitra may apply or track online (F14), or only staff enter applications.
5. Whether GIS maps of mitra are wanted (e-Dagulir has them).
6. The legal basis in Batam: Perwako and tariff regulations that e-Dagulir cites for Payakumbuh do not transfer.
7. BLUD name, logo and the correct official wording.
8. Whether existing Excel data must be imported.
9. Which reports they actually need.
10. Number of users and mitra (sizing against free-tier limits).
11. Do walk-in applicants still get entered by staff?
12. How do staff verify the identity of an online applicant (NIK and documents)?
13. Which documents are mandatory uploads, and the allowed file types and sizes?
14. Consent wording for personal data and how long data is kept (client and legal).

## Left to the builder

- Visual details of the three mockups within the two looks above.
- PRD wording, acceptance criteria and success measures, using `docs/checklists/prd.md`.
- File layout inside `research/` and `mockups/`.

## Next steps (first round)

1. Done: project folder `projects/e-blud/`.
2. Done: `research/` notes.
3. Done: `prd.md` v0 (Indonesian), marked DRAFT.
4. Done: five mockups in `mockups/` (public home, public application form, admin dashboard, admin verification of incoming applications, admin walk-in form), built as static HTML with Tailwind CSS v4 and styled to match the shadcn/ui components the planned React app would use (tokens in `DESIGN.md` and the `@theme` block of `mockups/input.css`; compiled to `mockups/mockups.css`), checked with `check:a11y` and a manual accessibility review (`mockups/a11y-review.md`).
5. Done: client preview PDF `preview/preview.pdf`, redesigned 2026-11-20 (navy cover with screenshot collage, summary, journey timeline, five framed screens with numbered callouts, feature grid, next steps, then the draft PRD as feature blocks). Regenerate it with `node projects/e-blud/preview/capture-shots.cjs` (only when the mockups change), `node projects/e-blud/preview/build-preview.cjs` and `npm run build:pdf -- projects/e-blud/preview/preview.html`; it is not the guidebook, which waits for PRD approval.
6. Done: client presentation (20 slides) with source in `presentation/` (see its README).
7. Next: you review. Nothing goes to the client until you say so. After the client reacts to the feature list, update the PRD first, then the guidebook.
