# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01. Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase. Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Halaman katalog (`/`) berhasil mengambil dan menampilkan seluruh data produk dari tabel `produk` Supabase secara server-side menggunakan `KartuProduk`. Jika tabel kosong atau koneksi gagal, pesan yang sesuai ditampilkan dengan jelas. `CatatanBelumAktif` berhasil dihapus.

**Perbaikan:**
Tidak ada perbaikan.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02. Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Halaman detail produk (`/produk/[id]`) berhasil mengambil detail produk berdasarkan ID di URL dari Supabase di sisi server. Jika ID tidak ditemukan, halaman otomatis memanggil `notFound()`. `CatatanBelumAktif` berhasil dihapus dan tombol WhatsApp dipertahankan.

**Perbaikan:**
Tidak ada perbaikan.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)". Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
Komponen `TombolWhatsApp` berhasil diubah menjadi tautan `<a>` dengan `target="_blank"` yang mengarah ke URL `https://wa.me/` sesuai nomor toko, disertai pesan otomatis berformat nama dan harga Rupiah. `CatatanBelumAktif` terkait US-03 telah dibersihkan.

**Perbaikan:**
Tidak ada perbaikan.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04. Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
Form login di `/admin/login` terhubung dengan `loginAction` menggunakan `@supabase/ssr`. Jika login gagal, pesan error ditampilkan di form. Jika berhasil, dialihkan ke `/admin`. Tombol "Keluar" di `NavAdmin` berfungsi mengakhiri sesi lalu mengalihkan pengguna ke `/admin/login`. `CatatanBelumAktif` pada halaman login telah dihapus.

**Perbaikan:**
Tidak ada perbaikan.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05. Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasinya. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Form di `/admin/password` terhubung ke `changePasswordAction` di `app/admin/actions.js`. Validasi server memastikan sesi admin aktif, password minimal 8 karakter, dan konfirmasi cocok. Pesan sukses atau error tampil dengan jelas di halaman. `CatatanBelumAktif` telah dihapus.

**Perbaikan:**
Tidak ada perbaikan.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06. Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
File `proxy.js` dibuat di root proyek untuk memproteksi seluruh rute `/admin/*` (kecuali `/admin/login`). Pengunjung yang belum login otomatis dialihkan ke `/admin/login`. Setiap Server Action pengubah data juga memeriksa autentikasi di server. `CatatanBelumAktif` pada halaman `/admin` telah dihapus.

**Perbaikan:**
Tidak ada perbaikan.

## Debugging dan fitur bonus

### US-07 List produk (Bonus)

**Prompt:**
saja ganti US-07 tadi jadi US-08. saya udah update docs/user-stories.md dan PROMPTS.md. sekarang kerjakan US-07 yang telah saya update.

**Hasil:**
Halaman `/admin` (`app/admin/page.jsx`) diperbarui untuk mengambil seluruh data daftar produk dari tabel `produk` di database Supabase secara server-side (Server Component) dan menampilkannya pada `TabelProduk`. Jika tabel kosong atau terjadi error, pesan yang sesuai akan ditampilkan.

**Perbaikan:**
Tidak ada perbaikan.

### US-08 Tambah produk (Bonus)


**Prompt:**
baca file /Users/andix/work/Business/raghadan/code/katalog-umkm-mentor/docs/user-stories.md. kerjakan US-08

**Hasil:**
Form di `/admin/produk/baru` terhubung ke `createProductAction` di `app/admin/actions.js`. Aksi penambahan produk terlindungi autentikasi di server, memvalidasi input (nama & harga), dan menyimpan produk baru ke tabel `produk` Supabase sebelum mengalihkan pengguna ke `/admin`. `CatatanBelumAktif` telah dihapus.

### Fix Storage RLS Policy Error pada Upload Produk

**Prompt:**
muncul error Gagal mengunggah foto ke bucket 'product': new row violates row-level security policy ketika saya melakukan upload produk

