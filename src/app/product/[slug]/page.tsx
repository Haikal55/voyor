import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getAllProducts } from "@/lib/db/queries";
import { ProductCard } from "@/components/ProductCard";
import { ProductClientInteractive } from "./ProductClientInteractive";
import { ChevronRight } from "lucide-react";
import {
  SITE_URL,
  SITE_NAME,
  getProductSchema,
  getBreadcrumbSchema,
} from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Creation Not Found | VOYOR" };

  const ogImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => ({
          url: img.url.startsWith("http") ? img.url : `${SITE_URL}${img.url}`,
          width: 900,
          height: 1200,
          alt: `${product.name} — VOYOR Milano Haute Couture`,
        }))
      : [
          {
            url: `${SITE_URL}/images/maison-heritage-versace.jpg`,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ];

  return {
    title: `${product.name} | VOYOR Official Boutique`,
    description: product.description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description: product.description,
      url: `${SITE_URL}/product/${product.slug}`,
      siteName: SITE_NAME,
      images: ogImages,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE_NAME}`,
      description: product.description,
      images: [ogImages[0].url],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = getAllProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    {
      name: "Collections",
      url: `/category/${product.categoryId.replace("cat_", "")}`,
    },
    { name: product.name, url: `/product/${product.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <main className="min-h-screen bg-[#080808] text-white pt-24 sm:pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 text-[11px] uppercase tracking-luxury text-neutral-400 flex items-center space-x-2">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[#555]" />
          <Link
            href={`/category/${product.categoryId.replace("cat_", "")}`}
            className="hover:text-white transition-colors"
          >
            Collection
          </Link>
          <ChevronRight className="w-3 h-3 text-[#555]" />
          <span className="text-[#a7c080] truncate">{product.name}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductClientInteractive product={product} />

          {relatedProducts.length > 0 && (
            <div className="mt-28 pt-16 border-t border-[#1c1c1c]">
              <span className="text-[#a7c080] text-xs uppercase tracking-ultra mb-2 block font-medium">
                Coordinated Styling
              </span>
              <h3 className="text-3xl text-white uppercase tracking-wider mb-10">
                Complete{" "}
                <span className="text-[#a7c080] italic font-normal">
                  The Ensemble
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
