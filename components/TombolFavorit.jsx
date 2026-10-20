"use client";

import { useFavorit } from "@/components/FavoritProvider";

// Ikon hati. Dipakai di kartu (bulat, menimpa foto) dan halaman detail (dengan teks).
export default function TombolFavorit({ produk, denganTeks = false, className = "" }) {
  const { isFavorit, toggle } = useFavorit();
  const aktif = isFavorit(produk.id);
  const label = aktif ? `Hapus ${produk.nama} dari favorit` : `Tambah ${produk.nama} ke favorit`;

  return (
    <button
      type="button"
      onClick={() => toggle(produk.id)}
      aria-pressed={aktif}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-2 transition-colors ${
        denganTeks
          ? "rounded-lg border border-garis bg-latar px-4 py-2 text-sm font-semibold hover:border-utama"
          : "h-9 w-9 rounded-full bg-latar/90 shadow hover:bg-latar"
      } ${aktif ? "text-bahaya" : "text-teks-lembut hover:text-bahaya"} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill={aktif ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {denganTeks && <span>{aktif ? "Favorit" : "Tambah ke favorit"}</span>}
    </button>
  );
}
