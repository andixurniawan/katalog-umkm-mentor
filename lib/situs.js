// Alamat situs untuk URL absolut (metadata, sitemap, robots). Hanya dipakai di server.
// Di Vercel terisi otomatis; untuk domain sendiri isi SITE_URL.
export const alamatSitus = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");
