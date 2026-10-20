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
- Kunci Gemini langsung (`GEMINI_API_KEY`) ditolak Google ("API key not valid"), dan model `gemini-1.5-flash` sudah tidak tersedia. Panggilan LLM dipindah ke `lib/deskripsi-ai.js` dan disambungkan ke gateway 9router (kompatibel OpenAI) memakai model `gemini` (Gemini lewat 9router), dengan konfigurasi `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL` di `.env.local` / environment variable server. Jika `LLM_*` kosong, tetap memakai Gemini API langsung (`GEMINI_API_KEY`, kunci di header `x-goog-api-key` bukan di URL).
- 9router membalas `content-type: text/event-stream` (satu JSON + `data: [DONE]`) kalau `stream` tidak diminta, sehingga `response.json()` gagal. Diperbaiki dengan `stream: false` dan parser yang tahan terhadap kedua bentuk.
- Batas waktu 25 detik, dan pesan error yang jelas untuk kunci ditolak, timeout, dan konfigurasi kosong.
- Kunci tidak ada di kode, `.env.example`, maupun bundle browser; hanya di `.env.local` (di-`.gitignore`) dan environment variable Vercel.

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

## US-23 Bagikan atau salin link produk

**Prompt:**
Sebagai pengunjung, saya ingin membagikan produk ke teman, supaya mereka bisa melihatnya.

Bernilai 5 poin.

Kriteria selesai:

- Halaman detail punya tombol bagikan atau salin link (Web Share API atau clipboard). (3 poin)
- Ada umpan balik setelah ditekan, misalnya "Link tersalin". (2 poin)

**Hasil:**
- `components/TombolBagikan.jsx`: memakai Web Share API jika tersedia, kalau tidak menyalin link ke clipboard (dengan fallback `execCommand` untuk browser lama). Setelah menyalin tampil "Link tersalin" selama 2 detik; jika gagal tampil "Gagal menyalin link". Menutup dialog bagikan tidak memunculkan pesan.
- `app/produk/[id]/page.jsx`: tombol dipasang di bawah tombol pesan.

**Perbaikan:**
Tidak ada perbaikan.

## US-24 Favorit tersimpan di browser

**Prompt:**
Sebagai pengunjung, saya ingin menandai produk favorit, supaya mudah menemukannya lagi.

Bernilai 10 poin.

Kriteria selesai:

- Ada tombol favorit di kartu atau halaman detail. (4 poin)
- Favorit tersimpan di browser dan bertahan setelah halaman dimuat ulang. (3 poin)
- Ada tampilan yang hanya berisi produk favorit. (3 poin)

**Hasil:**
- `components/FavoritProvider.jsx`: menyimpan daftar id favorit di `localStorage` (kunci `favorit`), sinkron antar tab.
- `components/TombolFavorit.jsx`: ikon hati, dipasang di `KartuProduk.jsx` (menimpa foto) dan di halaman detail (dengan teks).
- `app/favorit/page.jsx` + `components/IsiFavorit.jsx`: halaman `/favorit` berisi produk favorit saja. Data produk diambil lewat Server Action `app/favorit/actions.js` (Supabase tetap hanya diakses dari server), id divalidasi dan dibatasi 100.
- `Header.jsx`: tautan "Favorit". `app/layout.jsx` membungkus aplikasi dengan `FavoritProvider`.

**Perbaikan:**
Tidak ada perbaikan.

## US-25 Mode gelap

**Prompt:**
Sebagai pengunjung, saya ingin memilih tampilan gelap, supaya nyaman dilihat di malam hari.

Bernilai 10 poin.

Kriteria selesai:

- Ada tombol untuk berpindah antara mode terang dan gelap. (4 poin)
- Pilihan diingat setelah halaman dimuat ulang. (3 poin)
- Semua teks tetap terbaca di kedua mode. (3 poin)

**Hasil:**
- `app/globals.css`: blok `:root[data-theme="dark"]` menimpa token warna, jadi semua komponen yang memakai token ikut berubah. Token baru `--color-kontras` untuk teks di atas latar `utama`, `harga`, dan `bahaya` (putih di mode terang, hampir hitam di mode gelap karena warna latarnya jadi lebih terang).
- Semua `text-white` di komponen dan halaman diganti `text-kontras` agar tetap terbaca di kedua mode.
- `components/TombolTema.jsx`: tombol bulan/matahari di header, pilihan disimpan di `localStorage` (kunci `tema`).
- `app/layout.jsx`: skrip kecil di `<head>` memasang tema sebelum halaman tampil (tanpa berkedip). Jika belum ada pilihan tersimpan, mengikuti pengaturan perangkat.