**Hasil:**
Proses upload file di Server Action (`createProductAction`) disesuaikan agar menggunakan `SUPABASE_SECRET_KEY` setelah autentikasi sesi admin dikonfirmasi. Hal ini memungkinkan unggah foto ke bucket `product` berjalan lancar tanpa mengalami masalah RLS pada tabel `storage.objects`.

**Perbaikan:**
Memakai `createPublicClient()` yang memanfaatkan `SUPABASE_SECRET_KEY` untuk operasi upload storage pada sisi server setelah autentikasi admin berhasil divalidasi.

### US-08 Tambah produk & Upload Storage (Versi Ideal)

**Prompt:**
Baca docs/user-stories.md bagian US-08. Buat fitur tambah produk pada form di /admin/produk/baru yang diproses melalui Server Action createProductAction di app/admin/actions.js. Pastikan aksi hanya dapat dilakukan oleh admin yang sudah login. Tambahkan fitur upload foto produk yang disimpan ke Supabase Storage pada bucket "product" menggunakan server client (SUPABASE_SECRET_KEY) di sisi server untuk menghindari masalah RLS Storage. Setelah data disimpan ke tabel "produk", alihkan pengguna kembali ke /admin. Hapus CatatanBelumAktif dari halaman /admin/produk/baru.

**Hasil:**
Form di `/admin/produk/baru` terhubung dengan `createProductAction`. Foto yang diunggah otomatis disimpan ke Supabase Storage bucket `product` dan URL publiknya disimpan ke database Supabase. Pengguna dialihkan ke `/admin` setelah sukses dan `CatatanBelumAktif` berhasil dihapus.

**Perbaikan:**
Tidak ada perbaikan.

### US-09 Ubah produk (Bonus)

**Prompt:**
lanjut kerjakan US-09

**Hasil:**
Halaman `/admin/produk/[id]/ubah` mengambil data lama produk berdasarkan ID dari database Supabase secara server-side. Form terhubung dengan Server Action `updateProductAction` di `app/admin/actions.js` yang memvalidasi input, mendukung upload foto opsional ke Supabase Storage, dan menyimpan perubahan produk ke database sebelum mengalihkan pengguna kembali ke `/admin`. `CatatanBelumAktif` berhasil dihapus.

**Perbaikan:**
Tidak ada perbaikan.

### US-10 Hapus produk (Bonus)

**Prompt:**
lanjutkan US-10

**Hasil:**
Tombol "Hapus" pada tabel produk di `/admin` dihubungkan ke `TombolHapus` yang meminta konfirmasi browser sebelum menghapus. Jika disetujui, Server Action `deleteProductAction` di `app/admin/actions.js` memverifikasi sesi admin dan menghapus baris produk dari database Supabase sebelum menyegarkan halaman.

**Perbaikan:**
Tidak ada perbaikan.

## US-11 Filter kategori atau pencarian (Bonus)

**Prompt:**
baca file ini /Users/andix/work/Business/raghadan/code/katalog-umkm-mentor/docs/user-stories.md

kerjakan US11

**Hasil:**
Halaman katalog (`app/page.jsx`) diperbarui dengan fitur penyaringan produk berdasarkan kategori dan pencarian nama produk:
- Daftar pilihan kategori diambil secara dinamis dari produk yang ada di database Supabase.
- Pengunjung dapat memilih kategori ("Semua" atau kategori spesifik) dengan tautan badge/pill yang otomatis menandai kategori aktif.
- Pengunjung dapat mencari nama produk dengan form pencarian (mendukung tombol Cari, Enter, dan input search).
- Pencarian menggunakan query `ilike` di Supabase secara case-insensitive di sisi server.
- Fitur filter kategori dan pencarian nama produk dapat digunakan secara bersamaan tanpa saling menghilangkan parameter URL.
- Disediakan tombol "Reset" dan tautan "Hapus semua filter" untuk kembali ke seluruh katalog produk.
- Jika hasil pencarian/filter kosong, halaman menampilkan pesan yang jelas dan informatif beserta tombol untuk melihat semua produk.

