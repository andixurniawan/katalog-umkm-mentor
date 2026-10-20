import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { KeranjangProvider } from "@/components/KeranjangProvider";
import { FavoritProvider } from "@/components/FavoritProvider";
import { BandingkanProvider } from "@/components/BandingkanProvider";

// Dijalankan sebelum halaman tampil: pakai pilihan tersimpan, kalau belum ada ikuti pengaturan perangkat.
const skripTema = `try{var t=localStorage.getItem("tema");if(t!=="dark"&&t!=="light"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}`;
import { ambilToko } from "@/lib/pengaturan-toko";
import { TokoProvider } from "@/components/TokoProvider";
import { alamatSitus } from "@/lib/situs";

export async function generateMetadata() {
  const toko = await ambilToko();
  return {
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
}

export const viewport = {
  themeColor: "#1f6b4f",
};

export default async function RootLayout({ children }) {
  const toko = await ambilToko();
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
        <TokoProvider toko={toko}>
          <KeranjangProvider>
            <FavoritProvider>
              <BandingkanProvider>
                <Header toko={toko} />
                <main className="mx-auto w-full max-w-5xl flex-1 px-4">{children}</main>
                <Footer toko={toko} />
              </BandingkanProvider>
            </FavoritProvider>
          </KeranjangProvider>
        </TokoProvider>
      </body>
    </html>
  );
}
