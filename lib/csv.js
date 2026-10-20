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

// Membaca teks CSV menjadi array baris (array sel). Mendukung sel berkutip (koma, kutip ganda "" dan baris baru
// di dalamnya), pemisah koma atau titik koma (dikenali dari baris pertama), dan BOM di awal file.
export function bacaCsv(teks) {
  const isi = teks.replace(/^﻿/, "");
  const barisPertama = isi.split(/\r?\n/, 1)[0] || "";
  const pemisah = (barisPertama.match(/;/g) || []).length > (barisPertama.match(/,/g) || []).length ? ";" : ",";

  const hasil = [];
  let baris = [];
  let sel = "";
  let dalamKutip = false;

  for (let i = 0; i < isi.length; i++) {
    const c = isi[i];
    if (dalamKutip) {
      if (c === '"') {
        if (isi[i + 1] === '"') {
          sel += '"';
          i++;
        } else {
          dalamKutip = false;
        }
      } else {
        sel += c;
      }
    } else if (c === '"' && sel === "") {
      dalamKutip = true;
    } else if (c === pemisah) {
      baris.push(sel);
      sel = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && isi[i + 1] === "\n") i++;
      baris.push(sel);
      hasil.push(baris);
      baris = [];
      sel = "";
    } else {
      sel += c;
    }
  }
  if (sel !== "" || baris.length > 0) {
    baris.push(sel);
    hasil.push(baris);
  }

  return { baris: hasil.filter((b) => b.some((s) => s.trim() !== "")), kutipTerbuka: dalamKutip };
}
