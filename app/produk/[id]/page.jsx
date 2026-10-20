import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import GaleriFoto from "@/components/GaleriFoto";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import TombolBandingkan from "@/components/TombolBandingkan";
import TombolFavorit from "@/components/TombolFavorit";
import CatatDilihat from "@/components/CatatDilihat";
import HargaProduk from "@/components/HargaProduk";
import BadgeProduk from "@/components/BadgeProduk";
import { createPublicClient } from "@/lib/supabase/server";
import { ekstrakDaftarFoto } from "@/lib/foto";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

// Dipakai bersama oleh generateMetadata dan halaman; cache() membuat query hanya berjalan sekali per request.
const ambilProduk = cache(async (id) => {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .eq("aktif", true)
    .maybeSingle();

  return error ? null : data;
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const produk = await ambilProduk(id);

  if (!produk) {
    return { title: "Produk tidak ditemukan" };
  }

  const deskripsi = produk.deskripsi
    ? produk.deskripsi.replace(/\s+/g, " ").trim().slice(0, 160)
    : `${produk.nama} di ${toko.nama}`;
  const foto = ekstrakDaftarFoto(produk.foto_url)[0];

  return {
    title: produk.nama,
    description: deskripsi,
    openGraph: {
      type: "website",
      siteName: toko.nama,
      title: produk.nama,
      description: deskripsi,
      url: `/produk/${produk.id}`,
      ...(foto && { images: [{ url: foto, alt: produk.nama }] }),
    },
    twitter: {
      card: foto ? "summary_large_image" : "summary",
      title: produk.nama,
      description: deskripsi,
      ...(foto && { images: [foto] }),
    },
  };
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const produk = await ambilProduk(id);

  if (!produk) {
    notFound();
  }

  const supabase = createPublicClient();

  // Ambil beberapa produk lain dari kategori yang sama dari database (US-17)
  let produkTerkait = [];
  if (produk.kategori) {
    const produkId = parseInt(id, 10) || id;
    const { data: dataTerkait } = await supabase
      .from("produk")
      .select("*")
      .eq("kategori", produk.kategori)
      .eq("aktif", true)
      .neq("id", produkId)
      .order("id", { ascending: true })
      .limit(4);

    if (dataTerkait) {
      produkTerkait = dataTerkait;
    }
  }

  return (
    <div className="py-8 md:py-12">
      <CatatDilihat produk={produk} />
      <article className="grid gap-8 md:grid-cols-2">
        <GaleriFoto fotoUrl={produk.foto_url} nama={produk.nama} />
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            Kembali ke katalog
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-sm text-teks-lembut">{produk.kategori}</p>
            <BadgeProduk badge={produk.badge} />
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            {produk.nama}
          </h1>
          <HargaProduk produk={produk} besar />
          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {produk.deskripsi}
          </p>
          <TombolWhatsApp produk={produk} />
          <div className="flex flex-wrap items-center gap-3">
            <TombolFavorit produk={produk} denganTeks />
            <TombolBagikan nama={produk.nama} />
            <TombolBandingkan produk={produk} />
          </div>
        </div>
      </article>

      {produkTerkait.length > 0 && (
        <section
          aria-labelledby="judul-terkait"
          className="mt-12 border-t border-garis pt-10 sm:mt-16 sm:pt-12"
        >
          <div className="flex flex-col gap-5">
            <div>
              <h2 id="judul-terkait" className="text-xl font-bold">
                Produk terkait
              </h2>
              <p className="mt-1 text-sm text-teks-lembut">
                Produk lain dalam kategori{" "}
                <strong className="text-teks">{produk.kategori}</strong>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {produkTerkait.map((item) => (
                <KartuProduk key={item.id} produk={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
