"use client";

import { useState } from "react";
import { useKeranjang } from "@/components/KeranjangProvider";

// Dipakai di kartu (jumlah 1) dan halaman detail (jumlah dan varian dari pilihan pengunjung).
export default function TombolTambahKeranjang({
  produk,
  jumlah = 1,
  varian = "",
  className = "",
  ...props
}) {
  const { tambah } = useKeranjang();
  const [berhasil, setBerhasil] = useState(false);

  function handleClick() {
    tambah(produk, { jumlah, varian });
    setBerhasil(true);
    setTimeout(() => setBerhasil(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-lg border border-utama px-4 py-2.5 text-sm font-semibold text-utama transition-colors hover:bg-utama hover:text-kontras ${className}`}
      {...props}
    >
      <span aria-live="polite">{berhasil ? "Ditambahkan ✓" : "Tambah ke keranjang"}</span>
    </button>
  );
}
