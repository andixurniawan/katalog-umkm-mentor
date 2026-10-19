import Link from "next/link";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  const fotoUtama =
    produk.foto_url?.split(/[\n,]/)[0]?.trim() || produk.foto_url || "/placeholder.svg";

  const isHabis = produk.stok === 0;

  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
    >
      <div className="relative">
        <img
          src={fotoUtama}
          alt={produk.nama}
          className={`aspect-square w-full bg-permukaan object-cover ${isHabis ? "opacity-50 grayscale" : ""}`}
        />
        {isHabis && (
          <span className="absolute left-2 top-2 rounded-md bg-bahaya px-2 py-0.5 text-xs font-bold text-white">
            Habis
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-xs text-teks-lembut">{produk.kategori}</p>
        <h3 className="font-semibold leading-snug group-hover:text-utama">{produk.nama}</h3>
        <p className="mt-auto self-start rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
          {formatRupiah(produk.harga)}
        </p>
      </div>
    </Link>
  );
}
