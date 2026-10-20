"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { updateProductAction } from "@/app/admin/actions";

export default function FormUbahProduk({ produk, daftarKategori }) {
  const [state, formAction, isPending] = useActionState(updateProductAction, null);

  return (
    <FormProduk
      produk={produk}
      labelTombol="Simpan perubahan"
      action={formAction}
      state={state}
      isPending={isPending}
      daftarKategori={daftarKategori}
    />
  );
}

