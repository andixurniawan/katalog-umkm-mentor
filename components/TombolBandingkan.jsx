"use client";

import { useBandingkan, BATAS_BANDINGKAN } from "@/components/BandingkanProvider";

export default function TombolBandingkan({ produk, className = "" }) {
  const { dipilih, toggle, ids, siap } = useBandingkan();
  const aktif = siap && dipilih(produk.id);
  const akanMenggantikan = siap && !aktif && ids.length >= BATAS_BANDINGKAN;

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => toggle(produk.id)}
        aria-pressed={aktif}
        className={`inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
          aktif
            ? "border-utama bg-utama text-kontras"
            : "border-garis bg-latar hover:border-utama hover:text-utama"
        } ${className}`}
      >
        {aktif ? "Dipilih untuk dibandingkan ✓" : "Bandingkan"}
      </button>
      {akanMenggantikan && (
        <p className="text-xs text-teks-lembut">
          Maksimal {BATAS_BANDINGKAN} produk. Memilih ini menggantikan pilihan yang paling lama.
        </p>
      )}
    </div>
  );
}
