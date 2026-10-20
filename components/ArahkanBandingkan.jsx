"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBandingkan, BATAS_BANDINGKAN } from "@/components/BandingkanProvider";

// Dipakai saat /bandingkan dibuka tanpa parameter: bila sudah ada 2 pilihan tersimpan, langsung ke perbandingannya.
export default function ArahkanBandingkan() {
  const { ids, siap, kosongkan } = useBandingkan();
  const router = useRouter();

  useEffect(() => {
    if (siap && ids.length === BATAS_BANDINGKAN) {
      router.replace(`/bandingkan?a=${ids[0]}&b=${ids[1]}`);
    }
  }, [siap, ids, router]);

  if (!siap || ids.length === 0) return null;

  return (
    <p className="text-sm text-teks-lembut">
      Terpilih {ids.length} dari {BATAS_BANDINGKAN} produk.{" "}
      <button type="button" onClick={kosongkan} className="font-semibold text-utama hover:underline">
        Kosongkan pilihan
      </button>
    </p>
  );
}
