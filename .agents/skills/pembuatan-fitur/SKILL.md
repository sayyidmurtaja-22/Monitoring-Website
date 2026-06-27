---
name: update-homepage-frontend
description: Skill untuk memperbarui homepage dengan fitur sticky navbar, dark/light mode, dan mockup dinamis.
---

# Instruksi Pembaruan Homepage

Skill ini digunakan untuk memandu agen dalam memperbarui tampilan UI di halaman utama (homepage). Agen **dilarang** langsung mengubah kode tanpa berdiskusi terlebih dahulu mengenai pendekatan teknisnya.

## 1. Sticky Navbar
- Ubah perilaku navigasi (Navbar) agar tetap menempel di bagian atas layar (*sticky* atau *fixed*) ketika pengguna melakukan *scroll* ke bawah.
- Berikan efek transisi yang halus (misalnya penambahan *shadow* atau perubahan transparansi *background*) saat pengguna mulai melakukan *scroll*.

## 2. Implementasi Dark Mode dan Light Mode
- Tambahkan fitur pergantian tema (Light/Dark Mode).
- **Penanganan Background Gambar**: Karena *background* utama berupa gambar, atur agar pada saat Dark Mode, gambar *background* diberikan lapisan gelap (*dark overlay* menggunakan CSS rgba atau backdrop-filter) ATAU ganti dengan gambar latar yang lebih gelap agar teks tetap kontras dan mudah dibaca.
- Pastikan status tema tersimpan agar tidak kembali ke pengaturan awal saat halaman di-*refresh*.

## 3. Mockup Laptop Dashboard Dinamis
- Ganti *mockup* laptop lama dengan desain yang baru.
- Gambar layar *dashboard* di dalam laptop harus sinkron dengan tema saat ini:
  - Tampilkan `dashboard-light.png` (atau sejenisnya) saat mode terang.
  - Tampilkan `dashboard-dark.png` saat mode gelap.
- **Tugas Agen**: Jika pengguna belum menyiapkan gambar *mockup dashboard* yang baru, agen dapat menawarkan diri untuk membuatnya menggunakan tool pembuat gambar (`generate_image` tool) dengan gaya UI modern dan premium. Jika pengguna sudah memilikinya, agen akan meminta pengguna untuk menyediakan gambarnya.

## Aturan Pengerjaan:
1. Pastikan perubahan mematuhi panduan desain yang ada, seperti menggunakan Vanilla CSS atau framework yang digunakan (misal Tailwind/Next.js).
2. Pertahankan sisi responsif (*mobile-friendly*).
3. Lakukan pengujian kontras warna khususnya di Dark Mode.
