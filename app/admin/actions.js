"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { createServerAuthClient, createPublicClient } from "@/lib/supabase/server";
import { unggahFoto } from "@/lib/unggah-foto";
import { validasiProduk } from "@/lib/validasi-produk";
import { buatDeskripsiAi } from "@/lib/deskripsi-ai";
import { catatLog } from "@/lib/log-aktivitas";
import { validasiToko } from "@/lib/validasi-toko";
import { TAG_TOKO } from "@/lib/pengaturan-toko";
import { validasiBanner } from "@/lib/validasi-banner";

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

  const { data, values, errors } = validasiProduk(formData);
  const fotoFile = formData.get("foto_file");

  if (Object.keys(errors).length > 0) {
    return { error: "Periksa kembali isian yang ditandai.", errors, values };
  }

  let foto_url = data.foto_url;

  // Foto yang diunggah ditambahkan ke link foto yang sudah ada (galeri US-18 tidak ikut terhapus).
  if (fotoFile && typeof fotoFile === "object" && fotoFile.size > 0) {
    const hasil = await unggahFoto(fotoFile);
    if (hasil.error) {
      return { errors: { foto_file: hasil.error }, values };
    }
    foto_url = foto_url ? `${foto_url},${hasil.url}` : hasil.url;
  }

  const { data: baru, error } = await supabaseAuth
    .from("produk")
    .insert([{ ...data, foto_url }])
    .select("id")
    .single();

  if (error) {
    console.error("Gagal menambah produk:", error.message);
    return { error: "Gagal menyimpan produk: " + error.message, values };
  }

  await catatLog(supabaseAuth, user, "Tambah produk", `#${baru?.id} ${data.nama}`);

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProductAction(prevState, formData) {
  const supabaseAuth = await createServerAuthClient();
  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  const id = formData.get("id");
  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  const { data, values, errors } = validasiProduk(formData);
  const fotoFile = formData.get("foto_file");

  if (Object.keys(errors).length > 0) {
    return { error: "Periksa kembali isian yang ditandai.", errors, values };
  }

  let foto_url = data.foto_url;

  // Foto yang diunggah ditambahkan ke link foto yang sudah ada (galeri US-18 tidak ikut terhapus).
  if (fotoFile && typeof fotoFile === "object" && fotoFile.size > 0) {
    const hasil = await unggahFoto(fotoFile);
    if (hasil.error) {
      return { errors: { foto_file: hasil.error }, values };
    }
    foto_url = foto_url ? `${foto_url},${hasil.url}` : hasil.url;
  }

  const { error } = await supabaseAuth
    .from("produk")
    .update({ ...data, foto_url })
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui produk:", error.message);
    return { error: "Gagal menyimpan perubahan produk: " + error.message, values };
  }

  await catatLog(supabaseAuth, user, "Ubah produk", `#${id} ${data.nama}`);

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProductAction(formData) {
  const supabaseAuth = await createServerAuthClient();
  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  const id = formData.get("id");
  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  // Nama dibaca dulu supaya log tetap menyebut produk yang sudah terhapus.
  const { data: lama } = await supabaseAuth.from("produk").select("nama").eq("id", id).maybeSingle();

  const { error } = await supabaseAuth
    .from("produk")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Gagal menghapus produk:", error.message);
    return { error: "Gagal menghapus produk: " + error.message };
  }

  await catatLog(supabaseAuth, user, "Hapus produk", `#${id} ${lama?.nama ?? ""}`.trim());

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function toggleProductActiveAction(prevState, formData) {
  const supabaseAuth = await createServerAuthClient();
  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  const id = formData.get("id");
  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  // Nilai tujuan dikirim dari form, jadi klik ganda tidak membalik status dua kali.
  const aktif = formData.get("aktif") === "true";

  const { error } = await supabaseAuth.from("produk").update({ aktif }).eq("id", id);

  if (error) {
    console.error("Gagal mengubah status produk:", error.message);
    return { error: "Gagal mengubah status produk: " + error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  return { success: true };
}

export async function generateDescriptionAction({ nama, kategori }) {
  const supabaseAuth = await createServerAuthClient();
  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  const namaProduk = (nama || "").trim();
  const kategoriProduk = (kategori || "").trim();

  if (!namaProduk) {
    return {
      error: "Nama produk wajib diisi terlebih dahulu untuk membuat deskripsi dengan AI.",
    };
  }

  return buatDeskripsiAi({ nama: namaProduk, kategori: kategoriProduk });
}

// ---- Kategori (US-31) ----

const PANJANG_KATEGORI_MAKSIMAL = 50;

async function periksaAdmin() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return error || !user ? { supabase: null } : { supabase };
}

function bacaNamaKategori(formData) {
  const nama = formData.get("nama")?.toString().trim().replace(/\s+/g, " ") || "";
  if (!nama) return { error: "Nama kategori wajib diisi." };
  if (nama.length > PANJANG_KATEGORI_MAKSIMAL) {
    return { error: `Nama kategori maksimal ${PANJANG_KATEGORI_MAKSIMAL} karakter.` };
  }
  return { nama };
}

function segarkanHalamanKategori() {
  revalidatePath("/admin/kategori");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createCategoryAction(prevState, formData) {
  const { supabase } = await periksaAdmin();
  if (!supabase) return { error: "Anda harus login terlebih dahulu." };

  const { nama, error: errorNama } = bacaNamaKategori(formData);
  if (errorNama) return { error: errorNama };

  const { error } = await supabase.from("kategori").insert({ nama });

  if (error) {
    if (error.code === "23505") return { error: `Kategori "${nama}" sudah ada.` };
    console.error("Gagal menambah kategori:", error.message);
    return { error: "Gagal menambah kategori: " + error.message };
  }

  segarkanHalamanKategori();
  return { success: `Kategori "${nama}" ditambahkan.`, waktu: Date.now() };
}

export async function renameCategoryAction(prevState, formData) {
  const { supabase } = await periksaAdmin();
  if (!supabase) return { error: "Anda harus login terlebih dahulu." };

  const id = formData.get("id");
  if (!id) return { error: "ID kategori tidak valid." };

  const { nama, error: errorNama } = bacaNamaKategori(formData);
  if (errorNama) return { error: errorNama };

  // Foreign key (on update cascade) ikut mengubah kategori di semua produk terkait.
  const { error } = await supabase.from("kategori").update({ nama }).eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: `Kategori "${nama}" sudah ada.` };
    console.error("Gagal mengubah kategori:", error.message);
    return { error: "Gagal mengubah kategori: " + error.message };
  }

  segarkanHalamanKategori();
  return { success: "Nama kategori diubah.", waktu: Date.now() };
}

