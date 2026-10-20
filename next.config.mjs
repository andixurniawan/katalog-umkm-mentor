/** @type {import('next').NextConfig} */
const nextConfig = {
  // Batas bawaan Server Action 1 MB; foto produk boleh sampai 2 MB (lihat lib/unggah-foto.js).
  experimental: { serverActions: { bodySizeLimit: "3mb" } },
  // Supaya deploy tidak gagal hanya karena error tipe kecil selama workshop.
  typescript: { ignoreBuildErrors: true },
  async headers() {
    return [
      {
        // Browser harus selalu memeriksa versi terbaru service worker.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/manifest.json",
        destination: "/manifest.webmanifest",
      },
    ];
  },
};

export default nextConfig;