**Perbaikan:**
Tidak ada perbaikan.

## US-26 Metadata SEO dan Open Graph

**Prompt:**
Sebagai pemilik toko, saya ingin link produk tampil rapi saat dibagikan, supaya menarik pembeli.

Bernilai 5 poin.

Kriteria selesai:

- Halaman detail memakai `generateMetadata` untuk judul dan deskripsi yang sesuai produk. (3 poin)
- Open Graph memuat nama dan foto produk. (2 poin)

**Hasil:**
- `app/produk/[id]/page.jsx`: `generateMetadata` mengisi `title` (nama produk), `description` (deskripsi produk dipotong 160 karakter, atau "nama di toko" jika kosong), Open Graph (`title`, `description`, `url`, `siteName`, `images` berisi foto pertama produk), dan Twitter card. Produk yang tidak ada mendapat judul "Produk tidak ditemukan". Query produk dibungkus `cache()` supaya tidak dijalankan dua kali per request.
- `app/layout.jsx`: `metadataBase` agar URL foto dan halaman di Open Graph menjadi absolut, plus template judul `%s | Nama Toko`. Alamat situs dari `SITE_URL`, atau `VERCEL_PROJECT_PRODUCTION_URL` di Vercel, atau `http://localhost:3000`.
- `lib/foto.js`: `ekstrakDaftarFoto` dipindah dari `GaleriFoto.jsx` karena fungsi dari file `"use client"` tidak bisa dipanggil di Server Component. `GaleriFoto.jsx` dan `KeranjangProvider.jsx` ikut diperbarui.
- `.env.example`: variabel opsional `SITE_URL`.

**Perbaikan:**
Tidak ada perbaikan.

## US-27 sitemap.xml dan robots.txt

**Prompt:**
Sebagai pemilik toko, saya ingin mesin pencari menemukan semua produk, supaya toko lebih mudah ditemukan.

Bernilai 5 poin.

Kriteria selesai:

- `sitemap.xml` dibuat dari database dan memuat halaman produk. (3 poin)
- `robots.txt` valid dan menunjuk ke sitemap. (2 poin)

**Hasil:**
- `app/sitemap.js`: memuat beranda, `/tentang`, dan satu URL per produk dari tabel `produk` (`/produk/[id]`). Dibuat saat diminta (`force-dynamic`) supaya produk baru langsung masuk. Jika database gagal, tetap mengembalikan halaman tetap.
- `app/robots.js`: mengizinkan semua halaman, melarang `/admin`, `/keranjang`, dan `/favorit`, dan menunjuk ke `{alamat situs}/sitemap.xml`.
- `lib/situs.js`: alamat situs (`SITE_URL`, atau `VERCEL_PROJECT_PRODUCTION_URL`, atau localhost) dipakai bersama oleh layout, sitemap, dan robots.

**Perbaikan:**
Tidak ada perbaikan.

## US-28 Halaman 404 dan loading kustom

**Prompt:**
Sebagai pengunjung, saya ingin pesan yang ramah saat halaman tidak ada atau sedang dimuat.

Bernilai 5 poin.

Kriteria selesai:

- Ada `not-found.jsx` kustom dengan tautan kembali ke beranda. (3 poin)
- Ada `loading.jsx` atau skeleton di halaman yang mengambil data. (2 poin)

**Hasil:**
- `app/not-found.jsx` sudah ada; tombolnya diubah menjadi "Kembali ke beranda" (menuju `/`). Dipakai juga oleh `notFound()` di detail produk dan halaman yang tidak dikenal.
- `components/Skeleton.jsx`: kotak berdenyut (animasi dimatikan jika perangkat meminta `prefers-reduced-motion`).
- `app/loading.jsx` (grid kartu untuk beranda), `app/produk/[id]/loading.jsx` (foto + info produk), `app/admin/loading.jsx` (daftar baris). Masing-masing memakai `role="status"` dan teks untuk pembaca layar.

**Perbaikan:**
Tidak ada perbaikan.

