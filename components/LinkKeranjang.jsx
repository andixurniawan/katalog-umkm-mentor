"use client";

import Link from "next/link";
import { useKeranjang } from "@/components/KeranjangProvider";

export default function LinkKeranjang() {
  const { totalItem, siap } = useKeranjang();

  return (
    <Link
      href="/keranjang"
      className="inline-flex items-center gap-2 rounded-lg border border-garis px-3 py-1.5 text-sm font-semibold hover:border-utama hover:text-utama"
    >
      Keranjang
      {siap && totalItem > 0 && (
        <span className="rounded-full bg-utama px-2 py-0.5 text-xs font-bold text-white">
          {totalItem}
        </span>
      )}
    </Link>
  );
}
