"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient } from "@/lib/supabase/server";

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

