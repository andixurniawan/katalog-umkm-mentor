"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { simpanPengaturanTokoAction } from "@/app/admin/actions";
import { BATAS_ALAMAT, BATAS_JAM_BUKA, BATAS_NAMA_TOKO } from "@/lib/validasi-toko";

export default function FormPengaturanToko({ awal }) {
  const [state, formAction, isPending] = useActionState(simpanPengaturanTokoAction, null);
  const v = state?.values || awal;

  return (
    <form action={formAction} key={state?.waktu ?? "awal"} noValidate className="flex max-w-xl flex-col gap-4">
      <Input label="Nama toko" name="nama" maxLength={BATAS_NAMA_TOKO} defaultValue={v.nama} error={state?.errors?.nama} required />
      <Input
        label="Nomor WhatsApp"
        name="nomor_whatsapp"
        type="tel"
        inputMode="tel"
        defaultValue={v.nomor_whatsapp}
        error={state?.errors?.nomor_whatsapp}
        placeholder="081234567890"
        required
      />
      <Input label="Jam buka" name="jam_buka" maxLength={BATAS_JAM_BUKA} defaultValue={v.jam_buka} error={state?.errors?.jam_buka} placeholder="Setiap hari, 08.00–21.00" />
      <Input label="Alamat" name="alamat" textarea maxLength={BATAS_ALAMAT} defaultValue={v.alamat} error={state?.errors?.alamat} />
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
        {isPending ? "Menyimpan..." : "Simpan pengaturan"}
      </Tombol>
    </form>
  );
}
