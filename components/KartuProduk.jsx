import Link from "next/link";
import { tautanKategori } from "@/lib/slug";
import HargaProduk from "@/components/HargaProduk";
import BadgeProduk from "@/components/BadgeProduk";
import TombolTambahKeranjang from "@/components/TombolTambahKeranjang";
import TombolFavorit from "@/components/TombolFavorit";

export default function KartuProduk({ produk }) {
  const fotoUtama =
    produk.foto_url?.split(/[\n,]/)[0]?.trim() || produk.foto_url || "/placeholder.svg";

  const isHabis = produk.stok === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar">
      <Link href={`/produk/${produk.id}`} className="block">
        <div className="relative">
          <img
            src={fotoUtama}
            alt={produk.nama}
            className={`aspect-square w-full bg-permukaan object-cover ${isHabis ? "opacity-50 grayscale" : ""}`}
          />
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
            {isHabis && (
              <span className="rounded-md bg-bahaya px-2 py-0.5 text-xs font-bold text-kontras">
                Habis
              </span>
            )}
            <BadgeProduk badge={produk.badge} />
          </div>
        </div>
      </Link>
      {/* Kategori tertaut ke halamannya sendiri, jadi tidak boleh berada di dalam Link produk. */}
      <div className={`flex flex-1 flex-col gap-2 px-3 pt-3 ${isHabis ? "pb-3" : ""}`}>
        {produk.kategori && (
          <Link href={tautanKategori(produk.kategori)} className="w-fit text-xs text-teks-lembut hover:text-utama hover:underline">
            {produk.kategori}
          </Link>
        )}
        <Link href={`/produk/${produk.id}`} className="flex flex-1 flex-col gap-2">
          <h3 className="font-semibold leading-snug group-hover:text-utama">{produk.nama}</h3>
          <HargaProduk produk={produk} />
        </Link>
      </div>
      <TombolFavorit produk={produk} className="absolute right-2 top-2" />
      {!isHabis && (
        <div className="px-3 pb-3 pt-3">
          <TombolTambahKeranjang produk={produk} className="w-full" />
        </div>
      )}
    </div>
  );
}
