i
USULAN PENELITIAN
PERANCANGAN SISTEM INFORMASI PEMANTAUAN DATA
CUACA DAN KLIMATOLOGI KELAUTAN BERBASIS
WEBSITE DENGAN FITUR EKSPOR LAPORAN DINAMIS
disusun untuk dipresentasikan dalam rangka penelitian untuk Skripsi di
Fakultas Perikanan dan Ilmu Kelautan
oleh:
Muhammad Sayyid Murtaja
NIM. L1C022044
FAKULTAS PERIKANAN DAN ILMU KELAUTAN
UNIVERSITAS JENDERAL SOEDIRMAN
PURWOKERTO
2025

---PAGE BREAK---
ii
USULAN PENELITIAN
PERANCANGAN SISTEM INFORMASI PEMANTAUAN DATA
CUACA DAN KLIMATOLOGI KELAUTAN BERBASIS
WEBSITE DENGAN FITUR EKSPOR LAPORAN DINAMIS
Oleh :
Muhammad Sayyid Murtaja
NIM. L1C022044
disetujui untuk dipresentasikan
tanggal ……………….
Pembimbing Utama
Pembimbing Anggota
Rizqi Rizaldi Hidayat, S.I.K.,
Mukti Trenggono, S.Kel., M.Si
NIP. 198803172018031001
NIP. 197911302010121001
Mengetahui
Dekan Fakultas Perikanan dan Ilmu Kelautan
Universitas Jenderal Soedirman
Prof. Dr. Ir. Endang Hilmi, S.Hut., M.Si,IPU
NIP. 19720202 200312 1 002

---PAGE BREAK---
iii
KATA PENGANTAR
Puji syukur penulis panjatkan ke hadirat Allah SWT atas limpahan rahmat
dan karunia-Nya sehingga penelitian berjudul “Perancangan Sistem Informasi
Pemantauan Data Cuaca dan Klimatologi Kelautan” dapat diselesaikan dengan
baik. Penelitian ini bertujuan untuk merancang dan mengembangkan sistem
berbasis website yang mampu menampilkan data cuaca dan klimatologi
kelautan secara interaktif. Melalui integrasi Automatic Weather Station (AWS),
diharapkan sistem
ini
dapat
memberikan
kontribusi
dalam
penyediaan
informasi cuaca yang akurat dan mendukung pengambilan keputusan di
bidang kelautan.
Penulis menyampaikan terima kasih kepada Bapak Rizqi Rizaldi Hidayat,
S.I.K. selaku pembimbing utama, Bapak Mukti Trenggono, S.Kel., M.Si. selaku
pembimbing anggota, serta seluruh dosen dan staf Fakultas Perikanan dan
Ilmu Kelautan Universitas Jenderal Soedirman atas bimbingan, dukungan, dan
ilmu yang telah diberikan. Ucapan terima kasih juga disampaikan kepada
keluarga dan rekan-rekan yang senantiasa memberikan doa, semangat, serta
motivasi selama proses penyusunan penelitian ini. Semoga penelitian ini dapat
memberikan manfaat bagi pengembangan ilmu pengetahuan dan penerapan
teknologi di bidang Sistem Informasi dan klimatologi kelautan.

---PAGE BREAK---
iv
DAFTAR ISI
halaman
USULAN PENELITIAN.................................................................................................i
USULAN PENELITIAN............................................................................................... ii
KATA PENGANTAR...................................................................................................iii
DAFTAR ISI...................................................................................................................iv
DAFTAR TABEL............................................................................................................v
DAFTAR GAMBAR..................................................................................................... vi
I.
PENDAHULUAN.................................................................................................. 1
1.1
Latar Belakang................................................................................................. 1
1.2
Perumusan Masalah........................................................................................1
1.3
Tujuan Penelitian.............................................................................................1
1.4
Manfaat Penelitian.......................................................................................... 2
II.
TINJAUAN PUSTAKA..........................................................................................4
2.1
Cuaca dan Klimatologi Kelautan..................................................................4
2.2
Sistem Informasi Geografis (GIS).......................Error! Bookmark not defined.
2.3
Visualisasi Data Berbasis Web............................Error! Bookmark not defined.
2.4
Automatic Weather Station (AWS)........................Error! Bookmark not defined.
2.5
Quality Control (QC) Data Meteorologi............. Error! Bookmark not defined.
2.6
Sistem Informasi Geografis dan WebGIS...........Error! Bookmark not defined.
2.7
Python.................................................................... Error! Bookmark not defined.
2.8
Django Web Framework......................................Error! Bookmark not defined.
2.9
Leaflet Js & Chart Js..............................................Error! Bookmark not defined.
2.10
PostgreSQL dan PostGIS..................................... Error! Bookmark not defined.
III.
MATERI DAN METODA.................................................................................. 9
3.1
Materi................................................................................................................ 9
3.1.1
Alat.............................................................................................................9
3.1.2
Bahan....................................................................................................... 10
3.2
Metode............................................................................................................ 11
3.2.1
Pengumpulan Data................................................................................11
3.2.2
Perancangan Bangun Perangkat Lunak..............................................13
3.2.3
Pengembangan Perangkat Lunak........................................................13
3.2.4
Pengembangan Fitur Visualisasi Data Cuaca Error!
Bookmark
not
defined.
3.3
Waktu dan Tempat........................................................................................16
DAFTAR PUSTAKA....................................................................................................18

---PAGE BREAK---
v
DAFTAR TABEL
Tabel
halaman
Tabel 1.Alat yang digunakan dalam penelitian....................................................................9
Tabel 2. Bahan yang digunakan dalam penelitian.............................................................11

---PAGE BREAK---
vi
DAFTAR GAMBAR
Gambar
halaman
Gambar 1. Kerangka Kerja Penelitian.................................................................................. 11
Gambar 2. Alur Pengumpulan Data dari Automatic Weather Stations..........................12
Gambar 3. Metode Waterfall................................................................................................. 14

