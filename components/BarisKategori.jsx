"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import { renameCategoryAction, deleteCategoryAction } from "@/app/admin/actions";

export default function BarisKategori({ kategori, jumlahProduk }) {
  const [stateUbah, ubahAction, sedangUbah] = useActionState(renameCategoryAction, null);
  const [stateHapus, hapusAction, sedangHapus] = useActionState(deleteCategoryAction, null);

  const error = stateUbah?.error || stateHapus?.error;

  return (
    <li className="flex flex-col gap-2 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form action={ubahAction} className="flex flex-1 items-center gap-2">
          <input type="hidden" name="id" value={kategori.id} />
          <label htmlFor={`kategori-${kategori.id}`} className="sr-only">
            Nama kategori
          </label>
          <input
            id={`kategori-${kategori.id}`}
            name="nama"
            defaultValue={kategori.nama}
            maxLength={50}
            required
            className="min-w-0 flex-1 rounded-lg border border-garis bg-latar px-3 py-2 text-base text-teks focus:border-utama focus:outline-none"
          />
          <Tombol type="submit" varian="garis" disabled={sedangUbah}>
            {sedangUbah ? "Menyimpan..." : "Simpan"}
          </Tombol>
        </form>
        <p className="text-sm text-teks-lembut sm:w-24 sm:text-right">{jumlahProduk} produk</p>
        <form
          action={hapusAction}
          onSubmit={(e) => {
            if (!confirm(`Hapus kategori "${kategori.nama}"?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={kategori.id} />
          <Tombol type="submit" varian="bahaya" disabled={sedangHapus}>
            Hapus
          </Tombol>
        </form>
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-bahaya">
          {error}
        </p>
      )}
      {!error && stateUbah?.success && (
        <p role="status" className="text-sm font-medium text-utama">
          {stateUbah.success}
        </p>
      )}
    </li>
  );
}
