import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import { createPublicClient } from "@/lib/supabase/server";
import { buatSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

// Mencari nama kategori dari slug. Sumbernya tabel kategori; bila belum ada, dari kategori yang dipakai produk.
const cariKategori = cache(async (slug) => {
  const supabase = createPublicClient();
  if (!supabase || !slug) return null;

  const { data: tabel, error } = await supabase.from("kategori").select("nama");
  let daftar = error ? null : tabel.map((k) => k.nama);
  if (!daftar) {
    const { data: produk } = await supabase.from("produk").select("kategori").eq("aktif", true);
    daftar = [...new Set((produk || []).map((p) => p.kategori).filter(Boolean))];
  }
  return daftar.find((nama) => buatSlug(nama) === slug) || null;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const nama = await cariKategori(slug);
  return nama ? { title: `Kategori ${nama}` } : { title: "Kategori tidak ditemukan" };
}

export default async function HalamanKategori({ params }) {
  const { slug } = await params;
  const nama = await cariKategori(slug);
  if (!nama) notFound();

  const supabase = createPublicClient();
  const ambil = (denganUrutan) => {
    let q = supabase.from("produk").select("*").eq("aktif", true).eq("kategori", nama);
    if (denganUrutan) q = q.order("urutan", { ascending: true });
    return q.order("id", { ascending: true });
  };
  let { data, error } = await ambil(true);
  // Kolom urutan (US-47) belum dibuat: ulangi tanpa urutan itu.
  if (error && /urutan/i.test(error.message || "")) ({ data, error } = await ambil(false));
  if (error) console.error("Gagal mengambil produk kategori:", error.message);

  const daftarProduk = data || [];

  return (
    <div className="py-8 md:py-12">
      <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
        Kembali ke katalog
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{nama}</h1>
      <p className="mt-1 text-sm text-teks-lembut">{daftarProduk.length} produk</p>

      {error ? (
        <p className="py-8 text-center text-bahaya">Gagal mengambil data produk dari database.</p>
      ) : daftarProduk.length === 0 ? (
        <p className="py-12 text-center text-teks-lembut">Belum ada produk di kategori ini.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {daftarProduk.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}
