# PRD SIMAK DISKUM: Sistem Informasi Manajemen Agenda Kedinasan

Dinas Koperasi dan Usaha Mikro Kota Batam

Tanggal: 23 November 2026 · Status: Draft v1, menunggu persetujuan klien

## 1. Masalah dan tujuan

**Masalah.** Agenda kedinasan Dinas Koperasi dan Usaha Mikro (Diskum) Kota Batam dicatat di lembar Excel dan diumumkan secara manual. Jadwal ruangan dan pegawai mudah bentrok, laporan jadwal resmi 8 kolom disusun ulang setiap kali diminta, dan masyarakat serta mitra sulit mengetahui kegiatan Dinas yang sedang dan akan berlangsung.

Uji coba yang sudah dibuat (SIMAK DISKUM v5) membuktikan bahwa kebutuhannya dapat dipenuhi, tetapi tampilan untuk petugas terlalu padat: banyak tab, dialog yang menghalangi penyimpanan, dan status yang harus diubah manual. Aplikasi baru ini dibangun ulang dari awal. Fiturnya sama dengan uji coba (tanpa pengumuman), tetapi **lebih sederhana bagi petugas**: lebih sedikit halaman, langkah dan dialog.

**Tujuan.**
1. Semua agenda kedinasan tercatat di satu sistem dan langsung tampil di portal publik.
2. Petugas mencatat satu kegiatan di **satu halaman**, tanpa berpindah tab.
3. Bentrok ruangan dan pegawai terlihat saat mengisi formulir, sebelum terjadi.
4. Laporan jadwal resmi 8 kolom, lengkap dengan kop surat dan tanda tangan pejabat, dibuat dalam hitungan detik.
5. Data internal (catatan internal, tautan rapat, surat undangan) tidak pernah tampil di portal publik.

## 2. Pengguna

| Pengguna | Kebutuhan |
|---|---|
| Masyarakat dan mitra (tanpa akun) | Melihat agenda hari ini, kalender kegiatan, mencari kegiatan, dan melihat pemberitahuan pembatalan |
| Editor (Operator Agenda) | Mencatat dan memperbarui kegiatan, melengkapi tahap administrasi, membuat laporan |
| Admin (Subbag Umum atau pejabat yang ditunjuk) | Semua hak editor, ditambah menghapus kegiatan, mengelola data master, pengguna dan peran, pejabat penandatangan, riwayat perubahan, dan cadangan data |

Siapa saja pemegang akun admin dan editor ditetapkan oleh klien (lihat bagian 8). Data pegawai untuk daftar "Dihadiri Oleh" berasal dari daftar **70 pegawai, belum diverifikasi**.

## 3. Fitur

Dua tampilan: **portal publik** dan **halaman admin**. Nomor F1–F19 dipakai di semua dokumen turunan.

| No | Fitur | Tampilan |
|---|---|---|
| F1 | Dashboard publik | Publik |
| F2 | Kalender | Publik |
| F3 | Pencarian dan filter | Publik |
| F4 | Detail kegiatan | Publik |
| F5 | Login dan peran | Admin |
| F6 | Dashboard admin | Admin |
| F7 | Formulir kegiatan satu halaman | Admin |
| F8 | Tahap administrasi dan surat undangan | Admin |
| F9 | Peringatan bentrok | Admin |
| F10 | Status kegiatan | Admin |
| F11 | Pemisahan data publik dan internal | Admin dan publik |
| F12 | Edit bersamaan | Admin |
| F13 | Data master satu halaman | Admin |
| F14 | Laporan 8 kolom | Admin |
| F15 | Kop surat | Admin |
| F16 | Pejabat penandatangan | Admin |
| F17 | Riwayat perubahan | Admin |
| F18 | Kelola pengguna dan peran | Admin |
| F19 | Cadangan data | Admin |

## 4. Kebutuhan dan kriteria penerimaan per fitur

Semua waktu memakai **WIB (Asia/Jakarta)**. Tanggal ditulis DD/MM/YYYY.

### Portal publik

