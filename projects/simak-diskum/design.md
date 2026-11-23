# SIMAK DISKUM: PRD design

Date: 2026-11-23
Status: Draft, awaiting approval

## Intent

SIMAK DISKUM v5.0 is already built and running on staging, but it has no PRD in this repo's sense. Its scope is spread across about 35 milestone documents in `throwawaybtm/simak-diskum-v5`. The PRD records that scope in one Indonesian document the department can approve. It also defines the next round of work, so the guidebook, dev handbook and agent kit all take their feature numbers from it.

## Goals

- One `prd.md` in Indonesian, following `docs/checklists/prd.md`, about 3–5 pages plus the per-feature acceptance criteria.
- **F1–F16 "Sudah dibangun"**: the built features, as listed in `research/codebase-map.md` §5. Each has Given/When/Then acceptance criteria that can be checked on staging, taken from the existing specs and tests.
- **F17–F18 "Direncanakan"**:
  - **F17 Kop surat** (ENH-01): official letterhead and emblem on the PDF, Excel and image exports.
  - **F18 Pejabat penandatangan** (ENH-02): signatory settings in Admin → Pengaturan that an admin can edit, plus the signature block (name, title, NIP) on the report.
- **Two-part approval**: (1) F1–F16 are accepted at the Gate A demo (the Berita Acara refers to this PRD); (2) F17–F18 are approved as the next round of work.

## Non-goals

- **Out of scope ("Di luar cakupan"), with reasons:** ENH-03, server-side audit with Cloud Functions (needs the Blaze billing account, and the Firestore rules already enforce audit logging); ENH-04, offline PWA (not needed); production deployment itself (a separate checkpoint).
- Rewriting the app onto this repo's default stack (React, Tailwind, shadcn). That deviation is recorded later, in the dev handbook's stack decision record.

## Anti-goals

- The PRD claims something staging doesn't do, or calls F17–F18 built.
- Personal data in the PRD: no staff names or NIPs. The roster is described only as "70 pegawai (42 PNS, 17 PPPK, 11 Non-ASN), belum diverifikasi".
- Unexplained engineering jargon. Technical terms stay in English only where CLAUDE.md allows it (login, dashboard, export, etc.).

## Constraints

- Firebase Spark, $0/month, with Spark quotas named.
- Asia/Jakarta (WIB).
- The 8 report columns are fixed.
- Public data separation (DTO projection).
- Roles admin and editor.
- Browsers: modern desktop and mobile, 320–1440 px.
- WCAG target: 2.2 AA. Today the app is checked against 2.1 AA, so the 2.2 check becomes an open question with a re-check.

## Approaches

- **Chosen: one PRD, two parts.** It covers both the built and the planned scope, and the two-line approval keeps Gate A's meaning clear.
- Rejected: as-built only (option A); the user wants the next round defined now.
- Rejected: two separate PRDs; that would mean two approvals for one app.

## Calls made by Claude

- Staging outputs keep the "DATA SIMULASI" watermark and never show the real letterhead or signature. F17–F18 apply to production outputs only.
- Terms and roles are kept consistent with the e-BLUD PRD (same department).
- Proposed success measures are marked "usulan, belum disepakati", as in e-BLUD.
- Open questions carry over the Gate A Forms A–C:
  - signatory: who signs, and Kepala Dinas or Sekretaris
  - roster verification
  - production admin nominee
  - portrait or landscape with the letterhead
  - letterhead artwork source

## Left to the writer

The wording and the exact acceptance criteria per feature, traced to the repo's specs and tests.
