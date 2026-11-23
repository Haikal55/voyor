import { Product, Category } from "./types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://voyor.com");

export const SITE_NAME = "VOYOR";
export const SITE_TITLE = "VOYOR | Italian Haute Couture & Luxury Fashion Milano";
export const SITE_DESCRIPTION =
  "Official VOYOR Milano Online Boutique. Discover the Fall/Winter 2026 Runway collection, iconic Barocco silk shirts, atelier evening gowns, handcrafted tailoring, and sovereign leather bags.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/maison-heritage-versace.jpg`;

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: "VOYOR S.P.A. Milano",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    image: DEFAULT_OG_IMAGE,
    description: SITE_DESCRIPTION,
    foundingDate: "2026",
    foundingLocation: {
      "@type": "Place",
      name: "Milano, Italy",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Montenapoleone 8",
      addressLocality: "Milano",
      addressRegion: "MI",
      postalCode: "20121",
      addressCountry: "IT",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+39-02-7600-1234",
        contactType: "Customer Support & Private Concierge",
        email: "concierge@voyor.com",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Italian"],
      },
    ],
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/category/all?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };
}

export function getProductSchema(product: Product) {
  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) =>
          img.url.startsWith("http") ? img.url : `${SITE_URL}${img.url}`
        )
      : [DEFAULT_OG_IMAGE];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/product/${product.slug}/#product`,
    name: product.name,
    description: product.description,
    image: images,
    sku: `VY-${product.id}`,
    mpn: `VOYOR-${product.id.slice(-6).toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: product.categoryId.replace("cat_", ""),
    material: product.composition || "Silk & Luxury Wool",
    countryOfOrigin: product.origin || "Italy",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "USD",
      price: product.basePrice,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@id": `${SITE_URL}/#organization`,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IT",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: ["IT", "US", "GB", "ID", "FR", "DE", "JP", "AE"],
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "48",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getCategorySchema(category: Category, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/category/${category.slug}/#collection`,
    url: `${SITE_URL}/category/${category.slug}`,
    name: `${category.name} | VOYOR Collections`,
    description: category.description || SITE_DESCRIPTION,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, idx) => {
        const primaryImg = product.images?.[0]?.url || DEFAULT_OG_IMAGE;
        return {
          "@type": "ListItem",
          position: idx + 1,
          url: `${SITE_URL}/product/${product.slug}`,
          name: product.name,
          image: primaryImg.startsWith("http") ? primaryImg : `${SITE_URL}${primaryImg}`,
        };
      }),
    },
  };
}