**F1 Dashboard publik.** Halaman depan portal menampilkan agenda hari ini (WIB), diurutkan menurut jam mulai, dan ringkasan singkat: jumlah kegiatan hari ini, minggu ini dan bulan ini, serta kegiatan berikutnya. Kegiatan yang dibatalkan tetap tampil dengan tanda "Dibatalkan".
- *Given* ada tiga kegiatan hari ini, *when* pengunjung membuka portal, *then* ketiganya tampil urut menurut jam mulai.
- *Given* pukul 23.30 WIB dan perangkat pengunjung memakai zona waktu lain, *when* portal dibuka, *then* "hari ini" tetap mengikuti tanggal WIB.
- *Given* tidak ada kegiatan hari ini, *when* portal dibuka, *then* tampil pesan "Tidak ada kegiatan hari ini" dan kegiatan berikutnya.

**F2 Kalender.** Tampilan bulan, minggu, hari dan daftar. Pengunjung dapat berpindah periode (sebelumnya, berikutnya, hari ini). Di ponsel, tampilan daftar menjadi bawaan.
- *Given* tampilan bulan, *when* pengunjung memilih satu tanggal, *then* tampilan hari untuk tanggal itu terbuka.
- *Given* layar selebar 320 px, *when* kalender dibuka, *then* tampilan daftar muncul tanpa gulir menyamping.
- *Given* kalender, *when* dioperasikan hanya dengan keyboard, *then* semua tampilan dan tombol periode dapat dijangkau dan dipakai.

**F3 Pencarian dan filter.** Cari menurut kata kunci (nama kegiatan dan tempat), dan saring menurut rentang tanggal, kategori, penyelenggara dan status (Terjadwal, Selesai, Dibatalkan). Filter dapat digabung dan direset sekaligus.
- *Given* filter kategori "Rapat" dan bulan Desember, *when* diterapkan, *then* hanya rapat di bulan Desember yang tampil, beserta jumlah hasilnya.
- *Given* filter tanpa hasil, *when* diterapkan, *then* tampil "Tidak ada kegiatan yang cocok" dan tombol reset filter.

**F4 Detail kegiatan.** Menampilkan nama kegiatan, hari dan tanggal, pukul (atau "s.d. selesai" bila jam selesai kosong), tempat, penyelenggara, kategori, yang menghadiri, status dan catatan publik. Kegiatan yang dibatalkan menampilkan tanda "Dibatalkan" dan pemberitahuan pembatalan publik bila ada.
- *Given* kegiatan dibatalkan dengan pemberitahuan publik, *when* detail dibuka, *then* tanda "Dibatalkan" dan pemberitahuan itu tampil, tetapi alasan internal pembatalan tidak tampil.
- *Given* kegiatan tanpa jam selesai, *when* detail dibuka, *then* pukul tertulis "09.00 WIB s.d. selesai".

### Halaman admin

**F5 Login dan peran.** Masuk dengan email dan kata sandi; tersedia "Lupa kata sandi" yang mengirim tautan atur ulang ke email. Dua peran: **admin** dan **editor**. Akun tanpa peran, atau yang dinonaktifkan, tidak dapat membuka halaman admin.
- *Given* pengguna belum login, *when* membuka halaman admin, *then* diarahkan ke halaman login.
- *Given* kata sandi salah, *when* login, *then* tampil pesan umum "Email atau kata sandi salah" tanpa menyebut bagian mana yang salah.
- *Given* akun login tetapi tidak punya peran, *when* masuk, *then* tampil "Akses ditolak" dan petunjuk menghubungi admin.
- *Given* peran editor, *when* membuka menu data master, pengguna atau cadangan data, *then* menu itu tidak tersedia dan akses ditolak.

**F6 Dashboard admin.** Kartu jumlah kegiatan per tahap administrasi (F8), dan daftar kegiatan yang belum lengkap (tahap belum "Administrasi Lengkap"), diurutkan dari tanggal terdekat. Setiap baris membuka formulir kegiatan itu.
- *Given* kegiatan baru disimpan di tahap "Input Awal", *when* dashboard dibuka, *then* angka "Input Awal" bertambah satu dan kegiatan itu masuk daftar belum lengkap.
- *Given* kegiatan sudah "Administrasi Lengkap", *when* dashboard dibuka, *then* kegiatan itu tidak ada di daftar belum lengkap.

