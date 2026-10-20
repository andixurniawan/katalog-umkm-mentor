import { createServerAuthClient } from "@/lib/supabase/server";
import { buatCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

const KOLOM = [
  { kunci: "id", judul: "ID" },
  { kunci: "nama", judul: "Nama" },
  { kunci: "kategori", judul: "Kategori" },
  { kunci: "harga", judul: "Harga" },
  { kunci: "harga_diskon", judul: "Harga Diskon" },
  { kunci: "stok", judul: "Stok" },
  { kunci: "badge", judul: "Badge" },
  { kunci: "status", judul: "Status" },
  { kunci: "deskripsi", judul: "Deskripsi" },
  { kunci: "foto_url", judul: "Link Foto" },
  { kunci: "created_at", judul: "Dibuat" },
];

const UKURAN_BATCH = 1000;

export async function GET() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Harus login sebagai admin.", { status: 401 });
  }

  // Supabase membatasi 1000 baris per query, jadi ambil bertahap sampai habis.
  const semua = [];
  for (let dari = 0; ; dari += UKURAN_BATCH) {
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true })
      .range(dari, dari + UKURAN_BATCH - 1);

    if (error) {
      console.error("Gagal mengekspor produk:", error.message);
      return new Response("Gagal mengambil data produk.", { status: 500 });
    }
    semua.push(...data);
    if (data.length < UKURAN_BATCH) break;
  }

  const baris = semua.map((p) => ({ ...p, status: p.aktif === false ? "Nonaktif" : "Aktif" }));
  const tanggal = new Date().toISOString().slice(0, 10);

  // BOM di depan supaya Excel membaca UTF-8 (huruf non-ASCII tidak rusak).
  return new Response("﻿" + buatCsv(KOLOM, baris), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="produk-${tanggal}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