---PAGE BREAK---
1
I.
PENDAHULUAN
1.1
Latar Belakang
Informasi
iklim
berperan
krusial
sebagai
landasan
pengambilan
keputusan dan perumusan strategi adaptasi pada sektor-sektor rentan (Dinku,
2019). Hal ini menjadi sangat urgen karena dinamika iklim yang dapat berubah
secara drastis sering kali menyulitkan upaya mitigasi (Rahajoeningoem &
Saputra, 2017), memicu bencana hidrometeorologi yang secara langsung
mengancam keselamatan pelayaran dan stabilitas ekonomi (Minarto & Santoso,
2023). Bukti nyata dari kerentanan ini terlihat pada anomali El Niño tahun 2015
yang mengakibatkan kerugian hingga 0,2% PDB (Seto et al., 2018). Oleh karena
itu, integrasi teknologi digital dan analitik data menjadi solusi proaktif yang
esensial; tidak hanya untuk memprediksi cuaca secara presisi, tetapi juga untuk
meminimalisasi
risiko
dan
meningkatkan
efisiensi
operasional
maritim
(Kadhafi, 2024).
Dampak masif perubahan iklim global menuntut adanya pemantauan
cuaca dan klimatologi secara real-time guna membangun sistem prediksi
maritim yang akurat, menekan risiko kecelakaan, serta meningkatkan efisiensi
pelayaran (Latue et al., 2023). Namun, pengumpulan data pada stasiun cuaca di
Indonesia umumnya masih bersifat konvensional dan sangat bergantung pada
pencatatan manual oleh pengamat (Gandoria et al., 2023). Keterbatasan ini
dapat diatasi dengan otomatisasi melalui instrumen Automatic Weather Stations
(AWS), yakni sistem terintegrasi yang mampu mengukur, merekam, dan
mentransmisikan data cuaca secara mandiri tanpa intervensi manusia (Ekawati,

---PAGE BREAK---
2
2015). Lebih jauh, tingginya kompleksitas observasi Bumi saat ini mensyaratkan
agar perangkat seperti AWS terhubung dalam sebuah platform pemantauan
terintegrasi yang mampu mengolah beragam aliran data—dari satelit hingga
sensor lapangan—secara akurat dan efisien demi memfasilitasi pengambilan
keputusan real-time (Dou et al., 2023).
Meskipun AWS mampu menghasilkan aliran data yang masif dalam
resolusi tinggi, pemanfaatannya di lapangan kerap terkendala oleh sistem
manajemen data yang terfragmentasi dan kaku. Tingginya volume dan
kompleksitas
parameter
cuaca
membuat
ketersediaan
data
tidak
selalu
berbanding
lurus
dengan
kemudahan
akses
maupun
efektivitas
penggunaannya (Dinku et al., 2022). Mayoritas platform pemantauan saat ini
masih bersifat statis dan sebatas menyajikan visualisasi real-time, tanpa
dilengkapi fleksibilitas ekstraksi data yang memadai untuk kebutuhan analisis
lanjutan (Silva et al., 2021). Akibatnya, ketiadaan fasilitas pengunduhan data
yang dinamis ini menyebabkan penyusunan dokumen laporan berjalan lambat,
rentan kesalahan manual, serta menghambat kecepatan penyebaran informasi
untuk pengambilan keputusan taktis (Hossen et al., 2023).
Merespons kesenjangan aksesibilitas tersebut, pengembangan antarmuka
sistem informasi yang intuitif menjadi langkah penting untuk menjembatani
data sensorik secara langsung kepada pengguna akhir (Hossen et al., 2023).
Arsitektur berbasis website menawarkan solusi aksesibilitas terpusat dan cross-
platform,
meniadakan
kebutuhan
instalasi
perangkat
lunak
khusus
bagi
operator di lapangan. Sebagai kapabilitas fundamental, integrasi fitur ekspor

---PAGE BREAK---
3
laporan dinamis diimplementasikan untuk mentransformasi platform dari
sekadar
alat
visualisasi
statis
menjadi
instrumen
analitik
interaktif.
Fungsionalitas ini memberikan otorisasi penuh kepada pengguna untuk
memfilter, customisasi, serta mengekstraksi parameter iklim ke dalam format
terstruktur (Bestari & Wibowo, 2023). Melalui otomatisasi ini, sistem secara
signifikan mengakselerasi konversi data mentah menjadi wawasan taktis
(actionable insights), memfasilitasi pengambilan keputusan yang lebih cepat dan
presisi bagi para pemangku kepentingan (Rahman et al., 2022).
Seiring dengan mendesaknya kebutuhan mitigasi anomali cuaca dan
belum memadainya mekanisme pelaporan iklim yang ada, pengembangan
instrumen pemantauan yang terintegrasi secara digital merupakan suatu
keharusan (Ullo & Sinha, 2020). Untuk memaksimalkan utilitas tata kelola data
observasi, dibutuhkan intervensi perangkat lunak yang secara komprehensif
mampu
mengurai
kompleksitas
parameter
klimatologi
menjadi
format
dokumen yang siap diekstraksi secara praktis di lapangan (Hasan et al., 2022).
Penerapan
teknologi
web
modern
dengan
fitur
rendering
dinamis
dan
pengelolaan basis data yang efisien mampu mengatasi kendala tersebut
sekaligus menjaga aliran data cuaca dan klimatologi (Ali et al., 2023). Oleh
karena itu, sebagai upaya nyata dalam mengakselerasi efisiensi analisis dan
kemudahan pelaporan data cuaca serta klimatologi kelautan, penelitian ini
difokuskan pada "Perancangan Sistem Informasi Pemantauan Data Cuaca dan
Klimatologi Berbasis Website dengan Fitur Ekspor Laporan Dinamis".

