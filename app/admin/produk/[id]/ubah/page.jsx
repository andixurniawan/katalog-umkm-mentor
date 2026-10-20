import { notFound, redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import { createServerAuthClient } from "@/lib/supabase/server";
import KelolaVarian from "@/components/KelolaVarian";
import FormUbahProduk from "./FormUbahProduk";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;
  const supabase = await createServerAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  const { data: kategori } = await supabase
    .from("kategori")
    .select("nama")
    .order("nama", { ascending: true });

  const { data: daftarVarian, error: errorVarian } = await supabase
    .from("varian")
    .select("*")
    .eq("produk_id", produk.id)
    .order("harga", { ascending: true });

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormUbahProduk produk={produk} daftarKategori={(kategori || []).map((k) => k.nama)} />
      <KelolaVarian produkId={produk.id} daftar={daftarVarian || []} error={Boolean(errorVarian)} />
    </div>
  );
}
