import Link from "next/link";

// Lima produk dengan klik pesan WhatsApp terbanyak. `daftar` = [{ id, nama, jumlah }].
export default function TerlarisAdmin({ daftar, error }) {
  const terbanyak = Math.max(1, ...daftar.map((p) => p.jumlah));

  return (
    <section aria-labelledby="judul-terlaris" className="rounded-2xl border border-garis bg-permukaan/30 p-4 sm:p-5">
      <h2 id="judul-terlaris" className="text-sm font-semibold text-teks-lembut">
        Produk paling sering dipesan (klik WhatsApp)
      </h2>
      {error ? (
        <p className="mt-2 text-sm text-bahaya">
          Gagal mengambil data klik. Pastikan bagian 11 di docs/schema.sql sudah dijalankan.
        </p>
      ) : daftar.length === 0 ? (
        <p className="mt-2 text-sm text-teks-lembut">
          Belum ada data. Angka muncul setelah pengunjung mengklik tombol pesan via WhatsApp.
        </p>
      ) : (
        <ol className="mt-3 flex flex-col gap-2.5">
          {daftar.map((p, i) => (
            <li key={p.id} className="text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">
                  {i + 1}.{" "}
                  <Link href={`/admin/produk/${p.id}/ubah`} className="hover:text-utama">
                    {p.nama}
                  </Link>
                </span>
                <span className="text-teks-lembut">{p.jumlah} klik</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-garis" aria-hidden="true">
                <div className="h-full rounded-full bg-utama" style={{ width: `${(p.jumlah / terbanyak) * 100}%` }} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
