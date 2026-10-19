import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { toko } from "@/lib/toko";
import { createPublicClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const sp = await searchParams;
  const kataKunci = (sp?.q || sp?.cari || "").trim();
  const kategoriParam = (sp?.kategori || "").trim();
  const isKategoriAktif = Boolean(
    kategoriParam && kategoriParam.toLowerCase() !== "semua"
  );
  const kategoriTerpilih = isKategoriAktif ? kategoriParam : "";

  const supabase = createPublicClient();
  let daftarProduk = null;
  let daftarKategori = [];
  let pesanError = null;

  if (!supabase) {
    pesanError =
      "Gagal terhubung ke database. Pastikan SUPABASE_URL dan SUPABASE_SECRET_KEY sudah diatur.";
  } else {
    // Ambil semua kategori unik dari produk untuk pilihan filter
    const { data: dataKategori, error: errorKategori } = await supabase
      .from("produk")
      .select("kategori");

    if (!errorKategori && dataKategori) {
      daftarKategori = Array.from(
        new Set(
          dataKategori
            .map((p) => (p.kategori ? p.kategori.trim() : ""))
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, "id"));
    }

    // Query produk dengan filter kategori dan pencarian nama
    let query = supabase.from("produk").select("*");

    if (kategoriTerpilih) {
      query = query.ilike("kategori", kategoriTerpilih);
    }

    if (kataKunci) {
      query = query.ilike("nama", `%${kataKunci}%`);
    }

    const { data, error } = await query.order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data produk dari Supabase:", error);
      pesanError = "Gagal mengambil data produk dari database.";
    } else {
      daftarProduk = data;
    }
  }

  function buatTautanKategori(kat) {
    const params = new URLSearchParams();
    if (kat) {
      params.set("kategori", kat);
    }
    if (kataKunci) {
      params.set("q", kataKunci);
    }
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  const adaFilter = Boolean(kataKunci || kategoriTerpilih);

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="judul-produk" className="text-xl font-bold">
              Produk kami
            </h2>
            {adaFilter && (
              <Link
                href="/"
                className="text-xs font-semibold text-utama hover:underline"
              >
                Hapus semua filter
              </Link>
            )}
          </div>

          <form
            method="GET"
            action="/"
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <Input
                label="Cari produk"
                name="q"
                type="search"
                defaultValue={kataKunci}
                placeholder="Ketik nama produk..."
              />
            </div>
            {kategoriTerpilih && (
              <input type="hidden" name="kategori" value={kategoriTerpilih} />
            )}
            <div className="flex gap-2">
              <Tombol type="submit" className="h-[46px] flex-1 sm:flex-none">
                Cari
              </Tombol>
              {adaFilter && (
                <Tombol
                  href="/"
                  varian="garis"
                  className="h-[46px] flex-1 sm:flex-none"
                >
                  Reset
                </Tombol>
              )}
            </div>
          </form>

          {daftarKategori.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-teks-lembut">
                Kategori:
              </span>
              <Link
                href={buatTautanKategori("")}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  !kategoriTerpilih
                    ? "bg-utama text-white"
                    : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                }`}
              >
                Semua
              </Link>
              {daftarKategori.map((kat) => {
                const isActive =
                  kategoriTerpilih.toLowerCase() === kat.toLowerCase();
                return (
                  <Link
                    key={kat}
                    href={buatTautanKategori(kat)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-utama text-white"
                        : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                    }`}
                  >
                    {kat}
                  </Link>
                );
              })}
            </div>
          )}

          {adaFilter && daftarProduk && daftarProduk.length > 0 && (
            <p className="text-sm text-teks-lembut">
              Menampilkan {daftarProduk.length} produk
              {kategoriTerpilih && (
                <>
                  {" "}
                  untuk kategori{" "}
                  <strong className="text-teks">"{kategoriTerpilih}"</strong>
                </>
              )}
              {kataKunci && (
                <>
                  {" "}
                  dengan kata kunci{" "}
                  <strong className="text-teks">"{kataKunci}"</strong>
                </>
              )}
            </p>
          )}
        </div>

        {pesanError ? (
          <p className="py-8 text-center text-bahaya">{pesanError}</p>
        ) : daftarProduk && daftarProduk.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        ) : adaFilter ? (
          <div className="rounded-xl border border-garis bg-permukaan/30 py-12 text-center">
            <p className="text-base font-semibold text-teks">
              Tidak ada produk yang sesuai
            </p>
            <p className="mt-1 text-sm text-teks-lembut">
              {kataKunci && kategoriTerpilih
                ? `Tidak ditemukan produk dengan kata kunci "${kataKunci}" di kategori "${kategoriTerpilih}".`
                : kataKunci
                ? `Tidak ditemukan produk dengan kata kunci "${kataKunci}".`
                : `Belum ada produk di kategori "${kategoriTerpilih}".`}
            </p>
            <div className="mt-4">
              <Tombol href="/" varian="garis">
                Lihat semua produk
              </Tombol>
            </div>
          </div>
        ) : (
          <p className="py-8 text-center text-teks-lembut">Belum ada produk</p>
        )}
      </section>
    </>
  );
}
