# Skema Database

## Tabel `produk`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint | Nomor unik, dibuat otomatis |
| `nama` | text | Nama produk, wajib diisi |
| `harga` | integer | Harga dalam rupiah, tidak boleh negatif |
| `deskripsi` | text | Penjelasan produk |
| `foto_url` | text | Link gambar produk |
| `kategori` | text | Kelompok produk, misalnya "Camilan". Harus cocok dengan `kategori.nama` (foreign key, lihat di bawah) |
| `created_at` | timestamptz | Waktu dibuat, otomatis |

## Tabel `kategori`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint | Nomor unik, dibuat otomatis |
| `nama` | text | Nama kategori, unik (huruf besar/kecil dianggap sama), 1 sampai 50 karakter |
| `created_at` | timestamptz | Waktu dibuat, otomatis |

`produk.kategori` merujuk ke `kategori.nama`: mengubah nama kategori ikut mengubah produknya (`on update cascade`), dan kategori yang masih dipakai produk tidak bisa dihapus (`on delete restrict`).

## Aturan akses (RLS)

Row Level Security aktif di tabel `produk` dan `kategori` (aturannya sama).

| Siapa | Baca | Tambah | Ubah | Hapus |
| --- | --- | --- | --- | --- |
| Publik (tanpa login) | Ditolak | Ditolak | Ditolak | Ditolak |
| Admin yang login | Boleh | Boleh | Boleh | Boleh |

Pengunjung tetap bisa melihat katalog karena data dibaca oleh server memakai kunci rahasia, bukan langsung dari browser.

Skrip lengkap ada di `docs/schema.sql`.