export async function deleteCategoryAction(prevState, formData) {
  const { supabase } = await periksaAdmin();
  if (!supabase) return { error: "Anda harus login terlebih dahulu." };

  const id = formData.get("id");
  if (!id) return { error: "ID kategori tidak valid." };

  const { data: kategori, error: errorBaca } = await supabase
    .from("kategori")
    .select("nama")
    .eq("id", id)
    .maybeSingle();

  if (errorBaca || !kategori) return { error: "Kategori tidak ditemukan." };

  const { count, error: errorHitung } = await supabase
    .from("produk")
    .select("id", { count: "exact", head: true })
    .eq("kategori", kategori.nama);

  if (errorHitung) {
    console.error("Gagal memeriksa pemakaian kategori:", errorHitung.message);
    return { error: "Gagal memeriksa pemakaian kategori." };
  }

  if (count > 0) {
    return {
      error: `Kategori "${kategori.nama}" masih dipakai ${count} produk. Pindahkan atau hapus produknya dulu.`,
    };
  }

  const { error } = await supabase.from("kategori").delete().eq("id", id);

  if (error) {
    // 23503: produk baru memakai kategori ini di antara pemeriksaan dan penghapusan.
    if (error.code === "23503") {
      return { error: `Kategori "${kategori.nama}" masih dipakai produk.` };
    }
    console.error("Gagal menghapus kategori:", error.message);
    return { error: "Gagal menghapus kategori: " + error.message };
  }

  segarkanHalamanKategori();
  return { success: `Kategori "${kategori.nama}" dihapus.`, waktu: Date.now() };
}