**F7 Formulir kegiatan satu halaman.** Membuat, mengubah, menduplikat dan menghapus kegiatan dalam **satu halaman** tanpa tab. Isian: nama kegiatan, tanggal, jam mulai, jam selesai (boleh kosong = "s.d. selesai"), tempat, penyelenggara, kategori, yang menghadiri (pilih dari data pegawai), catatan publik, catatan internal dan tautan rapat internal. Di samping (atau di bawah, pada ponsel) tampil **pratinjau publik langsung** yang sama persis dengan yang akan tampil di portal. Duplikat menyalin semua isian kecuali tanggal, status, tahap dan surat undangan. Hapus hanya untuk admin, dengan konfirmasi.
- *Given* isian wajib (nama, tanggal, jam mulai, tempat, penyelenggara, kategori) belum diisi, *when* disimpan, *then* sistem menandai isian yang kurang di tempatnya dan tidak menyimpan.
- *Given* jam selesai lebih awal dari jam mulai, *when* disimpan, *then* ditolak dengan pesan di isian jam selesai.
- *Given* petugas mengetik catatan publik, *when* mengetik, *then* pratinjau publik langsung berubah, dan catatan internal tidak pernah tampil di pratinjau.
- *Given* kegiatan diduplikat, *when* salinan dibuka, *then* semua isian tersalin kecuali tanggal, status, tahap dan surat undangan, dan tahap kembali ke "Input Awal".
- *Given* peran editor, *when* membuka kegiatan, *then* tombol hapus tidak tersedia.

**F8 Tahap administrasi dan surat undangan.** Empat tahap: **Input Awal → Proses Offline → Detail Lengkap → Administrasi Lengkap**, tampil sebagai progress bar di atas formulir; petugas memajukan tahap dengan satu klik. Panel surat undangan (internal): nomor agenda, tanggal surat, perihal dan link Google Drive. "Administrasi Lengkap" mensyaratkan surat undangan terisi, atau alasan bila tidak ada surat. Mundur tahap memerlukan alasan dan tercatat di riwayat (F17). Tahap terpisah dari status kegiatan (F10).
- *Given* tahap "Detail Lengkap" dan surat undangan kosong, *when* petugas memilih "Administrasi Lengkap", *then* sistem meminta surat undangan atau alasan tidak ada surat.
- *Given* tahap "Administrasi Lengkap", *when* petugas memundurkan ke "Detail Lengkap", *then* alasan wajib diisi dan perubahan tercatat di riwayat.
- *Given* surat undangan terisi, *when* portal publik dibuka, *then* nomor agenda, perihal dan link Drive tidak tampil.

**F9 Peringatan bentrok.** Saat tanggal, jam, tempat atau yang menghadiri diubah, formulir langsung memeriksa bentrok dengan kegiatan lain yang belum dibatalkan: **ruangan yang dapat dipesan** pada waktu yang tumpang tindih, dan **pegawai** yang sama pada waktu yang tumpang tindih. Peringatan tampil **di dalam formulir** (bukan dialog), menyebut kegiatan yang bentrok dan tautannya. Ini hanya peringatan; petugas tetap dapat menyimpan. Kegiatan yang berakhir tepat saat kegiatan lain mulai tidak dianggap bentrok. Kegiatan tanpa jam selesai dianggap berlangsung sampai akhir hari.
- *Given* Ruang Rapat A dipakai 09.00–11.00, *when* petugas mengisi Ruang Rapat A pukul 10.00–12.00 di tanggal yang sama, *then* peringatan bentrok tampil di formulir dengan nama kegiatan yang bentrok.
- *Given* kegiatan lain berakhir 11.00, *when* kegiatan baru mulai 11.00 di ruangan yang sama, *then* tidak ada peringatan.
- *Given* tempat bertipe luar kantor atau daring (bukan ruangan yang dapat dipesan), *when* waktunya tumpang tindih, *then* tidak ada peringatan ruangan.
- *Given* peringatan bentrok tampil, *when* petugas menyimpan, *then* kegiatan tersimpan tanpa dialog tambahan.

