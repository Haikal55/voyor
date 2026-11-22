import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LuxuryProvider } from "@/context/luxury-context";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { getCartAction } from "./actions/cart";

// Apple San Francisco Pro (SF Pro Display)
const sfPro = localFont({
  src: [
    {
      path: "../../public/fonts/SF-Pro-Display-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Display-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Display-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "San Francisco",
    "SF Pro Display",
    "SF Pro Text",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

// Royal Luxury Cursive / Aksara Sambung (Local Calligraphy)
const scriptFont = localFont({
  src: [
    {
      path: "../../public/fonts/GreatVibes-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-script",
  display: "swap",
  fallback: ["Great Vibes", "Pinyon Script", "cursive"],
});

export const metadata: Metadata = {
  title: "VOYOR | Ultra-Luxury Fashion & Haute Couture Milano",
  description:
    "VOYOR Official Online Boutique. Discover the Fall/Winter 2026 Runway collection, iconic Barocco silk shirts, atelier evening gowns, and Sovereign leather bags.",
  keywords: [
    "VOYOR",
    "Luxury Fashion",
    "Haute Couture",
    "Italian Fashion",
    "Milano Runway",
    "Barocco Silk",
    "Luxury Handbags",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialCart: any[] = [];
  try {
    const res = await getCartAction();
    initialCart = res.items;
  } catch (e) {
    // Fallback gracefully
  }

  return (
    <html
      lang="en"
      className={`${sfPro.variable} ${scriptFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080808] text-[#f5f4f0] selection:bg-[#a7c080] selection:text-black font-sans">
        <LuxuryProvider initialCart={initialCart}>
          {/* Header temporarily removed */}
          {/* <Navbar /> */}
          <div className="flex-1">{children}</div>
          <CartDrawer />
          <Footer />
        </LuxuryProvider>
      </body>
    </html>
  );
}
