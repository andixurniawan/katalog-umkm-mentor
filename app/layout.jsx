import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { KeranjangProvider } from "@/components/KeranjangProvider";
import { FavoritProvider } from "@/components/FavoritProvider";

// Dijalankan sebelum halaman tampil: pakai pilihan tersimpan, kalau belum ada ikuti pengaturan perangkat.
const skripTema = `try{var t=localStorage.getItem("tema");if(t!=="dark"&&t!=="light"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}`;
import { toko } from "@/lib/toko";

// Alamat situs untuk membuat URL absolut di metadata (Open Graph). Di Vercel terisi otomatis;
// untuk domain sendiri isi SITE_URL (tanpa awalan NEXT_PUBLIC_, hanya dipakai di server).
const alamatSitus =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata = {
  metadataBase: new URL(alamatSitus),
  title: { default: toko.nama, template: `%s | ${toko.nama}` },
  description: toko.tagline,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: toko.nama,
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#1f6b4f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: skripTema }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#1f6b4f" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={toko.nama} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <KeranjangProvider>
          <FavoritProvider>
            <Header />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4">{children}</main>
            <Footer />
          </FavoritProvider>
        </KeranjangProvider>
      </body>
    </html>
  );
}
