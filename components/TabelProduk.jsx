import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import TombolHapus from "@/components/TombolHapus";
import TombolUrutan from "@/components/TombolUrutan";
import TombolAktif from "@/components/TombolAktif";

// `urutan` ({ mulai, total }) hanya diberikan bila daftar tidak sedang dicari dan kolom urutan sudah ada.
export default function TabelProduk({ daftarProduk, urutan }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-garis">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-permukaan text-teks-lembut">
          <tr>
            {urutan && <th className="px-4 py-3 font-semibold">Urutan</th>}
            <th className="px-4 py-3 font-semibold">Produk</th>
            <th className="px-4 py-3 font-semibold">Kategori</th>
            <th className="px-4 py-3 font-semibold">Harga</th>
            <th className="px-4 py-3 font-semibold">
              <span className="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {daftarProduk.map((produk, i) => (
            <tr
              key={produk.id}
              className={`border-t border-garis ${produk.aktif === false ? "bg-permukaan/50" : ""}`}
            >
              {urutan && (
                <td className="px-4 py-3">
                  <TombolUrutan
                    produk={produk}
                    bisaNaik={urutan.mulai + i > 0}
                    bisaTurun={urutan.mulai + i < urutan.total - 1}
                  />
                </td>
              )}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={produk.foto_url} alt="" className="h-10 w-10 rounded-md object-cover" />
                  <span className={`font-semibold ${produk.aktif === false ? "text-teks-lembut" : ""}`}>
                    {produk.nama}
                  </span>
                  {produk.aktif === false && (
                    <span className="rounded-md border border-garis px-2 py-0.5 text-xs font-semibold text-teks-lembut">
                      Nonaktif
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-teks-lembut">{produk.kategori}</td>
              <td className="px-4 py-3">{formatRupiah(produk.harga)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <TombolAktif produk={produk} />
                  <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                    Ubah
                  </Tombol>
                  <TombolHapus produk={produk} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
