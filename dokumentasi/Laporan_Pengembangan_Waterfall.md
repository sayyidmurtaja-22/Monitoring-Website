## 3.x Pengembangan Perangkat Lunak

Tahapan pengembangan perangkat lunak dalam penelitian ini merujuk pada fase **Implementasi (Pengkodean)** dalam metode *Waterfall*. Pada tahap ini, seluruh spesifikasi dari tahap analisis dan desain (seperti Use Case, ERD, dan Arsitektur Sistem) mulai diterjemahkan ke dalam bentuk baris-baris kode bahasa pemrograman yang dapat dieksekusi oleh mesin.

Proses pengembangan ini dibagi ke dalam beberapa aspek utama sesuai dengan arsitektur yang telah dirancang:

### 3.x.1 Inisialisasi dan Konfigurasi Lingkungan (Environment)
Pengembangan dimulai dengan melakukan inisialisasi *project* menggunakan *framework* **Next.js**. Konfigurasi awal mencakup pengaturan variabel lingkungan (`.env`) untuk menyimpan kredensial yang bersifat rahasia, seperti koneksi *string* ke database MySQL (`DATABASE_URL`) dan kunci rahasia (*secret key*) untuk NextAuth.

### 3.x.2 Implementasi Skema Database (Prisma ORM)
Sesuai dengan rancangan ERD sebelumnya, tahapan ini berfokus pada penulisan skema model menggunakan *Prisma Schema*. Setelah tabel `User`, `Account`, `Session`, dan tabel AWS (seperti `aws_bali`, `aws_pangandaran`, `aws_bungus`) didefinisikan, dilakukan migrasi database (*database migration*) agar struktur tabel di dalam MySQL secara otomatis menyesuaikan dengan kode skema yang telah dibuat.

### 3.x.3 Pengembangan Fitur Autentikasi dan Manajemen Pengguna
Fungsi keamanan sistem diimplementasikan menggunakan **NextAuth.js**. Pada fase ini, logika bisnis difokuskan pada:
- Pembuatan fungsi *Login* dengan teknik enkripsi kata sandi menggunakan pustaka `bcrypt-ts`.
- Pembatasan hak akses (*Role-based Access Control*) yang membedakan otoritas antara *Admin* (yang berhak menambah, menghapus, atau mengubah data pengguna) dan *User* biasa.
- Pembuatan sesi masuk (*session management*) untuk menjaga keamanan data di halaman *Dashboard*.

### 3.x.4 Implementasi Antarmuka dan Logika Fitur Ekspor Data
Pengembangan antarmuka halaman *Dashboard* berpedoman pada komponen UI/UX menggunakan **Tailwind CSS**. Selain visualisasi cuaca, di tahap ini juga dikembangkan algoritma untuk fitur pelaporan. Sistem diintegrasikan dengan pustaka eksternal seperti `html2canvas`, `jspdf`, dan `react-csv` untuk memungkinkan pengguna mengekspor rekaman data stasiun cuaca ke dalam format **PDF** dan **CSV** secara langsung dari peramban web (*Client-Side*).
