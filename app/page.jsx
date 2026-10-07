import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { createPublicClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog() {
  const supabase = createPublicClient();
  let daftarProduk = null;
  let pesanError = null;

  if (!supabase) {
    pesanError = "Gagal terhubung ke database. Pastikan SUPABASE_URL dan SUPABASE_SECRET_KEY sudah diatur.";
  } else {
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data produk dari Supabase:", error);
      pesanError = "Gagal mengambil data produk dari database.";
    } else {
      daftarProduk = data;
    }
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>
        {pesanError ? (
          <p className="py-8 text-center text-bahaya">
            {pesanError}
          </p>
        ) : daftarProduk && daftarProduk.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-teks-lembut">
            Belum ada produk
          </p>
        )}
      </section>
    </>
  );
}
