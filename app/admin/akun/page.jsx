import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormTambahAdmin from "@/components/FormTambahAdmin";
import BarisAdmin from "@/components/BarisAdmin";
import { createServerAuthClient, createPublicClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Akun admin" };

const format = (iso) =>
  iso ? new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "belum pernah";

export default async function HalamanAkunAdmin() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Daftar akun hanya bisa dibaca lewat Auth Admin API (SUPABASE_SECRET_KEY), setelah login diperiksa di atas.
  const admin = createPublicClient();
  const { data, error } = admin
    ? await admin.auth.admin.listUsers({ page: 1, perPage: 100 })
    : { data: null, error: { message: "SUPABASE_SECRET_KEY belum diatur." } };

  const sekarang = Date.now();
  const daftar = (data?.users || []).map((u) => ({
    id: u.id,
    email: u.email || "(tanpa email)",
    dibuat: format(u.created_at),
    loginTerakhir: format(u.last_sign_in_at),
    nonaktif: Boolean(u.banned_until && new Date(u.banned_until).getTime() > sekarang),
  }));

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Akun admin</h1>
      <section aria-labelledby="judul-tambah-admin" className="flex flex-col gap-3">
        <h2 id="judul-tambah-admin" className="font-bold">
          Tambah admin
        </h2>
        <FormTambahAdmin />
      </section>
      {error ? (
        <p className="py-8 text-center font-medium text-bahaya">Gagal mengambil daftar admin: {error.message}</p>
      ) : (
        <ul className="flex max-w-3xl flex-col divide-y divide-garis rounded-2xl border border-garis">
          {daftar.map((akun) => (
            <BarisAdmin key={akun.id} akun={akun} diriSendiri={akun.id === user.id} />
          ))}
        </ul>
      )}
    </div>
  );
}