## US-29 Upload foto ke Supabase Storage

**Prompt:**
Sebagai admin, saya ingin mengunggah foto produk dari komputer, supaya tidak perlu mengisi link foto manual.

Bernilai 15 poin.

Kriteria selesai:

- Form produk punya input file foto. (4 poin)
- File diunggah ke Supabase Storage dari server, kunci tidak ada di browser. (4 poin)
- URL foto tersimpan di produk dan foto tampil di katalog. (4 poin)
- Tipe file (gambar) dan ukuran maksimal divalidasi dengan pesan error yang jelas. (3 poin)

**Hasil:**
- `lib/unggah-foto.js` (baru): validasi di server lalu unggah ke bucket `product` memakai `SUPABASE_SECRET_KEY`. Aturan: maksimal 2 MB; tipe JPG, PNG, WebP, GIF (SVG ditolak karena bisa memuat script); isi file dicocokkan dengan magic bytes sehingga file yang hanya diganti ekstensinya ditolak. Nama file dibuat sendiri, nama dari pengguna tidak dipakai. Hasilnya `{ url }` atau `{ error }` dengan pesan yang jelas.
- `app/admin/actions.js`: kode upload yang diduplikasi di tambah dan ubah produk diganti satu panggilan `unggahFoto`. Cek login tetap dijalankan sebelum upload. Foto baru ditambahkan ke link foto yang sudah ada, jadi galeri US-18 tidak terhapus.
- `components/FormProduk.jsx`: input file hanya menerima tipe yang diizinkan, label menjelaskan batasnya.
- `next.config.mjs`: `serverActions.bodySizeLimit` dinaikkan ke 3 MB karena batas bawaan 1 MB menolak foto sebelum sampai ke kode.
- `docs/schema.sql` bagian 7: membuat bucket `product` (publik, 2 MB, 4 tipe gambar). Jalankan di Supabase SQL Editor jika bucket belum ada.

**Perbaikan:**
Tidak ada perbaikan.

## US-30 Dashboard ringkasan admin

**Prompt:**
Sebagai admin, saya ingin melihat ringkasan toko, supaya saya tahu kondisi katalog sekilas.

Bernilai 10 poin.

Kriteria selesai:

- `/admin` menampilkan jumlah produk dari database. (4 poin)
- Menampilkan jumlah produk per kategori. (3 poin)
- Hanya bisa dibuka setelah login. (3 poin)

**Hasil:**
- `components/RingkasanAdmin.jsx` (baru): kartu "Total produk" dan daftar "Produk per kategori" dengan bar proporsi. Kategori diurutkan dari yang terbanyak; produk tanpa kategori dihitung sebagai "Tanpa kategori".
- `app/admin/page.jsx`: mengambil kolom `kategori` dari tabel `produk` (bersamaan dengan daftar produk lewat `Promise.all`) dan menghitung total serta jumlah per kategori. Query dibuat terpisah dari daftar produk supaya angkanya tetap benar saat daftar nanti dipaginasi (US-33). Jika query gagal, tampil pesan error, bukan angka 0.
- Akses: `/admin` sudah dilindungi `proxy.js` dan pemeriksaan `getUser()` di halaman (redirect ke `/admin/login`), tidak ada perubahan.

**Perbaikan:**
Tidak ada perbaikan.

## US-31 Kelola kategori

**Prompt:**
Sebagai admin, saya ingin mengatur daftar kategori, supaya produk terkelompok rapi.

Bernilai 15 poin.

Kriteria selesai:

- Admin bisa menambah kategori. (4 poin)
- Admin bisa mengubah nama kategori. (3 poin)
- Admin bisa menghapus kategori, dan kategori yang masih dipakai produk ditolak atau ditangani dengan jelas. (4 poin)
- Daftar kategori di form produk berasal dari data ini, dan semua aksi memeriksa login di server. (4 poin)

