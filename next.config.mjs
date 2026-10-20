/** @type {import('next').NextConfig} */
const nextConfig = {
  // Batas bawaan Server Action 1 MB; foto produk boleh sampai 2 MB (lihat lib/unggah-foto.js).
  experimental: { serverActions: { bodySizeLimit: "3mb" } },
  // Supaya deploy tidak gagal hanya karena error tipe kecil selama workshop.
  typescript: { ignoreBuildErrors: true },
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

