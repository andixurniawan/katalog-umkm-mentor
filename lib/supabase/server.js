import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createPublicClient() {
  let supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return null;
  }

  // Bersihkan SUPABASE_URL jika tidak sengaja menyertakan path /rest/v1 atau garis miring di akhir
  supabaseUrl = supabaseUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  return createClient(supabaseUrl, supabaseSecretKey);
}

export async function createServerAuthClient() {
  let supabaseUrl = process.env.SUPABASE_URL || "";
  supabaseUrl = supabaseUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || "";

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Diabaikan jika dipanggil dari Server Component
        }
      },
    },
  });
}
