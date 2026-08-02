# ISSUE: Revisi Total Bab 3 — Migrasi Narasi dari Django ke Next.js

## Konteks Masalah
Draft Bab 3 (Materi dan Metode) saat ini seluruhnya ditulis berdasarkan stack teknologi **Django + PostgreSQL + PostGIS + Leaflet.js + Chart.js**. Namun, implementasi riil yang sudah berjalan menggunakan stack yang **sepenuhnya berbeda**: **Next.js + Prisma ORM + MySQL + Recharts + Echarts + Tailwind CSS**. Seluruh narasi dan gambar Bab 3 harus direvisi agar konsisten dengan kode sumber aktual.

---

## BAGIAN A: Gambar yang Harus Di-Generate Ulang

### Gambar 1 — Kerangka Kerja Penelitian
**Posisi**: Setelah paragraf pengantar Sub-Bab 3.2 Metode (halaman 11)
**Instruksi**: Buatkan kode Mermaid `flowchart TD` dengan susunan kotak vertikal dan garis putus-putus ke kanan, seperti berikut:

- **A**: "Pengumpulan Data Sensor AWS"
- **B**: "Perancangan Perangkat Lunak" -.-> **B1**: "Website Next.js dan Prisma ORM"
- **C**: "Pengembangan Perangkat Lunak" -.-> **C1**: "Manajemen Hak Akses dan Fitur Ekspor PDF dan CSV"
- **D**: "Implementasi Visualisasi Data" -.-> **D1**: "Visualisasi Cuaca via Grafik Dinamis dan Navigasi Regional"
- **E** (output dari D): "Website Pemantauan Data Cuaca"
- **F** (output dari D): "Dashboard Interaktif: Navigasi Lokasi, Grafik Dinamis, Filter Data dan Cetak Laporan"

**Catatan Kritis**:
- JANGAN tulis "Peta Interaktif" (tidak ada library peta di kode). Gunakan "Navigasi Regional".
- JANGAN tulis "CRUD" (data sensor AWS bersifat immutable/read-only). Gunakan "Manajemen Hak Akses dan Fitur Ekspor".

---

### Gambar 2 — Alur Pengumpulan Data dari AWS
**Posisi**: Akhir Sub-Bab 3.2.1 Pengumpulan Data (halaman 13)
**Instruksi**: Buatkan kode Mermaid `flowchart TD` dengan alur:

- 3 node sumber: "Stasiun AWS Bali", "Stasiun AWS Pangandaran", "Stasiun AWS Bungus"
- Ketiga node mengarah ke: "Database MySQL" (dengan keterangan parameter: Ta_Avg, RH_Avg, WS_S_Avg, Rain_mm_Tot)
- Database mengarah ke: "Server API Next.js /api/dashboard" (dengan keterangan: Query via Prisma ORM findMany)
- API mengarah ke: "Antarmuka Dashboard" (dengan keterangan: Respons JSON)

**Catatan Kritis**:
- JANGAN sebut Django atau PostgreSQL. Gunakan MySQL dan Prisma ORM.
- JANGAN sebut "Quality Control (QC)" kecuali memang ada di kode.

---

### Gambar 3 — Metode Waterfall
**Posisi**: Awal Sub-Bab 3.2.3 Pengembangan Perangkat Lunak (halaman 14)
**Instruksi**: Buatkan kode Mermaid `flowchart LR` dengan 5 tahap standar Waterfall:

- "Requirement Analysis" --> "System Design" --> "Implementation" --> "Verification" --> "Maintenance"

**Catatan**: Bentuk diagram ini tetap sama dengan proposal asli. Yang berubah adalah NARASI di bawahnya (lihat Bagian B).

---

## BAGIAN B: Teks Narasi yang Harus Direvisi (Per Sub-Bab)

### Sub-Bab 3.1.1 — Tabel 1 (Alat)
**Perubahan pada tabel**:
| No | Lama (Draft) | Baru (Revisi) |
|----|---|---|
| 2 | Next.js versi 14.x | **Tetap** (sudah benar) |
| 3 | Prisma ORM & MySQL | **Tetap** (sudah benar) |
| - | *(tidak ada)* | **Tambahkan**: Recharts & Echarts — Pustaka grafik berbasis SVG untuk visualisasi data cuaca interaktif |
| - | *(tidak ada)* | **Tambahkan**: NextAuth.js — Modul autentikasi dan manajemen hak akses berbasis Role (RBAC) |

### Sub-Bab 3.1.2 — Tabel 2 (Bahan)
**Perubahan pada tabel**:
| No | Lama (Draft) | Baru (Revisi) |
|----|---|---|
| 3 | Recharts (Charting Library) | **Tetap** (sudah benar) |
| 4 | TypeScript & CSS | Ganti menjadi: **TypeScript & Tailwind CSS** — Bahasa pemrograman type-safe dan framework CSS utility-first |

