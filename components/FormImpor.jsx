"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { imporProdukAction } from "@/app/admin/actions";

export default function FormImpor() {
  const [state, formAction, isPending] = useActionState(imporProdukAction, null);
  const r = state?.ringkasan;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <form action={formAction} key={state?.waktu ?? "awal"} className="flex flex-col gap-3">
        <Input label="File CSV" name="berkas_csv" type="file" accept=".csv,text/csv" required />
        <Tombol type="submit" disabled={isPending} className="self-start">
          {isPending ? "Mengimpor..." : "Impor produk"}
        </Tombol>
      </form>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-bahaya/10 p-3 text-sm font-medium text-bahaya">
          {state.error}
        </p>
      )}

      {r && (
        <section aria-label="Hasil impor" role="status" className="flex flex-col gap-3 rounded-2xl border border-garis p-4">
          <p className="font-bold">
            Selesai: <span className="text-utama">{r.berhasil} berhasil</span>,{" "}
            <span className={r.gagal.length ? "text-bahaya" : ""}>{r.gagal.length} gagal</span> dari {r.total} baris.
          </p>
          {r.gagal.length > 0 && (
            <>
              <p className="text-sm text-teks-lembut">
                Baris yang gagal tidak disimpan. Perbaiki di file lalu impor lagi (hanya baris yang gagal juga boleh).
              </p>
              <ul className="flex flex-col divide-y divide-garis text-sm">
                {r.gagal.map((g) => (
                  <li key={g.nomor} className="py-2">
                    <strong>Baris {g.nomor}:</strong> {g.pesan}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </div>
  );
}
