import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LuxuryProvider } from "@/context/luxury-context";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutSidebar } from "@/components/CheckoutSidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { getAllCategories, getAllProducts } from "@/lib/db/queries";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";
import { CookiePreferencesModal } from "@/components/CookiePreferencesModal";
import { SplashScreen } from "@/components/SplashScreen";
import { NavigationProgressBar } from "@/components/NavigationProgressBar";
import { getCartAction } from "./actions/cart";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080808",
};

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
  preload: false,
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
  preload: false,
  fallback: ["Great Vibes", "Pinyon Script", "cursive"],
});

const radiantFont = localFont({
  src: [
    {
      path: "../../public/fonts/RadiantRR-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-radiant",
  display: "swap",
  preload: false,
  fallback: ["Radiant RR Bold", "Radiant RR", "OPTIRadiant-Bold", "sans-serif"],
});

export const metadata: Metadata = {
  title: "VOYOR | Italian Haute Couture & Fashion Milano",
  description:
    "VOYOR Official Online Boutique. Discover the Fall/Winter 2026 Runway collection, iconic Barocco silk shirts, atelier evening gowns, and Sovereign leather bags.",
  keywords: [
    "VOYOR",
    "Haute Couture",
    "Italian Fashion",
    "Milano Runway",
    "Barocco Silk",
    "Leather Handbags",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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

  }

  const categories = getAllCategories();
  const allProducts = getAllProducts();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sfPro.variable} ${scriptFont.variable} ${radiantFont.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#080808] text-[#f5f4f0] selection:bg-[#a7c080] selection:text-black font-sans"
      >
        <NavigationProgressBar />
        <SplashScreen />
        <LuxuryProvider initialCart={initialCart}>
          <Navbar />
          <MobileMenu categories={categories} />
          <div className="flex-1">{children}</div>
          <CartDrawer />
          <CheckoutSidebar />
          <SearchModal allProducts={allProducts} />
          <CookiePreferencesModal />
          <Footer />
        </LuxuryProvider>
      </body>
    </html>
  );
}
