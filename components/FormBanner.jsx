"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { simpanBannerAction } from "@/app/admin/actions";
import { BATAS_JUDUL_BANNER, BATAS_TEKS_BANNER } from "@/lib/validasi-banner";

// Tambah banner (tanpa `banner`) atau ubah banner yang ada.
export default function FormBanner({ banner }) {
  const [state, formAction, isPending] = useActionState(simpanBannerAction, null);
  // Setelah gagal pakai isian terakhir, setelah berhasil menambah kosongkan form.
  const v = state?.values || banner || { aktif: true };

  return (
    <form
      action={formAction}
      key={banner ? undefined : (state?.waktu ?? "awal")}
      noValidate
      className="flex max-w-xl flex-col gap-3"
    >
      {banner && <input type="hidden" name="id" value={banner.id} />}
      <Input label="Judul" name="judul" maxLength={BATAS_JUDUL_BANNER} defaultValue={v.judul || ""} error={state?.errors?.judul} required />
      <Input label="Teks" name="teks" textarea maxLength={BATAS_TEKS_BANNER} defaultValue={v.teks || ""} error={state?.errors?.teks} />
      <Input label="Link gambar (opsional)" name="gambar_url" defaultValue={v.gambar_url || ""} error={state?.errors?.gambar_url} placeholder="https://..." />
      <Input label="Atau unggah gambar (JPG, PNG, WebP, GIF, maks 2 MB)" name="gambar_file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" error={state?.errors?.gambar_file} />
      <Input label="Tautan saat banner diklik (opsional)" name="tautan" defaultValue={v.tautan || ""} error={state?.errors?.tautan} placeholder="/?kategori=Minuman atau https://..." />
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="aktif" defaultChecked={v.aktif !== false} className="h-4 w-4" />
        Aktif (tampil di beranda)
      </label>
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
        {isPending ? "Menyimpan..." : banner ? "Simpan perubahan" : "Tambah banner"}
      </Tombol>
    </form>
  );
}
