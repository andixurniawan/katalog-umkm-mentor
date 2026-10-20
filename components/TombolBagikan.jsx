"use client";

import { useState } from "react";

// Bagikan lewat Web Share API jika ada (umumnya di HP), kalau tidak salin link ke clipboard.
export default function TombolBagikan({ nama }) {
  const [pesan, setPesan] = useState("");

  function tampilkanPesan(teks) {
    setPesan(teks);
    setTimeout(() => setPesan(""), 2000);
  }

  async function salinLink(url) {
    try {
      await navigator.clipboard.writeText(url);
      tampilkanPesan("Link tersalin");
    } catch {
      // Fallback untuk browser lama atau konteks tanpa izin clipboard.
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const berhasil = document.execCommand("copy");
      document.body.removeChild(input);
      tampilkanPesan(berhasil ? "Link tersalin" : "Gagal menyalin link");
    }
  }

  async function handleClick() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: nama, text: `Lihat ${nama}`, url });
        return;
      } catch (err) {
        // Pengunjung menutup dialog bagikan: tidak perlu pesan atau fallback.
        if (err?.name === "AbortError") return;
      }
    }
    await salinLink(url);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
      >
        Bagikan / salin link
      </button>
      <span role="status" aria-live="polite" className="text-sm font-semibold text-utama">
        {pesan}
      </span>
    </div>
  );
}
