# Bank Pertanyaan Ujian Skripsi (Komprehensif) + Jawaban

**Judul:** Perancangan Sistem Informasi Pemantauan Data Cuaca dan Klimatologi Kelautan Berbasis Website dengan Fitur Ekspor Laporan Dinamis

**Mahasiswa:** Muhammad Sayyid Murtaja (L1C022044)

---

## PART 1 — JAWABAN BANK SOAL

### A. Pendahuluan (Bab I)

**A1. Mengapa buat sendiri, bukan pakai platform BMKG?**
Karena platform BMKG/instansi resmi bersifat **informasi publik** (prakiraan & kondisi umum), sedangkan kebutuhan di sini adalah **pemantauan data mentah stasiun sendiri (AWS)** secara kontinu untuk pengelolaan dan pelaporan internal — khususnya data cuaca & klimatologi kelautan yang nilainya spesifik per titik (Padang, Bali, Pangandaran). Ditambah, data perlu diekspor menjadi laporan dinamis sesuai kebutuhan instansi, yang tidak disediakan platform publik.

**A2. Bagaimana sistem menyelesaikan masalah "fragmentasi"?**
Sebelumnya tiap stasiun menyimpan datanya sendiri-sendiri sehingga akses dan pelaporan terpecah. Sistem ini **memusatkan 3 stasiun AWS (Bungus/Padang, Bali, Pangandaran)** dalam satu platform (`config/Location.ts` memetakan `padang→aws_bungus`, `bali→aws_bali`, `pangandaran→aws_pangandaran`): satu tempat login, satu tampilan dashboard, satu mekanisme ekspor. Fragmentasi data tetap ada secara fisik (per-stasiun) tetapi **dipersatukan secara logika** oleh konfigurasi tersebut.

**A3. Mengapa Ekspor Laporan Dinamis jadi poin sentral?**
Karena petugas lapangan sebelumnya menyusun laporan **manual** (menyalin angka ke dokumen). Fitur ini memungkinkan memilih **parameter, stasiun, rentang tanggal, dan interval (jam/hari/bulan)** lalu langsung menghasilkan file (CSV/Excel/PDF) — mempercepat pelaporan dari hitungan jam menjadi hitungan menit dan mengurangi kesalahan salin.

### B. Tinjauan Pustaka (Bab II)

**B1. Mengapa Next.js?**
Karena kebutuhan: (1) **SSR/SSG** — halaman di-render server sehingga **SEO baik dan data tampil lebih cepat** tanpa nunggu JavaScript di browser; (2) **Full-stack dalam satu codebase** — API route (`app/api/dashboard`, auth) satu folder dengan frontend; (3) ekosistem React + tooling lengkap. React murni tidak punya SSR/API bawaan; Vue.js juga butuh konfigurasi tambahan (Nuxt) untuk fitur serupa. Konteks pemantauan: SSR membantu halaman pertama kali termuat cepat dan hasil agregasi bisa disiapkan server-side.

**B2. Prinsip Least Privilege di RBAC + kenapa tidak ABAC?**
Role hanya dua: `ADMIN` dan `USER` (enum di `prisma/schema.prisma`). Prinsip least privilege: **user biasa hanya melihat & mengekspor data; tindakan sensitif (mengelola akun, unduh PDF laporan resmi, menu admin) hanya untuk ADMIN** — di kode terlihat `user?.role !== "ADMIN"` membuat tombol PDF terkunci (ikon gembok), halaman `ProfileUsers` (kelola user & role) hanya dirender untuk ADMIN. ABAC tidak dipakai karena **kebutuhan sederhana**: kontrol cukup berbasis peran, tidak perlu atribut konteks (lokasi/waktu/aset). ABAC menambah kompleksitas kebijakan tanpa manfaat nyata di skala aplikasi ini.

**B3. Mengapa SUS, bukan wawancara mendalam?**
SUS dipilih karena: (1) **standar & sudah tervalidasi** — 10 pertanyaan baku, mudah dibandingkan dengan penelitian lain; (2) **kuantitatif & ringkas** — responden mengisi cepat (tidak butuh waktu wawancara berjam-jam); (3) **skor tunggal 0–100** yang mudah diinterpretasi kategori (Poor/OK/Good/Excellent). Wawancara mendalam memang memberi wawasan kualitatif, tetapi **sulit dikuantifikasi, memakan waktu, dan rawan bias pewawancara**.