---PAGE BREAK---
1
1.2
Perumusan Masalah
Dalam
proses
pengembangan
sistem
pemantauan
data
cuaca
dan
klimatologi kelautan, diperlukan integrasi yang solid antara pengelolaan aliran
data meteorologi dari Automatic Weather Station (AWS) dengan antarmuka
berbasis website yang informatif dan interaktif. Permasalahan utama yang
dihadapi adalah bagaimana merancang sistem yang tidak hanya sanggup
menyajikan data observasi secara real-time dan akurat, tetapi juga memfasilitasi
kebutuhan ekstraksi pelaporan bagi pengguna akhir. Berdasarkan kesenjangan
tersebut, rumusan masalah dalam penelitian ini adalah :
1. Bagaimana merancang dan membangun sistem informasi pemantauan
data cuaca dan klimatologi kelautan berbasis website yang mampu
menyajikan informasi secara real-time, akurat, dan dapat diakses dengan
mudah oleh pengguna ?
2. Bagaimana mengimplementasikan visualisasi data cuaca dan klimatologi
kelautan berbasis dashboard
interaktif untuk mendukung analisis
kondisi observasi secara efektif ?
3. Bagaimana mengimplementasikan fitur ekspor laporan dinamis agar
pengguna
akhir
dapat
menyaring
dan
mengunduh
data
hidrometeorologi kelautan secara fleksibel dan efisien ?
1.3
Tujuan Penelitian
Penelitian ini bertujuan untuk merancang dan mengembangkan sistem
informasi pemantauan data cuaca dan klimatologi kelautan berbasis website
yang real-time, interaktif, dan komunikatif. Sistem ini dibangun dengan

---PAGE BREAK---
2
memanfaatkan
arsitektur
full-stack
berbasis
Next.js
sebagai
infrastruktur
utamanya, sehingga proses ekstraksi dan penyajian data mentah dapat
ditransformasikan secara efisien menjadi wawasan yang terstruktur dan mudah
dipahami. Secara spesifik, tujuan dari penelitian ini meliputi:
1. Merancang dan membangun website pemantauan data cuaca dan
klimatologi kelautan yang terintegrasi langsung dengan basis data
instrumen Automatic Weather Station (AWS).
2. Mengembangkan
fitur
visualisasi
data
dalam
bentuk
representasi
dashboard analitik dan grafik dinamis guna mendukung analisis kondisi
hidrometeorologi kelautan secara komprehensif.
3. Menerapkan fitur ekspor laporan dinamis (seperti format CSV/XLSX)
untuk memberikan fleksibilitas bagi pengguna dalam mengekstraksi,
menyaring, serta mendistribusikan data observasi cuaca ke dalam
dokumen.
1.4
Manfaat Penelitian
Hasil dari penelitian ini diproyeksikan menjadi solusi fungsional dalam
tata kelola informasi hidrometeorologi maritim. Integrasi antara teknologi web
modern dan fitur pelaporan dinamis pada sistem ini tidak hanya mengatasi
tantangan pembacaan data mentah, tetapi juga berperan sebagai instrumen
esensial pendukung kebijakan di sektor kelautan. Rincian manfaat penelitian ini
dijabarkan sebagai berikut:
1. Menyediakan
platform
pemantauan
data
cuaca
dan
klimatologi
terpusat
yang
bersifat
cross-platform,
guna
memfasilitasi
para

---PAGE BREAK---
3
pemangku kepentingan—baik dari kalangan industri maritim, peneliti,
maupun instansi terkait—dalam mengakses informasi observasi secara
real-time dan efisien.
2. Mengoptimalkan tata kelola data cuaca dan klimatologi kelautan
melalui integrasi fitur ekstraksi laporan yang dinamis. Otomatisasi
fungsionalitas
ini
secara
efektif
mengurangi
potensi
kesalahan
rekapitulasi manusia (human error) dan memastikan aliran informasi
strategis (actionable insights) dapat tersaji secara instan guna mendasari
keputusan operasional yang akurat.

