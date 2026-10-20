"use client";

import { useEffect } from "react";

// Mendaftarkan service worker (public/sw.js) agar katalog bisa dipasang ke layar utama (US-13).
// Hanya di produksi supaya cache tidak mengganggu `next dev`.
export default function DaftarkanSw() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch((e) => console.error("Gagal mendaftarkan service worker:", e));
  }, []);

  return null;
}
