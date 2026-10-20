import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { KeranjangProvider } from "@/components/KeranjangProvider";
import { FavoritProvider } from "@/components/FavoritProvider";
import { toko } from "@/lib/toko";

export const metadata = {
  title: toko.nama,
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
    <html lang="id">
      <head>
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
