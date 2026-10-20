import { formatRupiah, adaDiskon, hargaAktif } from "@/lib/format";

// Harga di kartu dan halaman detail. Harga normal dicoret jika ada diskon.
export default function HargaProduk({ produk, besar = false }) {
  const diskon = adaDiskon(produk);
  const ukuran = besar ? "px-3 py-1 text-xl" : "px-2 py-0.5 text-sm";

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${besar ? "" : "mt-auto"}`}>
      <p className={`rounded-md bg-harga-latar font-bold text-harga ${ukuran}`}>
        {formatRupiah(hargaAktif(produk))}
      </p>
      {diskon && (
        <p className={`text-teks-lembut line-through ${besar ? "text-base" : "text-xs"}`}>
          <span className="sr-only">Harga normal </span>
          {formatRupiah(produk.harga)}
        </p>
      )}
    </div>
  );
}
