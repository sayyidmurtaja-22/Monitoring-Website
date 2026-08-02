**3.2 Metode Penelitian**

Penelitian ini menggunakan kerangka kerja (metode) yang disusun khusus sesuai dengan kebutuhan pengolahan data pemantauan cuaca laut. Kerangka kerja ini dibuat agar alur dari pengambilan data fisik di lapangan hingga penyajiannya di dalam *website* dapat berjalan dengan lancar.

Tahapan penelitian ini berfokus pada aliran pengolahan data (*data pipeline*), yang dimulai dari penarikan data dari sensor stasiun, perancangan sistem dan basis data (*database*), pembuatan program (*coding*), sampai pada tahap menampilkan data cuaca ke dalam bentuk grafik interaktif. Alur tahapan penelitian ini ditunjukkan pada Gambar 1.

*(Letakkan Gambar 1. Kerangka Kerja Penelitian Anda di sini)*

Penjelasan dari tahapan pada Gambar 1 adalah sebagai berikut. Tahap pertama yaitu pengumpulan data sensor AWS, di mana data cuaca laut seperti suhu, angin, dan curah hujan ditarik langsung dari alat stasiun pengamat. Setelah alur data disiapkan, masuk ke tahap perancangan perangkat lunak. Pada tahap ini, dilakukan pembuatan desain awal bentuk *website* beserta perancangan struktur tabel di dalam *database*-nya.

Tahap ketiga adalah pengembangan perangkat lunak. Tahap ini merupakan proses penulisan kode program (*coding*) untuk membangun sistem secara utuh, yang mencakup pembuatan halaman login, pembagian hak akses pengguna, serta pembuatan fungsi unduh data ke format PDF dan CSV. Tahap yang terakhir adalah implementasi visualisasi data, di mana data cuaca mentah dari *database* tadi diolah dan ditampilkan ke dalam bentuk grafik interaktif pada *dashboard website* agar lebih mudah dibaca.
