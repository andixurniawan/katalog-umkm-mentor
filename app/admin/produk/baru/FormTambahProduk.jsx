"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { createProductAction } from "@/app/admin/actions";

export default function FormTambahProduk({ daftarKategori }) {
  const [state, formAction, isPending] = useActionState(createProductAction, null);

  return (
    <FormProduk
      labelTombol="Simpan produk"
      action={formAction}
      state={state}
      isPending={isPending}
      daftarKategori={daftarKategori}
    />
  );
}
