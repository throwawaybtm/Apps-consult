# Simplification: e-Dagulir modules to e-BLUD features

Everything below is a **placeholder (Asumsi)** until the client confirms the real Diskum Batam workflow. IDs F1–F14 are the ones the PRD uses.

## Feature table

| ID | Name | e-Dagulir source module | Change |
|---|---|---|---|
| F1 | Login dan peran | Login, Admin, user menus | Keep. Roles are Asumsi. |
| F2 | Data mitra | Mitra > Data Mitra | Keep; photo kept. Map/GIS moved to an open question. |
| F3 | Permohonan pembiayaan | Pendataan Mitra, add and edit | Keep with the document checklist. |
| F4 | Survei dan analisa | Pendataan edit (survey fields), Rincian Biaya | Keep as a step on the application, not a separate module. |
| F5 | Penetapan dan validasi SOP | SOP validation (PPTX s9) | Keep; the rules themselves are open questions. |
| F6 | Akad dan pencairan | Pencairan | Keep; the "by the 28th" rule is an Asumsi. |
| F7 | Jadwal cicilan dan pembayaran | Cicilan, Pembayaran | Merge two modules into one; pokok, jasa, denda. |
| F8 | Pelunasan dan penyesuaian | Pinjaman Lunas, Adjustment Cicilan | Keep adjustment as part of settlement. |
| F9 | Dashboard | Dashboard | Keep KPI cards and two charts. |
| F10 | Laporan inti | Pelaporan (about 30 reports) | Reduce to a core set; client picks. |
| F11 | Cetak dokumen | Print forms, receipt, kwitansi with QR | Keep: formulir, tanda terima, rincian biaya, kwitansi. |
| F12 | Log aktivitas | Activity log | Keep. |
| F13 | Situs publik | none (Simantab pattern) | New: profil, berita, galeri, kontak, aggregate statistics. |
| F14 | Lacak permohonan | none (Simantab pattern) | New, Asumsi: a mitra enters a code and sees status. |

## Merges and drops

- Five loan lists (Pencairan, Pencairan Pinjaman, Pinjaman Lunas, Cicilan, Cicilan Lunas) become **one "Pinjaman" page** with status filters (Berjalan, Lunas, Batal). Installments of a loan show inside the loan.
- "Pelayanan Batal" becomes a **status** (Batal) with a mandatory reason, not a separate menu.
- Reports: 30+ items reduced to a core set (disbursement per period, installments per period, arrears, collectability, settled financing, collateral, receipt). The client chooses which others.
- Dropped for now: addendum and rescheduling reports, SPT letters, installment book, administration income report. Reason: unknown whether Batam uses them. Asumsi.
- Not carried over: Oracle, internal-network hosting, Payakumbuh regulations and branding.

## Unknowns to confirm with the client (Asumsi → Open questions)

1. Real loan workflow and who does each step.
2. Roles that exist (admin, pelayanan, facilitator, kasubag TU, kasir, bendahara).
3. Loan rules: ceilings per type, rate (e-Dagulir shows 6%), tenor options, collateral rule, denda rule, the 28th cut-off.
4. Online application or tracking by mitra, or staff entry only.
5. GIS map of mitra.
6. Batam legal basis (Perwako, tariffs).
7. Official name, logo and wording of the BLUD.
8. Importing existing Excel data.
9. Which reports are needed.
10. Number of users and mitra.
