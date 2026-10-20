"use client";

import { useEffect, useState } from "react";

const KUNCI_STORAGE = "tema";

// Tema awal dipasang oleh skrip di <head> (lihat app/layout.jsx) supaya tidak berkedip.
export default function TombolTema() {
  const [tema, setTema] = useState(null);

  useEffect(() => {
    setTema(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function ganti() {
    const berikut = tema === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = berikut;
    setTema(berikut);
    try {
      window.localStorage.setItem(KUNCI_STORAGE, berikut);
    } catch {
      // Storage diblokir: pilihan hanya berlaku selama halaman terbuka.
    }
  }

  const gelap = tema === "dark";

  return (
    <button
      type="button"
      onClick={ganti}
      aria-pressed={gelap}
      aria-label={gelap ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      title={gelap ? "Mode terang" : "Mode gelap"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-garis text-teks hover:border-utama hover:text-utama"
    >
      {/* Ikon baru tampil setelah mount agar sama dengan HTML dari server */}
      {tema && (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {gelap ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </>
          ) : (
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          )}
        </svg>
      )}
    </button>
  );
}