// ---- Moderasi ulasan (US-39) ----

export async function toggleUlasanAction(prevState, formData) {
  const { supabase } = await periksaAdmin();
  if (!supabase) return { error: "Anda harus login terlebih dahulu." };

  const id = formData.get("id");
  if (!id) return { error: "ID ulasan tidak valid." };

  // Nilai tujuan dikirim dari form, jadi klik ganda tidak membalik status dua kali.
  const tampil = formData.get("tampil") === "true";
  const { data, error } = await supabase
    .from("ulasan")
    .update({ tampil })
    .eq("id", id)
    .select("produk_id")
    .maybeSingle();

  if (error) {
    console.error("Gagal mengubah status ulasan:", error.message);
    return { error: "Gagal mengubah status ulasan: " + error.message };
  }
  if (!data) return { error: "Ulasan tidak ditemukan." };

  revalidatePath("/admin/ulasan");
  revalidatePath(`/produk/${data.produk_id}`);
  return { success: true };
}

export async function deleteUlasanAction(formData) {
  const { supabase } = await periksaAdmin();
  if (!supabase) return;

  const id = formData.get("id");
  if (!id) return;

  const { data, error } = await supabase.from("ulasan").delete().eq("id", id).select("produk_id").maybeSingle();

  if (error) {
    console.error("Gagal menghapus ulasan:", error.message);
    return;
  }

  revalidatePath("/admin/ulasan");
  if (data) revalidatePath(`/produk/${data.produk_id}`);
}

// ---- Banner promo (US-42) ----

export async function simpanBannerAction(prevState, formData) {
  const { supabase } = await periksaAdmin();
  if (!supabase) return { error: "Anda harus login terlebih dahulu." };

  const id = formData.get("id")?.toString() || "";
  const { data, values, errors } = validasiBanner(formData);
  if (Object.keys(errors).length > 0) {
    return { error: "Periksa kembali isian yang ditandai.", errors, values };
  }

  // Gambar yang diunggah menggantikan link gambar yang diketik.
  const berkas = formData.get("gambar_file");
  if (berkas && typeof berkas === "object" && berkas.size > 0) {
    const hasil = await unggahFoto(berkas);
    if (hasil.error) return { errors: { gambar_file: hasil.error }, values };
    data.gambar_url = hasil.url;
  }

  const { error } = id
    ? await supabase.from("banner").update(data).eq("id", id)
    : await supabase.from("banner").insert(data);

  if (error) {
    console.error("Gagal menyimpan banner:", error.message);
    return { error: "Gagal menyimpan banner: " + error.message, values };
  }

  revalidatePath("/admin/banner");
  revalidatePath("/");
  return { success: id ? "Banner diperbarui." : "Banner ditambahkan.", waktu: Date.now() };
}

export async function toggleBannerAction(prevState, formData) {
  const { supabase } = await periksaAdmin();
  if (!supabase) return { error: "Anda harus login terlebih dahulu." };

  const id = formData.get("id");
  if (!id) return { error: "ID banner tidak valid." };

  const aktif = formData.get("aktif") === "true";
  const { error } = await supabase.from("banner").update({ aktif }).eq("id", id);
  if (error) {
    console.error("Gagal mengubah status banner:", error.message);
    return { error: "Gagal mengubah status banner: " + error.message };
  }

  revalidatePath("/admin/banner");
  revalidatePath("/");
  return { success: true };
}

export async function deleteBannerAction(formData) {
  const { supabase } = await periksaAdmin();
  if (!supabase) return;

  const id = formData.get("id");
  if (!id) return;

  const { error } = await supabase.from("banner").delete().eq("id", id);
  if (error) {
    console.error("Gagal menghapus banner:", error.message);
    return;
  }

  revalidatePath("/admin/banner");
  revalidatePath("/");
}

// ---- Pengaturan toko (US-43) ----

