"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ekstrakDaftarFoto } from "@/components/GaleriFoto";
import { hargaAktif } from "@/lib/format";

const KUNCI_STORAGE = "keranjang";
const KeranjangContext = createContext(null);

function bacaStorage() {
  try {
    const mentah = window.localStorage.getItem(KUNCI_STORAGE);
    const data = mentah ? JSON.parse(mentah) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function tulisStorage(items) {
  try {
    window.localStorage.setItem(KUNCI_STORAGE, JSON.stringify(items));
  } catch {
    // Storage penuh atau diblokir: keranjang tetap jalan selama halaman terbuka.
  }
}

// Jumlah tidak boleh melebihi stok jika stok dilacak.
function batasiJumlah(jumlah, stok) {
  const angka = Math.max(1, Math.floor(Number(jumlah) || 1));
  return stok != null ? Math.min(angka, Math.max(1, stok)) : angka;
}

export function KeranjangProvider({ children }) {
  const [items, setItems] = useState([]);
  const [siap, setSiap] = useState(false);

  // Muat dari browser setelah mount, dan ikuti perubahan dari tab lain.
  useEffect(() => {
    setItems(bacaStorage());
    setSiap(true);
    const onStorage = (e) => {
      if (e.key === KUNCI_STORAGE) setItems(bacaStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const ubah = useCallback((fn) => {
    setItems((prev) => {
      const berikut = fn(prev);
      tulisStorage(berikut);
      return berikut;
    });
  }, []);

  const tambah = useCallback(
    (produk, { jumlah = 1, varian = "" } = {}) => {
      const namaVarian = varian.trim();
      const key = `${produk.id}|${namaVarian}`;
      ubah((prev) => {
        const ada = prev.find((item) => item.key === key);
        if (ada) {
          return prev.map((item) =>
            item.key === key
              ? { ...item, jumlah: batasiJumlah(item.jumlah + jumlah, item.stok) }
              : item
          );
        }
        return [
          ...prev,
          {
            key,
            id: produk.id,
            nama: produk.nama,
            harga: hargaAktif(produk),
            foto: ekstrakDaftarFoto(produk.foto_url)[0] || "/placeholder.svg",
            varian: namaVarian,
            stok: produk.stok ?? null,
            jumlah: batasiJumlah(jumlah, produk.stok ?? null),
          },
        ];
      });
    },
    [ubah]
  );

  const setJumlah = useCallback(
    (key, jumlah) =>
      ubah((prev) =>
        prev.map((item) =>
          item.key === key ? { ...item, jumlah: batasiJumlah(jumlah, item.stok) } : item
        )
      ),
    [ubah]
  );

  const hapus = useCallback(
    (key) => ubah((prev) => prev.filter((item) => item.key !== key)),
    [ubah]
  );

  const kosongkan = useCallback(() => ubah(() => []), [ubah]);

  const nilai = useMemo(() => {
    const totalItem = items.reduce((jumlah, item) => jumlah + item.jumlah, 0);
    const totalHarga = items.reduce((jumlah, item) => jumlah + item.harga * item.jumlah, 0);
    return { items, siap, totalItem, totalHarga, tambah, setJumlah, hapus, kosongkan };
  }, [items, siap, tambah, setJumlah, hapus, kosongkan]);

  return <KeranjangContext.Provider value={nilai}>{children}</KeranjangContext.Provider>;
}

export function useKeranjang() {
  const ctx = useContext(KeranjangContext);
  if (!ctx) throw new Error("useKeranjang harus dipakai di dalam KeranjangProvider");
  return ctx;
}
