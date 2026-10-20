// Membuat deskripsi produk dengan LLM (US-14). Pemanggilan LLM-nya ada di lib/llm.js.
import { tanyaLlm } from "@/lib/llm";

function buatPrompt(nama, kategori) {
  return `Anda adalah asisten pembuat konten untuk katalog UMKM. Buatlah deskripsi produk yang menarik, profesional, singkat (sekitar 2 sampai 4 kalimat), dan persuasif dalam bahasa Indonesia.
Nama produk: ${nama}
${kategori ? `Kategori produk: ${kategori}` : ""}

Tulis HANYA deskripsi produk tersebut, tanpa tanda kutip, tanpa pembuka/penutup, dan tanpa format markdown berlebih.`;
}

/** Mengembalikan { deskripsi } atau { error } berisi pesan untuk admin. */
export async function buatDeskripsiAi({ nama, kategori }) {
  const hasil = await tanyaLlm({ user: buatPrompt(nama, kategori), maxTokens: 400, temperature: 0.7 });

  if (hasil.belumDikonfigurasi) {
    return {
      error:
        "Kunci AI belum dikonfigurasi. Isi LLM_BASE_URL dan LLM_API_KEY (atau GEMINI_API_KEY) di .env.local atau environment variable server.",
    };
  }
  if (hasil.timeout) return { error: "AI terlalu lama menjawab. Coba lagi sebentar." };
  if (hasil.error) return { error: "Gagal membuat deskripsi dengan AI: " + hasil.error };
  return { deskripsi: hasil.teks };
}
