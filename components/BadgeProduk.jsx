// Label "Baru" atau "Terlaris" dari kolom badge produk.
export default function BadgeProduk({ badge, className = "" }) {
  if (!badge) return null;
  const warna = badge === "Terlaris" ? "bg-harga text-kontras" : "bg-utama text-kontras";
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${warna} ${className}`}>
      {badge}
    </span>
  );
}
