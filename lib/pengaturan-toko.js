import { unstable_cache } from "next/cache";
import { toko as tokoCadangan } from "@/lib/toko";
import { createPublicClient } from "@/lib/supabase/server";

export const TAG_TOKO = "pengaturan-toko";

const bacaDariDatabase = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    if (!supabase) return null;
    const { data, error } = await supabase.from("pengaturan_toko").select("*").eq("id", 1).maybeSingle();
    if (error) {
      console.error("Gagal mengambil pengaturan toko:", error.message);
      return null;
    }
    return data;
  },
  ["pengaturan-toko"],
  { tags: [TAG_TOKO], revalidate: 300 }
);

// Data toko dari database; field yang kosong atau tabel belum ada memakai nilai cadangan di lib/toko.js.
export async function ambilToko() {
  const data = await bacaDariDatabase();
  if (!data) return tokoCadangan;
  return {
    ...tokoCadangan,
    nama: data.nama || tokoCadangan.nama,
    nomorWhatsApp: data.nomor_whatsapp || tokoCadangan.nomorWhatsApp,
    jamBuka: data.jam_buka || tokoCadangan.jamBuka,
    alamat: data.alamat || tokoCadangan.alamat,
  };
}
