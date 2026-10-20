"use client";

import { useState } from "react";
import { ekstrakDaftarFoto } from "@/lib/foto";

export default function GaleriFoto({ fotoUrl, nama }) {
  const daftarFoto = ekstrakDaftarFoto(fotoUrl);
  const [indeksAktif, setIndeksAktif] = useState(0);

  const fotoUtama =
    daftarFoto[indeksAktif] || daftarFoto[0] || "/placeholder.svg";

  return (
    <div className="flex flex-col gap-3">
      {/* Foto Utama */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-garis bg-permukaan">
        <img
          src={fotoUtama}
          alt={nama ? `${nama} - Foto ${indeksAktif + 1}` : "Foto produk"}
          className="h-full w-full object-cover transition-all duration-200"
        />
      </div>

      {/* Gambar Kecil / Thumbnail (hanya tampil jika produk memiliki lebih dari 1 foto) */}
      {daftarFoto.length > 1 && (
        <div
          role="tablist"
          aria-label="Daftar foto produk"
          className="flex flex-wrap gap-2.5 overflow-x-auto pb-1"
        >
          {daftarFoto.map((foto, idx) => {
            const isAktif = idx === indeksAktif;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={isAktif}
                aria-label={`Lihat foto ${idx + 1}`}
                onClick={() => setIndeksAktif(idx)}
                className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                  isAktif
                    ? "border-utama ring-2 ring-utama/20"
                    : "border-garis opacity-70 hover:border-utama/50 hover:opacity-100"
                }`}
              >
                <img
                  src={foto}
                  alt={`${nama || "Produk"} thumbnail ${idx + 1}`}
                  className="h-full w-full bg-permukaan object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

