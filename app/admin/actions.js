"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerAuthClient } from "@/lib/supabase/server";
import { unggahFoto } from "@/lib/unggah-foto";

const BADGE_VALID = ["Baru", "Terlaris"];

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
  const stokRaw = formData.get("stok")?.toString().trim();
  const stok = stokRaw !== "" && stokRaw != null ? parseInt(stokRaw, 10) : null;
  const diskonRaw = formData.get("harga_diskon")?.toString().trim();
  const hargaDiskon = diskonRaw ? parseInt(diskonRaw, 10) : null;
  const badgeRaw = formData.get("badge")?.toString().trim();
  const badge = BADGE_VALID.includes(badgeRaw) ? badgeRaw : null;

  if (!nama || isNaN(harga) || harga < 0) {
    return { error: "Nama dan harga produk (minimal 0) wajib diisi." };
  }

  if (hargaDiskon !== null && (isNaN(hargaDiskon) || hargaDiskon < 0 || hargaDiskon >= harga)) {
    return { error: "Harga diskon harus berupa angka dan lebih kecil dari harga normal." };
  }

  // Foto yang diunggah ditambahkan ke link foto yang sudah ada (galeri US-18 tidak ikut terhapus).
  if (fotoFile && typeof fotoFile === "object" && fotoFile.size > 0) {
    const hasil = await unggahFoto(fotoFile);
    if (hasil.error) {
      return { error: hasil.error };
    }
    foto_url = foto_url ? `${foto_url},${hasil.url}` : hasil.url;
  }

  const { error } = await supabaseAuth.from("produk").insert([
    {
      nama,
      harga,
      kategori: kategori || null,
      foto_url: foto_url || null,
      deskripsi: deskripsi || null,
      stok: stok !== null && !isNaN(stok) ? stok : null,
      harga_diskon: hargaDiskon,
      badge,
    },
  ]);

  if (error) {
    console.error("Gagal menambah produk:", error.message);
    return { error: "Gagal menyimpan produk: " + error.message };
  }

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

  const nama = formData.get("nama")?.toString().trim();
  const hargaRaw = formData.get("harga");
  const harga = parseInt(hargaRaw, 10);
  const kategori = formData.get("kategori")?.toString().trim();
  let foto_url = formData.get("foto_url")?.toString().trim();
  const deskripsi = formData.get("deskripsi")?.toString().trim();
  const fotoFile = formData.get("foto_file");
  const stokRaw = formData.get("stok")?.toString().trim();
  const stok = stokRaw !== "" && stokRaw != null ? parseInt(stokRaw, 10) : null;
  const diskonRaw = formData.get("harga_diskon")?.toString().trim();
  const hargaDiskon = diskonRaw ? parseInt(diskonRaw, 10) : null;
  const badgeRaw = formData.get("badge")?.toString().trim();
  const badge = BADGE_VALID.includes(badgeRaw) ? badgeRaw : null;

  if (!nama || isNaN(harga) || harga < 0) {
    return { error: "Nama dan harga produk (minimal 0) wajib diisi." };
  }

  if (hargaDiskon !== null && (isNaN(hargaDiskon) || hargaDiskon < 0 || hargaDiskon >= harga)) {
    return { error: "Harga diskon harus berupa angka dan lebih kecil dari harga normal." };
  }

  // Foto yang diunggah ditambahkan ke link foto yang sudah ada (galeri US-18 tidak ikut terhapus).
  if (fotoFile && typeof fotoFile === "object" && fotoFile.size > 0) {
    const hasil = await unggahFoto(fotoFile);
    if (hasil.error) {
      return { error: hasil.error };
    }
    foto_url = foto_url ? `${foto_url},${hasil.url}` : hasil.url;
  }

  const { error } = await supabaseAuth
    .from("produk")
    .update({
      nama,
      harga,
      kategori: kategori || null,
      foto_url: foto_url || null,
      deskripsi: deskripsi || null,
      stok: stok !== null && !isNaN(stok) ? stok : null,
      harga_diskon: hargaDiskon,
      badge,
    })
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui produk:", error.message);
    return { error: "Gagal menyimpan perubahan produk: " + error.message };
  }

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

  const { error } = await supabaseAuth
    .from("produk")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Gagal menghapus produk:", error.message);
    return { error: "Gagal menghapus produk: " + error.message };
  }

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

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return {
      error:
        "Kunci Gemini API (GEMINI_API_KEY) belum dikonfigurasi di file .env.local atau environment variable server.",
    };
  }

  const prompt = `Anda adalah asisten pembuat konten untuk katalog UMKM. Buatlah deskripsi produk yang menarik, profesional, singkat (sekitar 2 sampai 4 kalimat), dan persuasif dalam bahasa Indonesia.
Nama produk: ${namaProduk}
${kategoriProduk ? `Kategori produk: ${kategoriProduk}` : ""}

Tulis HANYA deskripsi produk tersebut, tanpa tanda kutip, tanpa pembuka/penutup, dan tanpa format markdown berlebih.`;

  const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];
  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          return { deskripsi: text };
        }
      } else {
        const errJson = await response.json().catch(() => null);
        lastError =
          errJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        if (response.status !== 404) {
          break;
        }
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  return {
    error: "Gagal membuat deskripsi dengan AI: " + (lastError || "Respon kosong dari API."),
  };
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
