"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KUNCI_STORAGE = "bandingkan";
export const BATAS_BANDINGKAN = 2;
const BandingkanContext = createContext(null);

function bacaStorage() {
  try {
    const data = JSON.parse(window.localStorage.getItem(KUNCI_STORAGE) || "[]");
    return Array.isArray(data) ? data.filter(Number.isInteger).slice(-BATAS_BANDINGKAN) : [];
  } catch {
    return [];
  }
}

function tulisStorage(ids) {
  try {
    window.localStorage.setItem(KUNCI_STORAGE, JSON.stringify(ids));
  } catch {
    // Storage penuh atau diblokir: pilihan tetap jalan selama halaman terbuka.
  }
}

// Pilihan maksimal 2 produk. Memilih produk ketiga menggantikan pilihan yang paling lama.
export function BandingkanProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    setIds(bacaStorage());
    setSiap(true);
    const onStorage = (e) => {
      if (e.key === KUNCI_STORAGE) setIds(bacaStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((id) => {
    const angka = Number(id);
    setIds((prev) => {
      const berikut = prev.includes(angka)
        ? prev.filter((x) => x !== angka)
        : [...prev, angka].slice(-BATAS_BANDINGKAN);
      tulisStorage(berikut);
      return berikut;
    });
  }, []);

  const kosongkan = useCallback(() => {
    setIds([]);
    tulisStorage([]);
  }, []);

  const nilai = useMemo(
    () => ({ ids, siap, toggle, kosongkan, dipilih: (id) => ids.includes(Number(id)) }),
    [ids, siap, toggle, kosongkan]
  );

  return <BandingkanContext.Provider value={nilai}>{children}</BandingkanContext.Provider>;
}

export function useBandingkan() {
  const ctx = useContext(BandingkanContext);
  if (!ctx) throw new Error("useBandingkan harus dipakai di dalam BandingkanProvider");
  return ctx;
}
