import { notFound, redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import { createServerAuthClient } from "@/lib/supabase/server";
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

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormUbahProduk produk={produk} />
    </div>
  );
}
