import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import { createServerAuthClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Log aktivitas" };

export default async function HalamanLog() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: daftar, error } = await supabase
    .from("log_aktivitas")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Log aktivitas</h1>
      {error ? (
        <p className="py-8 text-center font-medium text-bahaya">
          Gagal mengambil log dari database. Pastikan bagian 14 di docs/schema.sql sudah dijalankan.
        </p>
      ) : daftar.length === 0 ? (
        <p className="py-8 text-center font-medium text-teks-lembut">
          Belum ada aktivitas. Tambah, ubah, atau hapus produk akan tercatat di sini.
        </p>
      ) : (
        <>
          <p className="text-sm text-teks-lembut">50 aktivitas terakhir.</p>
          <div className="overflow-x-auto rounded-2xl border border-garis">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="bg-permukaan text-teks-lembut">
                <tr>
                  <th className="px-4 py-3 font-semibold">Waktu</th>
                  <th className="px-4 py-3 font-semibold">Admin</th>
                  <th className="px-4 py-3 font-semibold">Aksi</th>
                  <th className="px-4 py-3 font-semibold">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-garis">
                {daftar.map((l) => (
                  <tr key={l.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-teks-lembut">
                      {new Date(l.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="break-all px-4 py-3">{l.admin_email}</td>
                    <td className="px-4 py-3 font-semibold">{l.aksi}</td>
                    <td className="px-4 py-3">{l.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