export async function simpanPengaturanTokoAction(prevState, formData) {
  const { supabase } = await periksaAdmin();
  if (!supabase) return { error: "Anda harus login terlebih dahulu." };

  const { data, values, errors } = validasiToko(formData);
  if (Object.keys(errors).length > 0) {
    return { error: "Periksa kembali isian yang ditandai.", errors, values };
  }

  const { error } = await supabase
    .from("pengaturan_toko")
    .upsert({ id: 1, ...data, updated_at: new Date().toISOString() });

  if (error) {
    console.error("Gagal menyimpan pengaturan toko:", error.message);
    return { error: "Gagal menyimpan pengaturan: " + error.message, values };
  }

  // Header, footer, tentang, dan tombol WhatsApp memakai data ini di semua halaman.
  updateTag(TAG_TOKO);
  revalidatePath("/", "layout");
  return {
    success: "Pengaturan toko disimpan.",
    values: { ...values, nomor_whatsapp: data.nomor_whatsapp },
    waktu: Date.now(),
  };
}

// ---- Kelola akun admin (US-44) ----
// Memakai Supabase Auth Admin API dengan SUPABASE_SECRET_KEY, hanya dari server.

async function periksaAdminDenganId() {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return error || !user ? { user: null } : { user };
}

const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function tambahAdminAction(prevState, formData) {
  const { user } = await periksaAdminDenganId();
  if (!user) return { error: "Anda harus login terlebih dahulu." };

  const email = formData.get("email")?.toString().trim().toLowerCase() || "";
  const password = formData.get("password")?.toString() || "";
  const errors = {};
  if (!email) errors.email = "Email wajib diisi.";
  else if (!FORMAT_EMAIL.test(email) || email.length > 254) errors.email = "Format email tidak valid.";
  if (password.length < 8) errors.password = "Password minimal 8 karakter.";
  else if (password.length > 72) errors.password = "Password maksimal 72 karakter.";
  if (Object.keys(errors).length > 0) return { error: "Periksa kembali isian yang ditandai.", errors, values: { email } };

  const admin = createPublicClient();
  if (!admin) return { error: "Gagal terhubung ke Supabase.", values: { email } };

  const { error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) {
    if (/already|registered|exists/i.test(error.message)) {
      return { errors: { email: "Email ini sudah terdaftar." }, values: { email } };
    }
    console.error("Gagal menambah admin:", error.message);
    return { error: "Gagal menambah admin: " + error.message, values: { email } };
  }

  revalidatePath("/admin/akun");
  return { success: `Admin ${email} ditambahkan.`, waktu: Date.now() };
}

export async function ubahStatusAdminAction(prevState, formData) {
  const { user } = await periksaAdminDenganId();
  if (!user) return { error: "Anda harus login terlebih dahulu." };

  const id = formData.get("id")?.toString() || "";
  if (!id) return { error: "ID admin tidak valid." };
  if (id === user.id) return { error: "Anda tidak bisa menonaktifkan akun sendiri." };

  const admin = createPublicClient();
  if (!admin) return { error: "Gagal terhubung ke Supabase." };

  // Nilai tujuan dikirim dari form. "876000h" (sekitar 100 tahun) berarti diblokir; "none" membuka blokir.
  const nonaktifkan = formData.get("nonaktif") === "true";
  const { error } = await admin.auth.admin.updateUserById(id, { ban_duration: nonaktifkan ? "876000h" : "none" });
  if (error) {
    console.error("Gagal mengubah status admin:", error.message);
    return { error: "Gagal mengubah status admin: " + error.message };
  }

  revalidatePath("/admin/akun");
  return { success: true };
}

export async function hapusAdminAction(prevState, formData) {
  const { user } = await periksaAdminDenganId();
  if (!user) return { error: "Anda harus login terlebih dahulu." };

  const id = formData.get("id")?.toString() || "";
  if (!id) return { error: "ID admin tidak valid." };
  if (id === user.id) return { error: "Anda tidak bisa menghapus akun sendiri." };

  const admin = createPublicClient();
  if (!admin) return { error: "Gagal terhubung ke Supabase." };

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    console.error("Gagal menghapus admin:", error.message);
    return { error: "Gagal menghapus admin: " + error.message };
  }

  revalidatePath("/admin/akun");
  return { success: true };
}
