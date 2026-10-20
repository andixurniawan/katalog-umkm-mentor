"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";
import { bacaDilihat } from "@/lib/terakhir-dilihat";

// Bagian di beranda. Tidak tampil sama sekali bila belum ada produk yang dibuka.
export default function TerakhirDilihat() {
  const [daftar, setDaftar] = useState([]);

  useEffect(() => {
    setDaftar(bacaDilihat());
  }, []);

  if (daftar.length === 0) return null;

  return (
    <section aria-labelledby="judul-dilihat" className="mb-10 flex flex-col gap-4">
      <h2 id="judul-dilihat" className="text-xl font-bold">
        Terakhir dilihat
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {daftar.slice(0, 4).map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </section>
  );
}