---PAGE BREAK---
4
II.
TINJAUAN PUSTAKA
2.1
Cuaca dan Klimatologi Kelautan
Cuaca dan klimatologi kelautan merupakan disiplin ilmu esensial yang
memanfaatkan
pengamatan
metrik
atmosfer
dan
oseanografi
untuk
mendiagnosis dinamika laut secara presisi. Kehadiran Sistem Observasi Laut
Global (GOOS) saat ini telah bertransformasi dari sekadar alat pantau menjadi
pilar utama perlindungan ekosistem pesisir global (Moltmann et al., 2019).
Pengumpulan data kelautan terbukti sangat vital bagi navigasi kapal dan
mitigasi bencana. Hal ini secara khusus berlaku di kawasan maritim strategis
seperti Asia Tenggara, di mana penyesuaian terhadap perubahan iklim menjadi
sebuah kebutuhan mutlak (Dong et al., 2024).
Perubahan iklim secara nyata ditentukan oleh indikator seperti lonjakan
tekanan udara, kecepatan angin, dan naiknya permukaan laut. Jika kita luput
mencatat perubahan cuaca tersebut, dampaknya bisa sangat merusak ekosistem
kelautan (Sojitra et al., 2024). Fakta ini diperkuat oleh berbagai kajian yang
menyatakan
bahwa
pemodelan
cuaca
laut
adalah
kunci
utama
untuk
menghadapi kondisi lingkungan yang sangat mudah berubah (Zhang et al.,
2024
2.2
Automatic Weather Station(AWS)
Automatic Weather Station (AWS) merupakan sistem sensor terpadu yang
mampu
merekam data meteorologi secara
otomatis dan terus-menerus.
Instrumen ini dirancang khusus untuk memantau perubahan kondisi atmosfer
secara mendetail, mulai dari pengukuran suhu yang sangat presisi hingga

---PAGE BREAK---
5
pemantauan angin berbasis Internet of Things (IoT) (Woo et al., 2023).
Penggunaan jaringan AWS terbukti mampu menekan tingkat kesalahan
manusia (human error), sekaligus memperluas jangkauan pengumpulan data
jika dibandingkan dengan metode pengamatan iklim manual (Kim et al., 2022).
Lebih lanjut, kemampuan AWS dalam mengirimkan data secara langsung (real-
time) menjadikannya sumber informasi utama untuk sistem peringatan dini
bencana
hidrometeorologi
(Rivera
et
al.,
2023).
Pada
rancangan
sistem
peringatan modern, sensor AWS bertindak sebagai penyuplai data mentah
yang langsung terhubung ke server aplikasi.
2.3
Pengelolaan Data dan Interoperabilitas Sistem
Seiring dengan tingginya volume data yang dikumpulkan dari stasiun
AWS kelautan, sistem basis data dituntut untuk memiliki kemampuan
menampung kapasitas yang terus membesar secara fleksibel (skalabel). Untuk
memastikan kelancaran pertukaran data antar-institusi, prinsip FAIR (Findable,
Accessible, Interoperable, and Reusable) telah disepakati sebagai standar utama
dalam pengelolaan data oseanografi global (Tanhua et al., 2019).
Penerapan
standar
ini
terbukti
efektif
dalam
mencegah
hilangnya
informasi penyerta (metadata
loss) pada
pusat
penyimpanan data iklim
(Schoening et al., 2022). Secara teknis, pengembangan aplikasi kelautan modern
umumnya mengandalkan teknologi Object-Relational Mapping (ORM) seperti
Prisma untuk menghubungkan basis data dengan kode aplikasi secara efisien
(Wang et al., 2024). Penggunaan teknologi ini menjamin konsistensi dan
keamanan struktur data (type-safe), sehingga kualitas catatan iklim kelautan

---PAGE BREAK---
6
dapat terus terjaga dan valid untuk digunakan dalam riset jangka panjang
(Gleiber et al., 2024).
2.4
Arsitektur Sistem Berbasis Web dengan Next.js
Untuk memastikan kelancaran pemrosesan data cuaca laut hingga ke
tangan pengguna, sistem aplikasi dituntut memiliki kinerja tinggi dan dapat
diakses langsung tanpa memerlukan instalasi perangkat lunak tambahan.
Berbagai studi terbaru membuktikan bahwa penggunaan kerangka kerja
(framework) web modern sangat efektif dalam mengurangi beban pemrosesan
pada perangkat
pengguna, terutama saat
menampilkan visualisasi data
kelautan
yang
kompleks
(Paoletti
et
al.,
2023).
Berlawanan
dengan
arsitektur Client-Side Rendering (CSR) konvensional yang kerap mengalami
hambatan latensi tinggi saat memproses DOM (Document Object Model) secara
lokal di perangkat klien (Iskandar et al., 2020). Performa pemuatan halaman
yang
responsif
menjadi
faktor
krusial
dalam
pengembangan
dashboard
pemantauan lingkungan berbasis real-time (Triska et al., 202).
2.5
Visualisasi Data Berbasis Web
Visualisasi data merupakan bentuk representasi visual yang membantu
pengguna, baik awam maupun pakar, untuk menggali informasi penting dari
volume data kelautan yang sangat besar. Pengolahan data dari satelit maupun
observasi langsung (in-situ) tidak akan berdampak maksimal jika tidak diubah
menjadi antarmuka visual yang siap pakai bagi masyarakat (Le Traon et al.,
2019). Penggunaan antarmuka interaktif secara nyata terbukti dapat mengubah
metrik data kelautan yang kompleks menjadi sajian visual yang informatif,
sehingga lebih mudah dimanfaatkan oleh publik dan pengambil keputusan

---PAGE BREAK---
7
(Ruff et al., 2024). Dalam pengelolaan wilayah pesisir, keberadaan portal
visualisasi data terbukti mampu meningkatkan transparansi dan akuntabilitas
lembaga,
serta
mempermudah
akses
terhadap
data
operasional
secara
signifikan (Ten Hoopen et al., 2022).
2.6
Implementasi Visualisasi Analitik dengan Recharts
Parameter cuaca seperti suhu, tekanan udara, dan curah hujan memiliki
karakteristik
deret
waktu
(time-series)
yang
kuat,
sehingga
memerlukan
visualisasi dinamis agar perubahan ekstrem dapat diamati dengan jelas
(Merchant et al., 2019). Sistem pemantauan modern kini telah beralih dari grafik
statis menuju penyajian data interaktif yang mampu menampilkan anomali
cuaca laut secara langsung (real-time) seiring masuknya data baru (Ren et al.,
2024). Untuk mengakomodasi kompleksitas analitik tersebut, pustaka grafik
berbasis vektor (SVG) seperti Recharts diintegrasikan secara organik ke dalam
arsitektur antarmuka (front-end) sistem (Bhavsar et al., 2024). Dengan demikian,
pengguna
mendapatkan pengalaman
analisis
cuaca
yang
responsif dan
interaktif.
2.7
Ekspor Laporan Dinamis (PDF dan Excel/CSV)
Sebuah sistem pemantauan visual akan lebih lengkap jika didukung oleh
modul pelaporan (reporting) yang adaptif. Pengarsipan log cuaca secara berkala
sangat dibutuhkan untuk memenuhi persyaratan administrasi manajemen
pelabuhan sekaligus memfasilitasi proses komputasi dan analisis data lanjutan
di masa mendatang (Felden et al., 2023). Dari sisi teknis, fitur pelaporan
dibangun dengan memanfaatkan konversi HTML canvas guna menyimpan
visualisasi antarmuka ke dalam dokumen berekstensi PDF. Selanjutnya, modul

---PAGE BREAK---
8
react-csv diintegrasikan untuk memfasilitasi ekspor data mentah menjadi
bentuk tabel yang kompatibel dengan aplikasi spreadsheet (Forsblom et al., 2024).
Dengan adanya standar ekspor ke berbagai format ini, masalah teknis dan
risiko hilangnya data yang sering terjadi saat memindahkan data laut dalam
jumlah besar dapat dihindari secara efektif (Garcia et al., 2024).

---PAGE BREAK---
9
III. MATERI DAN METODE
3.1
Materi
Pengembangan
sistem
informasi
pemantauan
cuaca
kelautan
yang
fungsional membutuhkan persiapan infrastruktur yang matang. Pada tahap ini,
penelitian difokuskan pada penyediaan komponen-komponen esensial yang
terbagi ke dalam dua kategori utama: perangkat keras (hardware) dan perangkat
lunak (software). Kedua elemen tersebut saling terintegrasi untuk membangun
arsitektur sistem pelaporan yang dinamis.
3.1.1 Alat
Pengembangan sistem server dan antarmuka pengguna membutuhkan
perangkat komputasi dengan kinerja yang baik. Spesifikasi perangkat keras ini
dipilih secara khusus agar mampu menjalankan beban kerja yang tinggi, seperti
Server-Side Rendering (SSR) dan pemrosesan basis data cuaca secara real-time,
yang disajikan pada tabel 1.
Tabel 1.Alat yang digunakan dalam penelitian
No
Alat
(Perangkat
Lunak)
Spesifikasi / Sumber /
Versi
Kegunaan
1
Komputer / Laptop
Intel Core™i9 13900H
(2,6 GHz)
Media
komputasi
utama
untuk
penulisan
kode,
rendering,
dan
pengujian sistem.
2
Next.js
(Web
Framework)
Versi: 14.x (Vercel Inc.)
Kerangka kerja full-
stack
(SSR)
untuk
membangun
antarmuka web dan
API.
3
Prisma ORM & MySQL
Versi:
Prisma
v5
&
MySQL v8
Sistem
manajemen
basis data dan alat
pemetaan
relasional
untuk log cuaca.

---PAGE BREAK---
10
Tabel Lanjutan 1.
No
Alat
(Perangkat
Lunak)
Spesifikasi / Sumber /
Versi
Kegunaan
4
Node.js & TypeScript
Versi:
Node
v20
LTS
(OpenJS)
Lingkungan
pengeksekusi
kode
peladen dan bahasa
pemrograman
type-
safe.
5
Automatic
Weather
Station
Modul
AWS
(Stasiun
Cuaca)
Sensor
perangkat
keras
(titik
hulu)
penyuplai
data
observasi cuaca laut.
6
Visual
Studio
Code
(IDE)
Versi: 1.90. (Microsoft)
Editor
teks
untuk
menulis
skrip
pemrograman
dan
pengujian kode.
7
NextAuth.js
5.0
Modul
autentikasi
dan manajemen hak
akses
berbasis
Role
(RBAC)
8
Peramban
Web
(Browser)
Google Chrome / Mozilla
Firefox
Platform
eksekusi
untuk menguji coba
antarmuka
dan
debugging web.
3.1.2 Bahan
Sebagai
penunjang
infrastruktur
komputasi
yang
telah
disiapkan,
penelitian ini juga membutuhkan serangkaian bahan utama untuk memastikan
aliran data di dalam sistem berjalan lancar. Bahan penelitian ini secara spesifik
berupa data observasi dan pustaka pendukung (library). Kumpulan data
mentah (raw data) berjenis deret waktu (time-series) ini memuat parameter cuaca
laut, seperti suhu udara, kelembapan, tekanan udara, serta kecepatan dan arah
angin. Keberhasilan sistem dalam mengolah data tersebut baik menjadi
visualisasi interaktif maupun dokumen pelaporan sangat bergantung pada
bahan-bahan yang dirincikan pada Tabel 2.

---PAGE BREAK---
11
Tabel 2. Bahan yang digunakan dalam penelitian
No
Bahan
Kegunaan
1
Dataset Cuaca AWS
Sebagai sumber data mentah (raw data) yang
akan diproses dan divisualisasikan sistem.
2
Pustaka Ekspor Data
Modul
jsPDF
dan
react-csv
untuk
mengekstraksi dan mengunduh laporan ke
format PDF dan Excel.
3
Recharts (Charting Library)
Pustaka
berbasis
vektor
(SVG)
untuk
membentuk visualisasi grafik cuaca secara
dinamis dan interaktif.
4
TypeScript & CSS
Bahasa pemrograman type-safe dan framework
CSS utility-first untuk menyusun fondasi
struktural dan tata letak antarmuka web.
3.2
Metode
Pelaksanaan penelitian ini disusun berdasarkan kerangka metodologi
yang sistematis dan terstruktur. Pendekatan ini bertujuan untuk memastikan
bahwa setiap fase, mulai dari identifikasi masalah hingga tahap evaluasi akhir,
berjalan secara berkesinambungan. Hal ini dilakukan guna menghasilkan
sistem pemantauan data cuaca yang tidak hanya berfungsi dengan baik secara
operasional, tetapi juga memiliki arsitektur perangkat lunak yang andal. Secara
garis besar, tahapan pelaksanaan penelitian ini diilustrasikan melalui diagram
alur pada Gambar 1.
Gambar 1. Kerangka Kerja Penelitian
3.2.1 Analisis Kebutuhan

---PAGE BREAK---
12
3.2.2 Pengumpulan Data
Sebagai sumber utama dalam penyediaan data pada sistem ini, tahap
akuisisi mengandalkan instrumen Automatic Weather Station (AWS) untuk
memantau kondisi cuaca dan iklim kelautan secara kontinu (Rivera et al., 2023).
Perangkat AWS ini berfungsi merekam berbagai parameter meteorologi—
seperti suhu udara, tekanan atmosfer, kecepatan angin, dan kelembapan—
dengan tingkat akurasi yang tinggi. Untuk memastikan kelancaran distribusi
data dari lapangan, sistem dilengkapi dengan alur integrasi data (data pipeline)
yang berjalan secara otomatis tanpa campur tangan manual. Alur pengiriman
data dari stasiun observasi hingga dapat diakses melalui antarmuka pengguna,
seperti ditunjukkan pada Gambar 2.
Gambar 2. Alur Pengumpulan Data dari Automatic Weather Stations
Berdasarkan Gambar 2, aliran data pada sistem pemantauan cuaca ini
dibangun dengan pendekatan arsitektur yang terpusat dan berjalan secara
otomatis. Di tahap pengumpulan data, instrumen AWS yang berlokasi di Bali,

---PAGE BREAK---
13
Pangandaran, dan Bungus bertindak sebagai sumber observasi utama. Ketiga
perangkat ini secara kontinu mengukur parameter cuaca laut dan menyimpan
hasil rekamannya langsung ke dalam basis data MySQL. Sebagai jembatan
antara basis data dan pengguna, API Next.js berperan sebagai server yang
menangani
logika
sistem.
Untuk
memanggil
data
dari
MySQL,
server
menggunakan pustaka Prisma ORM alih-alih kueri manual (raw query). Hal ini
diterapkan guna menjamin keamanan, kecepatan, dan keteraturan struktur
data saat diakses. Pada tahap akhir, server mengirimkan data tersebut ke
antarmuka aplikasi dalam bentuk respons JSON (JavaScript Object Notation).
Format JSON dipilih karena terbukti ringan dan sangat mendukung skalabilitas
aplikasi pemantauan (Albuali et al., 2023). Setelah diterima oleh sisi klien, data
JSON ini diproses (parsing) menjadi elemen visual seperti grafik analitik, angka
indikator, dan tabel informatif yang dapat diakses oleh Administrator maupun
Pengguna Publik.
3.2.3 Perancangan Perangkat Lunak
Gambar 3. Arsitektur Perancangan Bangun Perangkat Lunak
.
3.2.4 Pengembangan Perangkat Lunak
Fokus utama perancangan arsitektur perangkat lunak ini tidak terbatas
pada kebutuhan operasional, melainkan juga mencakup aspek keamanan dan
integritas data. Sebagai standar keamanan, sistem ini mengimplementasikan
kontrol akses yang terstruktur. Merujuk pada Blundo, Cimato, dan Siniscalchi
(2020),
adopsi
model
Role-Based
Access
Control
(RBAC)
memfasilitasi
pengelolaan batasan wewenang secara efisien. Metode ini secara efektif

---PAGE BREAK---
14
mengurangi kerentanan eskalasi hak istimewa (privilege escalation) melalui
pemisahan eksposur sistem yang ketat sesuai dengan peran spesifik pengguna.
Sebagai
bentuk
implementasi,
penelitian
ini
menerapkan
arsitektur
manajemen sesi dan otorisasi terpusat. Modul autentikasi akan melakukan
validasi secara berlapis sebelum memberikan izin akses, guna memastikan
keabsahan kredensial dan kesesuaian hak akses pengguna terhadap sumber
daya
yang
diminta.
Alur
logika
dari
kontrol
akses
dan
pemisahan
fungsionalitas sistem tersebut diilustrasikan pada gambar berikut.
Gambar 4. Pengembangan Perangkat Lunak
Diagram alir di atas mendemonstrasikan arsitektur keamanan dan kontrol
akses sistem yang dibangun berdasarkan model Role-Based Access Control
(RBAC). Pada arsitektur ini, sistem tidak hanya berfokus pada tahap autentikasi,
tetapi juga pada mekanisme otorisasi berlapis. Penerapan model RBAC sangat
krusial dalam pengembangan perangkat lunak untuk memastikan bahwa

---PAGE BREAK---
15
pembatasan akses selalu ditegakkan guna melindungi layanan dan sumber
daya sistem (Das et al., 2021).
Proses pengamanan ini dimulai pada modul validasi autentikasi dan
otorisasi akses, yang berfungsi sebagai lapisan keamanan pertama (security
gateway). Jika kredensial yang dimasukkan tidak sah, sistem secara otomatis
akan memutus sesi dan mengarahkan pengguna kembali ke halaman login.
Keberadaan modul validasi yang andal (robust) ini sangat penting dalam
ekosistem sistem yang tersentralisasi. Kerangka kerja kontrol akses yang ideal
harus mampu mendukung dan memisahkan fungsi registrasi, validasi identitas,
serta otorisasi di lini terdepan untuk mencegah pelanggaran integritas data
sejak awal (Yang et al., 2020). Bagi pengguna yang berhasil melewati tahap
validasi, sistem kemudian mengevaluasi perannya untuk menentukan hak
akses sebagai berikut:

Modul Pengguna Standar: Sistem mengarahkan pengguna reguler ke
fungsionalitas operasional dasar, seperti dashboard, penyaringan data,
dan visualisasi grafik. Secara arsitektural, rancangan ini menerapkan
prinsip hak istimewa minimum (principle of least privilege), di mana
pengguna
hanya
diberikan
izin
akses
sebatas
yang
benar-benar
dibutuhkan.

Modul Administrator: Sistem memberikan hak akses penuh bagi
pengelola sistem. Kompleksitas akses ini ditangani secara optimal
melalui hierarki peran (role hierarchy), di mana peran tingkat atas secara
otomatis mewarisi hak otorisasi dari peran di bawahnya (Nyame & Qin,

---PAGE BREAK---
16
2020). Melalui prinsip pewarisan ini, Administrator dapat mengakses
seluruh fitur pengguna standar ditambah hak istimewa (privilege) khusus
untuk mengekstrak data mentah langsung dari basis data.
Pemisahan modul berbasis wewenang ini merupakan aspek paling
fundamental dalam menjaga integritas sistem. Penerapan kontrol akses yang
terpusat
(centralized
perspective)
pada
RBAC
akan
secara
signifikan
mempermudah proses audit keamanan dan meminimalisasi inkonsistensi
kebijakan keamanan (Das et al., 2021). Melalui arsitektur pembatasan akses
yang ketat inilah, operasi beban tinggi pada basis data dapat diisolasi dan
diamankan dari jangkauan publik.
3.3
Waktu dan Tempat
Penelitian ini dilaksanakan di Laboratorium Teknologi Kelautan, Fakultas
Perikanan dan Ilmu Kelautan, Universitas Jenderal Soedirman (UNSOED),
Purwokerto, Jawa Tengah. Pemilihan laboratorium tersebut didasarkan pada
ketersediaan sarana dan prasarana yang mendukung kegiatan penelitian di
bidang komputasi kelautan serta sistem informasi geografis (GIS), yang relevan
dengan tujuan pengembangan sistem pemantauan data cuaca dan klimatologi
berbasis web. Kegiatan penelitian mencakup proses pengumpulan data
dari
Automatic
Weather
Station
(AWS),
pengolahan
dan
validasi
data,
perancangan sistem, implementasi perangkat lunak, serta pengujian kinerja
sistem secara menyeluruh.

---PAGE BREAK---
17
IV. HASIL DAN PEMBAHASAN

---PAGE BREAK---
18
DAFTAR PUSTAKA
Agrawal, S., & Gupta, R. D. (2017). Web GIS and its architecture: A review. Arabian
Journal of Geosciences, 10(518).
Aji, S., Pratmanto, D., Ardiansyah, A., & Saifudin, S. (2021). Implementasi framework
Laravel dalam perancangan sistem informasi desa. Indonesian Journal on Software
Engineering (IJSE), 7(2), 237–246.
Alfarisy, M. F., Wibowo, A. A., & Kholifaturrohmah, R. (2024). Pengabdian
Masyarakat pada UMKM CV Kinjeng Melalui Pengenalan Metode Visualisasi
Data Statistik dalam Bentuk Media Diagram Interaktif berbasis Peta. Jurnal
Pengabdian Masyarakat Bangsa, 1(11), 2905–2910.
Al Ghivary, R., Mawar, M., Wulandari, N., Srikandi, N., & Nazilatul M. F., A. (2023).
Peran visualisasi data untuk menunjang analisa data kependudukan di Indonesia.
PENTAHELIX: Jurnal Administrasi Publik, 1(1), 57–62.
Anwar, I. P., Setiawan, A., Herho, S. H. S., Atmojo, A. T., & Khadami, F. (2024).
Analisis parameter laut-atmosfer terhadap anomali tinggi muka air di Laut Jawa.
Indonesian Journal of Oceanography (IJOCE), 6(4), 306–315.
Anne Ru Cheng, T. H., Lee, H. I., Ku, Y. W., & Chen, Y. W. (2016). Quality control
program for real-time hourly temperature observation in Taiwan. Journal of
Atmospheric and Oceanic Technology, 33, 953–976.
Armi, Y. (2023). Berita cuaca dalam hubungannya dengan keselamatan pelayaran (Studi
kasus karamnya MV. Xing Shun 01) [Skripsi Sarjana Terapan, Politeknik Ilmu
Pelayaran Semarang].
Azhari, F., Sukoco, N. B., & Fatoni, K. I. (2016). Studi karakteristik parameter
meteorologi dan gelombang untuk operasi amfibi di perairan Singkawang
Kalimantan Barat. Jurnal Chart Datum, 6(1), 1–9.
Corral García, J. J. (2024). Aplicación web tablero Kanban compartido.
Dekkati, S., Lal, K., & Desamsetti, H. (2019). React Native for Android: Cross-Platform
Mobile Application Development. Global Disclosure of Economics and Business,
8(2), 164.
Deming, C., Dekkati, S., & Desamsetti, H. (2018). Exploratory Data Analysis and
Visualization for Business Analytics. Asian Journal of Applied Science and
Engineering, 7(1), 93–100.
Dian Minarto, & Kurniawan Teguh Santoso. (2023). Pengembangan Sistem Monitoring
dan Prediksi Cuaca Maritim untuk Peningkatan Keselamatan Navigasi. Sammajiva:
Jurnal Penelitian Bisnis dan Manajemen, 1(4), 231–238.
Dinku, T. (2019). Challenges with availability and quality of climate data in Africa. In
Extreme hydrology and climate variability (pp. 71-80). Elsevier.

---PAGE BREAK---
19
Dou, F., Ye, J., Yuan, G., Lu, Q., Niu, W., Sun, H., ... & Song, W. (2023). Towards
artificial general intelligence (AGI) in the Internet of Things (IoT): Opportunities
and challenges. arXiv preprint arXiv:2309.07438.
Ekawati, N. (2015). Pengaruh penggunaan jaringan Automatic Weather Station terhadap
kualitas data di Kantor Stasiun Meteorologi Hang Nadim Batam. Universitas
Putera Batam.
Fatihin, K. (2020). Rancang Bangun Sistem Monitoring Pengukur Cuaca Menggunakan
Minimum System Arduino. JATI (Jurnal Mahasiswa Teknik Informatika).
Gandoria, V. W., Repi, V. V. R., & Wibowo, A. (2023). Rancang bangun pengamat
parameter cuaca menggunakan komunikasi nir kabel. Program Studi Teknik Fisika
dan Teknik Elektro, Universitas Nasional.
Handoko, S. T., Eka, S. A., Rizky, P. M. B., & Faisal, S. (2018). Role of weather
modification technology in climate change adaptation: Indonesian case. Regional
Problems, 21(3–1), 54–57.
Hendra, H., & Halbadika Fahlevi, A. (2024). Implementation of Good Corporate
Governance (GCG) Principles in PDAM Tirta Ogan, Ogan Ilir District. IAPA
Proceedings Conference, 187–195.
Idawati, Zen, M., & Hikmah, N. (2021). Analisis perancangan dan implementasi sistem
penjualan kredit berbasis web (Studi kasus: PT. Rukun Sejahtera Teknik). Jurnal
Sistem Informasi dan Rekayasa Perangkat Lunak, 6(2), 93–101.
Indriani, Y. D., Seminar, K. B., & Sukoco, H. (2017). Sistem pendukung informasi
eksekutif mobilitas sivitas akademika dan publikasi ilmiah Institut Pertanian Bogor.
Jurnal Pustaka Indonesia, 16(2), 1–9.
Iswari, L. (2021). Penerapan React JS pada pengembangan front-end aplikasi startup
Ubaform. AUTOMATA, 2(2).
Kadhafi, M. (2024). Maritime safety in the digital era as the role of weather monitoring
and prediction technology. Maritime Park: Journal of Maritime Technology and
Society, 3(2), 92–97.
Kay, S., Avillanosa, A., Cheung, V., Dao, H., Gonzales, B., Palla, H., Praptiwi, R.,
Queirós, A., Sailley, S., Sumeldan, J., Syazwan, W., Then, A., & Wee, H. (2023).
Projected effects of climate change on marine ecosystems in Southeast Asian seas.
Frontiers in Marine Science, 10.
Kurniawan, H., & Tanjung, M. R. (2017). Sistem informasi geografis objek wisata alam
di
Provinsi
Sumatera
Utara
berbasis
mobile
Android.
Jurnal
Ilmiah
SISFOTENIKA, 7(1), 13–24.
Kusuma, C. W., Lukito, D. G., & Suraharta, I. M. (2024). Perancangan Sistem ETLE
Berbasis Web dengan Metode SDLC Waterfall (Studi Kasus: Kota Tegal). Jurnal
Sosial dan Teknologi (SOSTECH), 4.

---PAGE BREAK---
20
Latue, P. C., Rakuasa, H., Somae, G., & Muin, A. (2023). Analisis perubahan suhu
permukaan daratan di Kabupaten Seram Bagian Barat menggunakan platform
berbasis cloud Google Earth Engine. Sudo Jurnal Teknik Informatika, 2(2), 45–51.
M. E. Millianda, M. Furqon, R. G. Niagara, Kurniawan, R. Kemal, & T. D. Tsania.
(2025). Rancangan Automatic Weather Station (AWS) menggunakan Arduino
Mega pada bandara unit yang tidak tersedia AWS. Jurnal TNI Angkatan Udara,
4(3). ISSN 2809-5464.
Mindara, G. P., Tyanafisya, A., Fakhirah, S. F., Annaufal, A. N., Mahendar, I. A., &
Wicaksono, A. (2025). Design and development of an e-commerce website using
the waterfall method with the Laravel framework. Jurnal Teknologi dan Open
Source, 8(2), 441–452.
Murdiani, D., & Sobirin, M. (2022). Perbandingan metodologi Waterfall dan RAD
(Rapid Application Development) dalam pengembangan sistem informasi. Jurnal
Informatika Teknologi dan Sains (JINTEKS), 4(4), 302–306.
Putri, C. A., Rusdianto, D. S., & Santoso, E. (2020). Pengembangan sistem pengelolaan
perizinan ruang laut dan pesisir berbasis WebGIS dengan penerapan OpenLayers.
Jurnal Pengembangan Teknologi Informasi dan Ilmu Komputer, 4(8), 2744–2752.
Qudratullah, M. I. (2017, Maret). Analisis unsur-unsur cuaca berdasarkan hasil
pengukuran Automated Weather System (AWS) tipe Vaisala MAWS 201. Pillar of
Physics, 9, 17–24.
Rahajoeningoem, T., & Saputra, I. H. (2017). Sistem monitoring cuaca dan deteksi
banjir pada Android berbasis IoT. Prosiding SAINTIKS FTIK UNIKOM, 33–40.
Rajan, K. (2015). Performance analysis of mongodb vs. postgis/postgresql databases for
line intersection and point containment spatial queries. In Free and Open Source
Software for Geospatial (FOSS4G) Conference Proceedings (Vol. 15, No. 1, p. 50).
Rowland, A., Folmer, E., & Beek, W. (2020). Towards self-service GIS—Combining the
best of the Semantic Web and Web GIS. ISPRS International Journal of Geo-
Information, 9(12), 753.
Roy, P., & Bhardwaj, S. (2024, Juli). Remote Sensing and GIS Applications for Weather
and Climate Monitoring. Indian Farmer, 11(07), 247–251. ISSN: 2394-1227.
Sagita, S. M. (2017). Sistem Informasi Geografis Bencana Alam Banjir Jakarta Selatan.
Faktor Exacta, 9(4), 366–376.
Subhan, S., & Umar, R. (2019). Sistem Informasi Geografis Objek Wisata Kabupaten
Lombok Barat berbasis web. JSTIE (Jurnal Sarjana Teknik Informatika), 7(3), 193.
Sudianto, A., Nurhidayati, & Wijaya, L. K. (2020). Penerapan sistem informasi
geografis untuk pemetaan bengkel tambal ban di Kecamatan Selong Kabupaten
Lombok Timur. Infotek: Jurnal Informatika dan Teknologi, 3(1), 51–57.
Thaduri, U. R., Ballamudi, V. K. R., Dekkati, S., & Mandapuram, M. (2016). Making

---PAGE BREAK---
21
the Cloud Adoption Decisions: Gaining Advantages from Taking an Integrated
Approach. International Journal of Reciprocal Symmetry and Theoretical Physics,
3, 11–16.
Uzlah, L. I., Toruntju, F. S., Ramadhan, A. F., Ambiyah, A. A., Aqsan, L. O. P., & Nangi,
J. (2025). Pengembangan WebGIS interaktif untuk pemetaan dan analisis spasial
fasilitas umum di Kota Kendari menggunakan Leaflet.js. Jurnal Mahasiswa Teknik
Informatika, 9(5), 7682.
Wahid, A. A. (2020). Analisis Metode Waterfall untuk Pengembangan Sistem Informasi.
Jurnal Ilmu-Ilmu Informatika dan Manajemen STMIK.
Wijaya, S. C., Mahendra, A. A., Hamdan, T. N., Ramdan, H., & Aditya, R. (2024).
Pengembangan sistem informasi pelayanan publik untuk pemerintah daerah. Jurnal
MENTARI: Manajemen, Pendidikan dan Teknologi Informasi, 3(1), 40–51.

---PAGE BREAK---