**F10 Status kegiatan.** Tiga status: Terjadwal, Selesai, Dibatalkan. **Selesai diatur otomatis** setelah jam selesai lewat (WIB), atau setelah akhir hari bila jam selesai kosong; petugas tidak perlu mengubahnya. **Batalkan** adalah satu-satunya tindakan status: alasan internal wajib, pemberitahuan publik opsional. Pembatalan tercatat di riwayat (F17).
- *Given* kegiatan Terjadwal berakhir 11.00, *when* portal atau admin dibuka pukul 11.01 WIB, *then* statusnya tampil Selesai.
- *Given* petugas memilih Batalkan, *when* alasan kosong, *then* pembatalan tidak disimpan dan isian alasan ditandai.
- *Given* kegiatan dibatalkan, *when* jam selesainya lewat, *then* statusnya tetap Dibatalkan.

**F11 Pemisahan data publik dan internal.** Portal publik hanya menerima salinan publik yang disusun dari daftar isian yang diizinkan: nama, waktu, tempat, penyelenggara, kategori, yang menghadiri, status, catatan publik dan pemberitahuan pembatalan. Catatan internal, tautan rapat, surat undangan, alasan pembatalan dan ID pegawai **tidak pernah** sampai ke publik. Catatan publik dan pemberitahuan pembatalan diperiksa saat diketik: tautan Zoom, Google Meet atau Teams, ID rapat, PIN dan kata sandi ditandai di isian itu, dan penyimpanan ditahan sampai teks dipindah ke isian internal atau dihapus.
- *Given* catatan publik berisi "meet.google.com/abc-defg-hij", *when* disimpan, *then* penyimpanan ditahan dan pesan di isian menyarankan memindahkannya ke tautan rapat internal.
- *Given* catatan publik berisi "PIN: 123456", *when* disimpan, *then* penyimpanan ditahan dengan pesan yang sama jenisnya.
- *Given* kegiatan dengan catatan internal dan tautan rapat, *when* data portal publik diperiksa langsung (bukan hanya tampilannya), *then* kedua isian itu tidak ada.

**F12 Edit bersamaan.** Bila dua petugas mengubah kegiatan yang sama, penyimpanan yang lebih belakangan dihentikan. Sistem menjelaskan bahwa kegiatan sudah diubah orang lain (siapa dan kapan), tidak membuang isian petugas, dan menawarkan memuat versi terbaru.
- *Given* petugas A dan B membuka kegiatan yang sama, A menyimpan lebih dulu, *when* B menyimpan, *then* simpanan B ditolak dengan nama A dan waktu simpannya, dan isian B tetap ada di layar.
- *Given* pesan itu tampil, *when* B memilih "Muat versi terbaru", *then* formulir memuat data simpanan A.

**F13 Data master satu halaman.** Satu halaman berisi lima bagian: **pegawai, unit/bidang, ruangan/lokasi, penyelenggara, kategori**, dengan pencarian di tiap bagian. Ruangan/lokasi punya tipe (kantor, luar kantor, daring) dan tanda "dapat dipesan" untuk F9. Data yang sudah dipakai kegiatan **dinonaktifkan, bukan dihapus**; data nonaktif tidak muncul di pilihan formulir baru tetapi tetap tampil di kegiatan lama dan laporan. Hanya admin yang dapat mengubah data master.
- *Given* ruangan sudah dipakai satu kegiatan, *when* admin menghapusnya, *then* sistem menolak dan menawarkan menonaktifkan.
- *Given* pegawai dinonaktifkan, *when* formulir kegiatan baru dibuka, *then* pegawai itu tidak ada di pilihan, tetapi namanya tetap tampil di kegiatan lama.
- *Given* nama penyelenggara sudah ada, *when* admin menambah nama yang sama, *then* ditolak sebagai duplikat.

