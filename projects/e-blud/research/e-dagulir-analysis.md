# e-Dagulir analysis

Reference system supplied by the client's technical contact: e-Dagulir (also titled e-BLUD in its own screens), run by UPTD Fasilitasi Pembiayaan, Pemerintah Kota Payakumbuh. It is a revolving-fund lending BLUD ("dana bergulir"). It is **a placeholder reference only**: nothing here has been confirmed for Batam.

Sources:
- PPTX "Inovasi e-Dagulir" (19 slides). Cited as `PPTX s<n>`.
- PDF "Panduan pengisian dan penggunaan aplikasi e-BLUD" (16 pages, 26 numbered steps, 30 figures). Cited as `PDF step <n>`.

No personal data from the PDF's screenshots (names, NIK, photos) is reproduced in this repo.

## Why it was built (PPTX s3–s7)

- Four earlier attempts to get an application built failed (IT staff left, a Kominfo team stalled, a Kominfo queue of 2–3 years, a bank partnership failed). The coordinator then built it.
- Before: Microsoft Excel for 1,000+ mitra. Slow lookups of disbursement and installment status, slow reports, no photos or location of mitra, hard handover when a field officer changes.
- Stated goal: see daily disbursement and installment payments on a dashboard.

## Benefits claimed (PPTX s8–s14)

- Staff savings: staff fell from 13 to 10 and service continued.
- Time savings: data entered once appears in the menus of bendahara, kasubag TU, marketing officer and cashier; before, the same data was typed repeatedly.
- Rules enforced by the system, not by people: a beginner-loan ceiling (example: 30 million) and "loan may not exceed collateral value" both raise a validation error (PPTX s9).
- Accuracy: no duplicate records across staff.
- Photo and location of each mitra; GIS map for monitoring, arrears handling and facilitator handover (PPTX s7, s10, s14).
- Central database (Oracle) replacing Excel (PPTX s11).
- Daily automatic backup, multi-user access rights (PPTX s12).
- Calendar and daily denda: if a due date is a working day, denda starts the next working day; if it is a holiday, the next working day is a grace day and denda starts the working day after (PPTX s12).
- Audit trail: who entered what and when, down to the second; an activity log shows who works (PPTX s13).

## Roles seen

From the PPTX and PDF: admin; pelayanan staff (enters applications); marketing facilitator (surveys mitra in the field); kasubag TU and Kepala Tata Usaha (processes disbursement); kasir; bendahara (adjustments, installment payments, receipts). Which of these exist in Batam is unknown.

## Login (PDF steps 1–2)

Username is NIP or NIK plus password, a captcha code and a "kode keamanan" field. Reached at an internal-network address in the guide.

## Flow (PDF steps 3–26)

| Step | Action | Module |
|---|---|---|
| 3 | Dashboard: 10 KPI cards (disbursement today, this month, this year in rupiah and people; installments today, month, year; total mitra) with a date filter, a bar chart by business sector and a donut chart | Dashboard |
| 4–5 | List and add mitra: NIK, full name, birth place and date, religion, gender, phone, photo upload (Save button appears only after the photo), address, kecamatan, education, mother's name, spouse's name, mitra type, bank account number, account holder, bank branch | Mitra |
| 6–7 | List of applications not yet validated; add an application: pick mitra, loan amount, tenor, rate, business type and sector, business address and kecamatan, new or repeat loan, date file received, expected completion date, notes, 10-item document checklist | Pendataan |
| 8–9 | Print: page 1 is the application form (kept in the file), page 2 is a receipt handed to the mitra, with QR | Pendataan |
| 10 | After the facilitator's field survey, edit the application: collateral rights, current capital, daily and monthly sales targets, average profit, itemised cost use, field facilitator, checklist | Pendataan |
| 11 | Print "Rincian Biaya" (cost breakdown) | Pendataan |
| 12–13 | Cancel an application with a reason; list of cancelled applications | Pendataan, Pelayanan Batal |
| 14–16 | Once an akad number exists, the Kepala TU disburses. Realization date may not be later than the 28th (installment dates are generated on the same day each month; February has no 29th–31st). Later dates raise an error | Pencairan |
| 17–18 | Active loans list; settled loans list | Pencairan Pinjaman, Pinjaman Lunas |
| 19–20 | Adjustment: when a mitra settles early, the bendahara edits "sisa jasa" to reduce remaining service charge | Adjustment Cicilan |
| 21–22 | Active installments (unpaid); settled installments | Cicilan, Cicilan Lunas |
| 23–24 | Pay an installment: date, pokok, jasa, denda; shows stipulated amounts and installment number | Pembayaran |
| 25–26 | Print payment receipt (kwitansi) from the installment report; amount in words, two QR codes, date, officer name | Pelaporan |

Fields in the loan forms use Indonesian terms: pokok (principal), jasa (service charge, interest-like), denda (late fee), akad (contract), realisasi (disbursement), jatuh tempo (due date), kolektibilitas (collectability), tunggakan (arrears), agunan (collateral).

Document checklist for an application (PDF step 7, reworded): copy of KTP; copy of Kartu Keluarga; business development proposal; recommendation from the kelurahan; proof of property-tax payment; electricity or water bill (three-digit, recent); collateral documents (vehicle ownership papers, two or four wheels); land title certificate.

## Reports (PPTX s15–s18)

- Disbursement: per period (PDF and Excel), rescheduling per period, per business sector, kecamatan, kelurahan, gender, age, facilitator.
- Installments: per period (PDF, Excel).
- Collectability: per period, kecamatan, kelurahan, facilitator.
- Arrears: per period, kecamatan, kelurahan, facilitator.
- Collateral: active, settled, addendum (each PDF and Excel).
- Settled financing; settled rescheduling; administration income; survey per facilitator by analysis date; determination by analysis date.
- Documents: field survey assignment letter (SPT), arrears SPT, applicant list, control card per loan, installment book, "TS Pencairan" report.

## Look and feel

Classic admin template: dark grey sidebar with grouped modules, white KPI cards with icons, uppercase small headings, bar and donut charts in pastel colours, tables with photo thumbnails, blue (edit), grey, teal (view) and green (action) icon buttons, green and blue primary buttons. Login screen has a purple gradient background with the city crest. Data-dense but dated.

## Things that do not transfer

- Oracle database and internal-network hosting (conflicts with the repo's free-first stack).
- Payakumbuh regulations cited in PPTX s2 (Permendagri 79/2018 is national; the Perwako and tariff rules are local).
- The 6% rate, the 28th cut-off, the ceilings and the collateral rule are what that system uses; Batam's values are unknown.
- The city crest and name.
