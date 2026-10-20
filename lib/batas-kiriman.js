import { headers } from "next/headers";

// Pembatas kiriman sederhana di memori server: maksimal `maks` kiriman per `jendelaMs` untuk satu alamat.
// Di Vercel setiap instance punya memori sendiri, jadi ini perlindungan dasar, bukan jaminan mutlak.
// Alamat IP hanya dipakai sebagai kunci sementara di memori dan tidak disimpan ke database.
const catatan = new Map();

export async function periksaBatasKiriman(nama, { maks, jendelaMs }) {
  const h = await headers();
  const alamat = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "lokal";
  const kunci = `${nama}:${alamat}`;
  const sekarang = Date.now();

  const waktu = (catatan.get(kunci) || []).filter((t) => sekarang - t < jendelaMs);
  if (waktu.length >= maks) {
    catatan.set(kunci, waktu);
    return { boleh: false, tungguDetik: Math.ceil((jendelaMs - (sekarang - waktu[0])) / 1000) };
  }

  waktu.push(sekarang);
  catatan.set(kunci, waktu);

  // Buang kunci lama supaya Map tidak membesar tanpa batas.
  if (catatan.size > 5000) {
    for (const [k, v] of catatan) {
      if (sekarang - v[v.length - 1] >= jendelaMs) catatan.delete(k);
    }
  }
  return { boleh: true };
}
