"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { kirimUlasanAction } from "@/app/produk/[id]/actions";
import { BATAS_KOMENTAR_ULASAN, BATAS_NAMA_ULASAN } from "@/lib/validasi-ulasan";

export default function FormUlasan({ produkId }) {
  const [state, formAction, isPending] = useActionState(kirimUlasanAction, null);
  const v = state?.values || {};

  return (
    // key berubah setelah sukses supaya form kosong lagi
    <form action={formAction} key={state?.waktu ?? "awal"} noValidate className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="produk_id" value={produkId} />
      {/* Honeypot: tersembunyi dari pengunjung, bot biasanya mengisinya */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Jangan diisi
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Input
        label="Nama"
        name="nama"
        maxLength={BATAS_NAMA_ULASAN}
        defaultValue={v.nama}
        error={state?.errors?.nama}
        required
      />

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-sm font-semibold">Rating</legend>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded-lg border border-garis bg-latar px-3 py-1.5 text-sm font-semibold has-[:checked]:border-utama has-[:checked]:bg-utama has-[:checked]:text-kontras"
            >
              <input type="radio" name="rating" value={n} defaultChecked={v.rating === String(n)} className="sr-only" />
              {n} ★
            </label>
          ))}
        </div>
        {state?.errors?.rating && (
          <p role="alert" className="text-sm font-medium text-bahaya">
            {state.errors.rating}
          </p>
        )}
      </fieldset>

      <Input
        label="Komentar"
        name="komentar"
        textarea
        maxLength={BATAS_KOMENTAR_ULASAN}
        defaultValue={v.komentar}
        error={state?.errors?.komentar}
        required
      />

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

      <Tombol type="submit" disabled={isPending} className="self-start">
        {isPending ? "Mengirim..." : "Kirim ulasan"}
      </Tombol>
    </form>
  );
}
