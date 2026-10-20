import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import RingkasanAdmin from "@/components/RingkasanAdmin";
import Tombol from "@/components/Tombol";
import { createServerAuthClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Daftar produk dan data ringkasan diambil bersamaan dari database.
  const [{ data: daftarProduk, error }, { data: dataKategori, error: errorRingkasan }] =
    await Promise.all([
      supabase.from("produk").select("*").order("id", { ascending: true }),
      supabase.from("produk").select("kategori"),
    ]);

  if (error) {
    console.error("Gagal mengambil data produk admin:", error.message);
  }
  if (errorRingkasan) {
    console.error("Gagal mengambil ringkasan admin:", errorRingkasan.message);
  }

  const hitungKategori = new Map();
  for (const { kategori } of dataKategori || []) {
    const nama = kategori?.trim() || "Tanpa kategori";
    hitungKategori.set(nama, (hitungKategori.get(nama) || 0) + 1);
  }
  const perKategori = [...hitungKategori]
    .map(([nama, jumlah]) => ({ nama, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah || a.nama.localeCompare(b.nama, "id"));

  const produkList = daftarProduk || [];

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      {errorRingkasan ? (
        <p className="rounded-lg bg-bahaya/10 p-3 text-sm font-medium text-bahaya">
          Gagal mengambil ringkasan toko dari database.
        </p>
      ) : (
        <RingkasanAdmin total={dataKategori?.length ?? 0} perKategori={perKategori} />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {error ? (
        <p className="py-8 text-center font-medium text-bahaya">
          Gagal mengambil data produk dari database.
        </p>
      ) : produkList.length === 0 ? (
        <p className="py-8 text-center font-medium text-teks-lembut">
          Belum ada produk.
        </p>
      ) : (
        <TabelProduk daftarProduk={produkList} />
      )}
    </div>
  );
}
