"use client";

import { useState } from "react";
import { useToko } from "@/components/TokoProvider";
import TombolTambahKeranjang from "@/components/TombolTambahKeranjang";
import { catatKlikWhatsAppAction } from "@/app/produk/[id]/catat-klik";
import { formatRupiah, hargaAktif } from "@/lib/format";

// `daftarVarian` (US-48) berisi varian ber-harga dari database. Jika ada, pengunjung wajib memilih salah satu
// (state ada di PanelPembelian supaya harga di atas halaman ikut berubah). Jika tidak ada, varian
// berupa teks bebas seperti sebelumnya.
export default function TombolWhatsApp({ produk, daftarVarian = [], varianId = null, onPilihVarian = () => {} }) {
  const toko = useToko();
  if (!produk) return null;

  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  const isHabis = produk.stok === 0;

  const jumlahAngka = Math.max(1, Number(jumlah) || 1);
  const adaVarianHarga = daftarVarian.length > 0;
  const varianHarga = daftarVarian.find((v) => v.id === varianId) || null;
  // Harga varian menggantikan harga produk (termasuk diskon produk).
  const produkEfektif = varianHarga ? { ...produk, harga: varianHarga.harga, harga_diskon: null } : produk;
  const namaVarian = varianHarga ? varianHarga.nama : varian.trim();
  const hargaSatuan = hargaAktif(produkEfektif);
  const hargaTotal = hargaSatuan * jumlahAngka;

  let pesan = `Halo, saya mau pesan ${produk.nama}`;
  if (namaVarian) {
    pesan += ` (varian: ${namaVarian})`;
  }
  if (jumlahAngka > 1) {
    pesan += ` dengan jumlah ${jumlahAngka} pcs dan total harga ${formatRupiah(hargaTotal)} (satuan ${formatRupiah(hargaSatuan)})`;
  } else {
    pesan += ` dengan harga ${formatRupiah(hargaSatuan)}`;
  }
  pesan += ".";

  const linkWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  const daftarPilihan = [
    "Original",
    "Pedas",
    "Manis",
    "Ukuran Kecil",
    "Ukuran Sedang",
    "Ukuran Besar",
  ];

  if (isHabis) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-garis bg-permukaan/30 p-4 sm:p-5">
        <p className="text-center text-sm font-medium text-teks-lembut">
          Produk ini sedang tidak tersedia.
        </p>
        <button
          disabled
          className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-permukaan px-5 py-3 font-semibold text-teks-lembut"
        >
          Stok habis
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-garis bg-permukaan/30 p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        {/* Pilihan Varian */}
        {adaVarianHarga ? (
          <fieldset className="flex flex-col gap-1.5">
            <legend className="text-sm font-semibold text-teks">Pilih varian</legend>
            <div className="flex flex-wrap gap-2">
              {daftarVarian.map((v) => (
                <label
                  key={v.id}
                  className="cursor-pointer rounded-lg border border-garis bg-latar px-3 py-2 text-sm has-[:checked]:border-utama has-[:checked]:bg-utama has-[:checked]:text-kontras"
                >
                  <input
                    type="radio"
                    name="varian_harga"
                    value={v.id}
                    checked={v.id === varianId}
                    onChange={() => onPilihVarian(v.id)}
                    className="sr-only"
                  />
                  <span className="font-semibold">{v.nama}</span>
                  <span className="ml-2 opacity-80">{formatRupiah(v.harga)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="varian" className="text-sm font-semibold text-teks">
              Pilihan varian <span className="font-normal text-teks-lembut">(opsional)</span>
            </label>
            <input
              id="varian"
              name="varian"
              list="daftar-varian"
              type="text"
              value={varian}
              onChange={(e) => setVarian(e.target.value)}
              placeholder="Ketik atau pilih varian (rasa, ukuran, dll.)"
              className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
            <datalist id="daftar-varian">
              {daftarPilihan.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {daftarPilihan.map((item) => {
                const isDipilih = varian === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setVarian(isDipilih ? "" : item)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                      isDipilih
                        ? "bg-utama text-kontras"
                        : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Pilihan Jumlah */}
        <div className="flex items-center justify-between gap-4 border-t border-garis/60 pt-3">
          <label htmlFor="jumlah" className="text-sm font-semibold text-teks">
            Jumlah
          </label>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Kurangi jumlah"
              onClick={() => setJumlah((prev) => Math.max(1, (Number(prev) || 1) - 1))}
              disabled={jumlahAngka <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-base font-bold text-teks transition-colors hover:border-utama hover:text-utama disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>
            <input
              id="jumlah"
              name="jumlah"
              type="number"
              min="1"
              value={jumlah}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setJumlah(isNaN(val) ? "" : Math.max(1, val));
              }}
              onBlur={() => {
                if (!jumlah || jumlah < 1) setJumlah(1);
              }}
              className="h-9 w-16 rounded-lg border border-garis bg-latar text-center text-sm font-semibold text-teks focus:border-utama focus:outline-none"
            />
            <button
              type="button"
              aria-label="Tambah jumlah"
              onClick={() => setJumlah((prev) => (Number(prev) || 1) + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-base font-bold text-teks transition-colors hover:border-utama hover:text-utama"
            >
              +
            </button>
          </div>
        </div>

        {/* Subtotal jika jumlah > 1 */}
        {jumlahAngka > 1 && (
          <div className="flex items-center justify-between border-t border-garis/60 pt-3 text-sm">
            <span className="text-teks-lembut">Total ({jumlahAngka} pcs):</span>
            <span className="text-base font-bold text-harga">
              {formatRupiah(hargaTotal)}
            </span>
          </div>
        )}
      </div>

      <a
        href={linkWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        // Pencatatan tidak ditunggu dan errornya diabaikan, jadi WhatsApp selalu terbuka.
        onClick={() => {
          catatKlikWhatsAppAction(produk.id).catch(() => {});
        }}
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-kontras transition-colors hover:bg-utama-gelap"
      >
        Pesan via WhatsApp
      </a>
      <TombolTambahKeranjang produk={produkEfektif} jumlah={jumlahAngka} varian={namaVarian} className="w-full py-3" />
    </div>
  );
}
