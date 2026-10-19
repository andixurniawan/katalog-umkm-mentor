"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { generateDescriptionAction } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action, state, isPending }) {
  const [nama, setNama] = useState(produk?.nama || "");
  const [kategori, setKategori] = useState(produk?.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk?.deskripsi || "");
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
    <form action={action} encType="multipart/form-data" className="flex max-w-xl flex-col gap-4">
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
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
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
          defaultValue={produk.stok ?? ""}
          placeholder="Contoh: 10 (kosong = tidak dilacak)"
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>
      <Input
        label="Upload foto produk (disimpan ke Supabase Storage)"
        name="foto_file"
        type="file"
        accept="image/*"
      />
      <Input
        label="Atau link/URL foto (opsional jika tidak upload file)"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
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
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
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
