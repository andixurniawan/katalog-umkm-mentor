import { createPublicClient } from "@/lib/supabase/server";

export const UKURAN_MAKSIMAL = 2 * 1024 * 1024; // 2 MB
const BUCKET = "product";

// Tipe yang diizinkan, lengkap dengan tanda awal file (magic bytes) untuk memeriksa isi sebenarnya.
// SVG sengaja tidak diizinkan karena bisa memuat script.
const TIPE_GAMBAR = {
  "image/jpeg": { ekstensi: "jpg", cocok: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": {
    ekstensi: "png",
    cocok: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  "image/gif": { ekstensi: "gif", cocok: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 },
  "image/webp": {
    ekstensi: "webp",
    cocok: (b) =>
      b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP",
  },
};

/**
 * Validasi lalu unggah foto ke Supabase Storage dari server (memakai SUPABASE_SECRET_KEY).
 * Mengembalikan { url } jika berhasil atau { error } berisi pesan untuk admin.
 */
export async function unggahFoto(file) {
  if (file.size > UKURAN_MAKSIMAL) {
    return {
      error: `Ukuran foto terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal ${UKURAN_MAKSIMAL / 1024 / 1024} MB.`,
    };
  }

  const tipe = TIPE_GAMBAR[file.type];
  if (!tipe) {
    return { error: "Tipe file tidak didukung. Gunakan foto JPG, PNG, WebP, atau GIF." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!tipe.cocok(buffer)) {
    return { error: "Isi file bukan gambar yang valid. Pilih file foto yang lain." };
  }

  const storage = createPublicClient()?.storage;
  if (!storage) {
    return { error: "Gagal terhubung ke Supabase Storage. Periksa SUPABASE_URL dan SUPABASE_SECRET_KEY." };
  }

  // Nama file dibuat sendiri; nama dan ekstensi dari pengguna tidak dipakai.
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${tipe.ekstensi}`;

  const { error } = await storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("Gagal mengunggah foto ke Supabase Storage:", error.message);
    return { error: `Gagal mengunggah foto ke bucket '${BUCKET}': ${error.message}` };
  }

  const { data } = storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
