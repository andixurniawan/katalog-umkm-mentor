-- Skema database Katalog UMKM
-- Cara pakai: Supabase > SQL Editor > New query > tempel seluruh isi file ini > Run.
-- Aman dijalankan ulang.

-- 1. Tabel produk
create table if not exists public.produk (
  id bigint generated always as identity primary key,
  nama text not null,
  harga integer not null check (harga >= 0),
  deskripsi text,
  foto_url text,
  kategori text,
  created_at timestamptz not null default now()
);

-- 2. Row Level Security
-- Tidak ada izin untuk publik: akses langsung ke tabel dari luar aplikasi ditolak.
-- Hanya admin yang sudah login yang boleh membaca dan mengubah data.
alter table public.produk enable row level security;

drop policy if exists "admin_baca_produk" on public.produk;
drop policy if exists "admin_tambah_produk" on public.produk;
drop policy if exists "admin_ubah_produk" on public.produk;
drop policy if exists "admin_hapus_produk" on public.produk;

create policy "admin_baca_produk" on public.produk
  for select to authenticated using (true);

create policy "admin_tambah_produk" on public.produk
  for insert to authenticated with check (true);

create policy "admin_ubah_produk" on public.produk
  for update to authenticated using (true) with check (true);

create policy "admin_hapus_produk" on public.produk
  for delete to authenticated using (true);

-- 3. Data produk awal (hanya diisi jika tabel masih kosong)
insert into public.produk (nama, harga, deskripsi, foto_url, kategori)
select * from (values
  ('Kopi Bubuk Robusta 250 g', 45000, 'Biji robusta disangrai sedang lalu digiling halus. Cocok untuk kopi tubruk dan kopi susu.', '/produk/kopi.svg', 'Minuman'),
  ('Keripik Singkong Balado', 15000, 'Singkong iris tipis, digoreng renyah, dibalut bumbu balado pedas manis.', '/produk/keripik.svg', 'Camilan'),
  ('Sambal Bawang Botol 150 ml', 25000, 'Cabai rawit dan bawang putih goreng dengan minyak, tahan hingga 2 bulan.', '/produk/sambal.svg', 'Bumbu'),
  ('Kue Nastar Toples 500 g', 85000, 'Nastar lembut dengan selai nanas buatan sendiri. Dikemas toples kedap udara.', '/produk/nastar.svg', 'Kue kering'),
  ('Tas Anyaman Pandan', 120000, 'Dianyam tangan dari daun pandan kering, dilapisi kain di bagian dalam.', '/produk/tas.svg', 'Kerajinan'),
  ('Kain Batik Cap 2 m', 175000, 'Batik cap motif parang di atas kain katun primisima, panjang 2 meter.', '/produk/batik.svg', 'Kain')
) as data_awal (nama, harga, deskripsi, foto_url, kategori)
where not exists (select 1 from public.produk);

