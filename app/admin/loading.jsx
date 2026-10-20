import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="py-8">
      <span className="sr-only">Memuat halaman admin...</span>
      <Skeleton className="h-8 w-48" />
      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
