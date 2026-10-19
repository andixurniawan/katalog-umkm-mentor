"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
  const stokRaw = formData.get("stok")?.toString().trim();
  const stok = stokRaw !== "" && stokRaw != null ? parseInt(stokRaw, 10) : null;

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
      stok: stok !== null && !isNaN(stok) ? stok : null,
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

  if (!nama || isNaN(harga) || harga < 0) {
    return { error: "Nama dan harga produk (minimal 0) wajib diisi." };
  }

  // Jika file foto baru diunggah, simpan ke Supabase Storage pada bucket "product"
  if (fotoFile && typeof fotoFile === "object" && fotoFile.size > 0) {
    try {
      const fileExt = fotoFile.name ? fotoFile.name.split(".").pop() : "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const arrayBuffer = await fotoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

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

  const { error } = await supabaseAuth
    .from("produk")
    .update({
      nama,
      harga,
      kategori: kategori || null,
      foto_url: foto_url || null,
      deskripsi: deskripsi || null,
      stok: stok !== null && !isNaN(stok) ? stok : null,
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
