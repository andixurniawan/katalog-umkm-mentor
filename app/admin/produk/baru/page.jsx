import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import { createServerAuthClient } from "@/lib/supabase/server";
import FormTambahProduk from "./FormTambahProduk";

export const dynamic = "force-dynamic";

export default async function HalamanTambahProduk() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: kategori } = await supabase
    .from("kategori")
    .select("nama")
    .order("nama", { ascending: true });

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      <FormTambahProduk daftarKategori={(kategori || []).map((k) => k.nama)} />
    </div>
  );
}
