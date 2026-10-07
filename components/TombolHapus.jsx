"use client";

import { deleteProductAction } from "@/app/admin/actions";
import Tombol from "@/components/Tombol";

export default function TombolHapus({ produk }) {
  const handleSubmit = (e) => {
    const setuju = confirm(`Apakah Anda yakin ingin menghapus "${produk.nama}"?`);
    if (!setuju) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteProductAction} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={produk.id} />
      <Tombol type="submit" varian="bahaya">
        Hapus
      </Tombol>
    </form>
  );
}