**Perbaikan:**
Tidak ada perbaikan.

## US-12 Pilih jumlah atau varian (Bonus)

**Prompt:**
lanjutkan ke US12

**Hasil:**
Komponen pemesanan WhatsApp (`components/TombolWhatsApp.jsx`) pada halaman detail produk diperbarui dengan dukungan interaktif:
- Pemilihan jumlah produk (`jumlah`): kontrol tombol tambah/kurang (+ / -) dan input angka langsung dengan batas minimal 1 pcs.
- Pemilihan varian produk (`varian`): input teks bebas disertai opsi rekomendasi cepat (badge pill) dan HTML datalist untuk berbagai jenis produk (misal: Original, Pedas, Manis, Ukuran Kecil/Sedang/Besar).
- Penghitungan subtotal harga secara dinamis sesuai jumlah yang dipilih.
- Pesan otomatis WhatsApp diperbarui secara real-time menyertakan nama produk, varian yang dipilih, jumlah produk, dan harga satuan/total dalam format Rupiah.

**Perbaikan:**
Tidak ada perbaikan.

## US-13 PWA (Bonus)

**Prompt:**
Sebagai pengunjung, saya ingin memasang katalog di layar HP seperti aplikasi. Ikon tersedia di `public/icons`.

Bernilai 10 poin.

Kriteria selesai:

- Ada web app manifest yang ditautkan di halaman.
- Ikon tersedia di `public/icons` dan dirujuk di manifest.
- Katalog bisa di-install ke layar utama HP.

**Hasil:**
Konfigurasi Progressive Web App (PWA) berhasil ditambahkan:
- Dibuat Web App Manifest melalui `app/manifest.js` (Next.js App Router) dan `public/manifest.json`.
- Manifest mengonfigurasi `name`, `short_name`, `start_url`, `display: "standalone"`, `theme_color`, dan `background_color`.
- Ikon dari `public/icons` (`icon-192.png` dan `icon-512.png`) dirujuk dengan benar di manifest dengan format dan ukuran yang sesuai.
- Di `app/layout.jsx`, ditambahkan tautan manifest otomatis, viewport `themeColor`, ikon Apple Touch, dan meta tag pendukung PWA untuk mobile/iOS/Android agar katalog dapat diinstal ke layar utama HP.
- Konfigurasi rewrite pada `next.config.mjs` untuk mendukung akses ke `/manifest.json` dan `/manifest.webmanifest`.

**Perbaikan:**
Tidak ada perbaikan.

## US-14 Deskripsi produk dibuat AI (Bonus)

**Prompt:**
### US-14 Deskripsi produk dibuat AI

Sebagai admin, saya ingin membuat deskripsi produk secara otomatis dengan AI (Gemini API) dari nama dan kategori produk.

Bernilai 10 poin.

Kriteria selesai:

- Admin bisa membuat deskripsi otomatis dari nama dan kategori produk. (4 poin)
- Gemini API dipanggil dari server, kunci tidak ada di browser. (3 poin)
- Hasilnya mengisi kolom deskripsi sebelum produk disimpan. (3 poin)

Catatan: bonus US-08, US-09, dan US-10 hanya dihitung jika aksinya terlindungi login.

**Hasil:**
Fitur pembuatan deskripsi otomatis menggunakan Gemini API berhasil diimplementasikan:
- Dibuat Server Action `generateDescriptionAction` di `app/admin/actions.js` yang memverifikasi autentikasi admin di server sebelum memproses permintaan.
- Gemini API dipanggil secara server-side menggunakan `GEMINI_API_KEY` (atau `GOOGLE_API_KEY`) dari environment variable sehingga kunci API aman dan tidak pernah terekspos ke browser.
- Disediakan tombol "✨ Buat dengan AI" di samping label deskripsi pada form produk (`components/FormProduk.jsx`).
- Ketika ditekan, Server Action menerima nama dan kategori produk, lalu menghasilkan deskripsi yang menarik dan otomatis mengisi kolom textarea deskripsi secara langsung sehingga admin dapat meninjau atau menyuntingnya sebelum produk disimpan.

