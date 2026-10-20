"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import Bintang from "@/components/Bintang";
import { toggleUlasanAction, deleteUlasanAction } from "@/app/admin/actions";

// Satu ulasan di halaman moderasi admin: sembunyikan/tampilkan atau hapus.
export default function BarisUlasan({ ulasan, namaProduk }) {
  const [state, formAction, isPending] = useActionState(toggleUlasanAction, null);

  return (
    <li className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between ${ulasan.tampil ? "" : "bg-permukaan/40"}`}>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <Bintang nilai={ulasan.rating} ukuran="text-sm" />
          <span className="text-sm font-semibold">{ulasan.nama}</span>
          {!ulasan.tampil && (
            <span className="rounded-md bg-garis px-2 py-0.5 text-xs font-bold text-teks-lembut">Disembunyikan</span>
          )}
        </div>
        <p className="whitespace-pre-line break-words text-sm text-teks-lembut">{ulasan.komentar}</p>
        <p className="text-xs text-teks-lembut">
          {namaProduk ? `Produk: ${namaProduk}` : `Produk #${ulasan.produk_id}`} ·{" "}
          {new Date(ulasan.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
        </p>
        {state?.error && (
          <span role="alert" className="text-xs text-bahaya">
            {state.error}
          </span>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <form action={formAction}>
          <input type="hidden" name="id" value={ulasan.id} />
          <input type="hidden" name="tampil" value={String(!ulasan.tampil)} />
          <Tombol type="submit" varian="garis" disabled={isPending}>
            {isPending ? "Menyimpan..." : ulasan.tampil ? "Sembunyikan" : "Tampilkan"}
          </Tombol>
        </form>
        <form
          action={deleteUlasanAction}
          onSubmit={(e) => {
            if (!confirm("Hapus ulasan ini secara permanen?")) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={ulasan.id} />
          <Tombol type="submit" varian="bahaya">
            Hapus
          </Tombol>
        </form>
      </div>
    </li>
  );
}
