export const BADGE_VALID = ["Baru", "Terlaris"];

const NAMA_MAKSIMAL = 100;
const DESKRIPSI_MAKSIMAL = 2000;
const ANGKA_BULAT = /^\d+$/;

// Link foto: alamat http(s) lengkap atau path di folder public (contoh /produk/kopi.svg).
function linkFotoValid(link) {
  if (link.startsWith("/") && !link.startsWith("//")) return true;
  try {
    const { protocol } = new URL(link);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validasi isian form produk di server.
 * Mengembalikan:
 *  - values: isian mentah (string) untuk dikembalikan ke form agar tidak hilang saat error
 *  - errors: { namaField: pesan } (kosong jika semua valid)
 *  - data: nilai bersih siap disimpan ke database (hanya dipakai jika errors kosong)
 */
export function validasiProduk(formData) {
  const ambil = (kunci) => (formData.get(kunci) ?? "").toString().trim();

  const values = {
    nama: ambil("nama"),
    harga: ambil("harga"),
    harga_diskon: ambil("harga_diskon"),
    kategori: ambil("kategori"),
    badge: ambil("badge"),
    stok: ambil("stok"),
    foto_url: ambil("foto_url"),
    deskripsi: ambil("deskripsi"),
  };

  const errors = {};

  if (!values.nama) {
    errors.nama = "Nama produk wajib diisi.";
  } else if (values.nama.length > NAMA_MAKSIMAL) {
    errors.nama = `Nama produk maksimal ${NAMA_MAKSIMAL} karakter.`;
  }

  let harga = null;
  if (!values.harga) {
    errors.harga = "Harga wajib diisi.";
  } else if (!ANGKA_BULAT.test(values.harga) || Number(values.harga) < 1) {
    errors.harga = "Harga harus berupa angka bulat lebih dari 0, tanpa titik atau huruf.";
  } else if (Number(values.harga) > 2_000_000_000) {
    errors.harga = "Harga terlalu besar.";
  } else {
    harga = Number(values.harga);
  }

  let hargaDiskon = null;
  if (values.harga_diskon) {
    if (!ANGKA_BULAT.test(values.harga_diskon)) {
      errors.harga_diskon = "Harga diskon harus berupa angka bulat.";
    } else if (harga !== null && Number(values.harga_diskon) >= harga) {
      errors.harga_diskon = "Harga diskon harus lebih kecil dari harga normal.";
    } else {
      hargaDiskon = Number(values.harga_diskon);
    }
  }

  let stok = null;
  if (values.stok) {
    if (!ANGKA_BULAT.test(values.stok) || Number(values.stok) > 1_000_000) {
      errors.stok = "Stok harus berupa angka bulat 0 sampai 1.000.000.";
    } else {
      stok = Number(values.stok);
    }
  }

  if (values.badge && !BADGE_VALID.includes(values.badge)) {
    errors.badge = "Badge tidak dikenal. Pilih Baru, Terlaris, atau tanpa badge.";
  }

  if (values.foto_url) {
    const rusak = values.foto_url
      .split(/[\n,]/)
      .map((link) => link.trim())
      .filter(Boolean)
      .find((link) => !linkFotoValid(link));
    if (rusak) {
      errors.foto_url = `Link foto tidak valid: "${rusak}". Gunakan alamat yang diawali https:// atau /.`;
    }
  }

  if (values.deskripsi.length > DESKRIPSI_MAKSIMAL) {
    errors.deskripsi = `Deskripsi maksimal ${DESKRIPSI_MAKSIMAL} karakter.`;
  }

  return {
    values,
    errors,
    data: {
      nama: values.nama,
      harga,
      harga_diskon: hargaDiskon,
      kategori: values.kategori || null,
      badge: values.badge || null,
      stok,
      foto_url: values.foto_url || null,
      deskripsi: values.deskripsi || null,
    },
  };
}
