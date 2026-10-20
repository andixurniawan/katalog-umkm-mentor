"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { createCategoryAction } from "@/app/admin/actions";

export default function FormTambahKategori() {
  const [state, formAction, isPending] = useActionState(createCategoryAction, null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {/* key berubah setelah sukses supaya kolom kosong lagi */}
        <div className="flex-1" key={state?.waktu ?? "awal"}>
          <Input label="Tambah kategori" name="nama" maxLength={50} placeholder="Contoh: Minuman" required />
        </div>
        <Tombol type="submit" disabled={isPending} className="h-[46px]">
          {isPending ? "Menyimpan..." : "Tambah"}
        </Tombol>
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
    </form>
  );
}
