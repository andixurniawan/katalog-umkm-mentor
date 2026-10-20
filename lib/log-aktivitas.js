// Mencatat aksi admin: siapa (email), aksi, target, dan kapan (diisi database).
// Kegagalan mencatat tidak boleh menggagalkan aksi utama, jadi hanya ditulis ke log server.
export async function catatLog(supabase, user, aksi, target) {
  try {
    const { error } = await supabase
      .from("log_aktivitas")
      .insert({ admin_email: user?.email || "(tanpa email)", aksi, target: target ?? null });
    if (error) console.error("Gagal mencatat log aktivitas:", error.message);
  } catch (e) {
    console.error("Gagal mencatat log aktivitas:", e.message);
  }
}