-- 4. Data tambahan untuk menguji paginasi, urutan, filter, dan pencarian (54 produk).
--    Bersama data awal jadi 60 produk, 10 per kategori, dengan harga dan waktu dibuat berbeda.
--    Hanya diisi sekali; kalau tidak dibutuhkan, hapus dengan:
--    delete from public.produk where deskripsi like 'Contoh untuk uji paginasi%';
with kategori (urut, kategori, foto_url, harga_dasar, langkah, daftar) as (values
  (1, 'Minuman', '/produk/kopi.svg', 20000, 4000, array[
    'Kopi Arabika Gayo 250 g', 'Kopi Luwak Liar 100 g', 'Teh Melati Tubruk 100 g',
    'Wedang Uwuh Isi 10', 'Jahe Merah Instan 250 g', 'Kopi Susu Gula Aren 250 ml',
    'Teh Rosella Kering 50 g', 'Bajigur Instan Isi 5', 'Cokelat Bubuk Murni 200 g']),
  (2, 'Camilan', '/produk/keripik.svg', 10000, 1500, array[
    'Keripik Tempe Original', 'Keripik Pisang Cokelat', 'Rempeyek Kacang 250 g',
    'Basreng Pedas Daun Jeruk', 'Makaroni Bantat Pedas', 'Kerupuk Kulit Sapi 100 g',
    'Emping Melinjo Manis', 'Keripik Kentang Balado', 'Kacang Telur 250 g']),
  (3, 'Bumbu', '/produk/sambal.svg', 18000, 2500, array[
    'Sambal Cumi Asin 150 ml', 'Sambal Teri Medan 150 ml', 'Bumbu Rendang Instan',
    'Bumbu Pecel Kacang 250 g', 'Sambal Matah Botol 150 ml', 'Petis Udang 200 g',
    'Bumbu Rawon Instan', 'Saus Kacang Sate 250 g', 'Terasi Udang Bakar 100 g']),
  (4, 'Kue kering', '/produk/nastar.svg', 60000, 5000, array[
    'Kastengel Keju Toples 500 g', 'Putri Salju Toples 500 g', 'Lidah Kucing Toples 400 g',
    'Kue Semprit Toples 500 g', 'Sagu Keju Toples 400 g', 'Kue Kacang Toples 500 g',
    'Choco Chip Cookies 400 g', 'Bolu Kering Jadul 300 g', 'Kue Bawang 250 g']),
  (5, 'Kerajinan', '/produk/tas.svg', 35000, 15000, array[
    'Dompet Anyaman Rotan', 'Topi Pandan Pantai', 'Keranjang Bambu Serbaguna',
    'Tatakan Gelas Eceng Gondok Isi 6', 'Gantungan Kunci Kayu Ukir', 'Tas Rajut Benang Katun',
    'Vas Bunga Gerabah', 'Sandal Anyaman Mendong', 'Kotak Tisu Kayu Jati']),
  (6, 'Kain', '/produk/batik.svg', 150000, 25000, array[
    'Kain Batik Tulis Lasem 2 m', 'Sarung Tenun Samarinda', 'Kain Tenun Ikat NTT 2 m',
    'Selendang Songket Palembang', 'Kain Lurik Klaten 2 m', 'Batik Kawung Katun 2 m',
    'Kain Jumputan Palembang 2 m', 'Syal Batik Sutra', 'Kain Sasirangan Banjar 2 m'])
)
insert into public.produk (nama, harga, deskripsi, foto_url, kategori, created_at)
select
  p.nama,
  k.harga_dasar + p.ke * k.langkah,
  format('Contoh untuk uji paginasi, urutan, dan pencarian. Produk %s nomor %s.', lower(k.kategori), p.ke),
  k.foto_url,
  k.kategori,
  now() - make_interval(hours => ((k.urut - 1) * 9 + p.ke)::int)
from kategori k
cross join lateral unnest(k.daftar) with ordinality as p (nama, ke)
where not exists (select 1 from public.produk where deskripsi like 'Contoh untuk uji paginasi%');

-- 5. Kolom stok untuk US-19 (Status stok)
-- Jalankan ini jika kolom stok belum ada di tabel produk.
-- NULL berarti stok tidak dilacak; 0 berarti habis; angka positif berarti tersedia.
alter table public.produk
  add column if not exists stok integer default null check (stok is null or stok >= 0);
-- 6. Harga diskon dan badge untuk US-20 (Harga coret dan badge)
-- Jalankan ini jika kolom belum ada di tabel produk.
-- harga_diskon NULL berarti tidak ada diskon; jika terisi harus lebih kecil dari harga.
-- badge NULL berarti tanpa label; nilai yang diizinkan: 'Baru' atau 'Terlaris'.
alter table public.produk
  add column if not exists harga_diskon integer default null check (harga_diskon is null or harga_diskon >= 0);
alter table public.produk
  add column if not exists badge text default null;
alter table public.produk drop constraint if exists produk_badge_check;
alter table public.produk
  add constraint produk_badge_check check (badge is null or badge in ('Baru', 'Terlaris'));

-- 7. Bucket Storage untuk foto produk (US-29)
-- Bucket publik supaya foto bisa tampil di katalog. Unggahan hanya lewat server
-- (SUPABASE_SECRET_KEY), jadi tidak ada policy tulis untuk publik.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product', 'product', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 8. Tabel kategori (US-31 Kelola kategori)
-- Kolom produk.kategori tetap bernama "kategori" (teks), tetapi sekarang harus cocok dengan
-- kategori.nama lewat foreign key:
--   on update cascade  -> mengubah nama kategori otomatis mengubah semua produknya
--   on delete restrict -> kategori yang masih dipakai produk tidak bisa dihapus
create table if not exists public.kategori (
  id bigint generated always as identity primary key,
  nama text not null unique check (char_length(btrim(nama)) between 1 and 50),
  created_at timestamptz not null default now()
);