**F14 Laporan 8 kolom.** Laporan jadwal resmi untuk rentang tanggal yang dipilih, dengan kolom tetap: `No | Hari / Tanggal | Pukul | Kegiatan | Tempat | Penyelenggara | Dihadiri Oleh | Keterangan`. Unduh sebagai **PDF (A4)**, **Excel (.xlsx)** dan **gambar** (PNG). Kegiatan yang dibatalkan ditandai "[DIBATALKAN]" dan Keterangan berisi pemberitahuan publiknya; alasan internal dan catatan internal tidak pernah masuk laporan. Pilihan untuk tidak menyertakan kegiatan yang dibatalkan.
- *Given* rentang 1–31 Desember, *when* laporan dibuat, *then* semua kegiatan di rentang itu tampil urut tanggal dan jam, dengan delapan kolom di atas dan nomor berurutan.
- *Given* kegiatan dibatalkan dengan pemberitahuan publik, *when* laporan dibuat, *then* Kegiatan diawali "[DIBATALKAN]" dan Keterangan berisi "Dibatalkan: <pemberitahuan>", tanpa alasan internal.
- *Given* laporan yang sama, *when* diunduh sebagai PDF, Excel dan gambar, *then* isi barisnya sama di ketiga format.
- *Given* PDF diunduh, *when* dibuka, *then* ukurannya A4 dan huruf Indonesia tampil benar.

**F15 Kop surat.** Laporan (PDF, Excel dan gambar) memuat kop surat Dinas di bagian atas: logo, nama instansi, alamat dan kontak. Admin mengunggah atau mengganti gambar kop surat dari halaman pengaturan.
- *Given* kop surat sudah diatur, *when* laporan PDF dibuat, *then* kop surat tampil di atas halaman pertama.
- *Given* kop surat belum diatur, *when* laporan dibuat, *then* laporan tetap dibuat tanpa kop dan admin diberi tahu bahwa kop belum diatur.

**F16 Pejabat penandatangan.** Admin mengubah data pejabat penandatangan (nama, jabatan, NIP) di halaman pengaturan. Laporan mendapat blok tanda tangan di bawah tabel: tempat dan tanggal, jabatan, ruang tanda tangan, nama dan NIP.
- *Given* admin mengubah nama pejabat, *when* laporan baru dibuat, *then* blok tanda tangan memakai nama baru, dan perubahan tercatat di riwayat.
- *Given* peran editor, *when* membuka pengaturan pejabat, *then* data hanya dapat dilihat, tidak dapat diubah.

**F17 Riwayat perubahan.** Setiap simpan, batal, hapus, mundur tahap, perubahan data master, pengguna dan pengaturan tercatat: siapa, kapan, apa, nilai sebelum dan sesudah. Admin dapat melihat riwayat per kegiatan dan secara keseluruhan, dengan filter tanggal dan pengguna. Riwayat tidak dapat diubah atau dihapus dari aplikasi.
- *Given* editor mengubah jam kegiatan, *when* admin membuka riwayat kegiatan itu, *then* tampil nama editor, waktu (WIB), dan jam lama serta jam baru.
- *Given* admin, *when* mencoba mengubah atau menghapus entri riwayat, *then* tidak ada tombol untuk itu dan sistem menolaknya.

**F18 Kelola pengguna dan peran.** Halaman admin untuk menambah pengguna (email dan peran), mengubah peran, dan menonaktifkan akun, menggantikan skrip baris perintah di uji coba. Admin tidak dapat menurunkan perannya sendiri atau menonaktifkan admin terakhir.
- *Given* admin menambah pengguna dengan peran editor, *when* pengguna itu login (setelah mengatur kata sandi lewat email), *then* ia masuk sebagai editor.
- *Given* hanya ada satu admin, *when* admin itu mencoba menonaktifkan dirinya, *then* sistem menolak.
- *Given* akun dinonaktifkan, *when* pengguna itu mencoba login, *then* akses ditolak.

**F19 Cadangan data.** Admin mengekspor seluruh data (kegiatan, data master, pengaturan, riwayat) menjadi satu berkas cadangan, dan memulihkan dari berkas cadangan, dari halaman admin, menggantikan skrip cadangan di uji coba. Pemulihan menampilkan ringkasan isi berkas dan meminta konfirmasi dengan mengetik kata "PULIHKAN", lalu tercatat di riwayat. Berkas cadangan berisi data pegawai, jadi disimpan di tempat yang tidak publik.
- *Given* admin mengekspor, *when* berkas diunduh, *then* berkas berisi jumlah kegiatan dan data master yang sama dengan sistem.
- *Given* berkas cadangan rusak atau bukan dari SIMAK DISKUM, *when* dipulihkan, *then* sistem menolak sebelum mengubah data apa pun.
- *Given* berkas valid, *when* admin mengetik "PULIHKAN" dan mengonfirmasi, *then* data dipulihkan dan tercatat di riwayat.

