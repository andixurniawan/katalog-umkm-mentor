import { alamatSitus } from "@/lib/situs";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Halaman admin, keranjang, dan favorit tidak perlu muncul di mesin pencari.
      disallow: ["/admin", "/keranjang", "/favorit"],
    },
    sitemap: `${alamatSitus}/sitemap.xml`,
  };
}
