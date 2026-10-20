"use client";

import { createContext, useContext } from "react";

// Membagikan data toko dari server ke komponen client (tombol WhatsApp, keranjang).
const TokoContext = createContext(null);

export function TokoProvider({ toko, children }) {
  return <TokoContext.Provider value={toko}>{children}</TokoContext.Provider>;
}

export function useToko() {
  const ctx = useContext(TokoContext);
  if (!ctx) throw new Error("useToko harus dipakai di dalam TokoProvider");
  return ctx;
}
