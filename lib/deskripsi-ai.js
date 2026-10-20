// Membuat deskripsi produk dengan LLM. Hanya dipanggil dari server (Server Action), kunci tidak pernah ke browser.
//
// Penyedia (dipilih dari environment variable):
//  1. Gateway kompatibel OpenAI (contoh 9router): LLM_BASE_URL + LLM_API_KEY (+ LLM_MODEL, bawaan "gemini")
//  2. Gemini API langsung: GEMINI_API_KEY (atau GOOGLE_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY)

const BATAS_WAKTU_MS = 25_000;
const MODEL_GEMINI_LANGSUNG = ["gemini-2.0-flash", "gemini-2.5-flash"];

function buatPrompt(nama, kategori) {
  return `Anda adalah asisten pembuat konten untuk katalog UMKM. Buatlah deskripsi produk yang menarik, profesional, singkat (sekitar 2 sampai 4 kalimat), dan persuasif dalam bahasa Indonesia.
Nama produk: ${nama}
${kategori ? `Kategori produk: ${kategori}` : ""}

Tulis HANYA deskripsi produk tersebut, tanpa tanda kutip, tanpa pembuka/penutup, dan tanpa format markdown berlebih.`;
}

// Sebagian gateway membalas dengan content-type text/event-stream walau stream tidak diminta:
// satu objek JSON diikuti "data: [DONE]". Ambil objek JSON pertama saja.
async function bacaJson(response) {
  const teks = (await response.text()).trim().replace(/^data:\s*/, "");
  try {
    return JSON.parse(teks);
  } catch {
    const akhir = teks.indexOf("\n");
    return JSON.parse(akhir === -1 ? teks : teks.slice(0, akhir));
  }
}

function rapikan(teks) {
  return teks?.trim().replace(/^["“]+|["”]+$/g, "").trim() || "";
}

async function lewatGateway({ baseUrl, apiKey, model }, prompt) {
  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    }),
    signal: AbortSignal.timeout(BATAS_WAKTU_MS),
  });

  if (!response.ok) {
    const err = await bacaJson(response).catch(() => null);
    const pesan = err?.error?.message || err?.message || `HTTP ${response.status}`;
    if (response.status === 401 || response.status === 403) {
      throw new Error(`Kunci API LLM ditolak (${pesan}).`);
    }
    throw new Error(pesan);
  }

  const data = await bacaJson(response);
  return rapikan(data?.choices?.[0]?.message?.content);
}

async function lewatGeminiLangsung(apiKey, prompt) {
  let errorTerakhir = null;

  for (const model of MODEL_GEMINI_LANGSUNG) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        // Kunci dikirim lewat header, bukan query string, supaya tidak tercatat di log URL.
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
        }),
        signal: AbortSignal.timeout(BATAS_WAKTU_MS),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const teks = rapikan(data?.candidates?.[0]?.content?.parts?.[0]?.text);
      if (teks) return teks;
      errorTerakhir = "Respon kosong dari API.";
      continue;
    }

    const err = await response.json().catch(() => null);
    errorTerakhir = err?.error?.message || `HTTP ${response.status}`;
    // Model tidak ditemukan: coba model berikutnya. Error lain (kunci salah, kuota) langsung dihentikan.
    if (response.status !== 404) break;
  }

  throw new Error(errorTerakhir || "Respon kosong dari API.");
}

/** Mengembalikan { deskripsi } atau { error } berisi pesan untuk admin. */
export async function buatDeskripsiAi({ nama, kategori }) {
  const prompt = buatPrompt(nama, kategori);

  const gateway = {
    baseUrl: process.env.LLM_BASE_URL?.trim(),
    apiKey: process.env.LLM_API_KEY?.trim(),
    model: process.env.LLM_MODEL?.trim() || "gemini",
  };
  const kunciGemini =
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!(gateway.baseUrl && gateway.apiKey) && !kunciGemini) {
    return {
      error:
        "Kunci AI belum dikonfigurasi. Isi LLM_BASE_URL dan LLM_API_KEY (atau GEMINI_API_KEY) di .env.local atau environment variable server.",
    };
  }

  try {
    const teks =
      gateway.baseUrl && gateway.apiKey
        ? await lewatGateway(gateway, prompt)
        : await lewatGeminiLangsung(kunciGemini, prompt);

    if (!teks) return { error: "Gagal membuat deskripsi dengan AI: respon kosong." };
    return { deskripsi: teks };
  } catch (err) {
    const timeout = err?.name === "TimeoutError" || err?.name === "AbortError";
    console.error("Gagal memanggil LLM:", err?.message);
    return {
      error: timeout
        ? "AI terlalu lama menjawab. Coba lagi sebentar."
        : "Gagal membuat deskripsi dengan AI: " + (err?.message || "kesalahan tidak dikenal."),
    };
  }
}
