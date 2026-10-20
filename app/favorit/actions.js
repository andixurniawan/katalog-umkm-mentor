"use server";

import { createPublicClient } from "@/lib/supabase/server";

// Mengambil produk favorit berdasarkan id yang disimpan di browser. Data publik, jadi tanpa cek login.
export async function ambilProdukFavorit(ids) {
  const daftarId = Array.isArray(ids)
    ? [...new Set(ids.map((id) => parseInt(id, 10)).filter(Number.isInteger))].slice(0, 100)
    : [];

  if (daftarId.length === 0) return { produk: [] };

  const supabase = createPublicClient();
  if (!supabase) return { error: "Gagal terhubung ke database." };

  const { data, error } = await supabase
    .from("produk")
    .select("*")
    .in("id", daftarId)
    .eq("aktif", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("Gagal mengambil produk favorit:", error.message);
    return { error: "Gagal mengambil produk favorit." };
  }
  return { produk: data };
}
