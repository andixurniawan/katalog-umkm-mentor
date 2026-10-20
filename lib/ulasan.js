// Ulasan yang tampil (tampil = true) beserta jumlah dan rata-rata rating.
// Ulasan yang disembunyikan admin tidak ikut dihitung.
export async function ambilUlasanProduk(supabase, produkId) {
  const { data, error } = await supabase
    .from("ulasan")
    .select("id, nama, rating, komentar, created_at")
    .eq("produk_id", produkId)
    .eq("tampil", true)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Gagal mengambil ulasan:", error.message);
    return { daftar: [], jumlah: 0, rata: 0, error: true };
  }

  const jumlah = data.length;
  const rata = jumlah ? data.reduce((total, u) => total + u.rating, 0) / jumlah : 0;
  return { daftar: data, jumlah, rata, error: false };
}
