"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import { toggleProductActiveAction } from "@/app/admin/actions";

// Menyembunyikan atau menampilkan produk di katalog publik tanpa menghapusnya.
export default function TombolAktif({ produk }) {
  const [state, formAction, isPending] = useActionState(toggleProductActiveAction, null);
  const aktif = produk.aktif !== false;

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={produk.id} />
      <input type="hidden" name="aktif" value={String(!aktif)} />
      <Tombol type="submit" varian="garis" disabled={isPending}>
        {isPending ? "Menyimpan..." : aktif ? "Nonaktifkan" : "Aktifkan"}
      </Tombol>
      {state?.error && (
        <span role="alert" className="max-w-48 text-right text-xs text-bahaya">
          {state.error}
        </span>
      )}
    </form>
  );
}
