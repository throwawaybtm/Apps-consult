# PRD SI-TARI DISKUM: Sistem Informasi Tamu & Rapat Internal

Dinas Koperasi dan Usaha Mikro Kota Batam

Tanggal: 24 November 2026 · Status: **as-built**. Dokumen ini mencatat aplikasi yang **sudah dibuat dan berjalan sebagai uji coba** (`sitari-diskum-v3`, Admin v57). Isinya diambil dari kode dan dari pratinjau lokal dengan data fiktif (`research/codebase-map.md`). Dokumen ini bukan usulan yang menunggu persetujuan.

## 1. Masalah dan tujuan

**Masalah sebelum SI-TARI.** Tamu dicatat di buku tamu kertas. Permohonan kunjungan dari daerah lain datang lewat surat dan pesan WhatsApp pribadi, lalu diteruskan dari meja ke meja. Jadwal ruang rapat dan daftar hadir dibuat manual, sehingga ruangan bisa terpakai dua kali dan daftar hadir harus diketik ulang. Bukti SPPD (foto kegiatan, daftar hadir, notula) tersebar di ponsel dan map, dan sulit dikumpulkan saat dibutuhkan.

**Tujuan yang dijawab aplikasi.**
1. Semua tamu, baik yang datang langsung maupun rombongan dari luar daerah, tercatat di **satu buku tamu digital**.
2. Setiap permohonan kunjungan rombongan melewati **alur yang jelas** dari konfirmasi sampai selesai, dengan status yang terlihat semua orang.
3. Penerima tamu dan narahubung tamu mendapat **pemberitahuan WhatsApp** dengan jadwal yang sudah pasti.
4. **Ruang rapat tidak bisa dipesan ganda**, dan semua agenda rapat terlihat di satu daftar dan kalender.
5. **Daftar hadir diisi lewat QR**, tanpa kertas, dan langsung menjadi PDF.
6. **Bukti kegiatan dan SPPD terkumpul di satu tempat** dan dapat diunduh sebagai satu arsip PDF.

## 2. Pengguna

| Pengguna | Kebutuhan |
|---|---|
| Kepala Dinas dan pimpinan | Melihat ringkasan tamu dan rapat hari ini, memimpin rapat, menerima arsip kegiatan yang rapi |
| Admin SI-TARI (petugas yang ditunjuk) | Mengelola buku tamu, menjalankan alur kunjungan, menjadwalkan rapat, mengelola presensi, notula dan laporan |
| PIC bidang (penerima tamu) | Menerima pemberitahuan kunjungan dan menyiapkan materi |
| Staf peserta rapat | Mengisi presensi lewat QR dari ponsel |
| Tamu Dalam Daerah (datang langsung) | Mendaftar di meja depan tanpa antre menulis |
| Tamu Luar Daerah (rombongan) | Mengajukan kunjungan beserta surat, lalu menerima kepastian jadwal |

## 3. Fitur

| No. | Fitur | Pengguna utama |
|---|---|---|
| F1 | Dashboard ringkasan hari ini | Pimpinan, Admin |
| F2 | Buku Tamu digital (daftar, pencarian, filter tanggal, urutan) | Admin |
| F3 | Formulir Tamu Luar Daerah (TLD) dengan unggah surat | Tamu Luar Daerah |
| F4 | Formulir Tamu Dalam Daerah (TDD) dan foto kunjungan | Tamu Dalam Daerah, Admin |
| F5 | Konfirmasi kunjungan: Bidang Tujuan, PIC, ganti jadwal | Admin |
| F6 | Disposisi | Admin |
| F7 | Notifikasi WhatsApp dan pemesanan ruangan kunjungan | Admin, PIC, narahubung tamu |
| F8 | Kedatangan rombongan dan validasi presensi | Admin |
| F9 | SPPD, penyelesaian kunjungan dan arsip PDF | Admin |
| F10 | Jadwal Rapat dan Kalender Agenda | Admin |
| F11 | Tunda, jadwalkan ulang, kunci dan batalkan rapat | Admin |
| F12 | Presensi digital lewat QR | Peserta rapat, Admin |
| F13 | Foto rapat dan E-Notula PDF A4 | Admin |
| F14 | QR formulir tamu dan Laporan Tamu Bulanan (PDF/PNG) | Admin, Pimpinan |
| F15 | Tampilan ponsel | Semua |
| F16 | Pengamanan data dan akses | Semua |

## 4. Kebutuhan dan kriteria penerimaan per fitur

