import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { Header } from "@/components/customer/header";
import { Footer } from "@/components/customer/footer";
import { PriceTicker } from "@/components/customer/price-ticker";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://pavithra-traders.onrender.com"
  ),
  title: {
    default: "PAVITHRA TRADERS | Cement & Steel Suppliers",
    template: "%s | PAVITHRA TRADERS",
  },
  description:
    "PAVITHRA TRADERS supplies quality cement and steel construction materials from trusted brands including UltraTech, Dalmia, Ramco, Maha, Penna, Tata Tiscon, JSW Neosteel, Agni Steels and SSI TMT.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "PAVITHRA TRADERS | Cement & Steel Suppliers",
    description: "Quality construction materials. Reliable prices. Trusted supply.",
    type: "website",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#F3F4F6] text-[#111827]">
        <CartProvider>
          <PriceTicker />
          <Header />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
