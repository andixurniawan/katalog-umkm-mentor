"use client";

import { useKeranjang } from "@/components/KeranjangProvider";
import Tombol from "@/components/Tombol";
import { catatKlikWhatsAppAction } from "@/app/produk/[id]/catat-klik";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

function buatPesan(items, totalHarga) {
  const baris = items.map((item, i) => {
    const varian = item.varian ? ` (varian: ${item.varian})` : "";
    return `${i + 1}. ${item.nama}${varian} x${item.jumlah} @ ${formatRupiah(item.harga)} = ${formatRupiah(item.harga * item.jumlah)}`;
  });
  return `Halo, saya mau pesan:\n${baris.join("\n")}\n\nTotal: ${formatRupiah(totalHarga)}`;
}

export default function IsiKeranjang() {
  const { items, siap, totalHarga, setJumlah, hapus, kosongkan } = useKeranjang();

  if (!siap) {
    return <p className="py-8 text-teks-lembut">Memuat keranjang...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-garis bg-permukaan/30 py-12 text-center">
        <p className="text-base font-semibold">Keranjang masih kosong</p>
        <p className="mt-1 text-sm text-teks-lembut">Tambahkan produk dari katalog dulu.</p>
        <div className="mt-4">
          <Tombol href="/" varian="garis">
            Lihat katalog
          </Tombol>
        </div>
      </div>
    );
  }

  const linkWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(buatPesan(items, totalHarga))}`;

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col divide-y divide-garis rounded-xl border border-garis">
        {items.map((item) => (
          <li key={item.key} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
            <img
              src={item.foto}
              alt={item.nama}
              className="h-20 w-20 flex-shrink-0 rounded-lg bg-permukaan object-cover"
            />
            <div className="flex flex-1 flex-col gap-2">
              <div>
                <p className="font-semibold leading-snug">{item.nama}</p>
                {item.varian && (
                  <p className="text-xs text-teks-lembut">Varian: {item.varian}</p>
                )}
                <p className="text-sm text-teks-lembut">{formatRupiah(item.harga)}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label={`Kurangi jumlah ${item.nama}`}
                    onClick={() => setJumlah(item.key, item.jumlah - 1)}
                    disabled={item.jumlah <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar font-bold hover:border-utama hover:text-utama disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
                    {item.jumlah}
                  </span>
                  <button
                    type="button"
                    aria-label={`Tambah jumlah ${item.nama}`}
                    onClick={() => setJumlah(item.key, item.jumlah + 1)}
                    disabled={item.stok != null && item.jumlah >= item.stok}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar font-bold hover:border-utama hover:text-utama disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <p className="font-bold text-harga">{formatRupiah(item.harga * item.jumlah)}</p>
                <button
                  type="button"
                  onClick={() => hapus(item.key)}
                  className="text-sm font-semibold text-bahaya hover:underline"
                >
                  Hapus
                </button>
              </div>
              {item.stok != null && item.jumlah >= item.stok && (
                <p className="text-xs text-teks-lembut">Stok tersedia: {item.stok}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 rounded-xl border border-garis bg-permukaan/30 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-extrabold text-harga">{formatRupiah(totalHarga)}</span>
        </div>
        <a
          href={linkWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          // Satu klik dicatat per produk berbeda di keranjang; tidak ditunggu supaya WhatsApp tetap terbuka.
          onClick={() => {
            for (const id of new Set(items.map((item) => item.id))) {
              catatKlikWhatsAppAction(id).catch(() => {});
            }
          }}
          className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-kontras transition-colors hover:bg-utama-gelap"
        >
          Pesan semua via WhatsApp
        </a>
        <button
          type="button"
          onClick={kosongkan}
          className="text-sm font-semibold text-teks-lembut hover:text-bahaya"
        >
          Kosongkan keranjang
        </button>
      </div>
    </div>
  );
}
