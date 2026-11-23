export type CurrencyCode = "USD" | "EUR" | "GBP" | "IDR";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromUSD: number;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", rateFromUSD: 1.0, locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", rateFromUSD: 0.92, locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", rateFromUSD: 0.79, locale: "en-GB" },
  IDR: { code: "IDR", symbol: "Rp", rateFromUSD: 16250, locale: "id-ID" },
};

export interface CountryConfig {
  code: string;
  name: string;
  currency: CurrencyCode;
  flag: string;
}

export const COUNTRIES: Record<string, CountryConfig> = {
  ID: { code: "ID", name: "Indonesia", currency: "IDR", flag: "🇮🇩" },
  US: { code: "US", name: "United States", currency: "USD", flag: "🇺🇸" },
  IT: { code: "IT", name: "Italy / European Union", currency: "EUR", flag: "🇮🇹" },
  GB: { code: "GB", name: "United Kingdom", currency: "GBP", flag: "🇬🇧" },
};

export function detectUserCountry(): CountryConfig {
  if (typeof window === "undefined") {
    return COUNTRIES.ID;
  }

  try {
    const saved = localStorage.getItem("voyor_country");
    if (saved && COUNTRIES[saved]) {
      return COUNTRIES[saved];
    }
  } catch {}

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (
      tz.includes("Jakarta") ||
      tz.includes("Makassar") ||
      tz.includes("Jayapura") ||
      tz.includes("Pontianak") ||
      tz.includes("Indonesia")
    ) {
      return COUNTRIES.ID;
    }
    if (tz.includes("London") || tz.includes("Belfast") || tz.includes("Europe/London")) {
      return COUNTRIES.GB;
    }
    if (
      tz.includes("Rome") ||
      tz.includes("Paris") ||
      tz.includes("Berlin") ||
      tz.includes("Madrid") ||
      tz.includes("Europe")
    ) {
      return COUNTRIES.IT;
    }
    if (
      tz.includes("America") ||
      tz.includes("New_York") ||
      tz.includes("Los_Angeles") ||
      tz.includes("Chicago")
    ) {
      return COUNTRIES.US;
    }
  } catch {}

  try {
    const langs = navigator.languages || [navigator.language];
    for (const l of langs) {
      const lower = l.toLowerCase();
      if (lower.includes("id")) return COUNTRIES.ID;
      if (lower.includes("gb")) return COUNTRIES.GB;
      if (
        lower.includes("it") ||
        lower.includes("fr") ||
        lower.includes("de") ||
        lower.includes("es")
      ) {
        return COUNTRIES.IT;
      }
      if (lower.includes("en-us") || lower.includes("en")) return COUNTRIES.US;
    }
  } catch {}

  return COUNTRIES.ID;
}

export function formatPrice(amountInUSD: number, currency: CurrencyCode = "USD"): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountInUSD * cfg.rateFromUSD;

  if (currency === "IDR") {
    return `${cfg.symbol} ${Math.round(converted).toLocaleString("id-ID")}`;
  }

  return new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: cfg.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted);
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  heroImage: string | null;
  isFeatured: boolean;
  displayOrder: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  colorName?: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stockQuantity: number;
  priceDelta: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string;
  categoryId: string;
  basePrice: number;
  compareAtPrice: number | null;
  currency: string;
  isNew: boolean;
  isBestseller: boolean;
  isRunway: boolean;
  composition: string | null;
  origin: string;
  detailsJson: string | null;
  careGuide: string | null;
  createdAt?: Date | null;
  images: ProductImage[];
  variants: ProductVariant[];
  category?: Category;
}

export interface CartItemDetailed {
  id: string;
  quantity: number;
  variant: ProductVariant;
  product: {
    id: string;
    slug: string;
    name: string;
    subtitle: string | null;
    basePrice: number;
    image: string;
  };
}

export interface ArticleBlock {
  type: "heading" | "paragraph" | "image" | "quote";
  text?: string;
  url?: string;
  alt?: string;
  caption?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  author: string;
  authorRole: string;
  publishedAt: Date | string;
  heroImage: string;
  heroImageAlt: string | null;
  heroImageCaption: string | null;
  content: string;
  readingTime: string;
  isFeatured: boolean;
  isTrending: boolean;
  tags: string[];
  sourceUrl?: string | null;
  blocks?: ArticleBlock[];
  galleryImages?: { url: string; alt?: string; caption?: string }[];
  createdAt?: Date;
}
