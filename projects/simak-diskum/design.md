# SIMAK DISKUM: design

Date: 2026-11-23
Status: Approved 2026-11-23

## Intent

SIMAK DISKUM (Sistem Informasi Manajemen Agenda Kedinasan) is for Dinas Koperasi dan Usaha Mikro Kota Batam. It schedules and publishes the department's official activities and produces the official 8-column schedule report.

The user built a **trial run** (`throwawaybtm/simak-diskum-v5`, mapped in `research/codebase-map.md`). The trial is research only. The new app is remade through this repo's workflow: PRD → guidebook → dev handbook → agent kit → Claude Code build. It keeps the trial's features (minus announcements) and is **simpler for the staff who use it**: fewer screens, fewer steps, fewer dialogs.

## Goals

- A fresh Indonesian `prd.md`, written per `docs/checklists/prd.md`, with features F1–F19 below. These numbers are reused by every later document.
- The staff side is noticeably lighter than the trial's. The public side and the reports keep what the trial had.

## Features (PRD numbering)

**Portal publik**
- F1 Dashboard publik: agenda hari ini (WIB) and a short summary.
- F2 Kalender: bulan, minggu, hari, daftar.
- F3 Pencarian dan filter: tanggal, kategori, penyelenggara, status.
- F4 Detail kegiatan, including the notice for a cancelled activity.

**Admin**
- F5 Login (email and password), lupa sandi, roles admin and editor.
- F6 Dashboard admin: counts per tahap, and items still incomplete.
- F7 Formulir kegiatan on **one page**: create, edit, duplikat, hapus (admin only), live public preview.
- F8 Tahap administrasi (Input Awal → Proses Offline → Detail Lengkap → Administrasi Lengkap) shown as a progress bar, plus the surat undangan details (no. agenda, tanggal, perihal, link Drive, internal only).
- F9 Peringatan bentrok **inline** while filling the form, for bookable rooms and personnel. A warning only; the user may still save.
- F10 Status: **Selesai is automatic** once the end time passes. **Batalkan** is the only status action and requires a reason; an optional public notice can be added.
- F11 Pemisahan data publik dan internal: internal notes, meeting links and staff IDs never reach the public side. Public notes are checked for meeting links and PINs.
- F12 Edit bersamaan: if two people edit the same activity, the later save is stopped and explained.
- F13 Data master on **one page**: pegawai, unit/bidang, ruangan/lokasi, penyelenggara, kategori. Deactivate instead of delete when an item is in use.
- F14 Laporan 8 kolom (`No | Hari / Tanggal | Pukul | Kegiatan | Tempat | Penyelenggara | Dihadiri Oleh | Keterangan`) as PDF (A4), Excel (.xlsx) and image.
- F15 Kop surat on the reports.
- F16 Pejabat penandatangan: an admin can edit the signatory, and the report gets a signature block (name, title, NIP).
- F17 Riwayat perubahan: who changed what and when, viewable by admin.
- F18 Kelola pengguna dan peran: an admin page, replacing the trial's command-line role script.
- F19 Cadangan data: export and restore from an admin page, replacing the trial's backup script.

## Non-goals (PRD "Di luar cakupan")

- Pengumuman (public announcements). Removed by the user.
- Offline mode (PWA).
- Cloud Functions or anything else that needs a billing account.
- Mobile app store apps. The app is a responsive web app only.
- Importing the old Excel spreadsheets. This is a one-time setup task covered in the dev handbook, not a staff feature.
- Notifications (email or WhatsApp). The trial didn't have them.

## Anti-goals

- Staff screens as dense as the trial's: modals that block saving, five-tab pages, a status that has to be set by hand.
- Any private field showing up on the public side.
- Personal data in the documents. The roster appears only as a count (70 pegawai, belum diverifikasi), never as names or NIPs.

## Constraints

- Free first: Firebase Spark, GAS, Drive.
- Time zone: Asia/Jakarta (WIB).
- Devices: phones from 320 px up to desktop.
- Quality bars: WCAG 2.2 AA; Core Web Vitals "good".
- Report columns: the 8 columns are fixed.
- Stack: React + Vite + Tailwind v4 + shadcn/ui by default. This is confirmed at checkpoint 2 in the dev handbook, not in the PRD.

## Approaches

- **Chosen:** write the PRD fresh, using the trial as research. It records the user's decisions (simpler staff UX, auto Selesai, no announcements), and the trial is not binding.
- Rejected: converting the trial's 35 milestone documents into a PRD. That would carry the trial's weight and wording forward.

## Calls made by Claude

- Terms and roles are kept consistent with the e-BLUD PRD (same department).
- Success measures are marked as proposals ("usulan, belum disepakati").
- Open questions for the client:
  - who signs the report, and in which role
  - roster verification by Subbag Kepegawaian
  - who the admin accounts are for
  - report orientation with the kop surat (portrait or landscape)
  - the source of the kop surat artwork
  - whether editors may cancel activities, or only admins

## Left to the writer

Wording, and the Given/When/Then acceptance criteria per feature.
