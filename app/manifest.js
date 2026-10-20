import { ambilToko } from "@/lib/pengaturan-toko";

export default async function manifest() {
  const toko = await ambilToko();
  return {
    name: toko.nama,
    short_name: toko.nama,
    description: toko.tagline,
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f6b4f",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

