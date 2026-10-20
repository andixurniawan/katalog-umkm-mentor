"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahVarianAction, hapusVarianAction } from "@/app/admin/actions";
import { formatRupiah } from "@/lib/format";

function BarisVarian({ varian }) {
  const [state, formAction, isPending] = useActionState(hapusVarianAction, null);
  return (
    <li className="flex items-center justify-between gap-3 p-3">
      <div>
        <span className="font-semibold">{varian.nama}</span>
        <span className="ml-2 text-sm text-teks-lembut">{formatRupiah(varian.harga)}</span>
        {state?.error && (
          <p role="alert" className="text-xs text-bahaya">
            {state.error}
          </p>
        )}
      </div>
      <form action={formAction}>
        <input type="hidden" name="id" value={varian.id} />
        <Tombol type="submit" varian="bahaya" disabled={isPending}>
          {isPending ? "Menghapus..." : "Hapus"}
        </Tombol>
      </form>
    </li>
  );
}

// Kelola varian (ukuran/porsi dengan harga sendiri) satu produk di halaman ubah produk.
export default function KelolaVarian({ produkId, daftar, error }) {
  const [state, formAction, isPending] = useActionState(tambahVarianAction, null);

  return (
    <section aria-labelledby="judul-varian" className="flex max-w-xl flex-col gap-3 border-t border-garis pt-6">
      <h2 id="judul-varian" className="text-xl font-bold">
        Varian harga
      </h2>
      <p className="text-sm text-teks-lembut">
        Opsional. Jika ada varian, pengunjung memilih salah satu dan harga mengikuti varian tersebut (harga diskon
        produk tidak dipakai untuk varian).
      </p>

      {error ? (
        <p className="rounded-lg bg-bahaya/10 p-3 text-sm font-medium text-bahaya">
          Gagal mengambil varian. Pastikan bagian 16 di docs/schema.sql sudah dijalankan.
        </p>
      ) : daftar.length === 0 ? (
        <p className="text-sm text-teks-lembut">Belum ada varian.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-garis rounded-2xl border border-garis">
          {daftar.map((v) => (
            <BarisVarian key={v.id} varian={v} />
          ))}
        </ul>
      )}

      <form action={formAction} key={state?.waktu ?? "awal"} noValidate className="flex flex-col gap-3">
        <input type="hidden" name="produk_id" value={produkId} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Nama varian" name="nama" maxLength={50} defaultValue={state?.values?.nama || ""} error={state?.errors?.nama} placeholder="Besar" />
          <Input label="Harga (Rp)" name="harga" inputMode="numeric" defaultValue={state?.values?.harga || ""} error={state?.errors?.harga} placeholder="25000" />
        </div>
        {state?.error && (
          <p role="alert" className="rounded-lg bg-bahaya/10 p-3 text-sm font-medium text-bahaya">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p role="status" className="rounded-lg bg-utama/10 p-3 text-sm font-medium text-utama">
            {state.success}
          </p>
        )}
        <Tombol type="submit" varian="garis" disabled={isPending} className="self-start">
          {isPending ? "Menyimpan..." : "Tambah varian"}
        </Tombol>
      </form>
    </section>
  );
}
