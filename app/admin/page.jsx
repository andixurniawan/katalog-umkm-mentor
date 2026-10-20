import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import TerlarisAdmin from "@/components/TerlarisAdmin";
import RingkasanAdmin from "@/components/RingkasanAdmin";
import Tombol from "@/components/Tombol";
import Input from "@/components/Input";
import Paginasi from "@/components/Paginasi";
import { createServerAuthClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PER_HALAMAN = 10;

export default async function HalamanAdmin({ searchParams }) {
  const sp = await searchParams;
  const kataKunci = (sp?.q || "").toString().trim().slice(0, 100);
  const halaman = Math.max(1, parseInt(sp?.halaman, 10) || 1);

  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Pencarian dan pembatasan jumlah dilakukan di query database. % dan _ dari pengguna
  // di-escape supaya dicari apa adanya, bukan sebagai wildcard.
  const dari = (halaman - 1) * PER_HALAMAN;
  let queryDaftar = supabase.from("produk").select("*", { count: "exact" });
  if (kataKunci) {
    queryDaftar = queryDaftar.ilike("nama", `%${kataKunci.replace(/[\\%_]/g, "\\$&")}%`);
  }
  queryDaftar = queryDaftar.order("id", { ascending: true }).range(dari, dari + PER_HALAMAN - 1);

  // Daftar produk dan data ringkasan diambil bersamaan dari database.
  const [
    { data: daftarProduk, count, error },
    { data: dataKategori, error: errorRingkasan },
  ] = await Promise.all([queryDaftar, supabase.from("produk").select("kategori")]);

  // Lima produk dengan klik terbanyak, dihitung di database lewat view klik_whatsapp_per_produk.
  const { data: dataKlik, error: errorKlik } = await supabase
    .from("klik_whatsapp_per_produk")
    .select("produk_id, jumlah")
    .order("jumlah", { ascending: false })
    .limit(5);
  let terlaris = [];
  if (!errorKlik && dataKlik?.length) {
    const { data: dataNama } = await supabase
      .from("produk")
      .select("id, nama")
      .in("id", dataKlik.map((k) => k.produk_id));
    const namaProduk = new Map((dataNama || []).map((p) => [p.id, p.nama]));
    terlaris = dataKlik.map((k) => ({ id: k.produk_id, nama: namaProduk.get(k.produk_id) || `Produk #${k.produk_id}`, jumlah: k.jumlah }));
  }

  function buatTautan(nomor) {
    const params = new URLSearchParams();
    if (kataKunci) params.set("q", kataKunci);
    if (nomor > 1) params.set("halaman", nomor);
    return params.size ? `/admin?${params}` : "/admin";
  }

  // Nomor halaman di URL melebihi jumlah halaman (misalnya setelah menghapus produk terakhir di halaman itu):
  // PostgREST membalas PGRST103 "range not satisfiable", jadi hitung total lalu pindah ke halaman terakhir.
  if (error?.code === "PGRST103") {
    let queryHitung = supabase.from("produk").select("id", { count: "exact", head: true });
    if (kataKunci) {
      queryHitung = queryHitung.ilike("nama", `%${kataKunci.replace(/[\\%_]/g, "\\$&")}%`);
    }
    const { count: totalSemua } = await queryHitung;
    redirect(buatTautan(Math.max(1, Math.ceil((totalSemua || 0) / PER_HALAMAN))));
  }

  const totalHasil = count || 0;
  const totalHalaman = Math.max(1, Math.ceil(totalHasil / PER_HALAMAN));

  if (error) {
    console.error("Gagal mengambil data produk admin:", error.message);
  }
  if (errorRingkasan) {
    console.error("Gagal mengambil ringkasan admin:", errorRingkasan.message);
  }

  const hitungKategori = new Map();
  for (const { kategori } of dataKategori || []) {
    const nama = kategori?.trim() || "Tanpa kategori";
    hitungKategori.set(nama, (hitungKategori.get(nama) || 0) + 1);
  }
  const perKategori = [...hitungKategori]
    .map(([nama, jumlah]) => ({ nama, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah || a.nama.localeCompare(b.nama, "id"));

  const produkList = daftarProduk || [];

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      {errorRingkasan ? (
        <p className="rounded-lg bg-bahaya/10 p-3 text-sm font-medium text-bahaya">
          Gagal mengambil ringkasan toko dari database.
        </p>
      ) : (
        <RingkasanAdmin total={dataKategori?.length ?? 0} perKategori={perKategori} />
      )}
      <TerlarisAdmin daftar={terlaris} error={Boolean(errorKlik)} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/ekspor-csv"
            download
            className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
          >
            Ekspor CSV
          </a>
          <Tombol href="/admin/impor" varian="garis">
            Impor CSV
          </Tombol>
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>
      <form method="GET" action="/admin" role="search" className="flex max-w-xl items-end gap-2">
        <div className="flex-1">
          <Input
            label="Cari produk"
            name="q"
            type="search"
            defaultValue={kataKunci}
            placeholder="Ketik nama produk..."
            maxLength={100}
          />
        </div>
        <Tombol type="submit" className="h-[46px]">
          Cari
        </Tombol>
        {kataKunci && (
          <Tombol href="/admin" varian="garis" className="h-[46px]">
            Reset
          </Tombol>
        )}
      </form>
      {error ? (
        <p className="py-8 text-center font-medium text-bahaya">
          Gagal mengambil data produk dari database.
        </p>
      ) : produkList.length === 0 ? (
        <p className="py-8 text-center font-medium text-teks-lembut">
          {kataKunci ? `Tidak ada produk dengan nama "${kataKunci}".` : "Belum ada produk."}
        </p>
      ) : (
        <>
          <p className="text-sm text-teks-lembut">
            Menampilkan {dari + 1}–{dari + produkList.length} dari {totalHasil} produk
            {kataKunci && (
              <>
                {" "}
                dengan kata kunci <strong className="text-teks">"{kataKunci}"</strong>
              </>
            )}
          </p>
          <TabelProduk daftarProduk={produkList} />
          <Paginasi
            halaman={halaman}
            totalHalaman={totalHalaman}
            buatTautan={buatTautan}
            label="Navigasi halaman daftar produk"
          />
        </>
      )}
    </div>
  );
}
