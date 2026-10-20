// Rating dalam bentuk bintang. Teks sr-only untuk pembaca layar.
export default function Bintang({ nilai, ukuran = "text-base" }) {
  const bulat = Math.round(nilai);
  return (
    <span className={`inline-flex ${ukuran} leading-none text-harga`} role="img" aria-label={`Rating ${nilai.toFixed(1)} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" className={n <= bulat ? "" : "opacity-25"}>
          ★
        </span>
      ))}
    </span>
  );
}
