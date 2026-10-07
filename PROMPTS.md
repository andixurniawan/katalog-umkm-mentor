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