Kriteria ditulis sebagai "Diberikan … ketika … maka …" dan menggambarkan perilaku yang sudah ada.

### F1 Dashboard ringkasan hari ini
- Empat kartu: **Tamu Hari Ini** (dan total tercatat), **Tipe Kedatangan** (Luar vs FO), **Rapat Hari Ini** (tanpa agenda yang ditunda), **Kendali SPPD** (yang belum lengkap vs "Sah & Terverifikasi").
- Daftar **Kunjungan Tamu Terbaru** (5 terakhir) dengan tombol Detail, dan daftar **Rapat Hari Ini** dengan ruangan, jam, penyelenggara dan pimpinan.
- Jam WIB tampil di kepala halaman; pendaftaran tamu baru muncul tanpa memuat ulang.
- *Kriteria:* Diberikan tamu baru mengisi formulir TDD, ketika dashboard sedang terbuka, maka angka Tamu Hari Ini bertambah dan tamu itu muncul di Kunjungan Tamu Terbaru dalam beberapa detik.

### F2 Buku Tamu digital
- Satu tabel untuk TLD dan TDD: ID & waktu, asal instansi, nama & WhatsApp, Bidang Tujuan & agenda, Penerima Tamu, status, aksi.
- Kode kunjungan `TLD-ddmmyyyy-nnn` dan `TDD-ddmmyyyy-nnn`. Kolom dapat diurutkan; pencarian kata kunci (beberapa kata dipisah koma) dan filter tanggal.
- *Kriteria:* Diberikan kata kunci "Bintan, Lingga", ketika dicari, maka tampil kunjungan yang memuat salah satu kata itu.

### F3 Formulir Tamu Luar Daerah (TLD)
- Isian wajib: nama dan alamat instansi, agenda, ketua rombongan, jumlah orang, daftar anggota (satu nama per baris), tanggal dan jam kunjungan, WhatsApp narahubung, **Surat Permohonan Kunjungan** dan **Surat Tugas Rombongan** (PDF atau foto, sampai 5 file, maksimal 5 MB per file).
- Permohonan baru berstatus **Menunggu Konfirmasi**. Bidang Tujuan dan penerima ditentukan admin.
- *Kriteria:* Diberikan file 7 MB, ketika diunggah, maka formulir menolak dengan pesan batas ukuran.

### F4 Formulir Tamu Dalam Daerah (TDD) dan foto kunjungan
- Isian: ketua, total orang, anggota, instansi (opsional), WhatsApp, alamat, **Bidang Tujuan beserta nama PIC-nya**, agenda. Tidak ada isian tanggal/jam: **waktu kedatangan dicatat otomatis**.
- Kunjungan TDD berstatus **Non-SPPD**. Admin dapat melihat datanya dan menambah sampai 10 foto kunjungan.
- *Kriteria:* Diberikan tamu mengirim formulir pukul 08.47 WIB, maka Buku Tamu mencatat 08.47 WIB tanpa isian jam dari tamu.

### F5 Konfirmasi kunjungan
- Tab **KONFIRMASI** menampilkan data dan surat. Admin memilih satu atau lebih **Bidang Tujuan** (PIC mengikuti bidang), dapat **mengganti jadwal**, dan dapat mengirim notifikasi ke narahubung tamu, lalu menekan KONFIRMASI.
- *Kriteria:* Diberikan Bidang Tujuan belum dipilih, ketika admin menekan KONFIRMASI, maka sistem menolak dengan "Pilih Bidang Tujuan sebelum konfirmasi."

### F6 Disposisi
- Tab **DISPOSISI**: unggah pindaian lembar disposisi lalu SUDAH DISPOSISI. Status menjadi **Sudah Disposisi**.
- *Kriteria:* Diberikan kunjungan belum dikonfirmasi, maka disposisi tidak dapat disimpan.

### F7 Notifikasi WhatsApp dan pemesanan ruangan
- Tab **NOTIFIKASI**: kirim WhatsApp (melalui Fonnte) ke **setiap PIC** dengan instansi, nomor surat, agenda, waktu dan narahubung tamu. Narahubung tamu menerima pesan kepastian jadwal, lokasi dan pejabat penerima.
- Setelah semua PIC diberi tahu, admin memesan **ruangan, tanggal dan jam**. Agenda kunjungan otomatis muncul di Jadwal Rapat. Status menjadi **Menunggu Kedatangan**.
- Jika pengiriman gagal, status kunjungan tidak mundur; pengiriman dapat diulang.
- *Kriteria:* Diberikan ruangan sudah terpakai pada jam yang sama, ketika jadwal disimpan, maka sistem menolak dengan "Ruangan sudah digunakan pada jadwal tersebut."