**Hasil:**
- `docs/schema.sql` bagian 8: tabel `kategori` (nama unik, tidak peka huruf besar/kecil, 1 sampai 50 karakter) dengan RLS yang sama seperti `produk`. Data lama dimigrasi: kategori yang sudah dipakai produk disalin ke tabel baru. Kolom `produk.kategori` tidak diganti nama, tetapi diberi foreign key ke `kategori.nama` dengan `on update cascade` (ubah nama ikut mengubah produk) dan `on delete restrict` (kategori yang dipakai tidak bisa dihapus). Jalankan bagian 8 di Supabase SQL Editor.
- `app/admin/actions.js`: `createCategoryAction`, `renameCategoryAction`, `deleteCategoryAction`; semuanya memeriksa login di server dan memvalidasi nama. Hapus menghitung dulu produk yang memakai kategori dan menolak dengan pesan "masih dipakai N produk"; foreign key menjadi pengaman kedua. Nama kembar ditolak dengan pesan yang jelas.
- `app/admin/kategori/page.jsx`, `components/FormTambahKategori.jsx`, `components/BarisKategori.jsx`: halaman kelola kategori (tambah, ubah nama inline, hapus dengan konfirmasi, jumlah produk per kategori). `NavAdmin.jsx` mendapat tautan "Kategori".
- Form produk: kolom kategori sekarang dropdown dari tabel `kategori` (`FormProduk.jsx`). `app/admin/produk/baru/page.jsx` menjadi Server Component yang mengambil kategori, form-nya dipindah ke `FormTambahProduk.jsx`; halaman ubah ikut mengirim daftar kategori.
- `docs/skema-database.md`: tabel `kategori` dan relasinya.

**Perbaikan:**
Tidak ada perbaikan.

## US-32 Aktif atau nonaktifkan produk

**Prompt:**
Sebagai admin, saya ingin menyembunyikan produk tanpa menghapusnya, supaya bisa ditampilkan lagi nanti.

Bernilai 10 poin.

Kriteria selesai:

- Ada tombol aktif atau nonaktif untuk produk di halaman admin. (4 poin)
- Produk nonaktif tidak muncul di katalog publik, dan halaman detailnya menampilkan "tidak ditemukan". (3 poin)
- Aksinya memeriksa login di server. (3 poin)

**Hasil:**
- `docs/schema.sql` bagian 9: kolom `aktif boolean not null default true` di tabel `produk`. Jalankan di Supabase SQL Editor sebelum aplikasi baru dipakai, karena query publik sekarang menyaring kolom ini.
- `components/TombolAktif.jsx` dan `components/TabelProduk.jsx`: tombol "Nonaktifkan" / "Aktifkan" per baris di `/admin`, baris nonaktif diberi label dan warna redup.
- `app/admin/actions.js`: `toggleProductActiveAction` memeriksa login di server dan menerima status tujuan dari form (bukan membalik status), jadi klik ganda tidak mengubah hasil.
- Semua query publik menyaring `aktif = true`: katalog dan daftar kategori filter di `app/page.jsx`, detail produk dan produk terkait di `app/produk/[id]/page.jsx` (produk nonaktif memanggil `notFound()`, termasuk metadata), `app/sitemap.js`, dan `app/favorit/actions.js`. Daftar admin tetap menampilkan semua produk.

**Perbaikan:**
Tidak ada perbaikan.

## US-33 Cari dan paginasi di list admin

**Prompt:**
Sebagai admin, saya ingin mencari produk di halaman admin, supaya cepat menemukan yang saya cari.

Bernilai 10 poin.

Kriteria selesai:

- Ada kolom cari di `/admin` yang menyaring lewat query database. (4 poin)
- Daftar produk dipaginasi. (3 poin)
- Kata kunci dan nomor halaman tersimpan di URL, jadi tetap ada setelah dimuat ulang. (3 poin)

