// Varian harga satu produk, termurah dulu. Jika tabel belum ada atau error, dikembalikan daftar kosong
// sehingga halaman produk tetap tampil seperti sebelum ada varian.
export async function ambilVarianProduk(supabase, produkId) {
  const { data, error } = await supabase
    .from("varian")
    .select("id, nama, harga")
    .eq("produk_id", produkId)
    .order("harga", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Gagal mengambil varian:", error.message);
    return [];
  }
  return data;
}
