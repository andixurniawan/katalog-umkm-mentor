import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormBanner from "@/components/FormBanner";
import BarisBanner from "@/components/BarisBanner";
import { createServerAuthClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Banner promo" };

export default async function HalamanBanner() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: daftar, error } = await supabase.from("banner").select("*").order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Banner promo</h1>
      <p className="max-w-xl text-sm text-teks-lembut">
        Beranda menampilkan satu banner aktif (yang terbaru). Banner nonaktif tidak tampil.
      </p>
      <section aria-labelledby="judul-tambah-banner" className="flex flex-col gap-3">
        <h2 id="judul-tambah-banner" className="font-bold">
          Tambah banner
        </h2>
        <FormBanner />
      </section>
      {error ? (
        <p className="py-8 text-center font-medium text-bahaya">
          Gagal mengambil banner dari database. Pastikan bagian 12 di docs/schema.sql sudah dijalankan.
        </p>
      ) : daftar.length === 0 ? (
        <p className="py-4 text-center font-medium text-teks-lembut">Belum ada banner.</p>
      ) : (
        <ul className="flex max-w-3xl flex-col divide-y divide-garis rounded-2xl border border-garis">
          {daftar.map((b) => (
            <BarisBanner key={`${b.id}-${b.created_at}`} banner={b} />
          ))}
        </ul>
      )}
    </div>
  );
}