**Hasil:**
- `app/admin/page.jsx`: parameter URL `q` dan `halaman`. Pencarian memakai `ilike` pada kolom `nama` di query Supabase, dan jumlah dibatasi 10 per halaman dengan `.range()` plus `count: "exact"` untuk total halaman. Karakter `%`, `_`, dan `\` dari pengguna di-escape supaya dicari apa adanya. Jika nomor halaman melebihi jumlah halaman (misalnya setelah menghapus produk terakhir di halaman itu), diarahkan ke halaman terakhir. Ringkasan dashboard (US-30) tetap menghitung seluruh produk, tidak terpengaruh pencarian.
- Form cari memakai `GET`, jadi kata kunci dan halaman ada di URL (`/admin?q=kopi&halaman=2`) dan bertahan saat dimuat ulang atau dibagikan. Ada tombol Reset, teks "Menampilkan X–Y dari Z produk", dan pesan jika tidak ada hasil.
- `components/Paginasi.jsx` (baru): tombol Sebelumnya/Selanjutnya dan nomor halaman dengan "…" supaya tidak terlalu panjang.

**Perbaikan:**
Tidak ada perbaikan.

## US-34 Validasi form admin di server

**Prompt:**
Sebagai admin, saya ingin form menolak data yang salah, supaya katalog tidak berisi data rusak.

Bernilai 10 poin.

Kriteria selesai:

- Server memvalidasi input: nama wajib, harga angka positif. (4 poin)
- Pesan error tampil per field di bawah input yang salah. (3 poin)
- Nilai yang sudah diisi tidak hilang saat terjadi error. (3 poin)

**Hasil:**
- `lib/validasi-produk.js` (baru): satu validator untuk tambah dan ubah produk. Nama wajib (maksimal 100 karakter, spasi saja ditolak); harga wajib, angka bulat lebih dari 0 (`45.000`, `12abc`, `1e3`, `-5`, dan `0` ditolak); harga diskon angka bulat dan lebih kecil dari harga; stok angka bulat 0 sampai 1.000.000; badge hanya `Baru`/`Terlaris`; link foto hanya `http(s)://` atau path `/...` (`javascript:` dan `//host` ditolak); deskripsi maksimal 2000 karakter. Semua error dikumpulkan sekaligus, per field.
- `app/admin/actions.js`: `createProductAction` dan `updateProductAction` memakai validator itu setelah cek login, dan mengembalikan `{ errors, values }`. Error upload foto (US-29) juga ditampilkan di bawah input file. Penyimpanan hanya berjalan jika semua valid.
- `components/Input.jsx`: prop `error` menampilkan pesan merah di bawah input, dengan `aria-invalid` dan `role="alert"`. `components/FormProduk.jsx`: pesan error di tiap field, form memakai `noValidate` supaya pesan dari server yang tampil.
- Nilai tidak hilang: React mereset form setelah action selesai, dan reset itu mengembalikan dropdown (badge, kategori) ke pilihan awal serta mengosongkan input file. `FormProduk` sekarang menangani submit sendiri (`onSubmit` + `useTransition`) sehingga reset tidak terjadi. Semua field dikontrol state. Ini diuji di browser sungguhan (lihat catatan tes).

**Perbaikan:**
- Versi pertama memakai `<form action>` dan dropdown badge/kategori kembali kosong setelah error. Ditemukan lewat uji browser dan diperbaiki dengan submit manual.
- Harga 0 sebelumnya diterima; sekarang ditolak karena user story menyebut "angka positif".

## US-35 Ekspor produk ke CSV

**Prompt:**
Sebagai admin, saya ingin mengunduh daftar produk, supaya bisa dibuka di spreadsheet.

Bernilai 10 poin.

Kriteria selesai:

- Ada tombol "Ekspor CSV" yang mengunduh semua produk. (4 poin)
- CSV dibuat di server, kolom dan header jelas, dan karakter khusus (koma, kutip) aman. (3 poin)
- Endpoint memeriksa login: tanpa login ditolak. (3 poin)

**Hasil:**
- `app/admin/ekspor-csv/route.js` (baru): Route Handler `GET /admin/ekspor-csv`. Memeriksa login di server (tanpa login dibalas 401; `proxy.js` juga mengalihkan ke `/admin/login`). Mengambil semua produk bertahap 1000 baris (batas Supabase), tidak terpengaruh pencarian atau halaman, lalu mengirim file `produk-YYYY-MM-DD.csv`.
- Kolom: ID, Nama, Kategori, Harga, Harga Diskon, Stok, Badge, Status (Aktif/Nonaktif), Deskripsi, Link Foto, Dibuat.
- `lib/csv.js` (baru): sel berisi koma, kutip, atau baris baru dibungkus kutip dan kutip digandakan. Teks yang diawali `=`, `+`, `-`, `@` diberi awalan `'` supaya tidak dibaca sebagai rumus di spreadsheet. Baris dipisah CRLF, ada BOM UTF-8 supaya Excel membaca huruf non-ASCII dengan benar.
- `app/admin/page.jsx`: tombol "Ekspor CSV" di sebelah "Tambah produk" (tautan biasa `<a download>`, bukan `Link`, supaya tidak di-prefetch).

**Perbaikan:**
Tidak ada perbaikan.
