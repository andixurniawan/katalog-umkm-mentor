// Pemanggil LLM bersama (deskripsi produk US-14 dan tanya jawab US-50). Hanya dipanggil dari server;
// kunci tidak pernah ke browser.
//
// Penyedia (dipilih dari environment variable):
//  1. Gateway kompatibel OpenAI (contoh 9router): LLM_BASE_URL + LLM_API_KEY (+ LLM_MODEL, bawaan "gemini")
//  2. Gemini API langsung: GEMINI_API_KEY (atau GOOGLE_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY)

const BATAS_WAKTU_BAWAAN_MS = 25_000;
const MODEL_GEMINI_LANGSUNG = ["gemini-2.0-flash", "gemini-2.5-flash"];

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

async function lewatGateway({ baseUrl, apiKey, model }, { system, user, maxTokens, temperature, batasWaktuMs }) {
  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
  const messages = [...(system ? [{ role: "system", content: system }] : []), { role: "user", content: user }];
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, stream: false, messages, temperature, max_tokens: maxTokens }),
    signal: AbortSignal.timeout(batasWaktuMs),
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

async function lewatGeminiLangsung(apiKey, { system, user, maxTokens, temperature, batasWaktuMs }) {
  let errorTerakhir = null;

  for (const model of MODEL_GEMINI_LANGSUNG) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        // Kunci dikirim lewat header, bukan query string, supaya tidak tercatat di log URL.
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          ...(system && { systemInstruction: { parts: [{ text: system }] } }),
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
        signal: AbortSignal.timeout(batasWaktuMs),
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

/**
 * Mengirim satu giliran ke LLM. Mengembalikan { teks } atau
 * { error, timeout?, belumDikonfigurasi? } (error = pesan teknis, sudah di-log di server).
 */
export async function tanyaLlm({
  system = "",
  user,
  maxTokens = 400,
  temperature = 0.7,
  batasWaktuMs = BATAS_WAKTU_BAWAAN_MS,
}) {
  const gateway = {
    baseUrl: process.env.LLM_BASE_URL?.trim(),
    apiKey: process.env.LLM_API_KEY?.trim(),
    model: process.env.LLM_MODEL?.trim() || "gemini",
  };
  const kunciGemini =
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!(gateway.baseUrl && gateway.apiKey) && !kunciGemini) {
    return { error: "Kunci AI belum dikonfigurasi.", belumDikonfigurasi: true };
  }

  const opsi = { system, user, maxTokens, temperature, batasWaktuMs };
  try {
    const teks =
      gateway.baseUrl && gateway.apiKey
        ? await lewatGateway(gateway, opsi)
        : await lewatGeminiLangsung(kunciGemini, opsi);

    return teks ? { teks } : { error: "Respon kosong dari AI." };
  } catch (err) {
    const timeout = err?.name === "TimeoutError" || err?.name === "AbortError";
    console.error("Gagal memanggil LLM:", err?.message);
    return { error: err?.message || "Kesalahan tidak dikenal.", timeout };
  }
}
