import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormTambahKategori from "@/components/FormTambahKategori";
import BarisKategori from "@/components/BarisKategori";
import { createServerAuthClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola kategori" };

export default async function HalamanKategori() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const [{ data: daftarKategori, error }, { data: dataProduk }] = await Promise.all([
    supabase.from("kategori").select("*").order("nama", { ascending: true }),
    supabase.from("produk").select("kategori"),
  ]);

  const jumlahPerKategori = new Map();
  for (const { kategori } of dataProduk || []) {
    if (kategori) jumlahPerKategori.set(kategori, (jumlahPerKategori.get(kategori) || 0) + 1);
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Kategori</h1>
      <FormTambahKategori />
      {error ? (
        <p className="py-8 text-center font-medium text-bahaya">
          Gagal mengambil kategori dari database. Pastikan bagian 8 di docs/schema.sql sudah dijalankan.
        </p>
      ) : daftarKategori.length === 0 ? (
        <p className="py-8 text-center font-medium text-teks-lembut">Belum ada kategori.</p>
      ) : (
        <ul className="flex max-w-3xl flex-col divide-y divide-garis rounded-2xl border border-garis">
          {daftarKategori.map((kategori) => (
            <BarisKategori
              key={`${kategori.id}-${kategori.nama}`}
              kategori={kategori}
              jumlahProduk={jumlahPerKategori.get(kategori.nama) || 0}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