## 5. Di luar cakupan

- Pengumuman publik (ada di uji coba, dihapus atas keputusan pengguna).
- Mode offline (PWA).
- Cloud Functions atau layanan lain yang memerlukan akun penagihan (billing).
- Aplikasi di app store; aplikasi ini hanya web responsif.
- Pemindahan data Excel lama sebagai fitur petugas. Pemindahan satu kali dikerjakan saat penyiapan dan dijelaskan di dev handbook.
- Notifikasi email atau WhatsApp.
- Harga dan penawaran (dibuat terpisah).

## 6. Ukuran keberhasilan (usulan, belum disepakati)

- Petugas mencatat satu kegiatan baru dalam kurang dari 2 menit, di satu halaman.
- Laporan 8 kolom untuk satu bulan dibuat dalam kurang dari 10 detik.
- Tidak ada data internal yang tampil di portal publik (diperiksa saat uji penerimaan).
- Setiap perubahan data dapat ditelusuri ke satu pengguna.
- Bentrok ruangan dan pegawai yang tercatat sebelum kegiatan berkurang dibanding pencatatan Excel.
- Portal publik dan halaman admin memenuhi WCAG 2.2 AA dan Core Web Vitals "baik" (LCP ≤ 2,5 dtk, INP ≤ 200 ms, CLS ≤ 0,1).

## 7. Batasan

- **Biaya:** gratis lebih dulu: Firebase paket Spark, Google Apps Script dan Google Drive. Layanan berbayar hanya dengan alasan tertulis dan persetujuan klien.
- **Waktu:** belum ditentukan.
- **Zona waktu:** WIB (Asia/Jakarta) untuk semua tampilan, status otomatis dan laporan.
- **Perangkat:** peramban modern, dari ponsel selebar 320 px sampai komputer.
- **Laporan:** delapan kolom laporan tetap dan tidak dapat diubah.
- **Data pribadi:** data pegawai (nama, NIP, jabatan) dan data pejabat penandatangan diperlakukan sebagai data pribadi. Dokumen proyek tidak memuat nama atau NIP; daftar pegawai hanya disebut sebagai 70 pegawai, belum diverifikasi. Link surat undangan di Google Drive tidak pernah dibuat publik.
- **Keamanan:** daftar periksa OWASP Top 10 dan tinjauan keamanan pada setiap perubahan.
- **Teknologi:** pilihan teknologi diputuskan di dev handbook dan disetujui terpisah, bukan di PRD ini.

## 8. Pertanyaan terbuka

| No | Pertanyaan | Dijawab oleh |
|---|---|---|
| 1 | Siapa pejabat yang menandatangani laporan, dan dalam jabatan apa (termasuk bila diwakili)? | Klien (Kepala Dinas) |
| 2 | Kapan daftar 70 pegawai diverifikasi oleh Subbag Kepegawaian? | Klien (Subbag Kepegawaian) |
| 3 | Siapa saja pemegang akun admin dan editor? | Klien |
| 4 | Orientasi laporan dengan kop surat: potret atau lanskap? | Klien |
| 5 | Dari mana berkas kop surat resmi (logo dan teks) diperoleh? | Klien (Subbag Umum) |
| 6 | Apakah editor boleh membatalkan kegiatan, atau hanya admin? | Klien |
| 7 | Di portal publik, kolom "Dihadiri Oleh" menampilkan nama pegawai, jabatan, atau unit saja? | Klien |

## 9. Persetujuan

Dengan menandatangani, klien menyetujui cakupan F1–F19 di atas. Perubahan cakupan setelah ini dicatat di PRD lebih dulu.

| Nama klien | Jabatan | Tanggal | Tanda tangan |
|---|---|---|---|
| | | | |
