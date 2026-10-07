import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
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

  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data produk admin:", error.message);
  }

  const produkList = daftarProduk || [];

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
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
