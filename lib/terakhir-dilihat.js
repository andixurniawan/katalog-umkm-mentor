// Daftar produk yang terakhir dibuka, disimpan di localStorage browser (bukan di server).
export const KUNCI_DILIHAT = "terakhir-dilihat";
export const BATAS_DILIHAT = 8;

export function bacaDilihat() {
  try {
    const data = JSON.parse(window.localStorage.getItem(KUNCI_DILIHAT) || "[]");
    return Array.isArray(data) ? data.filter((p) => p && Number.isInteger(p.id)).slice(0, BATAS_DILIHAT) : [];
  } catch {
    return [];
  }
}

// Hanya kolom yang dipakai kartu produk yang disimpan, supaya ukurannya kecil.
export function simpanDilihat(produk) {
  try {
    const ringkas = {
      id: Number(produk.id),
      nama: produk.nama,
      harga: produk.harga,
      harga_diskon: produk.harga_diskon ?? null,
      foto_url: produk.foto_url ? produk.foto_url.split(/[\n,]/)[0].trim() : null,
      kategori: produk.kategori ?? null,
      badge: produk.badge ?? null,
      stok: produk.stok ?? null,
    };
    const daftar = [ringkas, ...bacaDilihat().filter((p) => p.id !== ringkas.id)].slice(0, BATAS_DILIHAT);
    window.localStorage.setItem(KUNCI_DILIHAT, JSON.stringify(daftar));
  } catch {
    // Storage penuh atau diblokir: fitur ini hanya pelengkap, abaikan.
  }
}
