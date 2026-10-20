"use client";

import Link from "next/link";
import { useBandingkan, BATAS_BANDINGKAN } from "@/components/BandingkanProvider";

export default function LinkBandingkan() {
  const { ids, siap } = useBandingkan();
  const jumlah = siap ? ids.length : 0;
  const href = jumlah === BATAS_BANDINGKAN ? `/bandingkan?a=${ids[0]}&b=${ids[1]}` : "/bandingkan";

  return (
    <Link href={href} className="text-sm font-semibold hover:text-utama">
      Bandingkan
      {jumlah > 0 && <span className="ml-1 text-xs text-teks-lembut">({jumlah}/{BATAS_BANDINGKAN})</span>}
    </Link>
  );
}
