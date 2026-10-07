import { createClient } from "@supabase/supabase-js";

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
