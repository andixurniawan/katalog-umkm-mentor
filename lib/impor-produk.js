import { bacaCsv } from "@/lib/csv";
import { validasiProduk } from "@/lib/validasi-produk";

export const UKURAN_CSV_MAKSIMAL = 1024 * 1024; // 1 MB
export const BARIS_IMPOR_MAKSIMAL = 500;

// Nama kolom CSV (huruf besar/kecil dan spasi tidak dibedakan) -> nama field produk.
// Judul yang sama dengan hasil "Ekspor CSV" dikenali, sehingga file ekspor bisa diimpor lagi.
const KOLOM = {
  nama: "nama",
  harga: "harga",
  "harga diskon": "harga_diskon",
  harga_diskon: "harga_diskon",
  kategori: "kategori",
  stok: "stok",
  badge: "badge",
  deskripsi: "deskripsi",
  "link foto": "foto_url",
  foto_url: "foto_url",
  foto: "foto_url",
  status: "status",
};

// Awalan ' pada ekspor (pengaman rumus spreadsheet) dibuang lagi saat impor.
const bukaPengaman = (s) => s.replace(/^'(?=[=+\-@\t\r])/, "");

/**
 * Mengubah teks CSV menjadi baris produk yang valid dan daftar baris yang salah.
 * `kategoriTersedia` = nama kategori yang ada di database (produk.kategori memakai foreign key).
 * Mengembalikan { valid: [{ nomor, data }], gagal: [{ nomor, pesan }], error? }.
 * `nomor` = nomor baris di file (baris judul = 1), seperti yang terlihat di spreadsheet.
 */
export function prosesImpor(teks, kategoriTersedia) {
  const { baris, kutipTerbuka } = bacaCsv(teks);
  if (kutipTerbuka) return { valid: [], gagal: [], error: "File CSV rusak: ada tanda kutip yang tidak ditutup." };
  if (baris.length === 0) return { valid: [], gagal: [], error: "File CSV kosong." };

  const judul = baris[0].map((j) => KOLOM[j.trim().toLowerCase()] || null);
  if (!judul.includes("nama") || !judul.includes("harga")) {
    return { valid: [], gagal: [], error: 'Baris judul harus memuat kolom "Nama" dan "Harga".' };
  }

  const data = baris.slice(1);
  if (data.length === 0) return { valid: [], gagal: [], error: "File CSV tidak berisi data produk." };
  if (data.length > BARIS_IMPOR_MAKSIMAL) {
    return { valid: [], gagal: [], error: `Terlalu banyak baris (${data.length}). Maksimal ${BARIS_IMPOR_MAKSIMAL} produk per impor.` };
  }

  const peta = new Map([...kategoriTersedia].map((k) => [k.toLowerCase(), k]));
  const valid = [];
  const gagal = [];

  data.forEach((sel, i) => {
    const nomor = i + 2;
    const form = new FormData();
    let status = "";
    judul.forEach((kolom, j) => {
      if (!kolom) return;
      const nilai = bukaPengaman((sel[j] ?? "").trim());
      if (kolom === "status") status = nilai.toLowerCase();
      else form.set(kolom, nilai);
    });

    const { data: bersih, errors } = validasiProduk(form);
    const pesan = Object.values(errors);

    if (bersih.kategori) {
      const cocok = peta.get(bersih.kategori.toLowerCase());
      if (cocok) bersih.kategori = cocok;
      else pesan.push(`Kategori "${bersih.kategori}" belum ada. Tambahkan dulu di halaman Kategori.`);
    }
    if (status && !["aktif", "nonaktif"].includes(status)) pesan.push('Status harus "Aktif" atau "Nonaktif".');

    if (pesan.length > 0) {
      gagal.push({ nomor, pesan: pesan.join(" ") });
    } else {
      valid.push({ nomor, data: { ...bersih, aktif: status !== "nonaktif" } });
    }
  });

  return { valid, gagal };
}
