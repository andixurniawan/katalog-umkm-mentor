// Ringkasan katalog di dashboard admin: jumlah produk dan jumlah per kategori.
export default function RingkasanAdmin({ total, perKategori }) {
  const terbanyak = Math.max(1, ...perKategori.map((k) => k.jumlah));

  return (
    <section aria-labelledby="judul-ringkasan" className="flex flex-col gap-4">
      <h2 id="judul-ringkasan" className="sr-only">
        Ringkasan toko
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-garis bg-permukaan/30 p-4 sm:p-5">
          <p className="text-sm font-semibold text-teks-lembut">Total produk</p>
          <p className="mt-1 text-4xl font-extrabold text-utama">{total}</p>
        </div>
        <div className="rounded-2xl border border-garis bg-permukaan/30 p-4 sm:col-span-2 sm:p-5">
          <p className="text-sm font-semibold text-teks-lembut">Produk per kategori</p>
          {perKategori.length === 0 ? (
            <p className="mt-2 text-sm text-teks-lembut">Belum ada data kategori.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2.5">
              {perKategori.map((k) => (
                <li key={k.nama} className="text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{k.nama}</span>
                    <span className="text-teks-lembut">{k.jumlah} produk</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-garis" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-utama"
                      style={{ width: `${(k.jumlah / terbanyak) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
