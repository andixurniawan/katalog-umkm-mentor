"use client";

import { useActionState } from "react";
import { geserProdukAction } from "@/app/admin/actions";

// Panah naik/turun untuk mengatur urutan produk di katalog.
export default function TombolUrutan({ produk, bisaNaik, bisaTurun }) {
  const [state, formAction, isPending] = useActionState(geserProdukAction, null);

  const tombol = (arah, label, simbol, aktif) => (
    <button
      type="submit"
      name="arah"
      value={arah}
      disabled={!aktif || isPending}
      aria-label={`${label}: ${produk.nama}`}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-garis bg-latar text-sm font-bold hover:border-utama hover:text-utama disabled:cursor-not-allowed disabled:opacity-30"
    >
      {simbol}
    </button>
  );

  return (
    <form action={formAction} className="flex flex-col items-start gap-1">
      <input type="hidden" name="id" value={produk.id} />
      <div className="flex gap-1">
        {tombol("naik", "Naikkan urutan", "↑", bisaNaik)}
        {tombol("turun", "Turunkan urutan", "↓", bisaTurun)}
      </div>
      {state?.error && (
        <span role="alert" className="max-w-40 text-xs text-bahaya">
          {state.error}
        </span>
      )}
    </form>
  );
}
