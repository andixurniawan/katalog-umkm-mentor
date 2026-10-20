import Link from "next/link";

// Banner promo di beranda. Tidak menampilkan apa pun bila tidak ada banner aktif.
export default function BannerPromo({ banner }) {
  if (!banner) return null;

  const isi = (
    <div className="relative overflow-hidden rounded-2xl border border-garis bg-utama text-kontras">
      {banner.gambar_url && (
        <img src={banner.gambar_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      )}
      <div className="relative flex flex-col gap-1 p-5 sm:p-8">
        <p className="text-xl font-extrabold sm:text-2xl">{banner.judul}</p>
        {banner.teks && <p className="max-w-xl text-sm opacity-90 sm:text-base">{banner.teks}</p>}
      </div>
    </div>
  );

  if (!banner.tautan) return <section aria-label="Promo" className="mb-10">{isi}</section>;
  const eksternal = /^https?:\/\//.test(banner.tautan);
  return (
    <section aria-label="Promo" className="mb-10">
      {eksternal ? (
        <a href={banner.tautan} target="_blank" rel="noopener noreferrer" className="block">
          {isi}
        </a>
      ) : (
        <Link href={banner.tautan} className="block">
          {isi}
        </Link>
      )}
    </section>
  );
}
