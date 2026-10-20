import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import BarisUlasan from "@/components/BarisUlasan";
import { createServerAuthClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Moderasi ulasan" };

export default async function HalamanUlasanAdmin() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: daftar, error } = await supabase
    .from("ulasan")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  // Nama produk diambil terpisah supaya halaman tetap jalan walau relasi belum terbaca.
  const idProduk = [...new Set((daftar || []).map((u) => u.produk_id))];
  const { data: dataProduk } = idProduk.length
    ? await supabase.from("produk").select("id, nama").in("id", idProduk)
    : { data: [] };
  const namaProduk = new Map((dataProduk || []).map((p) => [p.id, p.nama]));

  const disembunyikan = (daftar || []).filter((u) => !u.tampil).length;

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ulasan</h1>
      {error ? (
        <p className="py-8 text-center font-medium text-bahaya">
          Gagal mengambil ulasan dari database. Pastikan bagian 10 di docs/schema.sql sudah dijalankan.
        </p>
      ) : daftar.length === 0 ? (
        <p className="py-8 text-center font-medium text-teks-lembut">Belum ada ulasan.</p>
      ) : (
        <>
          <p className="text-sm text-teks-lembut">
            {daftar.length} ulasan, {disembunyikan} disembunyikan. Ulasan yang disembunyikan tidak tampil di halaman
            produk dan tidak dihitung di rata-rata rating.
          </p>
          <ul className="flex max-w-3xl flex-col divide-y divide-garis rounded-2xl border border-garis">
            {daftar.map((u) => (
              <BarisUlasan key={u.id} ulasan={u} namaProduk={namaProduk.get(u.produk_id)} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
