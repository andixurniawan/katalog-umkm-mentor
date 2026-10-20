// Membuat teks CSV. Sel yang mengandung koma, kutip, atau baris baru dibungkus kutip,
// dan kutip di dalamnya digandakan. Teks yang diawali = + - @ diberi awalan ' supaya
// tidak dijalankan sebagai rumus saat file dibuka di spreadsheet.
function bersihkanSel(nilai) {
  if (nilai === null || nilai === undefined) return "";
  let teks = typeof nilai === "string" ? nilai : String(nilai);
  if (typeof nilai === "string" && /^[=+\-@\t\r]/.test(teks)) teks = `'${teks}`;
  return /[",\r\n]/.test(teks) ? `"${teks.replace(/"/g, '""')}"` : teks;
}

export function buatCsv(kolom, baris) {
  const header = kolom.map((k) => bersihkanSel(k.judul)).join(",");
  const isi = baris.map((b) => kolom.map((k) => bersihkanSel(b[k.kunci])).join(","));
  return [header, ...isi].join("\r\n") + "\r\n";
}
