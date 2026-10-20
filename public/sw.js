// Service worker sederhana: membuat katalog bisa dipasang ke layar utama dan menampilkan halaman
// "offline" bila koneksi putus. Halaman katalog selalu diambil dari jaringan supaya data tidak basi,
// dan /admin tidak pernah disimpan di cache.
const VERSI = "katalog-v1";
const HALAMAN_OFFLINE = "/offline.html";
const ASET = [HALAMAN_OFFLINE, "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSI).then((cache) => cache.addAll(ASET)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((nama) => Promise.all(nama.filter((n) => n !== VERSI).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/admin")) return;

  // Pindah halaman: jaringan dulu, halaman offline bila gagal.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(HALAMAN_OFFLINE)));
    return;
  }

  // Ikon: dari cache dulu.
  if (url.pathname.startsWith("/icons/")) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request)));
  }
});