### Sub-Bab 3.2.1 — Pengumpulan Data (Halaman 12-13)
**Hapus/Ganti seluruh kalimat berikut**:
- "...dikirim secara otomatis melalui jaringan nirkabel ke **server Django**" → ganti menjadi "...dikirim secara otomatis ke **basis data MySQL**"
- "...disimpan dalam **basis data PostgreSQL** setelah melalui proses validasi dan **quality control (QC)**" → ganti menjadi "...disimpan dalam **basis data MySQL** dan diakses oleh sistem web melalui **Prisma ORM**"
- "...divisualisasikan menggunakan **Leaflet.js** untuk peta interaktif dan **Chart.js** untuk grafik" → ganti menjadi "...divisualisasikan menggunakan **Recharts** dan **Echarts** untuk grafik parameter cuaca interaktif dan **navigasi antarlokasi berbasis komponen React**"
- Hapus kalimat: "...mendukung pengelolaan data **(CRUD)** dan ekspor melalui antarmuka web"
- Ganti dengan: "...mendukung **visualisasi data real-time, pemfilteran rentang waktu, serta ekspor laporan** melalui antarmuka web yang responsif"

### Sub-Bab 3.2.2 — Perancangan Bangun Perangkat Lunak (Halaman 13)
**Revisi total**. Ganti seluruh paragraf lama yang menyebut Django/MVT menjadi:
> "Tahap ini berfokus pada pembuatan struktur awal sistem menggunakan framework Next.js dengan arsitektur App Router. Perancangan dimulai dari inisialisasi proyek, pembentukan struktur direktori berbasis file-system routing, hingga konfigurasi koneksi basis data MySQL melalui Prisma ORM. Arsitektur sistem dirancang dengan pemisahan antara Server Components (untuk pengambilan data secara aman dari database) dan Client Components (untuk interaktivitas antarmuka pengguna, grafik, dan filter). Perancangan antarmuka dasar mencakup halaman utama (Homepage), navigasi antar-lokasi stasiun AWS, serta layout responsif menggunakan Tailwind CSS sebagai fondasi komponen visual pada tahap pengembangan selanjutnya."

### Sub-Bab 3.2.3 — Pengembangan Perangkat Lunak / Waterfall (Halaman 13-17)
**Paragraf pengantar**: Ganti semua referensi Django/PostgreSQL/PostGIS/Leaflet:
> "Proses pengembangan sistem dilakukan menggunakan framework Next.js (TypeScript) sebagai kerangka kerja full-stack untuk membangun antarmuka web dan API, Prisma ORM dengan MySQL sebagai sistem manajemen basis data untuk penyimpanan log cuaca, serta Recharts dan Echarts sebagai pustaka frontend untuk visualisasi grafik parameter cuaca secara dinamis."

**Tahap (a) Requirement** — Tetap, tidak perlu diubah.

**Tahap (b) Design** — Tetap, tidak perlu diubah (use case, activity diagram, dll masih relevan).

**Tahap (c) Implementation** — Revisi total. Ganti seluruh paragraf yang menyebut Django/MVT/PostGIS/CRUD menjadi:
> "Implementasi sistem dilakukan dengan memanfaatkan framework Next.js berbasis bahasa pemrograman TypeScript. Pada sisi backend, Next.js API Routes digunakan untuk mengelola data hasil pengamatan Automatic Weather Station (AWS) dan menyediakan endpoint RESTful yang mengembalikan data dalam format JSON. Seluruh data disimpan menggunakan basis data MySQL dan diakses melalui Prisma ORM yang menjamin konsistensi dan keamanan struktur data (type-safe). Pada sisi frontend, antarmuka pengguna dibangun menggunakan React Components dengan Tailwind CSS untuk tata letak responsif. Sistem autentikasi diimplementasikan menggunakan NextAuth.js dengan pendekatan Role-Based Access Control (RBAC), di mana fitur ekspor laporan hanya dapat diakses oleh pengguna dengan peran Administrator. Integrasi modul ekspor dilakukan menggunakan pustaka html2canvas-pro dan jsPDF untuk menghasilkan dokumen PDF, serta react-csv untuk mengekstraksi data ke format CSV."

**Catatan Penting untuk tahap (c)**:
- JANGAN tulis "modul CRUD (Create, Read, Update, Delete)". Dalam sistem telemetri IoT, data sensor bersifat **immutable** (tidak boleh diubah manual oleh manusia) demi menjaga integritas dan validitas data penelitian cuaca. Sistem hanya menyediakan operasi Read (visualisasi dan filter) serta Export (unduh PDF/CSV).
- JANGAN sebut PostGIS atau GIS karena tidak ada di kode.