**Perbaikan:**
Tidak ada perbaikan.

## US-15 Urutkan produk (Bonus lanjutan)

**Prompt:**
Sebagai pengunjung, saya ingin mengurutkan produk, supaya cepat menemukan yang murah atau yang terbaru.

Bernilai 5 poin.

Kriteria selesai:

- Ada pilihan urutan: termurah, termahal, terbaru. (3 poin)
- Urutan diterapkan saat mengambil data (query), bukan hanya di tampilan. (2 poin)

**Hasil:**
Halaman katalog (`app/page.jsx`) diperbarui dengan fitur pengurutan produk:
- Disediakan kontrol pilihan urutan: dropdown `<select name="urutan">` dan tombol pill navigasi cepat untuk opsi `Bawaan`, `Termurah`, `Termahal`, dan `Terbaru`.
- Pengurutan langsung diterapkan pada query database Supabase di sisi server:
  - `termurah`: `.order("harga", { ascending: true })`
  - `termahal`: `.order("harga", { ascending: false })`
  - `terbaru`: `.order("created_at", { ascending: false })`
  - `bawaan`: `.order("id", { ascending: true })`
- Pilihan urutan tersimpan di URL query parameter (`urutan` / `sort`) dan terintegrasi harmonis dengan filter kategori serta pencarian nama produk tanpa saling menghilangkan parameter.
- Teks status hasil dan tombol reset filter/urutan disediakan untuk memudahkan navigasi pengunjung.

**Perbaikan:**
Tidak ada perbaikan.

## US-16 Paginasi atau muat lebih banyak (Bonus lanjutan)

**Prompt:**
Sebagai pengunjung, saya ingin daftar produk tidak terlalu panjang, supaya halaman cepat dibuka.

Bernilai 10 poin.

Kriteria selesai:

- Daftar produk dipecah per halaman atau ada tombol "muat lebih banyak". (4 poin)
- Pembatasan jumlah dilakukan di query database, bukan hanya disembunyikan. (3 poin)
- Navigasi antar halaman berfungsi dan jumlah halaman benar. (3 poin)

**Hasil:**
Fitur paginasi produk berhasil diimplementasikan di katalog publik (`app/page.jsx`):
- Pembatasan jumlah produk dilakukan langsung di query database Supabase menggunakan `.range(from, to)` dan `{ count: "exact" }`, sehingga produk yang diambil ke memori dan dikirim ke browser dibatasi (12 produk per halaman) dan bukan sekadar disembunyikan di tampilan.
- Total halaman dihitung secara akurat dari `count` produk di database (`Math.ceil(totalProduk / perPage)`).
- Disediakan kontrol navigasi paginasi: tombol Sebelumnya (`← Sebelumnya`), nomor-nomor halaman (`1`, `2`, `3`, dst.), dan tombol Selanjutnya (`Selanjutnya →`).
- Parameter halaman tersimpan di URL query parameter (`halaman` / `page`) dan terintegrasi harmonis dengan filter kategori, pencarian kata kunci, serta pengurutan tanpa menghilangkan parameter aktif.
- Mengubah filter atau urutan otomatis mengembalikan tampilan ke halaman 1.

**Perbaikan:**
Tidak ada perbaikan.

## US-17 Produk terkait di halaman detail (Bonus lanjutan)

**Prompt:**
Sebagai pengunjung, saya ingin melihat produk lain yang mirip, supaya saya punya pilihan lain.

Bernilai 5 poin.

Kriteria selesai:

- Halaman detail menampilkan beberapa produk lain dari kategori yang sama. (3 poin)
- Produk yang sedang dibuka tidak ikut ditampilkan, dan data diambil dari database. (2 poin)

