// "Minuman Panas" -> "minuman-panas". Dipakai untuk URL halaman kategori.
export function buatSlug(teks) {
  return (teks || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function tautanKategori(nama) {
  return `/kategori/${encodeURIComponent(buatSlug(nama))}`;
}
