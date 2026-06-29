# 📘 Panduan Pengembangan & Maintenance (Monitoring Website)

Dokumen ini dibuat sebagai panduan komprehensif bagi *developer* atau siapa pun yang akan melanjutkan, mengelola, atau melakukan *maintenance* pada proyek **Monitoring Website** ini.

---

## 🛠️ Teknologi & Stack yang Digunakan

Proyek ini dibangun menggunakan arsitektur modern (*Modern Web Stack*):
1. **Framework Utama:** [Next.js](https://nextjs.org/) (App Router `app/` directory).
2. **Bahasa Pemrograman:** TypeScript (`.tsx`, `.ts`).
3. **Database ORM:** [Prisma](https://www.prisma.io/).
4. **Autentikasi:** [NextAuth.js](https://next-auth.js.org/).
5. **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) dengan dukungan mode Gelap/Terang (Dark/Light Mode).
6. **Animasi:** Kombinasi [GSAP](https://gsap.com/) (untuk scroll animation) dan [Framer Motion](https://www.framer.com/motion/) (untuk micro-interactions & transisi).
7. **Ikon:** [Lucide React](https://lucide.dev/).

---

## 📂 Struktur Folder Penting

Jika Anda baru melihat proyek ini, berikut adalah lokasi file-file utama yang perlu Anda ketahui:

- `app/` → Berisi seluruh *routing* halaman web.
  - `app/HomePageClient.tsx` → Komponen utama dari halaman depan (*Landing Page*). Di sinilah tata letak UI, animasi, dan *cross-platform showcase* berada.
  - `app/api/` → Semua *endpoint* API (Backend) untuk aplikasi ini (termasuk Auth & Dashboard).
  - `app/ListAws/` & `app/users/` → Halaman rute lain yang menampilkan data monitoring spesifik.
- `components/` → Kumpulan komponen React yang bisa digunakan berulang (*reusable*).
  - `components/Chart/` → Menyimpan komponen grafik (Line, Bar, Dual Line) untuk visualisasi data.
  - `components/auth/` → Menyimpan komponen terkait login/register seperti `AuthModal.tsx`.
- `public/` → Tempat meletakkan aset statis seperti gambar. (Contoh: `dark desktop.png`, `light mobile.png`).
- `prisma/` → Berisi `schema.prisma` yang mendefinisikan struktur tabel database Anda.

---

## 💻 Cara Menjalankan Aplikasi di Lokal (Development)

Untuk menjalankan server di komputer lokal Anda, ikuti langkah berikut:

1. **Buka Terminal** dan arahkan ke direktori proyek (`cd murtaja`).
2. **Install Dependencies** (jika baru pertama kali):
   ```bash
   yarn install
   ```
3. **Jalankan Server Development:**
   ```bash
   yarn dev
   ```
4. Buka browser dan akses: `http://localhost:3000`.

---

## 🗄️ Panduan Database (Prisma)

Aplikasi ini menggunakan Prisma sebagai penghubung ke database. 
- File konfigurasi ada di `prisma/schema.prisma`.
- Variabel URL database disimpan di dalam file `.env` rahasia (contoh: `DATABASE_URL=...`).

**Jika Anda Mengubah Struktur Tabel (Schema):**
Setiap kali Anda menambahkan atau mengubah tabel di `schema.prisma`, jalankan perintah ini di terminal:
```bash
npx prisma generate
npx prisma db push
```
*Catatan: Pastikan server `yarn dev` dimatikan terlebih dahulu saat menjalankan perintah di atas pada sistem operasi Windows agar tidak terjadi error bentrok / `EPERM`.*

---

## 🔐 Panduan Serah Terima (Handover) & Autentikasi Email

Proyek ini menggunakan **NextAuth.js** dengan integrasi login pihak ketiga (seperti **Google OAuth**). Jika Anda akan menyerahkan proyek ini kepada orang lain (klien/developer baru), mereka **wajib mengganti** kunci rahasia milik mereka sendiri agar email dan data Anda tetap aman.

Berikut adalah hal-hal yang **wajib diganti** di dalam file `.env` oleh pemilik yang baru:

1. **Google OAuth Credentials (`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`)**
   - Pemilik baru harus membuat *Project* baru di [Google Cloud Console](https://console.cloud.google.com/).
   - Buat kredensial **OAuth 2.0 Client IDs**.
   - Masukkan *Authorized redirect URIs* dengan format: `https://[DOMAIN_MEREKA]/api/auth/callback/google`
   - Ganti `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` di `.env` dan di *Environment Variables* Vercel dengan kredensial yang baru didapat.

2. **Database URL (`DATABASE_URL`)**
   - Pemilik baru harus menyewa database mereka sendiri (misalnya di Microsoft Azure, AWS, Supabase, atau PlanetScale).
   - Ganti isi variabel `DATABASE_URL` dengan *Connection String* milik mereka.

3. **NextAuth Secret & URL (`NEXTAUTH_SECRET` & `NEXTAUTH_URL`)**
   - `NEXTAUTH_SECRET`: Pemilik baru harus men-generate *string* rahasia acak yang baru (bisa didapat dengan menjalankan `openssl rand -base64 32` di terminal) lalu mengganti nilainya. Ini sangat penting untuk keamanan sesi *cookie* pengguna.
   - `NEXTAUTH_URL` (atau `AUTH_URL`): Pastikan ini diubah menjadi domain asli milik klien saat sudah di-deploy (contoh: `https://monitoring-baru.com`). Di Vercel, variabel ini kadang terisi otomatis oleh sistem.

---

## 🎨 Panduan Modifikasi UI & Tema

Aplikasi ini mendukung **Dark Mode** dan **Light Mode**.
- Untuk mengubah warna *Light Mode*, gunakan utility class Tailwind standar seperti `bg-[#F1FAEE]` atau `text-[#1D3557]`.
- Untuk mengubah warna *Dark Mode*, gunakan prefix `dark:`, contohnya `dark:bg-[#1D3557]` atau `dark:text-[#F1FAEE]`.

**Tips Desain (Standard Project Ini):**
- Proyek ini menggunakan gaya *Glassmorphism* (elemen tembus pandang/kaca). Gunakan kombinasi `bg-white/70`, `backdrop-blur-xl`, dan `border` transparan untuk mempertahankan estetika premium ini.
- Hindari penggunaan tata letak bertumpuk (*overlapping*). Jika menambahkan section baru, ikuti gaya berdampingan (*side-by-side*) yang minimalis.

---

## 🚀 Panduan Deployment (Vercel & Microsoft Azure)

Proyek ini sangat ideal di-deploy menggunakan kombinasi **Vercel** (sebagai *host* Frontend & Serverless Backend) dan **Microsoft Azure** (sebagai *host* Database atau layanan cloud spesifik lainnya).

### 1. Memastikan Kode Aman (Build Check)
Sebelum melempar kode ke *production*, pastikan aplikasi bebas dari *error*:
```bash
yarn build
```
*(Tips: Jika Anda menggunakan Windows dan muncul pesan error `EPERM: operation not permitted` saat proses build, itu artinya server `yarn dev` Anda masih menyala dan mengunci file database. Matikan dulu `yarn dev` (Ctrl+C), lalu jalankan ulang `yarn build`).*

### 2. Deploy Aplikasi via Vercel
Karena proyek ini berbasis Next.js, Vercel adalah platform yang paling optimal dan otomatis:
1. Simpan perubahan Anda dan dorong (*push*) ke GitHub:
   ```bash
   git add .
   git commit -m "Update fitur terbaru"
   git push origin main
   ```
2. Karena Vercel sudah (atau seharusnya) terhubung dengan repositori GitHub Anda, Vercel akan otomatis mendeteksi *push* ini dan langsung melakukan proses deploy.
3. **Sangat Penting:** Jangan lupa menyalin semua variabel rahasia yang ada di file `.env` lokal Anda dan memasukkannya ke menu **Settings > Environment Variables** di halaman *dashboard* proyek Vercel Anda. Jika tidak, aplikasi akan gagal terhubung ke database.

### 3. Mengelola Layanan di Microsoft Azure
Mengingat Anda mengandalkan **Microsoft Azure** (misalnya untuk Database Azure PostgreSQL/SQL, Azure Blob Storage, atau Authentication), perhatikan dua hal krusial ini saat *maintenance*:
1. **Firewall & Akses Jaringan:** Pastikan konfigurasi *firewall* pada *database server* di portal Microsoft Azure Anda disetel agar mengizinkan (*allow*) *traffic* masuk dari IP Vercel (atau centang opsi *"Allow access to Azure services"*).
2. **Connection String:** Pastikan *Connection String* (`DATABASE_URL`) yang Anda ambil dari Azure benar-benar tersambung. URL ini wajib di-input ke Vercel agar antarmuka web Anda bisa menarik/mendorong data ke server Azure.

---

**Selamat Mengembangkan!** 🚀
Jika suatu saat web Anda mengalami blank (Error 500) setelah di-deploy, langkah pertama yang harus dilakukan adalah mengecek menu **"Logs"** di Vercel dan memastikan bahwa Azure tidak memblokir koneksi dari aplikasi Anda.
