export const BATAS_NAMA_TOKO = 60;
export const BATAS_JAM_BUKA = 100;
export const BATAS_ALAMAT = 300;

// Ubah isian nomor menjadi format internasional tanpa +: "0822-2737 0677" dan "+62 822..." menjadi "62822...".
// Mengembalikan null bila bentuknya tidak masuk akal.
export function normalisasiNomor(mentah) {
  const hanyaAngka = mentah.replace(/[\s\-().]/g, "").replace(/^\+/, "");
  if (!/^\d+$/.test(hanyaAngka)) return null;
  const nomor = hanyaAngka.startsWith("0") ? `62${hanyaAngka.slice(1)}` : hanyaAngka;
  return /^62\d{8,13}$/.test(nomor) ? nomor : null;
}

export function validasiToko(formData) {
  const ambil = (k) => formData.get(k)?.toString().trim() || "";
  const values = {
    nama: ambil("nama"),
    nomor_whatsapp: ambil("nomor_whatsapp"),
    jam_buka: ambil("jam_buka"),
    alamat: ambil("alamat"),
  };
  const errors = {};

  if (!values.nama) errors.nama = "Nama toko wajib diisi.";
  else if (values.nama.length > BATAS_NAMA_TOKO) errors.nama = `Nama toko maksimal ${BATAS_NAMA_TOKO} karakter.`;

  const nomor = values.nomor_whatsapp ? normalisasiNomor(values.nomor_whatsapp) : null;
  if (!values.nomor_whatsapp) errors.nomor_whatsapp = "Nomor WhatsApp wajib diisi.";
  else if (!nomor) {
    errors.nomor_whatsapp = "Nomor tidak valid. Contoh: 081234567890 atau 6281234567890 (8 sampai 13 angka setelah 62).";
  }

  if (values.jam_buka.length > BATAS_JAM_BUKA) errors.jam_buka = `Jam buka maksimal ${BATAS_JAM_BUKA} karakter.`;
  if (values.alamat.length > BATAS_ALAMAT) errors.alamat = `Alamat maksimal ${BATAS_ALAMAT} karakter.`;

  return {
    data: { nama: values.nama, nomor_whatsapp: nomor, jam_buka: values.jam_buka || null, alamat: values.alamat || null },
    values,
    errors,
  };
}
