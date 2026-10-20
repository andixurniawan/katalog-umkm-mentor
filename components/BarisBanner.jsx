"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import FormBanner from "@/components/FormBanner";
import { toggleBannerAction, deleteBannerAction } from "@/app/admin/actions";

export default function BarisBanner({ banner }) {
  const [state, formAction, isPending] = useActionState(toggleBannerAction, null);

  return (
    <li className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">
            {banner.judul}{" "}
            {!banner.aktif && (
              <span className="ml-1 rounded-md bg-garis px-2 py-0.5 text-xs font-bold text-teks-lembut">Nonaktif</span>
            )}
          </p>
          {banner.teks && <p className="text-sm text-teks-lembut">{banner.teks}</p>}
          {state?.error && (
            <span role="alert" className="text-xs text-bahaya">
              {state.error}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <form action={formAction}>
            <input type="hidden" name="id" value={banner.id} />
            <input type="hidden" name="aktif" value={String(!banner.aktif)} />
            <Tombol type="submit" varian="garis" disabled={isPending}>
              {isPending ? "Menyimpan..." : banner.aktif ? "Nonaktifkan" : "Aktifkan"}
            </Tombol>
          </form>
          <form
            action={deleteBannerAction}
            onSubmit={(e) => {
              if (!confirm(`Hapus banner "${banner.judul}"?`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={banner.id} />
            <Tombol type="submit" varian="bahaya">
              Hapus
            </Tombol>
          </form>
        </div>
      </div>
      <details>
        <summary className="cursor-pointer text-sm font-semibold text-utama">Ubah</summary>
        <div className="mt-3">
          <FormBanner banner={banner} />
        </div>
      </details>
    </li>
  );
}
