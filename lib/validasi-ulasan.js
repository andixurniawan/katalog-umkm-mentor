export const BATAS_NAMA_ULASAN = 50;
export const BATAS_KOMENTAR_ULASAN = 500;

// Mengembalikan { data, values, errors }. Dipakai Server Action; validasi di browser hanya pelengkap.
export function validasiUlasan(formData) {
  const nama = formData.get("nama")?.toString().trim().replace(/\s+/g, " ") || "";
  const komentar = formData.get("komentar")?.toString().trim() || "";
  const ratingMentah = formData.get("rating")?.toString() || "";
  const values = { nama, komentar, rating: ratingMentah };
  const errors = {};

  if (!nama) errors.nama = "Nama wajib diisi.";
  else if (nama.length > BATAS_NAMA_ULASAN) errors.nama = `Nama maksimal ${BATAS_NAMA_ULASAN} karakter.`;

  if (!/^[1-5]$/.test(ratingMentah)) errors.rating = "Pilih rating 1 sampai 5.";

  if (!komentar) errors.komentar = "Komentar wajib diisi.";
  else if (komentar.length > BATAS_KOMENTAR_ULASAN) {
    errors.komentar = `Komentar maksimal ${BATAS_KOMENTAR_ULASAN} karakter.`;
  }

  return { data: { nama, komentar, rating: Number(ratingMentah) }, values, errors };
}
