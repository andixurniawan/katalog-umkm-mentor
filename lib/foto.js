export function ekstrakDaftarFoto(fotoUrl) {
  if (!fotoUrl) return [];

  // Jika format JSON array string: ["url1", "url2"]
  if (typeof fotoUrl === "string" && fotoUrl.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(fotoUrl);
      if (Array.isArray(parsed)) {
        return parsed
          .map((u) => (typeof u === "string" ? u.trim() : ""))
          .filter(Boolean);
      }
    } catch {
      // Abaikan jika bukan JSON valid
    }
  }

  // Jika dipisahkan oleh baris baru atau koma
  if (typeof fotoUrl === "string") {
    const pemisah = fotoUrl.includes("\n") ? "\n" : ",";
    const daftar = fotoUrl
      .split(pemisah)
      .map((url) => url.trim())
      .filter(Boolean);

    if (daftar.length > 0) return daftar;
    return [fotoUrl.trim()];
  }

  if (Array.isArray(fotoUrl)) {
    return fotoUrl.filter(Boolean);
  }

  return [];
}
