import { createPublicClient } from "@/lib/supabase/server";
import { alamatSitus } from "@/lib/situs";

// Dibuat saat diminta, bukan saat build, supaya produk baru langsung masuk.
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const halamanTetap = ["", "/tentang"].map((path) => ({
    url: `${alamatSitus}${path}`,
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.5,
  }));

  const supabase = createPublicClient();
  if (!supabase) return halamanTetap;

  const { data, error } = await supabase
    .from("produk")
    .select("id, created_at")
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Gagal mengambil produk untuk sitemap:", error?.message);
    return halamanTetap;
  }

  const halamanProduk = data.map((produk) => ({
    url: `${alamatSitus}/produk/${produk.id}`,
    lastModified: produk.created_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...halamanTetap, ...halamanProduk];
}
