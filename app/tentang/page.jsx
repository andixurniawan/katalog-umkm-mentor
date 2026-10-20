import Tombol from "@/components/Tombol";
import { toko } from "@/lib/toko";

export const metadata = { title: "Tentang kami" };

export default function HalamanTentang() {
  const linkWhatsApp = `https://wa.me/${toko.nomorWhatsApp}`;
  // Tampilkan nomor dalam format lokal, misalnya 6282227370677 menjadi 082227370677.
  const nomorTampil = `0${toko.nomorWhatsApp.replace(/^62/, "")}`;

  return (
    <div className="max-w-2xl py-8 md:py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Tentang {toko.nama}</h1>
      <p className="mt-2 text-lg text-teks-lembut">{toko.tagline}</p>

      <section aria-labelledby="judul-profil" className="mt-8">
        <h2 id="judul-profil" className="text-xl font-bold">
          Profil toko
        </h2>
        <p className="mt-2 leading-relaxed text-teks-lembut">
          {toko.nama} adalah usaha lokal yang menjual produk pilihan langsung dari pemiliknya.
          Lihat katalog, pilih produk yang kamu suka, lalu pesan lewat WhatsApp tanpa perlu
          membuat akun.
        </p>
      </section>

      <section aria-labelledby="judul-kontak" className="mt-8">
        <h2 id="judul-kontak" className="text-xl font-bold">
          Alamat dan kontak
        </h2>
        <dl className="mt-3 flex flex-col gap-4 rounded-xl border border-garis bg-permukaan/30 p-4 sm:p-5">
          <div>
            <dt className="text-sm font-semibold">Alamat</dt>
            <dd className="text-teks-lembut">{toko.alamat}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold">Jam buka</dt>
            <dd className="text-teks-lembut">{toko.jamBuka}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold">WhatsApp</dt>
            <dd className="text-teks-lembut">{nomorTampil}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-utama px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
          >
            Hubungi via WhatsApp
          </a>
          <Tombol href="/" varian="garis">
            Lihat katalog
          </Tombol>
        </div>
      </section>
    </div>
  );
}
