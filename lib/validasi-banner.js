import { linkValid } from "@/lib/link";

export const BATAS_JUDUL_BANNER = 100;
export const BATAS_TEKS_BANNER = 300;

// Mengembalikan { data, values, errors } untuk form banner admin.
export function validasiBanner(formData) {
  const ambil = (k) => formData.get(k)?.toString().trim() || "";
  const values = {
    judul: ambil("judul"),
    teks: ambil("teks"),
    gambar_url: ambil("gambar_url"),
    tautan: ambil("tautan"),
    aktif: formData.get("aktif") === "on",
  };
  const errors = {};

  if (!values.judul) errors.judul = "Judul wajib diisi.";
  else if (values.judul.length > BATAS_JUDUL_BANNER) errors.judul = `Judul maksimal ${BATAS_JUDUL_BANNER} karakter.`;

  if (values.teks.length > BATAS_TEKS_BANNER) errors.teks = `Teks maksimal ${BATAS_TEKS_BANNER} karakter.`;

  if (values.gambar_url && !linkValid(values.gambar_url)) {
    errors.gambar_url = "Link gambar tidak valid. Gunakan alamat yang diawali https:// atau /.";
  }
  if (values.tautan && !linkValid(values.tautan)) {
    errors.tautan = "Tautan tidak valid. Gunakan alamat yang diawali https:// atau /.";
  }

  return {
    data: {
      judul: values.judul,
      teks: values.teks || null,
      gambar_url: values.gambar_url || null,
      tautan: values.tautan || null,
      aktif: values.aktif,
    },
    values,
    errors,
  };
}
