"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { useFavorit } from "@/components/FavoritProvider";
import { ambilProdukFavorit } from "@/app/favorit/actions";

export default function IsiFavorit() {
  const { ids, siap } = useFavorit();
  const [produk, setProduk] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data sekali per perubahan daftar id yang menambah produk baru. Penghapusan
  // difilter langsung di bawah supaya kartu hilang tanpa menunggu server.
  const kunciId = ids.join(",");
  useEffect(() => {
    if (!siap) return;
    let batal = false;
    setMemuat(true);
    ambilProdukFavorit(ids).then((res) => {
      if (batal) return;
      if (res.error) setError(res.error);
      else {
        setError(null);
        setProduk(res.produk);
      }
      setMemuat(false);
    });
    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siap, kunciId]);

  if (!siap || memuat) {
    return <p className="py-8 text-teks-lembut">Memuat favorit...</p>;
  }

  if (error) {
    return <p className="py-8 text-bahaya">{error}</p>;
  }

  const tampil = produk.filter((p) => ids.includes(p.id));

  if (tampil.length === 0) {
    return (
      <div className="rounded-xl border border-garis bg-permukaan/30 py-12 text-center">
        <p className="text-base font-semibold">Belum ada produk favorit</p>
        <p className="mt-1 text-sm text-teks-lembut">
          Tekan ikon hati pada produk untuk menyimpannya di sini.
        </p>
        <div className="mt-4">
          <Tombol href="/" varian="garis">
            Lihat katalog
          </Tombol>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {tampil.map((item) => (
        <KartuProduk key={item.id} produk={item} />
      ))}
    </div>
  );
}