-- Nama kategori tidak boleh kembar walau beda huruf besar/kecil ("Kain" dan "kain").
create unique index if not exists kategori_nama_lower_unik on public.kategori (lower(nama));

alter table public.kategori enable row level security;

drop policy if exists "admin_baca_kategori" on public.kategori;
drop policy if exists "admin_tambah_kategori" on public.kategori;
drop policy if exists "admin_ubah_kategori" on public.kategori;
drop policy if exists "admin_hapus_kategori" on public.kategori;

create policy "admin_baca_kategori" on public.kategori
  for select to authenticated using (true);
create policy "admin_tambah_kategori" on public.kategori
  for insert to authenticated with check (true);
create policy "admin_ubah_kategori" on public.kategori
  for update to authenticated using (true) with check (true);
create policy "admin_hapus_kategori" on public.kategori
  for delete to authenticated using (true);

-- Migrasi data lama: rapikan spasi, isi tabel kategori dari kategori yang sudah dipakai produk,
-- lalu samakan huruf besar/kecil dengan nama kategori yang tersimpan.
update public.produk
  set kategori = nullif(btrim(kategori), '')
  where kategori is distinct from nullif(btrim(kategori), '');

insert into public.kategori (nama)
  select distinct kategori from public.produk where kategori is not null
  order by kategori
  on conflict do nothing;

update public.produk p
  set kategori = k.nama
  from public.kategori k
  where lower(p.kategori) = lower(k.nama) and p.kategori <> k.nama;

alter table public.produk drop constraint if exists produk_kategori_fkey;
alter table public.produk
  add constraint produk_kategori_fkey
  foreign key (kategori) references public.kategori (nama)
  on update cascade on delete restrict;

-- 9. Status aktif produk (US-32 Aktif atau nonaktifkan produk)
-- true = tampil di katalog publik; false = disembunyikan (data tetap ada).
alter table public.produk
  add column if not exists aktif boolean not null default true;

