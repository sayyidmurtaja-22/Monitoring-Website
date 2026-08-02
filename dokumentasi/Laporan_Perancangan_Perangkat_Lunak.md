## 3.x Perancangan Bangun Perangkat Lunak

Sub-bab ini menguraikan perancangan bangun perangkat lunak (arsitektur sistem) yang dikembangkan untuk aplikasi Monitoring Website Stasiun Cuaca Otomatis (AWS). Arsitektur perangkat lunak disusun menggunakan pola *Client-Server* modern berbasis framework **Next.js** dengan menerapkan arsitektur *Monolithic-like* namun modular, di mana *Frontend* dan *Backend* terintegrasi dalam satu *codebase* (berkat fitur *App Router* pada Next.js).

Secara garis besar, perancangan perangkat lunak pada sistem ini dibagi ke dalam tiga lapisan (layer) utama:

### 3.x.1 Lapisan Antarmuka Pengguna (Frontend Layer)
Lapisan antarmuka pengguna dibangun menggunakan **React.js** (terintegrasi di dalam ekosistem Next.js) dengan pendekatan *Server-Side Rendering* (SSR) dan *Client-Side Rendering* (CSR). Lapisan ini bertugas untuk berinteraksi langsung dengan pengguna (administrator dan pengguna biasa) dan menyajikan data secara interaktif.
- **Pengaturan Gaya (Styling):** Antarmuka dirancang menggunakan **Tailwind CSS** yang dipadukan dengan komponen pustaka siap pakai seperti **Chakra UI**, **HeroUI**, dan **Shadcn UI**. Hal ini memastikan tampilan yang responsif, modern, dan konsisten di berbagai perangkat.
- **Visualisasi Data:** Mengingat inti dari aplikasi ini adalah memonitor data iklim/cuaca (suhu, arah angin, curah hujan, dsb.), sistem menggunakan pustaka **Recharts** dan **Echarts** untuk mengubah data mentah dari stasiun (AWS Bali, Pangandaran, Bungus) menjadi grafik visual interaktif (seperti *bar chart*, *line chart*, dan *wind rose*).
- **Animasi:** Untuk meningkatkan pengalaman pengguna (UX), antarmuka diperkaya dengan animasi dinamis menggunakan **Framer Motion** dan **GSAP**.

### 3.x.2 Lapisan Server & Logika Bisnis (Backend Layer)
Lapisan ini mengelola logika bisnis aplikasi, otentikasi pengguna, dan penanganan permintaan (*request*) ke database. Pada arsitektur ini, backend terintegrasi langsung di dalam framework Next.js melalui fitur **API Routes** dan **Server Actions**.
- **Autentikasi dan Otorisasi:** Keamanan akses pengguna diatur menggunakan modul **NextAuth.js (v5)**. Modul ini menangani proses *login*, enkripsi kata sandi (menggunakan *bcrypt*), serta pembuatan sesi (session token) yang aman untuk membedakan hak akses antara *Admin* dan *User*.
- **Pengolahan Data API:** Lapisan ini memproses pengiriman dan pengambilan data (seperti pembacaan data baterai, suhu, kecepatan angin, dll.) lalu meneruskannya secara aman ke komponen lapisan antarmuka.

### 3.x.3 Lapisan Basis Data (Database Layer)
Lapisan basis data menyimpan seluruh persistensi data dari aplikasi.
- **Relational Database:** Sistem menggunakan **MySQL** sebagai sistem manajemen basis data relasional (RDBMS) utama. Tabel di dalam database mencakup data manajemen pengguna (`users`, `accounts`, `sessions`) serta data metrik dan rekaman dari stasiun (*Automated Weather Station*) yakni tabel `aws_bali`, `aws_pangandaran`, dan `aws_bungus`.
- **Object-Relational Mapping (ORM):** Untuk menghubungkan antara lapisan backend (Next.js) dengan database MySQL, aplikasi menggunakan **Prisma ORM**. Penggunaan Prisma memberikan tingkat keamanan (*type-safety*) yang tinggi dalam mengeksekusi kueri, menghindari risiko injeksi SQL, dan memudahkan pengelolaan skema (*schema migration*) database.

### 3.x.4 Alur Interaksi Sistem (Data Flow)
1. **Permintaan Pengguna:** Pengguna mengakses situs melalui peramban web (browser). Komponen UI melakukan permintaan data metrik melalui *Server Actions* / API internal.
2. **Validasi:** NextAuth.js memastikan apakah sesi pengguna valid dan memiliki hak akses (Role) yang sesuai sebelum melanjutkan permintaan.
3. **Eksekusi Kueri:** Setelah divalidasi, logika bisnis menggunakan fungsi-fungsi Prisma Client (*Prisma ORM*) untuk mengekstrak atau memperbarui data (misal data sensor cuaca terbaru) dari database MySQL.
4. **Penyajian Data:** Data yang dikembalikan oleh database diteruskan kembali ke lapisan antarmuka (Frontend) untuk dirender (dijadikan visualisasi grafik menggunakan *Recharts* / *Echarts*).