**Hasil:**
Halaman detail produk (`app/produk/[id]/page.jsx`) diperbarui dengan bagian "Produk terkait":
- Mengambil produk lain dari kategori yang sama langsung dari database Supabase (`.eq("kategori", produk.kategori)`).
- Mengecualikan produk yang sedang dibuka (`.neq("id", produkId)`).
- Menampilkan hingga 4 produk terkait menggunakan kartu produk standar (`KartuProduk`) dalam tata letak grid responsif.
- Bagian produk terkait hanya tampil jika terdapat produk lain dalam kategori tersebut.

**Perbaikan:**
Tidak ada perbaikan.

## US-18 Galeri foto produk

**Prompt:**
Sebagai pengunjung, saya ingin melihat beberapa foto satu produk, supaya saya tahu bentuk produknya dari berbagai sisi.

Bernilai 10 poin.

Kriteria selesai:

- Satu produk bisa punya lebih dari satu foto. (4 poin)
- Halaman detail menampilkan galeri dengan foto utama dan gambar kecil. (3 poin)
- Pengunjung bisa berganti foto, dan produk dengan satu foto tetap tampil normal. (3 poin)

**Hasil:**
- Kolom `foto_url` mendukung beberapa URL yang dipisahkan koma atau baris baru.
- Dibuat `components/GaleriFoto.jsx` (client component) yang menampilkan foto utama besar dan thumbnail di bawahnya; klik thumbnail mengganti foto utama.
- Jika hanya satu foto, galeri tetap tampil normal tanpa thumbnail.
- `app/produk/[id]/page.jsx` menggunakan `GaleriFoto` menggantikan `<img>` langsung.
- `components/KartuProduk.jsx` diperbarui untuk mengambil foto pertama dari URL yang dipisahkan.

**Perbaikan:**
Tidak ada perbaikan.

## US-19 Stok produk

**Prompt:**
Sebagai pengunjung, saya ingin tahu produk yang habis, supaya saya tidak memesan produk yang tidak ada.

Bernilai 5 poin.

Kriteria selesai:

- Produk punya status atau jumlah stok di database. (2 poin)
- Produk yang habis diberi penanda "Habis" dan tombol pesan WhatsApp dinonaktifkan atau disembunyikan. (3 poin)

**Hasil:**
- `docs/schema.sql` diperbarui dengan migrasi menambahkan kolom `stok integer default null` pada tabel `produk`. `NULL` = tidak dilacak, `0` = habis, positif = tersedia.
- `components/FormProduk.jsx` ditambahkan input stok (opsional) di antara Kategori dan foto upload.
- `app/admin/actions.js` — `createProductAction` dan `updateProductAction` keduanya membaca dan menyimpan nilai stok.
- `components/KartuProduk.jsx` menampilkan badge merah "Habis" dan gambar di-grayscale ketika `stok === 0`.
- `components/TombolWhatsApp.jsx` — ketika `stok === 0`, semua kontrol varian & jumlah disembunyikan dan digantikan pesan "Produk ini sedang tidak tersedia." dengan tombol "Stok habis" yang dinonaktifkan.

**Perbaikan:**
Tidak ada perbaikan.

## US-20 Harga coret dan badge

**Prompt:**
Sebagai pengunjung, saya ingin melihat harga diskon dan label produk, supaya saya tahu mana yang sedang promo atau baru.

Bernilai 5 poin.

Kriteria selesai:

- Produk bisa punya harga diskon, dan harga normal tampil dicoret di kartu dan halaman detail. (3 poin)
- Badge "Baru" atau "Terlaris" tampil berdasarkan data produk. (2 poin)

