"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KUNCI_STORAGE = "favorit";
const FavoritContext = createContext(null);

function bacaStorage() {
  try {
    const data = JSON.parse(window.localStorage.getItem(KUNCI_STORAGE) || "[]");
    return Array.isArray(data) ? data.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

function tulisStorage(ids) {
  try {
    window.localStorage.setItem(KUNCI_STORAGE, JSON.stringify(ids));
  } catch {
    // Storage penuh atau diblokir: favorit tetap jalan selama halaman terbuka.
  }
}

export function FavoritProvider({ children }) {
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
      const berikut = prev.includes(angka) ? prev.filter((x) => x !== angka) : [...prev, angka];
      tulisStorage(berikut);
      return berikut;
    });
  }, []);

  const nilai = useMemo(
    () => ({ ids, siap, toggle, isFavorit: (id) => ids.includes(Number(id)) }),
    [ids, siap, toggle]
  );

  return <FavoritContext.Provider value={nilai}>{children}</FavoritContext.Provider>;
}

export function useFavorit() {
  const ctx = useContext(FavoritContext);
  if (!ctx) throw new Error("useFavorit harus dipakai di dalam FavoritProvider");
  return ctx;
}
