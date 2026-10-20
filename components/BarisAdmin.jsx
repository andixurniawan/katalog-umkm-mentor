"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import { ubahStatusAdminAction, hapusAdminAction } from "@/app/admin/actions";

export default function BarisAdmin({ akun, diriSendiri }) {
  const [stateStatus, aksiStatus, sedangUbah] = useActionState(ubahStatusAdminAction, null);
  const [stateHapus, aksiHapus, sedangHapus] = useActionState(hapusAdminAction, null);
  const galat = stateStatus?.error || stateHapus?.error;

  return (
    <li className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="break-all font-semibold">
          {akun.email}{" "}
          {diriSendiri && <span className="ml-1 rounded-md bg-utama/10 px-2 py-0.5 text-xs font-bold text-utama">Anda</span>}
          {akun.nonaktif && <span className="ml-1 rounded-md bg-garis px-2 py-0.5 text-xs font-bold text-teks-lembut">Nonaktif</span>}
        </p>
        <p className="text-xs text-teks-lembut">
          Dibuat {akun.dibuat} · Login terakhir {akun.loginTerakhir}
        </p>
        {galat && (
          <span role="alert" className="text-xs text-bahaya">
            {galat}
          </span>
        )}
      </div>
      {!diriSendiri && (
        <div className="flex shrink-0 gap-2">
          <form action={aksiStatus}>
            <input type="hidden" name="id" value={akun.id} />
            <input type="hidden" name="nonaktif" value={String(!akun.nonaktif)} />
            <Tombol type="submit" varian="garis" disabled={sedangUbah}>
              {sedangUbah ? "Menyimpan..." : akun.nonaktif ? "Aktifkan" : "Nonaktifkan"}
            </Tombol>
          </form>
          <form
            action={aksiHapus}
            onSubmit={(e) => {
              if (!confirm(`Hapus admin ${akun.email}? Akun tidak bisa dikembalikan.`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={akun.id} />
            <Tombol type="submit" varian="bahaya" disabled={sedangHapus}>
              Hapus
            </Tombol>
          </form>
        </div>
      )}
    </li>
  );
}