**Tahap (d) Verification** — Ganti kalimat "...uji validitas data untuk memastikan kesesuaian antara data yang diperoleh dari AWS dan data yang **divisualisasikan pada dashboard**" menjadi:
> "...uji validitas data untuk memastikan kesesuaian antara data yang tersimpan di basis data MySQL dan data yang ditampilkan pada grafik Recharts di dashboard, serta memverifikasi bahwa dokumen PDF dan CSV yang diunduh memuat data yang akurat sesuai filter rentang waktu yang dipilih pengguna."

**Tahap (e) Maintenance** — Tetap, tidak perlu diubah.

### Sub-Bab 3.2.4 — Pengembangan Fitur Visualisasi Data Cuaca (Halaman 17)
**Revisi total**. Ganti seluruh paragraf yang menyebut Leaflet.js/Chart.js menjadi:
> "Tahap ini difokuskan pada pengembangan komponen visual guna menyajikan data cuaca secara informatif dan interaktif, dengan memanfaatkan pustaka Recharts untuk menghasilkan grafik garis (Line Chart) dan grafik batang (Bar Chart) yang menampilkan parameter cuaca seperti suhu, kelembapan, kecepatan angin, dan curah hujan secara dinamis. Selain itu, pustaka Echarts digunakan untuk komponen visualisasi khusus seperti grafik Wind Rose yang merepresentasikan distribusi arah dan kecepatan angin. Navigasi antarlokasi stasiun AWS diimplementasikan melalui komponen kartu regional (Card-Based Navigation) yang memungkinkan pengguna berpindah antar-dashboard Bali, Pangandaran, dan Bungus secara intuitif. Sistem dikonfigurasi untuk merespons filter rentang waktu (DatePicker) dan interval (per jam/hari/minggu) secara real-time, sehingga grafik akan melakukan render ulang seketika saat parameter filter diubah oleh pengguna. Fitur Tooltip interaktif juga disematkan pada setiap grafik untuk menampilkan detail nilai data saat kursor diarahkan ke titik tertentu."

---

## BAGIAN C: Justifikasi Akademis (Paragraf Pembelaan untuk Sidang)

### Mengapa Tidak Ada Peta Geospasial (Leaflet.js)?
Sisipkan paragraf berikut di akhir Sub-Bab 3.2.4:
> "Dalam proses pengembangan, pendekatan visualisasi lokasi stasiun mengalami penyesuaian dari konsep peta geospasial (interactive maps) menjadi sistem navigasi berbasis komponen kartu regional (card-based navigation). Keputusan desain ini diambil berdasarkan pertimbangan bahwa pustaka peta geospasial memerlukan pemuatan aset tambahan yang berdampak pada waktu respons halaman dan bertentangan dengan prinsip performa Server-Side Rendering (SSR) pada Next.js. Selain itu, mengingat sistem berfungsi sebagai alat analisis data kuantitatif (bukan pemetaan spasial kualitatif), antarmuka kartu regional terbukti lebih efisien dalam mengalokasikan ruang layar untuk menampilkan grafik dan tabel data yang lebih informatif."

### Mengapa Tidak Ada CRUD Data Cuaca?
Sisipkan paragraf berikut di akhir tahap (c) Implementation:
> "Sistem secara sengaja tidak menyediakan fitur manipulasi data (Create, Update, Delete) terhadap rekaman cuaca yang tersimpan di basis data. Keputusan ini berlandaskan pada prinsip immutabilitas data telemetri (telemetry data immutability) yang merupakan standar baku dalam pengembangan sistem Internet of Things (IoT). Data yang dikirimkan dari sensor fisik AWS merepresentasikan kondisi atmosfer aktual pada suatu titik waktu tertentu, sehingga modifikasi manual akan merusak validitas ilmiah dan integritas data penelitian. Oleh karena itu, hak akses dibatasi hanya pada operasi Read (visualisasi dan filter) serta Export (pengunduhan laporan PDF dan CSV)."

---

## BAGIAN D: Checklist Verifikasi

Setelah mengerjakan semua revisi di atas, pastikan:
- [ ] Tidak ada satupun kata "Django" tersisa di Bab 3
- [ ] Tidak ada satupun kata "PostgreSQL" atau "PostGIS" tersisa
- [ ] Tidak ada satupun kata "Leaflet.js" tersisa
- [ ] Tidak ada satupun kata "Chart.js" tersisa (gunakan Recharts/Echarts)
- [ ] Tidak ada satupun kata "MVT" atau "Model-View-Template" tersisa
- [ ] Kata "CRUD" hanya muncul dalam konteks justifikasi mengapa TIDAK dipakai
- [ ] Kata "Peta Interaktif" hanya muncul dalam konteks justifikasi mengapa TIDAK dipakai
- [ ] Semua referensi teknologi konsisten: Next.js, TypeScript, Prisma ORM, MySQL, Recharts, Echarts, Tailwind CSS, NextAuth.js, html2canvas-pro, jsPDF, react-csv
