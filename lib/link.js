// Alamat http(s) lengkap atau path di dalam situs (contoh /produk/1). "//host" dan "javascript:" ditolak.
export function linkValid(link) {
  if (link.startsWith("/") && !link.startsWith("//")) return true;
  try {
    const { protocol } = new URL(link);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}
