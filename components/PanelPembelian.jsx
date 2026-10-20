"use client";

import { useState } from "react";
import HargaProduk from "@/components/HargaProduk";
import TombolWhatsApp from "@/components/TombolWhatsApp";

// Harga, deskripsi (children dari server), dan kotak pesan dalam satu state supaya harga
// di bagian atas berubah mengikuti varian yang dipilih (US-48).
export default function PanelPembelian({ produk, daftarVarian, children }) {
  const [varianId, setVarianId] = useState(daftarVarian[0]?.id ?? null);
  const varian = daftarVarian.find((v) => v.id === varianId);
  const produkTampil = varian ? { ...produk, harga: varian.harga, harga_diskon: null } : produk;

  return (
    <>
      <HargaProduk produk={produkTampil} besar />
      {children}
      <TombolWhatsApp produk={produk} daftarVarian={daftarVarian} varianId={varianId} onPilihVarian={setVarianId} />
    </>
  );
}
