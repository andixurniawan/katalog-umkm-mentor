import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import { formatRupiah } from "@/lib/format";
import { createPublicClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const supabase = createPublicClient();

  if (!supabase) {
    notFound();
  }

  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  // Ambil beberapa produk lain dari kategori yang sama dari database (US-17)
  let produkTerkait = [];
  if (produk.kategori) {
    const produkId = parseInt(id, 10) || id;
    const { data: dataTerkait } = await supabase
      .from("produk")
      .select("*")
      .eq("kategori", produk.kategori)
      .neq("id", produkId)
      .order("id", { ascending: true })
      .limit(4);

    if (dataTerkait) {
      produkTerkait = dataTerkait;
    }
  }

  return (
    <div className="py-8 md:py-12">
      <article className="grid gap-8 md:grid-cols-2">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
        />
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            Kembali ke katalog
          </Link>
          <p className="text-sm text-teks-lembut">{produk.kategori}</p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            {produk.nama}
          </h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {produk.deskripsi}
          </p>
          <TombolWhatsApp produk={produk} />
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
