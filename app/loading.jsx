import Skeleton from "@/components/Skeleton";

// Tampil saat beranda (dan halaman lain tanpa loading sendiri) mengambil data dari database.
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="py-10 sm:py-14">
      <span className="sr-only">Memuat halaman...</span>
      <Skeleton className="h-10 w-2/3 max-w-md" />
      <Skeleton className="mt-4 h-5 w-1/2 max-w-sm" />
      <Skeleton className="mt-10 h-6 w-32" />
      <Skeleton className="mt-4 h-[46px] w-full" />
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-garis">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="flex flex-col gap-2 p-3">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
