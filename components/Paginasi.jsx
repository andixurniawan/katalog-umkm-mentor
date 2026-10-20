import Link from "next/link";

// Nomor halaman yang ditampilkan: awal, akhir, dan sekitar halaman aktif; sisanya "…".
function daftarNomor(halaman, total) {
  const dipilih = new Set([1, total, halaman - 1, halaman, halaman + 1]);
  const urut = [...dipilih].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const hasil = [];
  urut.forEach((n, i) => {
    if (i > 0 && n - urut[i - 1] > 1) hasil.push("…");
    hasil.push(n);
  });
  return hasil;
}

const kelasTautan =
  "inline-flex h-9 items-center justify-center rounded-lg border border-garis bg-latar px-3 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama";
const kelasMati =
  "inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg border border-garis bg-permukaan/50 px-3 text-sm font-semibold text-teks-lembut/40";

// buatTautan(nomorHalaman) mengembalikan URL halaman tersebut (menjaga parameter lain seperti kata kunci).
export default function Paginasi({ halaman, totalHalaman, buatTautan, label = "Navigasi halaman" }) {
  if (totalHalaman <= 1) return null;

  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-center gap-1.5">
      {halaman > 1 ? (
        <Link href={buatTautan(halaman - 1)} className={kelasTautan}>
          &larr; Sebelumnya
        </Link>
      ) : (
        <span className={kelasMati}>&larr; Sebelumnya</span>
      )}

      {daftarNomor(halaman, totalHalaman).map((nomor, i) =>
        nomor === "…" ? (
          <span key={`titik-${i}`} className="px-1 text-teks-lembut" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={nomor}
            href={buatTautan(nomor)}
            aria-current={nomor === halaman ? "page" : undefined}
            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors ${
              nomor === halaman
                ? "bg-utama text-kontras"
                : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
            }`}
          >
            {nomor}
          </Link>
        )
      )}

      {halaman < totalHalaman ? (
        <Link href={buatTautan(halaman + 1)} className={kelasTautan}>
          Selanjutnya &rarr;
        </Link>
      ) : (
        <span className={kelasMati}>Selanjutnya &rarr;</span>
      )}
    </nav>
  );
}