### C. Materi & Metode (Bab III)

**C1. Horizontal sharding (tabel per stasiun) — kenapa tidak satu tabel besar ber-`station_id`?**
Alasan teknis: (1) **Isolasi data** — kegagalan/beban satu stasiun tidak mengganggu stasiun lain; (2) **Ukuran indeks & tabel lebih kecil** — saat data mencapai jutaan baris, indeks `timestamp` per-tabel jauh lebih ramping daripada satu indeks raksasa ber-`station_id`, sehingga pencarian rentang waktu lebih cepat; (3) **query paralel & sederhana** — query per stasiun tidak perlu klausa filter `WHERE station_id = ...` yang membebani optimizer. Trade-off: ada duplikasi skema (3 model hampir sama di `schema.prisma`) dan agregasi lintas-stasiun harus meng-iterasi 3 tabel — ini dimudahkan oleh `LOCATIONS` di config. Keputusan ini juga sesuai cara data masuk: **tiap stasiun menulis ke tabelnya sendiri**, jadi sharding adalah pemetaan alami.

**C2. Peran vital Prisma ORM (type-safety)?**
Prisma **membangun client dari skema** sehingga setiap field model memiliki tipe TypeScript. Error salah tipe/kolom **terdeteksi saat kompilasi (tsc)**, bukan runtime. Migrasi terversi (`prisma/migrations`), sehingga struktur DB terkontrol & dapat direproduksi di deploy. Untuk agregasi khusus, Prisma tetap menyediakan `$queryRawUnsafe` tanpa kehilangan kemampuan memetakan hasil ke tipe `AvgWeatherData`.

**C3. Alur data sensor AWS → MySQL + validasi?**
Alur: sensor AWS mengirim data → masuk ke **tabel per stasiun di MySQL (Azure)** → aplikasi membaca via Prisma → **dibersihkan saat agregasi** (bukan saat masuk). Penting & jujur: **validasi dilakukan di sisi query dengan `CASE WHEN`** (mis. suhu −50..60°C, RH 0..100%, P 900..1100, radiasi −200..1100, angin 0..60 m/s), nilai di luar batas diabaikan agar rata-rata tidak rusak. Proses pengiriman data sensor itu sendiri (telemetri) berada di luar lingkup repositori aplikasi — aplikasi ini bertanggung jawab menyajikan & membersihkan data.

**C4. Penentuan 45 responden & bias?**
45 responden jauh di atas batas minimum SUS (≥10–12 pengguna sudah memadai untuk mengungkap mayoritas masalah usability — Nielsen), sehingga hasil cukup valid secara statistik. Mengenai bias: **mahasiswa perairan/kalangan teknis cenderung lebih familier dengan web** sehingga bisa menaikkan skor; **masyarakat umum** lebih realistis pada pengalaman pemakaian sebenarnya. Rata-rata 70,78 justru mencerminkan campuran keduanya — bukan skor yang terlalu tinggi.

### D. Hasil & Pembahasan (Bab IV)

**D1. Kenapa perlu Wind Rose?**
Grafik garis hanya menunjukkan **nilai kecepatan vs waktu**. Wind Rose menampilkan **distribusi gabungan arah + kekuatan angin dalam persentase frekuensi** — informasinya: arah angin dominan (mata angin dengan segmen terpanjang), kombinasi "dari mana + seberapa kencang", dan perbandingan antar sektor. Ini krusial untuk **keselamatan pelayaran, navigasi, dan budidaya laut** — mis. menentukan arah gelombang & arus atau angin dominan untuk lokasi tambak.

**D2. Penanganan sesi JWT + jika token dicuri?**
NextAuth memakai **strategi JWT** (`lib/auth.ts`): saat login, token **ditandatangani server dengan `AUTH_SECRET`** berisi `id` + `role`; disimpan di cookie; tiap request, server memverifikasi tanda tangan. **Jika token dicuri**: penyerang bisa menyamar sampai token kedaluwarsa (atau role diubah saat request diproses server memakai nilai dalam token). Mitigasi: HTTPS, `AUTH_SECRET` kuat & dirahasiakan, masa berlaku token (expiry), dan jangan simpan token di tempat tidak aman.

