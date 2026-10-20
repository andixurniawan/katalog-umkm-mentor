import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormImpor from "@/components/FormImpor";
import { createServerAuthClient } from "@/lib/supabase/server";
import { BARIS_IMPOR_MAKSIMAL } from "@/lib/impor-produk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Impor produk" };

export default async function HalamanImpor() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Impor produk dari CSV</h1>
      <div className="max-w-2xl text-sm leading-relaxed text-teks-lembut">
        <p>
          Baris pertama file adalah judul kolom. Kolom wajib: <strong className="text-teks">Nama</strong> dan{" "}
          <strong className="text-teks">Harga</strong>. Kolom opsional: Kategori, Harga Diskon, Stok, Badge, Deskripsi,
          Link Foto, Status (Aktif/Nonaktif).
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>Harga berupa angka bulat tanpa titik, misalnya 45000.</li>
          <li>Kategori harus sudah ada di halaman Kategori.</li>
          <li>Maksimal {BARIS_IMPOR_MAKSIMAL} produk dan 1 MB per file.</li>
          <li>
            Baris yang valid disimpan, baris yang salah dilaporkan dengan nomor barisnya. File dari tombol{" "}
            <a href="/admin/ekspor-csv" download className="font-semibold text-utama hover:underline">
              Ekspor CSV
            </a>{" "}
            bisa dipakai sebagai contoh format (kolom ID dan Dibuat diabaikan; produk selalu ditambahkan sebagai baru).
          </li>
        </ul>
      </div>
      <FormImpor />
    </div>
  );
}
