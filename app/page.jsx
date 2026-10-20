import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import BannerPromo from "@/components/BannerPromo";
import TerakhirDilihat from "@/components/TerakhirDilihat";
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
  const urutan = (sp?.urutan || sp?.sort || "").toLowerCase().trim();

  const halamanParam = sp?.halaman || sp?.page || "1";
  const halaman = Math.max(1, parseInt(halamanParam, 10) || 1);
  const perPageParam = sp?.per_page || sp?.limit;
  const perPage = Math.max(1, parseInt(perPageParam || "12", 10) || 12);

  const supabase = createPublicClient();
  let banner = null;
  let daftarProduk = null;
  let daftarKategori = [];
  let pesanError = null;
  let totalProduk = 0;
  let totalHalaman = 1;

  if (!supabase) {
    pesanError =
      "Gagal terhubung ke database. Pastikan SUPABASE_URL dan SUPABASE_SECRET_KEY sudah diatur.";
  } else {
    // Banner aktif terbaru; bila tabel belum ada atau error, beranda tetap tampil tanpa banner.
    const { data: dataBanner } = await supabase
      .from("banner")
      .select("*")
      .eq("aktif", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    banner = dataBanner || null;

    // Ambil semua kategori unik dari produk untuk pilihan filter
    const { data: dataKategori, error: errorKategori } = await supabase
      .from("produk")
      .select("kategori")
      .eq("aktif", true);

    if (!errorKategori && dataKategori) {
      daftarKategori = Array.from(
        new Set(
          dataKategori
            .map((p) => (p.kategori ? p.kategori.trim() : ""))
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, "id"));
    }

    // Query produk dengan filter kategori, pencarian nama, urutan, dan paginasi langsung di query database
    let query = supabase
      .from("produk")
      .select("*", { count: "exact" })
      .eq("aktif", true);

    if (kategoriTerpilih) {
      query = query.ilike("kategori", kategoriTerpilih);
    }

    if (kataKunci) {
      query = query.ilike("nama", `%${kataKunci}%`);
    }

    if (urutan === "termurah") {
      query = query
        .order("harga", { ascending: true })
        .order("id", { ascending: true });
    } else if (urutan === "termahal") {
      query = query
        .order("harga", { ascending: false })
        .order("id", { ascending: true });
    } else if (urutan === "terbaru") {
      query = query
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });
    } else {
      query = query.order("id", { ascending: true });
    }

    // Pembatasan jumlah dilakukan langsung di database menggunakan .range()
    const from = (halaman - 1) * perPage;
    const to = from + perPage - 1;

    const { data, count, error } = await query.range(from, to);

    if (error) {
      console.error("Gagal mengambil data produk dari Supabase:", error);
      pesanError = "Gagal mengambil data produk dari database.";
    } else {
      daftarProduk = data;
      totalProduk = count || 0;
      totalHalaman = Math.max(1, Math.ceil(totalProduk / perPage));
    }
  }

  function buatTautan({ kategoriBaru, urutanBaru, halamanBaru }) {
    const params = new URLSearchParams();

    const kat =
      kategoriBaru !== undefined ? kategoriBaru : kategoriTerpilih;
    if (kat) {
      params.set("kategori", kat);
    }

    const urt = urutanBaru !== undefined ? urutanBaru : urutan;
    if (urt) {
      params.set("urutan", urt);
    }

    if (kataKunci) {
      params.set("q", kataKunci);
    }

    // Jika filter atau urutan diubah, otomatis reset ke halaman 1
    const hal =
      halamanBaru !== undefined
        ? halamanBaru
        : kategoriBaru !== undefined || urutanBaru !== undefined
        ? 1
        : halaman;

    if (hal && hal > 1) {
      params.set("halaman", hal);
    }

    if (perPageParam) {
      params.set("per_page", perPage);
    }

    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  const adaFilter = Boolean(kataKunci || kategoriTerpilih || urutan || halaman > 1);

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <BannerPromo banner={banner} />

      <TerakhirDilihat />

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
            <div className="flex flex-col gap-1.5 sm:w-44">
              <label htmlFor="urutan" className="text-sm font-semibold">
                Urutan
              </label>
              <select
                id="urutan"
                name="urutan"
                defaultValue={urutan}
                className="h-[46px] w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
              >
                <option value="">Bawaan</option>
                <option value="termurah">Termurah</option>
                <option value="termahal">Termahal</option>
                <option value="terbaru">Terbaru</option>
              </select>
            </div>
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
                href={buatTautan({ kategoriBaru: "" })}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  !kategoriTerpilih
                    ? "bg-utama text-kontras"
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
                    href={buatTautan({ kategoriBaru: kat })}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-utama text-kontras"
                        : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                    }`}
                  >
                    {kat}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-teks-lembut">
              Urutkan:
            </span>
            {[
              { id: "", label: "Bawaan" },
              { id: "termurah", label: "Termurah" },
              { id: "termahal", label: "Termahal" },
              { id: "terbaru", label: "Terbaru" },
            ].map((item) => {
              const isActive = urutan === item.id;
              return (
                <Link
                  key={item.id || "bawaan"}
                  href={buatTautan({ urutanBaru: item.id })}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-utama text-kontras"
                      : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {adaFilter && daftarProduk && daftarProduk.length > 0 && (
            <p className="text-sm text-teks-lembut">
              Menampilkan {daftarProduk.length} dari {totalProduk} produk
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
              {urutan && (
                <>
                  {" "}
                  (urutan:{" "}
                  <strong className="text-teks">
                    {urutan === "termurah"
                      ? "Termurah"
                      : urutan === "termahal"
                      ? "Termahal"
                      : urutan === "terbaru"
                      ? "Terbaru"
                      : urutan}
                  </strong>
                  )
                </>
              )}
            </p>
          )}
        </div>

        {pesanError ? (
          <p className="py-8 text-center text-bahaya">{pesanError}</p>
        ) : daftarProduk && daftarProduk.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>

            {totalHalaman > 1 && (
              <nav
                aria-label="Navigasi halaman produk"
                className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-garis bg-latar p-4 sm:flex-row"
              >
                <p className="text-sm text-teks-lembut">
                  Halaman <strong className="text-teks">{halaman}</strong> dari{" "}
                  <strong className="text-teks">{totalHalaman}</strong> (Total {totalProduk} produk)
                </p>

                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {halaman > 1 ? (
                    <Link
                      href={buatTautan({ halamanBaru: halaman - 1 })}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-garis bg-latar px-3 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
                    >
                      &larr; Sebelumnya
                    </Link>
                  ) : (
                    <span className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg border border-garis bg-permukaan/50 px-3 text-sm font-semibold text-teks-lembut/40">
                      &larr; Sebelumnya
                    </span>
                  )}

                  {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((nomor) => {
                    const isAktif = nomor === halaman;
                    return (
                      <Link
                        key={nomor}
                        href={buatTautan({ halamanBaru: nomor })}
                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors ${
                          isAktif
                            ? "bg-utama text-kontras"
                            : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                        }`}
                      >
                        {nomor}
                      </Link>
                    );
                  })}

                  {halaman < totalHalaman ? (
                    <Link
                      href={buatTautan({ halamanBaru: halaman + 1 })}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-garis bg-latar px-3 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
                    >
                      Selanjutnya &rarr;
                    </Link>
                  ) : (
                    <span className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg border border-garis bg-permukaan/50 px-3 text-sm font-semibold text-teks-lembut/40">
                      Selanjutnya &rarr;
                    </span>
                  )}
                </div>
              </nav>
            )}
          </>
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
                : kategoriTerpilih
                ? `Belum ada produk di kategori "${kategoriTerpilih}".`
                : "Tidak ada produk yang sesuai dengan filter atau urutan yang dipilih."}
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
