import Link from "next/link";
import { notFound } from "next/navigation";
import ArahkanBandingkan from "@/components/ArahkanBandingkan";
import HargaProduk from "@/components/HargaProduk";
import BadgeProduk from "@/components/BadgeProduk";
import Tombol from "@/components/Tombol";
import { createPublicClient } from "@/lib/supabase/server";
import { ekstrakDaftarFoto } from "@/lib/foto";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bandingkan produk" };

function bacaId(nilai) {
  const teks = Array.isArray(nilai) ? nilai[0] : nilai;
  return /^\d{1,15}$/.test(teks || "") ? Number(teks) : null;
}

function Petunjuk({ children }) {
  return (
    <div className="flex max-w-xl flex-col items-start gap-4 py-10">
      <h1 className="text-2xl font-extrabold">Bandingkan produk</h1>
      <p className="text-teks-lembut">{children}</p>
      <ArahkanBandingkan />
      <Tombol href="/">Pilih produk di katalog</Tombol>
    </div>
  );
}

export default async function HalamanBandingkan({ searchParams }) {
  const sp = await searchParams;
  const mentahA = sp?.a;
  const mentahB = sp?.b;

  if (!mentahA && !mentahB) {
    return (
      <Petunjuk>
        Pilih dua produk dengan tombol "Bandingkan" di halaman detail produk, lalu buka halaman ini lagi.
      </Petunjuk>
    );
  }

  const idA = bacaId(mentahA);
  const idB = bacaId(mentahB);

  // ID yang bukan angka sama saja dengan produk yang tidak ada.
  if ((mentahA && idA === null) || (mentahB && idB === null)) notFound();

  if (!idA || !idB) {
    return <Petunjuk>Pilih satu produk lagi untuk dibandingkan.</Petunjuk>;
  }
  if (idA === idB) {
    return <Petunjuk>Produk yang dipilih sama. Pilih dua produk yang berbeda.</Petunjuk>;
  }

  const supabase = createPublicClient();
  if (!supabase) notFound();

  const { data, error } = await supabase
    .from("produk")
    .select("*")
    .in("id", [idA, idB])
    .eq("aktif", true);

  if (error) {
    console.error("Gagal mengambil produk untuk perbandingan:", error.message);
    return <Petunjuk>Gagal mengambil data produk. Coba muat ulang halaman.</Petunjuk>;
  }

  // Urutan mengikuti URL; salah satu produk tidak ada atau nonaktif berarti halaman tidak ditemukan.
  const produkA = data.find((p) => p.id === idA);
  const produkB = data.find((p) => p.id === idB);
  if (!produkA || !produkB) notFound();

  const baris = [
    { label: "Kategori", isi: (p) => p.kategori || "-" },
    { label: "Harga", isi: (p) => <HargaProduk produk={p} /> },
    {
      label: "Stok",
      isi: (p) => (p.stok === 0 ? "Habis" : p.stok == null ? "Tersedia" : `${p.stok} tersedia`),
    },
    { label: "Deskripsi", isi: (p) => p.deskripsi || "-" },
  ];

  return (
    <div className="py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Bandingkan produk</h1>
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          Kembali ke katalog
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6">
        {[produkA, produkB].map((p) => (
          <article key={p.id} className="flex flex-col gap-3">
            <img
              src={ekstrakDaftarFoto(p.foto_url)[0] || "/placeholder.svg"}
              alt={p.nama}
              className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
            />
            <div className="flex flex-wrap items-center gap-2">
              <BadgeProduk badge={p.badge} />
            </div>
            <h2 className="text-lg font-bold leading-snug">
              <Link href={`/produk/${p.id}`} className="hover:text-utama">
                {p.nama}
              </Link>
            </h2>
          </article>
        ))}
      </div>

      <dl className="mt-6 flex flex-col divide-y divide-garis rounded-2xl border border-garis">
        {baris.map((b) => (
          <div key={b.label} className="p-4">
            <dt className="text-sm font-semibold text-teks-lembut">{b.label}</dt>
            <dd className="mt-2 grid grid-cols-2 gap-4 text-sm leading-relaxed md:gap-6">
              <div>{b.isi(produkA)}</div>
              <div>{b.isi(produkB)}</div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
