# SITARI DISKUM v3: codebase map

Date: 2026-11-24
Source: `throwawaybtm/sitari-diskum-v3`, branch `main` at `c9acad3` (README: Admin v57, Public v25). Cloned read-only; nothing was pushed, deployed or written to the live Sheets, Drive or Fonnte. Confirmed in the code and in the repo's local preview (`local-test/server.js`) with fictional data (`../presentation/seed-preview.cjs`).

The code wins over the docs. Where `GLOSSARY.md` describes an older design, that is noted under "Docs that are out of date".

## What the app is

**SI-TARI DISKUM** (Sistem Informasi Tamu & Rapat Internal) for the Dinas Koperasi dan Usaha Mikro Kota Batam. A Google Apps Script web app: Google Sheets is the database (`Data_Tamu`, `Data_Rapat`, `Data_Presensi`, `Kendali_SPPD`, master sheets, sidecar sheets such as `Alur_Kunjungan`), Google Drive holds uploads, and WhatsApp messages go through the Fonnte gateway. UI in Bahasa Indonesia, times in WIB.

Status (repo `.claude/skills/sitari-knowledge`): a **trial deployment** on the owner's personal account, not yet released or handed over. Public access is open for testing.

## Surfaces

| Surface | Source | Who | What |
|---|---|---|---|
| Admin dashboard | `Admin/Index.html` + modals | Admin / staff | Four tabs: Dashboard, Buku Tamu, Jadwal Rapat, Lainnya. Desktop top bar; phone bottom navigation (`mobile-nav-tab`). |
| TLD form (Tamu Luar Daerah) | `Tamu-Luar/Index.html` → `Public/Tld.html` | External delegations | Planned visit request with two required document uploads. |
| TDD form (Tamu Dalam Daerah / FO) | `Tamu-FO/Index.html` → `Public/Tdd.html` | Walk-in visitors at the front desk (kiosk/QR) | Check-in, arrival time recorded automatically. |
| Presensi | `Admin/Presensi.html` (copied to Public) | Meeting participants via QR; admin via `?page=presensi-admin` | Digital attendance per agenda. |

Public calls the Admin backend through the `SiTariCore` library; Public has no database of its own and never returns PIC phone numbers or private workflow files.

## Feature areas (confirmed in code)

### Dashboard (`Admin/Index.html`, `getDashboardData`)
- Four cards: **Tamu Hari Ini** (today's visits, total recorded), **Tipe Kedatangan** (TLD "Luar" vs TDD "FO"), **Rapat Hari Ini** (today's agendas, not counting Ditunda), **Kendali SPPD** (TLD visits whose SPPD is not complete vs "Sah & Terverifikasi").
- **Kunjungan Tamu Terbaru**: last five visits, same row layout as Buku Tamu, "Detail" opens the visit.
- **Rapat Hari Ini**: today's room use with room badge, time, organiser and chair.
- Live WIB clock in the header; new guest submissions appear within about two seconds.

### Buku Tamu (guest book)
- One table for TLD and TDD rows: ID & time, institution/address, visitor & WhatsApp, Bidang Tujuan & agenda, Penerima Tamu (PIC), status, action. Sortable columns; search with comma-separated alternatives plus an exact date filter (`AgendaSearch.html`).
- Buttons open the TLD and TDD forms.
- Visit codes: `TLD-ddmmyyyy-nnn`, `TDD-ddmmyyyy-nnn`.

### TLD request form (`Tamu-Luar/`)
- Fields: institution, address, organisation structure picker (Bidang), agenda, ketua rombongan, number of people, member list (one per line), visit date and time, WhatsApp, **Surat Permohonan Kunjungan** and **Surat Tugas Rombongan** (both required; PDF or photo, up to 5 files each, 5 MB per file).
- New requests start at **Menunggu Konfirmasi**. The admin assigns the Bidang Tujuan and PIC.

### TDD walk-in form (`Tamu-FO/`)
- Fields: ketua, total people, members, institution (optional), WhatsApp, address, **Bidang Tujuan with the PIC's name shown** (multi-select), agenda. No date/time inputs: arrival time is recorded automatically.
- TDD visits are **Non-SPPD**. The admin can open them read-only and add up to 10 visit photos (`TddModal.html`).

### Visit workflow for TLD (`Admin/VisitWorkflow.js`, `VisitModal.html`, `VisitWorkflowStorage.js`)
Six tabs, each unlocked by the previous one; statuses `Menunggu Konfirmasi → Sudah Disposisi → Menunggu Kedatangan → Kelola SPPD → Selesai`.

1. **KONFIRMASI**: review details and letters; choose Bidang Tujuan (PIC follows the bidang); optionally change the date/time (`reschedule`) and send the WhatsApp to the visitor's contact (`notifyContact`); press KONFIRMASI (status stays Menunggu Konfirmasi).
2. **DISPOSISI**: upload the disposition scan → Sudah Disposisi.
3. **NOTIFIKASI**: send WhatsApp to every assigned PIC (Fonnte; simulated in the preview), then book room, date and time → an agenda appears in Jadwal Rapat with the same room-conflict and capacity checks → Menunggu Kedatangan.
4. **KEDATANGAN**: roster of ketua and members with Hadir / Belum hadir from the agenda's QR attendance or the admin's Presensi Manual; VALIDASI after the scheduled end freezes attendance → Kelola SPPD.
5. **SPPD**: upload Foto Kegiatan and write a short Catatan (max 300 characters). The attendance-list PDF is generated automatically from the agenda's presensi.
6. **SELESAI**: read-only archive of every document (letters, disposition, daftar hadir, photo, notula) and **Unduh Arsip Kunjungan**, merged into one PDF in the browser (`ArchiveClient.html`, pdf-lib).

