## 3.x Implementasi Visualisasi Data

Tahap implementasi visualisasi data merupakan proses penting dalam menerjemahkan data mentah (tabular) dari sensor stasiun cuaca (AWS) menjadi informasi visual yang mudah dipahami, interaktif, dan dinamis. Pada sistem ini, proses visualisasi diimplementasikan menggunakan pustaka **Recharts** dan **Echarts**.

### 3.x.1 Pengolahan Data Interaktif
Sebelum data divisualisasikan, aplikasi melakukan pengambilan data dari *database* secara langsung dan seketika (*real-time* atau *near real-time*) melalui *Server Actions*. Data iklim yang diambil meliputi metrik curah hujan, suhu rata-rata, kecepatan angin, arah angin, serta kondisi baterai stasiun (tegangan). 

### 3.x.2 Penggunaan Pustaka Grafik (Charting Library)
- **Recharts & Echarts:** Kedua pustaka grafik berbasis komponen React ini digunakan untuk menyajikan data secara dinamis. Pustaka ini dipilih karena mendukung manipulasi elemen grafis yang halus, waktu rendering yang cepat, dan sangat responsif terhadap perubahan ukuran layar peramban pengguna.
- **Jenis Visualisasi:** 
  - *Line Chart* (Grafik Garis): Digunakan untuk memantau tren cuaca dari waktu ke waktu secara historis, seperti tren suhu (Ta_Avg) dan tren tegangan baterai stasiun (Batt_V_Avg).
  - *Bar Chart* (Grafik Batang): Digunakan untuk menampilkan akumulasi data kuantitatif, misalnya data curah hujan.
  - *Wind Rose* (Mawar Angin): Diimplementasikan menggunakan *Echarts* untuk menunjukkan distribusi arah dan kecepatan angin pada suatu rentang waktu tertentu.

### 3.x.3 Fitur Filter Data Dinamis
Visualisasi yang dibangun tidak bersifat statis. Implementasi visualisasi ini dilengkapi dengan fitur filter interaktif di dalam *Dashboard*, di mana pengguna dapat menentukan rentang tanggal (tanggal awal dan akhir) atau memilih spesifik stasiun (Bali, Pangandaran, atau Bungus). Grafik akan langsung melakukan kalkulasi ulang (memuat ulang komponen secara otomatis) sesuai dengan parameter *filter* yang diinput oleh pengguna.
