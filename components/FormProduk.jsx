"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { generateDescriptionAction } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({
  produk = {},
  labelTombol,
  action,
  state,
  isPending,
  daftarKategori = [],
}) {
  // Semua isian dikontrol state agar bisa dibaca komponen ini (misalnya untuk deskripsi AI).
  const awal = (kunci) => (produk?.[kunci] ?? "").toString();
  const [nama, setNama] = useState(awal("nama"));
  const [harga, setHarga] = useState(awal("harga"));
  const [hargaDiskon, setHargaDiskon] = useState(awal("harga_diskon"));
  const [kategori, setKategori] = useState(awal("kategori"));
  const [badge, setBadge] = useState(awal("badge"));
  const [stok, setStok] = useState(awal("stok"));
  const [fotoUrl, setFotoUrl] = useState(awal("foto_url"));
  const [deskripsi, setDeskripsi] = useState(awal("deskripsi"));
  const errors = state?.errors || {};
  const [, startTransition] = useTransition();

  // Submit ditangani manual (bukan <form action>) karena React mereset seluruh form setelah action
  // selesai; reset itu mengembalikan <select> ke pilihan awal dan mengosongkan input file.
  // Dengan cara ini isian tetap ada saat server menolak data.
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => action(formData));
  }
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleBuatDeskripsiAi = async () => {
    setAiError(null);
    if (!nama.trim()) {
      setAiError("Nama produk wajib diisi terlebih dahulu untuk membuat deskripsi dengan AI.");
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await generateDescriptionAction({
        nama: nama.trim(),
        kategori: kategori.trim(),
      });

      if (res?.error) {
        setAiError(res.error);
      } else if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
      }
    } catch (err) {
      setAiError(err.message || "Terjadi kesalahan saat memanggil AI.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      noValidate
      className="flex max-w-xl flex-col gap-4"
    >
      {produk?.id && <input type="hidden" name="id" value={produk.id} />}
      {state?.error && (
        <p className="rounded-lg bg-bahaya/10 p-3 text-sm font-medium text-bahaya">
          {state.error}
        </p>
      )}
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        error={errors.nama}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="1"
        value={harga}
        onChange={(e) => setHarga(e.target.value)}
        error={errors.harga}
        required
      />
      <Input
        label="Harga diskon (Rp, opsional, harus lebih kecil dari harga)"
        name="harga_diskon"
        type="number"
        min="0"
        value={hargaDiskon}
        onChange={(e) => setHargaDiskon(e.target.value)}
        error={errors.harga_diskon}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="badge" className="text-sm font-semibold">
          Badge
        </label>
        <select
          id="badge"
          name="badge"
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          aria-invalid={errors.badge ? true : undefined}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
        >
          <option value="">Tanpa badge</option>
          <option value="Baru">Baru</option>
          <option value="Terlaris">Terlaris</option>
        </select>
        {errors.badge && (
          <span role="alert" className="text-sm font-medium text-bahaya">
            {errors.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="kategori" className="text-sm font-semibold">
          Kategori{" "}
          <Link href="/admin/kategori" className="font-normal text-utama underline underline-offset-2">
            (kelola kategori)
          </Link>
        </label>
        <select
          id="kategori"
          name="kategori"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
        >
          <option value="">Tanpa kategori</option>
          {daftarKategori.map((nama) => (
            <option key={nama} value={nama}>
              {nama}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="stok" className="text-sm font-semibold">
          Stok{" "}
          <span className="font-normal text-teks-lembut">
            (kosongkan jika tidak dilacak; isi 0 untuk menandai habis)
          </span>
        </label>
        <input
          id="stok"
          name="stok"
          type="number"
          min="0"
          value={stok}
          onChange={(e) => setStok(e.target.value)}
          aria-invalid={errors.stok ? true : undefined}
          placeholder="Contoh: 10 (kosong = tidak dilacak)"
          className={`w-full rounded-lg border bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none ${errors.stok ? "border-bahaya" : "border-garis"}`}
        />
        {errors.stok && (
          <span role="alert" className="text-sm font-medium text-bahaya">
            {errors.stok}
          </span>
        )}
      </div>
      <Input
        label="Upload foto produk (JPG, PNG, WebP, atau GIF, maksimal 2 MB; ditambahkan ke link di bawah)"
        name="foto_file"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        error={errors.foto_file}
      />
      <Input
        label="Link foto (pisahkan dengan koma untuk beberapa foto)"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        value={fotoUrl}
        onChange={(e) => setFotoUrl(e.target.value)}
        error={errors.foto_url}
      />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="deskripsi" className="text-sm font-semibold">
            Deskripsi
          </label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAi}
            disabled={isGeneratingAi}
            className="inline-flex items-center gap-1.5 rounded-md border border-garis bg-permukaan px-2.5 py-1 text-xs font-semibold text-utama transition-colors hover:border-utama hover:bg-latar disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGeneratingAi ? "Membuat deskripsi..." : "✨ Buat dengan AI"}
          </button>
        </div>
        {aiError && (
          <p className="rounded-md bg-bahaya/10 px-2.5 py-1.5 text-xs font-medium text-bahaya">
            {aiError}
          </p>
        )}
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Tulis deskripsi produk atau buat otomatis menggunakan AI di atas..."
          aria-invalid={errors.deskripsi ? true : undefined}
          className={`w-full rounded-lg border bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none ${errors.deskripsi ? "border-bahaya" : "border-garis"}`}
        />
        {errors.deskripsi && (
          <span role="alert" className="text-sm font-medium text-bahaya">
            {errors.deskripsi}
          </span>
        )}
      </div>
      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Memproses..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
