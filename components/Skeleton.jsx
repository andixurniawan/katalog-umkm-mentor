// Kotak abu-abu berdenyut sebagai pengganti konten yang sedang dimuat.
export default function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-permukaan motion-reduce:animate-none ${className}`}
    />
  );
}