**D3. Analisis SUS 70,78 — mengapa tidak "Excellent" (≥80,3)?**
Kendala yang umumnya dirasakan responden: **kerapatan parameter/informasi** di dashboard (banyak kartu & grafik), **istilah teknis kelautan** (radiasi neto, tekanan uap) yang asing bagi masyarakat umum, dan **responsivitas** di layar kecil. Kehadiran fitur panduan (tour) membantu, tetapi pengguna baru tetap butuh waktu adaptasi → skor berada di kategori "Good", belum Excellent.

**D4. Kualitas resolusi grafik di PDF?**
Mekanisme: DOM dirender ke canvas dengan **`html2canvas-pro`** → `canvas.toDataURL("image/png")` → disisipkan ke PDF via `jsPDF`. Karena PNG **lossless (tanpa kompresi/artefak)** dan `useCORS: true` (gambar eksternal tidak hilang), teks & garis tetap tajam. Parameter `scale` mengontrol DPI render (dashboard aktif memakai scale 1; kode lama memakai scale 2); untuk laporan resmi scale dapat dinaikkan → resolusi lebih tinggi. Elemen loading diberi `data-html2canvas-ignore` agar tidak ikut ter-ekspor.

### E. Kesimpulan (Bab V)

**E1. Kendala infrastruktur terbesar di penerapan nyata?**
**Koneksi internet di lokasi stasiun (daerah pesisir/terpencil)** — keandalan transmisi data dari AWS ke server, lalu akses dari kantor ke aplikasi. Berikutnya: **pasokan daya/baterai panel** stasiun dan ketersediaan **server database yang stabil** (hosting berbayar/bandwidth). Semua berujung pada ketersediaan data real-time.

**E2. Prioritas saran pengembangan + bisakah ML?**
Prioritas: **ingestion API real-time + validasi saat data masuk**, lalu **notifikasi/alerting** (mis. baterai lemah, nilai ekstrem). **Machine learning untuk prediksi cuaca sangat memungkinkan**: arsitektur sudah menghasilkan data deret waktu teragregasi (jam/hari/bulan) yang siap dilatih model prediksi (mis. regresi/ARIMA/LSTM) — tinggal menambahkan modul analitik yang memakai data historis yang sudah ada.

---

## PART 2 — BANK SOAL GALIAN (Pertanyaan Lanjutan) + Jawaban

**G1. Bagaimana Anda mencegah SQL injection pada query raw (`$queryRawUnsafe`)?**
Nama tabel bukan dari input pengguna — diambil dari whitelist `TableName` (`aws_bungus/aws_bali/aws_pangandaran`) di config, jadi tidak bisa dimanipulasi. Rentang tanggal dikonversi dari objek `Date` terformat, bukan string mentah sembarangan. (Prisma sendiri aman default untuk query terstruktur.)

**G2. Kenapa data tersimpan UTC, bukan WIB?**
Agar **konsisten & bebas zona** — UTC adalah standar waktu global. Konversi ke WIB (+7) dilakukan **saat query** lewat `DATE_ADD(timestamp, INTERVAL 7 HOUR)` di SELECT/WHERE/GROUP BY, sehingga jika ada stasiun di zona lain, tinggal ubah offset tanpa merombak data.

**G3. Apa beda `AvgGeneralHour` dan `ExportGeneric`?**
SQL-nya sama; yang membedakan tujuan: `AvgGeneralHour` menghasilkan data untuk **grafik** (nama kolom `avg_*`), `ExportGeneric` menghasilkan data siap **ekspor** (nama kolom asli). Logika pemilihan periode, zona waktu, dan filter nilai mustahil identik.

**G4. Mengapa hujan memakai `SUM` sedangkan parameter lain `AVG`?**
Karena curah hujan bersifat **kumulatif** — "total hujan" dalam satu jam/hari/bulan adalah penjumlahan seluruhnya, sedangkan suhu/kelembapan/tekanan adalah **nilai sesaat** sehingga rata-rata lebih bermakna. Suhu maks/min memakai `MAX`/`MIN`.

