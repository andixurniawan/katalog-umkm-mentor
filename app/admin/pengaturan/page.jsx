import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormPengaturanToko from "@/components/FormPengaturanToko";
import { createServerAuthClient } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pengaturan toko" };

export default async function HalamanPengaturanToko() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Dibaca langsung (tanpa cache) supaya form selalu berisi nilai terbaru.
  const { data, error } = await supabase.from("pengaturan_toko").select("*").eq("id", 1).maybeSingle();

  const awal = {
    nama: data?.nama ?? toko.nama,
    nomor_whatsapp: data?.nomor_whatsapp ?? toko.nomorWhatsApp,
    jam_buka: data?.jam_buka ?? toko.jamBuka,
    alamat: data?.alamat ?? toko.alamat,
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Pengaturan toko</h1>
      {error && (
        <p className="rounded-lg bg-bahaya/10 p-3 text-sm font-medium text-bahaya">
          Gagal membaca pengaturan dari database. Pastikan bagian 13 di docs/schema.sql sudah dijalankan. Form
          menampilkan nilai cadangan dari lib/toko.js.
        </p>
      )}
      <FormPengaturanToko awal={awal} />
    </div>
  );
}
