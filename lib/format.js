export function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

// Harga diskon hanya berlaku jika terisi dan lebih kecil dari harga normal.
export function hargaAktif(produk) {
  const diskon = produk.harga_diskon;
  return diskon != null && diskon < produk.harga ? diskon : produk.harga;
}

export function adaDiskon(produk) {
  return hargaAktif(produk) < produk.harga;
}
