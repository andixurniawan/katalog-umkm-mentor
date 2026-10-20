import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="py-8 md:py-12">
      <span className="sr-only">Memuat produk...</span>
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
