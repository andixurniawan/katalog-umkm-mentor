"use client";

import { useActionState, useState } from "react";
import Tombol from "@/components/Tombol";
import { tanyaProdukAction } from "@/app/produk/[id]/actions";

const BATAS = 200;

export default function FormTanyaAi({ produkId }) {
  const [state, formAction, isPending] = useActionState(tanyaProdukAction, null);
  const [teks, setTeks] = useState("");

  return (
    <div className="flex max-w-xl flex-col gap-3">
      <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="produk_id" value={produkId} />
        <label htmlFor="pertanyaan" className="text-sm font-semibold">
          Pertanyaanmu
        </label>
        <textarea
          id="pertanyaan"
          name="pertanyaan"
          rows={2}
          maxLength={BATAS}
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Contoh: Apakah produk ini cocok untuk hadiah?"
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        <div className="flex items-center justify-between gap-3">
          <Tombol type="submit" disabled={isPending || !teks.trim()}>
            {isPending ? "Menjawab..." : "Tanya"}
          </Tombol>
          <span className="text-xs text-teks-lembut">
            {teks.length}/{BATAS}
          </span>
        </div>
      </form>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-bahaya/10 p-3 text-sm font-medium text-bahaya">
          {state.error}
        </p>
      )}
      {state?.jawaban && (
        <div role="status" className="rounded-xl border border-garis bg-permukaan/30 p-4 text-sm leading-relaxed">
          <p className="text-xs font-semibold text-teks-lembut">Jawaban asisten AI</p>
          <p className="mt-1 whitespace-pre-line">{state.jawaban}</p>
          <p className="mt-2 text-xs text-teks-lembut">
            Dijawab otomatis dari data produk ini. Untuk memastikan, tanyakan langsung ke penjual.
          </p>
        </div>
      )}
    </div>
  );
}