Server-side rules: optimistic version check ("Data sudah berubah. Muat ulang…"), script lock on every write, files validated (PDF/JPG/PNG/WebP/HEIC, 5 MB), stage order enforced, Admin entry points guarded by `requireVisitAdmin_()`.

WhatsApp messages (`VisitNotifications.js`): one to the visitor's contact (confirmed schedule, location, receiving official) and one to each PIC (institution, letter, agenda, time, visitor contact). Disabled in development mode; the preview simulates them.

### Jadwal Rapat (meetings)
- Room legend: Ruang Rapat Utama Diskum (50), Ruangan Bidang Koperasi & UMKM (5), Ruang Rapat Pimpinan / Kadis (10), Ruangan Rapat UPTD PLUT KUMKM.
- Agenda list with room badge, status, date/time, organiser and chair; search and date filter.
- **Jadwalkan Rapat**: title, room, date, start/end, Bidang Penyelenggara, Pimpinan Rapat, agenda. Room double-booking and capacity are blocked server-side (`MeetingRooms.js`).
- **Kalender Agenda** (`BookingCalendar.html`): month view, days with agendas highlighted, today outlined.
- **Edit Rapat**: change details; **Tunda** (postpone), **Jadwalkan Ulang** (reschedule, history kept in `Riwayat_Agenda`), **Kunci** (lock: read-only), **Batalkan** (cancel); upload meeting photos (`MeetingPhotos.html`) and the E-Notula.
- Display statuses seen in code: Terjadwal, Berlangsung, Menunggu Foto, Menunggu E-notula, Selesai, Ditunda, Terkunci, Dibatalkan.
- TLD visit agendas live in the same list ("Kunjungan …").

### Presensi (attendance)
- **Presensi QR** per agenda: a full-screen QR the participants scan (`bukaModalPresensi`).
- Public form "Daftar Hadir Rapat Internal": agenda, category **Internal Diskum** (pick bidang then name; NIP and jabatan filled in), **Internal Pemko Batam** (OPD list), **Tamu Luar Daerah** (name, institution, jabatan; for visit agendas, pick from the registered roster); optional WhatsApp.
- Opens from 00:00 WIB on the agenda date until the agenda is finished, locked or validated; duplicates are refused with the time already recorded (`AttendancePolicy.html`, `MeetingRooms.js`).
- **Isi presensi** (admin route `?page=presensi-admin`) with an editable 24-hour time; **Presensi Manual** for visit rosters.
- **Presensi** button: "Presensi Agenda", the read-only list of names, OPD/institution, date and time, ordered by the Dinas hierarchy (`AgendaAttendanceData.js`).

### E-Notula and PDFs (`NotulaPdf.html`, `AgendaDocuments.js`)
- Official E-Notula composer that produces an A4 PDF in the browser; for internal meetings at least one meeting photo is required first. Saving the notula marks the agenda Selesai.
- Other PDFs: daftar hadir per visit, the merged visit archive, the monthly guest report.

### Lainnya (`Tools.html`)
- **QR Formulir Tamu**: QR and link for the TDD and TLD forms (to print for the front desk).
- **Laporan Tamu Bulanan**: month picker, filter Semua / TLD / TDD, table of ketua and agenda, export as **PDF** or **PNG** (long reports split into several images).

### Phone layout
`MobileBase.html` and responsive styles: bottom navigation in Admin, single-column forms, square document previews in one column.

## Security and privacy as built
- `requireVisitAdmin_()` guards about 40 Admin entry points and fails closed, **but** the trial deployment runs with demo access (`ADMIN_DEMO_MODE` / public dev mode), so the Admin dashboard currently opens without a login. The README says Admin must be restricted before the official release.
- Public responses omit PIC phone numbers and private workflow file links.
- Fonnte token in Script Properties only; sending disabled in development.
- No visitor login and no cancellation link in the code (see below).
- Tracked files with personal data: `Admin/RapatPimpinan.html` and `Admin/AgendaAttendanceData.js` hard-code the names and NIPs of 13 officials, and `config-templates/*` carry the PICs' real names. Our captures replace these with fictional names in the browser and in gitignored local copies only.

## Docs that are out of date (code wins)
| `GLOSSARY.md` says | Code has |
|---|---|
| Visit statuses Dikonfirmasi, Ditolak, Dibatalkan | `Menunggu Konfirmasi`, `Sudah Disposisi`, `Menunggu Kedatangan`, `Kelola SPPD`, `Selesai` (TLD); `Non-SPPD` (TDD). No reject or visitor-cancel action. |
| Tautan Pembatalan (visitor cancellation link) | Not in the code. |
| Benturan Staf (staff clash warning) | Not in the code; room clashes are blocked instead. |
| Kendali SPPD: three files, Petugas Persetujuan verification, Perlu Perbaikan reopening with Catatan Audit | SPPD tab: photo + note; daftar hadir auto-generated; completing the visit sets `Sah & Terverifikasi`. No reopen action. |
| Surat Tugas optional | Required in the TLD form. |
| Jam Kunjungan restricted to Mon–Fri 08:00–16:00 | Form takes any valid date/time; not enforced in the local validation. |

So the deck and video cover only the as-built flow above.

## Preview caveats for captures
- The preview shows "Mode pengujian lokal: notifikasi disimulasikan" in the NOTIFIKASI tab. Captures hide this preview-only line.
- Opening "Jadwalkan Rapat" right after load can show the "Agenda rapat ini sudah dikunci" notice on an empty form (seen once in the preview; check before using that frame).