### F8 Kedatangan dan validasi presensi
- Tab **KEDATANGAN** menampilkan ketua dan setiap anggota dengan status **Hadir / Belum hadir**, dari QR presensi agenda atau Presensi Manual admin.
- **VALIDASI** baru bisa setelah jam selesai kunjungan; setelah divalidasi daftar hadir dibekukan. Status menjadi **Kelola SPPD**.
- *Kriteria:* Diberikan kunjungan dijadwalkan sampai 11.30 WIB, ketika admin menekan VALIDASI pukul 10.15, maka sistem menolak karena kunjungan belum selesai.

### F9 SPPD, penyelesaian dan arsip
- Tab **SPPD**: unggah **Foto Kegiatan** dan tulis **Catatan** singkat (maksimal 300 karakter). **Daftar hadir PDF dibuat otomatis** dari presensi agenda.
- Tab **SELESAI**: semua dokumen kunjungan (surat permohonan, surat tugas, disposisi, daftar hadir, foto, notula) dapat dilihat dan diunduh, dan **Unduh Arsip Kunjungan** menggabungkan semuanya menjadi satu PDF. Status **Selesai**, Kendali SPPD **Sah & Terverifikasi**, dan kunjungan menjadi hanya-baca.
- *Kriteria:* Diberikan foto kegiatan belum diunggah, maka kunjungan tidak dapat diselesaikan.

### F10 Jadwal Rapat dan Kalender Agenda
- Daftar agenda rapat internal dan kunjungan dengan ruangan, status, tanggal/jam, penyelenggara dan pimpinan; pencarian dan filter tanggal.
- **Jadwalkan Rapat**: judul, ruangan, tanggal, jam mulai/selesai, bidang penyelenggara, pimpinan rapat, agenda. Pemakaian ruangan ganda dan kelebihan kapasitas ditolak.
- **Kalender Agenda** bulanan: tanggal yang memiliki agenda diberi warna, hari ini ditandai.
- Ruangan: Ruang Rapat Utama Diskum (50 orang), Ruangan Bidang Koperasi & UMKM (5), Ruang Rapat Pimpinan / Kadis (10), Ruangan Rapat UPTD PLUT KUMKM.
- *Kriteria:* Diberikan rapat 13.30–15.00 di Ruang Rapat Utama, ketika rapat lain dijadwalkan 14.00 di ruangan yang sama, maka penyimpanan ditolak.

### F11 Tunda, jadwalkan ulang, kunci dan batalkan rapat
- **Tunda** (status Ditunda, presensi tertutup), **Jadwalkan Ulang** (riwayat jadwal disimpan), **Kunci** (data dan lampiran menjadi hanya-baca), **Batalkan**.
- Status yang tampil: Terjadwal, Berlangsung, Menunggu Foto, Menunggu E-notula, Selesai, Ditunda, Terkunci, Dibatalkan.
- *Kriteria:* Diberikan rapat berstatus Ditunda, ketika peserta membuka presensi, maka muncul "Agenda rapat sedang ditunda."

### F12 Presensi digital lewat QR
- **Presensi QR** menampilkan kode QR layar penuh untuk agenda. Peserta memilih kategori: **Internal Diskum** (pilih bidang lalu nama; NIP dan jabatan terisi otomatis), **Internal Pemko Batam** (pilih OPD), atau **Tamu Luar Daerah** (nama dari daftar rombongan yang terdaftar).
- Presensi dibuka sejak pukul 00.00 WIB pada tanggal agenda sampai agenda selesai atau dikunci. Presensi ganda ditolak dengan jam yang sudah tercatat.
- Admin dapat **Isi presensi** dengan jam yang dapat diubah, dan **Presensi Manual** untuk rombongan. Tombol **Presensi** menampilkan daftar nama, OPD/instansi, tanggal dan jam, diurutkan sesuai struktur Dinas.
- *Kriteria:* Diberikan pegawai sudah presensi pukul 07.52, ketika ia mengisi lagi, maka sistem menjawab bahwa presensinya sudah tercatat pukul 07.52 WIB.

