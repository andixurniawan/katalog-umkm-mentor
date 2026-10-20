"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahAdminAction } from "@/app/admin/actions";

export default function FormTambahAdmin() {
  const [state, formAction, isPending] = useActionState(tambahAdminAction, null);

  return (
    <form action={formAction} key={state?.waktu ?? "awal"} noValidate className="flex max-w-xl flex-col gap-3">
      <Input label="Email admin baru" name="email" type="email" defaultValue={state?.values?.email || ""} error={state?.errors?.email} autoComplete="off" required />
      <Input label="Password sementara (minimal 8 karakter)" name="password" type="password" error={state?.errors?.password} autoComplete="new-password" required />
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
        {isPending ? "Menyimpan..." : "Tambah admin"}
      </Tombol>
    </form>
  );
}
