"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient, createPublicClient } from "@/lib/supabase/server";

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createServerAuthClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login gagal:", error.message);
    return { error: "Email atau password salah." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createServerAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePasswordAction(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  const supabase = await createServerAuthClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu untuk mengganti password." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    console.error("Gagal mengganti password:", error.message);
    return { error: "Gagal mengganti password: " + error.message };
  }

  return { success: "Password berhasil diganti!" };
}

export async function createProductAction(prevState, formData) {
  const supabaseAuth = await createServerAuthClient();
  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga");
  const harga = parseInt(hargaRaw, 10);
  const kategori = formData.get("kategori")?.toString().trim();
  let foto_url = formData.get("foto_url")?.toString().trim();
  const deskripsi = formData.get("deskripsi")?.toString().trim();
  const fotoFile = formData.get("foto_file");

  if (!nama || isNaN(harga) || harga < 0) {
    return { error: "Nama dan harga produk (minimal 0) wajib diisi." };
  }

  // Jika file foto diunggah, simpan ke Supabase Storage pada bucket "product"
  if (fotoFile && typeof fotoFile === "object" && fotoFile.size > 0) {
    try {
      const fileExt = fotoFile.name ? fotoFile.name.split(".").pop() : "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const arrayBuffer = await fotoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Gunakan server client dengan SUPABASE_SECRET_KEY untuk upload di server
      // Sesi admin sudah terverifikasi melalui check auth di atas.
      const storageClient = createPublicClient() || supabaseAuth;

      const { error: uploadError } = await storageClient
        .storage
        .from("product")
        .upload(filePath, buffer, {
          contentType: fotoFile.type || "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("Gagal mengunggah foto ke Supabase Storage:", uploadError.message);
        return { error: "Gagal mengunggah foto ke bucket 'product': " + uploadError.message };
      }

      const { data: urlData } = storageClient
        .storage
        .from("product")
        .getPublicUrl(filePath);

      foto_url = urlData.publicUrl;
    } catch (err) {
      console.error("Error upload foto:", err);
      return { error: "Gagal memproses file foto yang diunggah." };
    }
  }

  const { error } = await supabaseAuth.from("produk").insert([
    {
      nama,
      harga,
      kategori: kategori || null,
      foto_url: foto_url || null,
      deskripsi: deskripsi || null,
    },
  ]);

  if (error) {
    console.error("Gagal menambah produk:", error.message);
    return { error: "Gagal menyimpan produk: " + error.message };
  }

  redirect("/admin");
}