### F13 Foto rapat dan E-Notula
- Unggah foto rapat di Edit Rapat. **E-Notula** disusun di aplikasi dan dicetak sebagai **PDF A4** resmi; untuk rapat internal minimal satu foto harus ada lebih dulu. Menyimpan E-Notula menandai agenda Selesai.
- *Kriteria:* Diberikan rapat internal tanpa foto, ketika E-Notula disimpan, maka sistem meminta foto rapat terlebih dahulu.

### F14 QR formulir tamu dan Laporan Tamu Bulanan
- **QR Formulir Tamu** untuk TDD dan TLD (dicetak untuk meja depan) beserta tautannya.
- **Laporan Tamu Bulanan**: pilih bulan, filter Semua / TLD / TDD, unduh **PDF** atau **gambar PNG** (laporan panjang dipecah menjadi beberapa gambar).
- *Kriteria:* Diberikan filter TLD dan bulan November 2026, ketika diunduh PDF, maka berkas hanya memuat kunjungan TLD bulan itu.

### F15 Tampilan ponsel
- Admin memakai navigasi bawah di ponsel; formulir TLD, TDD dan presensi tampil satu kolom; pratinjau dokumen satu kolom.
- *Kriteria:* Pada layar 390 px, tidak ada gulir ke samping di dashboard, formulir dan presensi.

### F16 Pengamanan data dan akses
- Setiap fungsi Admin diperiksa di server (`requireVisitAdmin_`, gagal-tertutup). Setiap penulisan memakai kunci (lock) dan pemeriksaan versi, sehingga dua admin tidak saling menimpa.
- Formulir publik tidak pernah menerima nomor WhatsApp PIC atau tautan dokumen internal. Token Fonnte disimpan di Script Properties, tidak di kode.
- *Kriteria:* Diberikan data kunjungan sudah diubah admin lain, ketika admin menyimpan dari layar lama, maka muncul "Data sudah berubah. Muat ulang sebelum menyimpan."

## 5. Di luar cakupan (versi ini)

- Penolakan permohonan atau pembatalan oleh tamu lewat tautan (dibahas di dokumen awal, belum ada di aplikasi).
- Peringatan bentrok jadwal staf penerima (yang dicegah adalah bentrok ruangan).
- Tanda tangan digital; pengesahan tetap fisik.
- Login untuk tamu; tamu cukup mengisi formulir.
- Aplikasi ponsel terpisah (Android/iOS); aplikasi berjalan di peramban.

## 6. Ukuran keberhasilan (usulan, untuk dipantau setelah rilis resmi)

| Ukuran | Target usulan |
|---|---|
| Tamu yang tercatat digital | 100% tamu, tanpa buku tamu kertas |
| Waktu dari permohonan TLD sampai jadwal terkonfirmasi | ≤ 2 hari kerja |
| Rapat yang memakai presensi QR | ≥ 90% rapat internal |
| Kunjungan TLD yang selesai dengan arsip lengkap | 100% sebelum pengajuan SPPD |
| Bentrok ruang rapat | 0 |

## 7. Batasan

- **Platform:** Google Apps Script, Google Sheets sebagai basis data, Google Drive untuk dokumen; tanpa server berbayar. WhatsApp melalui layanan pihak ketiga Fonnte (nomor WhatsApp milik Dinas).
- **Perangkat:** peramban modern di komputer dan ponsel.
- **Waktu dan bahasa:** WIB (Asia/Jakarta), Bahasa Indonesia.
- **Data pribadi:** nama, nomor WhatsApp dan dokumen tamu hanya untuk keperluan kunjungan; dokumen di folder Drive Dinas, tidak dibagikan sebagai tautan publik.

## 8. Hal yang perlu diselesaikan sebelum rilis resmi

| No. | Hal | Penanggung jawab |
|---|---|---|
| 1 | **Akses Admin dibatasi** (saat ini dashboard Admin uji coba dapat dibuka tanpa login) | Pemilik aplikasi |
| 2 | Nomor WhatsApp Layanan milik Dinas dan Fonnte diaktifkan | Dinas, pemilik aplikasi |
| 3 | Kebijakan retensi data tamu dan dokumen | Dinas |
| 4 | Data uji coba dibersihkan; data pegawai resmi diimpor | Pemilik aplikasi |
| 5 | Serah terima dari akun pribadi ke akun milik Dinas | Dinas, pemilik aplikasi |

## 9. Persetujuan

Tidak berlaku untuk dokumen as-built ini. Aplikasi sudah dibuat; dokumen ini menjadi acuan bersama untuk presentasi, video dan pengembangan berikutnya.
