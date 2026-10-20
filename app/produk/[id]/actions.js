"use server";

import { revalidatePath } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { validasiUlasan } from "@/lib/validasi-ulasan";
import { periksaBatasKiriman } from "@/lib/batas-kiriman";

export async function kirimUlasanAction(prevState, formData) {
  // Honeypot: kolom ini disembunyikan dari pengunjung, jadi yang mengisinya adalah bot.
  // Dibalas seolah berhasil supaya bot tidak tahu ia ditolak.
  if (formData.get("website")?.toString().trim()) {
    return { success: "Terima kasih, ulasanmu sudah dikirim.", waktu: Date.now() };
  }

  const produkId = Number(formData.get("produk_id"));
  if (!Number.isInteger(produkId) || produkId <= 0) {
    return { error: "Produk tidak valid." };
  }

  const { data, values, errors } = validasiUlasan(formData);
  if (Object.keys(errors).length > 0) {
    return { error: "Periksa kembali isian yang ditandai.", errors, values };
  }

  const batas = await periksaBatasKiriman("ulasan", { maks: 3, jendelaMs: 10 * 60 * 1000 });
  if (!batas.boleh) {
    return {
      error: `Terlalu banyak ulasan dikirim. Coba lagi dalam ${Math.ceil(batas.tungguDetik / 60)} menit.`,
      values,
    };
  }

  const supabase = createPublicClient();
  if (!supabase) return { error: "Gagal terhubung ke database.", values };

  // Ulasan hanya boleh untuk produk yang aktif dan tampil di katalog.
  const { data: produk } = await supabase
    .from("produk")
    .select("id")
    .eq("id", produkId)
    .eq("aktif", true)
    .maybeSingle();
  if (!produk) return { error: "Produk tidak ditemukan.", values };

  const { error } = await supabase.from("ulasan").insert({ produk_id: produkId, ...data });
  if (error) {
    console.error("Gagal menyimpan ulasan:", error.message);
    return { error: "Gagal menyimpan ulasan. Coba lagi nanti.", values };
  }

  revalidatePath(`/produk/${produkId}`);
  return { success: "Terima kasih, ulasanmu sudah dikirim.", waktu: Date.now() };
}
