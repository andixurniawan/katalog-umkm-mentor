"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { periksaBatasKiriman } from "@/lib/batas-kiriman";

// Mencatat satu klik "Pesan via WhatsApp". Yang disimpan hanya id produk dan waktu (default di database).
export async function catatKlikWhatsAppAction(produkId) {
  const id = Number(produkId);
  if (!Number.isInteger(id) || id <= 0) return;

  // Batas dasar supaya angka di dashboard tidak mudah digelembungkan.
  const batas = await periksaBatasKiriman("klik-wa", { maks: 30, jendelaMs: 60 * 1000 });
  if (!batas.boleh) return;

  const supabase = createPublicClient();
  if (!supabase) return;

  const { data: produk } = await supabase.from("produk").select("id").eq("id", id).eq("aktif", true).maybeSingle();
  if (!produk) return;

  const { error } = await supabase.from("klik_whatsapp").insert({ produk_id: id });
  if (error) console.error("Gagal mencatat klik WhatsApp:", error.message);
}
