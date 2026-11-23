import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Bodoni_Moda } from "next/font/google";
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
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  getOrganizationSchema,
  getWebsiteSchema,
} from "@/lib/seo";

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

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "VOYOR S.P.A. Milano", url: SITE_URL }],
  creator: "VOYOR",
  publisher: "VOYOR S.P.A.",
  category: "Luxury Fashion & Haute Couture",
  keywords: [
    "VOYOR",
    "VOYOR Milano",
    "Haute Couture",
    "Italian Luxury Fashion",
    "Milan Fashion Week",
    "Barocco Silk Shirt",
    "Atelier Evening Gowns",
    "Sovereign Leather Bags",
    "Runway FW26",
    "Quiet Luxury",
    "Designer Menswear",
    "Designer Womenswear",
    "Italian Silk",
    "Made in Italy",
    "Bespoke Tailoring Milano",
  ],
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "VOYOR Milano Haute Couture Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
    creator: "@voyor",
    site: "@voyor",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
  } catch (e) {}

  const categories = getAllCategories();
  const allProducts = getAllProducts();

  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sfPro.variable} ${scriptFont.variable} ${radiantFont.variable} ${bodoni.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
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