**G5. Apa itu `jumlah_data` dan fungsinya?**
`COUNT(*)` per periode — menunjukkan **berapa banyak sampel mentah** dalam satu jam/hari/bulan. Fungsinya: validasi kelengkapan (periode dengan `jumlah_data` kecil diragukan), dan dasar menjelaskan kenapa rata-rata bisa bernilai NULL (semua sampel dianggap mustahil).

**G6. Kenapa angka rata-rata bisa NULL, bukan 0?**
Karena `CASE WHEN` membuat nilai di luar batas menjadi NULL. Kalau semua sampel di satu periode tidak valid, `AVG` menghasilkan NULL (bukan 0 yang menyesatkan). Inilah "non-destruktif" — **DB asli tidak diubah**, penyaringan hanya saat pembacaan.

**G7. Bagaimana default role bisa ADMIN di skema — ini aman?**
Jujur: skema menetapkan `@default(ADMIN)` dan ada `TESTING_MODE` yang memaksa semua akun jadi ADMIN untuk demo. **Untuk produksi, default harus `USER` dan `TESTING_MODE=false`** — ini poin yang menunjukkan saya paham implikasi keamanan (sudah dicatat sebagai perbaikan).

**G8. Bedanya login Google dan Credentials di sistem Anda?**
Keduanya melewati NextAuth. **Credentials**: email+password, divalidasi dengan `bcrypt` (`hashSync` saat register, `compareSync` saat login) — cocok untuk pengguna internal. **Google (OAuth)**: identitas dipegang Google, user dibuat otomatis via PrismaAdapter. Keduanya menghasilkan JWT yang memuat `id` + `role`.

**G9. Apakah Password disimpan aman?**
Ya — di-hash dengan **bcrypt (cost 10)** sebelum disimpan (`register/route.ts`); hanya hash yang ada di DB, password asli tidak pernah disimpan. Ini alasan `user.password` nullable — akun Google tidak punya password.

**G10. Apa keuntungan `useCORS: true` di html2canvas?**
Gambar dari domain lain (mis. ikon/aset eksternal) **diblokir browser karena CORS** sehingga canvas bisa kosong/blank saat diekspor. `useCORS: true` memberi izin mengambil aset tersebut sehingga hasil PDF tetap lengkap.

**G11. Mengapa 16 arah mata angin di Wind Rose?**
Resolusi 16 sektor (22,5° per sektor) memberikan **detail arah yang lebih halus** daripada 8 arah (45°) — penting untuk analisis angin kelautan yang peka arah. Formula `Math.floor(((dir+11.25)%360)/22.5)` memetakan derajat ke indeks 0–15.

**G12. Bagaimana derajat diubah ke nama arah (badge)?**
`getCompassDirection` membagi 360° menjadi 8 sektor (`Math.round(degree/45) % 8`) → nama Utara, Timur Laut, Timur, dst. Dipakai pada badge "Arah: Barat Daya" di kartu data.

**G13. Apa yang terjadi jika `W_D_Avg` kosong di Wind Rose?**
Ada fallback beruntun: `W_D_Avg` → `WD_Max_WS` → `avg_W_D_Avg`; untuk kecepatan: `WS_S_Avg` → `avg_WS_S_Avg`. Jadi grafik tetap terisi walau satu kolom kosong.

**G14. Bagaimana status "online" stasiun ditentukan?**
Bukan dari "server menyala", tapi dari **kesegaran data**: API `/api/dashboard` mengambil `MAX(time)` tiap stasiun, menghitung `ageMinutes` (berapa menit sejak data terakhir), dan menandai ONLINE jika < 15 menit. Jika data terakhir berbulan-bulan lalu, status dengan jujur OFFLINE — ini menghindari klaim koneksi yang menyesatkan.

**G15. Apa fungsi halaman `ProfileUsers`?**
Manajemen pengguna khusus ADMIN: melihat daftar user, **mengubah role USER↔ADMIN** (implementasi RBAC). Halaman ini hanya dirender untuk ADMIN — user biasa tidak dapat mengakses.