-- 10. Ulasan dan rating produk (US-38, US-39)
-- Pengunjung mengirim ulasan lewat Server Action (memakai SUPABASE_SECRET_KEY), jadi tidak ada
-- policy tulis untuk publik. Admin yang login boleh membaca, menyembunyikan, dan menghapus.
create table if not exists public.ulasan (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk (id) on delete cascade,
  nama text not null check (char_length(btrim(nama)) between 1 and 50),
  rating smallint not null check (rating between 1 and 5),
  komentar text not null check (char_length(btrim(komentar)) between 1 and 500),
  tampil boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists ulasan_produk_idx on public.ulasan (produk_id, created_at desc);

alter table public.ulasan enable row level security;

drop policy if exists "admin_baca_ulasan" on public.ulasan;
drop policy if exists "admin_ubah_ulasan" on public.ulasan;
drop policy if exists "admin_hapus_ulasan" on public.ulasan;

create policy "admin_baca_ulasan" on public.ulasan
  for select to authenticated using (true);
create policy "admin_ubah_ulasan" on public.ulasan
  for update to authenticated using (true) with check (true);
create policy "admin_hapus_ulasan" on public.ulasan
  for delete to authenticated using (true);

-- 11. Pencatatan klik pesan WhatsApp (US-40, US-41)
-- Hanya menyimpan produk dan waktu klik, tanpa data pribadi pengunjung (tanpa IP, nama, atau nomor).
-- Pencatatan lewat Server Action (SUPABASE_SECRET_KEY), jadi tidak ada policy tulis untuk publik.
create table if not exists public.klik_whatsapp (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists klik_whatsapp_produk_idx on public.klik_whatsapp (produk_id);

alter table public.klik_whatsapp enable row level security;

drop policy if exists "admin_baca_klik_whatsapp" on public.klik_whatsapp;
create policy "admin_baca_klik_whatsapp" on public.klik_whatsapp
  for select to authenticated using (true);

-- Jumlah klik per produk untuk dashboard admin. security_invoker: RLS tabel di atas tetap berlaku.
create or replace view public.klik_whatsapp_per_produk
  with (security_invoker = true) as
  select produk_id, count(*)::int as jumlah
  from public.klik_whatsapp
  group by produk_id;

-- 12. Banner promo di beranda (US-42)
-- Pengunjung membaca banner aktif lewat server (SUPABASE_SECRET_KEY); admin yang login mengelola.
create table if not exists public.banner (
  id bigint generated always as identity primary key,
  judul text not null check (char_length(btrim(judul)) between 1 and 100),
  teks text check (teks is null or char_length(teks) <= 300),
  gambar_url text,
  tautan text,
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.banner enable row level security;

drop policy if exists "admin_baca_banner" on public.banner;
drop policy if exists "admin_tambah_banner" on public.banner;
drop policy if exists "admin_ubah_banner" on public.banner;
drop policy if exists "admin_hapus_banner" on public.banner;

create policy "admin_baca_banner" on public.banner
  for select to authenticated using (true);
create policy "admin_tambah_banner" on public.banner
  for insert to authenticated with check (true);
create policy "admin_ubah_banner" on public.banner
  for update to authenticated using (true) with check (true);
create policy "admin_hapus_banner" on public.banner
  for delete to authenticated using (true);

-- 13. Pengaturan toko (US-43)
-- Satu baris saja (id = 1). Dibaca lewat server (SUPABASE_SECRET_KEY); admin yang login boleh mengubah.
-- Jika baris belum ada, aplikasi memakai nilai cadangan di lib/toko.js.
create table if not exists public.pengaturan_toko (
  id smallint primary key default 1 check (id = 1),
  nama text not null check (char_length(btrim(nama)) between 1 and 60),
  nomor_whatsapp text not null check (nomor_whatsapp ~ '^62[0-9]{8,13}$'),
  jam_buka text check (jam_buka is null or char_length(jam_buka) <= 100),
  alamat text check (alamat is null or char_length(alamat) <= 300),
  updated_at timestamptz not null default now()
);

alter table public.pengaturan_toko enable row level security;

drop policy if exists "admin_baca_pengaturan_toko" on public.pengaturan_toko;
drop policy if exists "admin_tambah_pengaturan_toko" on public.pengaturan_toko;
drop policy if exists "admin_ubah_pengaturan_toko" on public.pengaturan_toko;

create policy "admin_baca_pengaturan_toko" on public.pengaturan_toko
  for select to authenticated using (true);
create policy "admin_tambah_pengaturan_toko" on public.pengaturan_toko
  for insert to authenticated with check (true);
create policy "admin_ubah_pengaturan_toko" on public.pengaturan_toko
  for update to authenticated using (true) with check (true);

-- 14. Log aktivitas admin (US-45)
-- Dicatat dari server memakai sesi admin yang login. Hanya boleh ditambah dan dibaca (tanpa ubah/hapus).
create table if not exists public.log_aktivitas (
  id bigint generated always as identity primary key,
  admin_email text not null,
  aksi text not null,
  target text,
  created_at timestamptz not null default now()
);

create index if not exists log_aktivitas_waktu_idx on public.log_aktivitas (created_at desc);

alter table public.log_aktivitas enable row level security;

drop policy if exists "admin_baca_log" on public.log_aktivitas;
drop policy if exists "admin_tambah_log" on public.log_aktivitas;

create policy "admin_baca_log" on public.log_aktivitas
  for select to authenticated using (true);
create policy "admin_tambah_log" on public.log_aktivitas
  for insert to authenticated with check (true);

-- 15. Urutan tampil produk (US-47)
-- Angka lebih kecil tampil lebih dulu di katalog. Produk lama diurutkan sesuai id,
-- produk baru otomatis ditaruh paling akhir lewat sequence.
create sequence if not exists public.produk_urutan_seq;

alter table public.produk add column if not exists urutan bigint;
update public.produk set urutan = id where urutan is null;

select setval('public.produk_urutan_seq', greatest((select coalesce(max(urutan), 0) from public.produk), 1));

alter table public.produk alter column urutan set default nextval('public.produk_urutan_seq');
alter table public.produk alter column urutan set not null;

grant usage, select on sequence public.produk_urutan_seq to authenticated, service_role;

create index if not exists produk_urutan_idx on public.produk (urutan, id);