**Hasil:**
- `docs/schema.sql` bagian 6: kolom `harga_diskon integer` (nullable) dan `badge text` (nullable, hanya `Baru` atau `Terlaris`). Jalankan bagian ini di Supabase SQL Editor sebelum mengetes.
- `lib/format.js`: helper `hargaAktif` dan `adaDiskon`. Diskon hanya berlaku jika terisi dan lebih kecil dari harga normal.
- Komponen baru `components/HargaProduk.jsx` (harga aktif + harga normal dicoret) dan `components/BadgeProduk.jsx`, dipakai di `KartuProduk.jsx` dan `app/produk/[id]/page.jsx`.
- `components/FormProduk.jsx`: input harga diskon dan pilihan badge.
- `app/admin/actions.js`: create dan update menyimpan `harga_diskon` dan `badge`. Server menolak diskon yang tidak lebih kecil dari harga, dan nilai badge di luar daftar dijadikan kosong. Pemeriksaan login tidak berubah.
- `components/TombolWhatsApp.jsx`: pesan WhatsApp dan total memakai harga diskon.

**Perbaikan:**
Tidak ada perbaikan.

## US-21 Keranjang, pesan semua via WhatsApp

**Prompt:**
Sebagai pengunjung, saya ingin memesan beberapa produk sekaligus, supaya tidak perlu mengirim pesan satu per satu.

Bernilai 15 poin.

Kriteria selesai:

- Ada tombol "Tambah ke keranjang" di kartu atau halaman detail. (4 poin)
- Keranjang bisa mengubah jumlah dan menghapus item, dan total harga benar. (4 poin)
- Isi keranjang bertahan saat pindah halaman. (4 poin)
- Satu tombol mengirim seluruh isi keranjang dalam satu pesan WhatsApp ke nomor di `lib/toko.js`. (3 poin)

**Hasil:**
- `components/KeranjangProvider.jsx`: state keranjang (context) yang disimpan di `localStorage` dengan kunci `keranjang`, sinkron antar tab. Item dibedakan per produk dan varian; item yang sama digabung jumlahnya. Jumlah dibatasi stok jika stok dilacak.
- `components/TombolTambahKeranjang.jsx`: dipakai di `KartuProduk.jsx` (jumlah 1, disembunyikan jika habis) dan `TombolWhatsApp.jsx` (memakai jumlah dan varian yang dipilih).
- `components/LinkKeranjang.jsx` di `Header.jsx`: tautan ke keranjang dengan jumlah item.
- `app/keranjang/page.jsx` + `components/IsiKeranjang.jsx`: daftar item, tombol +/− dan hapus, total, kosongkan keranjang, dan tombol "Pesan semua via WhatsApp" yang mengirim satu pesan berisi seluruh item ke `toko.nomorWhatsApp`.
- `app/layout.jsx` membungkus aplikasi dengan `KeranjangProvider`.
- `KartuProduk.jsx`: elemen terluar diubah dari `Link` menjadi `div` karena tombol tidak boleh berada di dalam tautan.
- Harga yang dipakai adalah harga aktif (diskon dari US-20) saat produk ditambahkan.

**Perbaikan:**
Tidak ada perbaikan.

## US-22 Halaman Tentang dan kontak toko

**Prompt:**
Sebagai pengunjung, saya ingin tahu siapa pemilik toko dan cara menghubunginya, supaya saya percaya pada toko ini.

Bernilai 5 poin.

Kriteria selesai:

- Ada halaman (misalnya `/tentang`) berisi profil toko, alamat, jam buka, dan kontak. (3 poin)
- Halaman tertaut dari navigasi atau footer. (2 poin)

**Hasil:**
- `app/tentang/page.jsx`: profil toko, alamat, jam buka, dan nomor WhatsApp dari `lib/toko.js`, plus tombol "Hubungi via WhatsApp" dan "Lihat katalog".
- `components/Header.jsx`: tautan "Tentang" di navigasi.
- `components/Footer.jsx`: tautan "Tentang & kontak".
- Teks profil bersifat umum; pemilik bisa menggantinya dengan cerita usahanya sendiri.

**Perbaikan:**
Tidak ada perbaikan.
