import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getAllProducts } from "@/lib/db/queries";
import { ProductCard } from "@/components/ProductCard";
import { ProductClientInteractive } from "./ProductClientInteractive";
import { Sparkles, ChevronRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Creation Not Found | VOYOR" };

  return {
    title: `${product.name} | VOYOR Official Boutique`,
    description: product.description,
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

  const detailsList: string[] = product.detailsJson ? JSON.parse(product.detailsJson) : [];

  return (
    <main className="min-h-screen bg-[#080808] text-white pt-24 sm:pt-32 pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-[11px] uppercase tracking-luxury text-neutral-400 flex items-center space-x-2">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#555]" />
        <Link href={`/category/${product.categoryId.replace("cat_", "")}`} className="hover:text-white transition-colors">
          Collection
        </Link>
        <ChevronRight className="w-3 h-3 text-[#555]" />
        <span className="text-[#a7c080] truncate">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Editorial Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              {product.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative aspect-[3/4] w-full bg-[#121212] border border-[#1e1e1e] overflow-hidden group"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-top"
                  />
                  {idx === 0 && product.isRunway && (
                    <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-sm border border-[#a7c080] text-[#a7c080] text-[10px] uppercase tracking-ultra px-3 py-1 font-medium">
                      Milano Runway Piece
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sticky Details & Purchase Console (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              {/* Interactive Size, Color, Add to Bag Component */}
              <ProductClientInteractive product={product} />

              {/* Guarantees */}
              <div className="pt-6 border-t border-[#1c1c1c] space-y-3 text-[11px] text-neutral-400">
                <div className="flex items-center space-x-3">
                  <Truck className="w-4 h-4 text-[#a7c080]" />
                  <span>Complimentary Global VIP White-Glove Delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-4 h-4 text-[#a7c080]" />
                  <span>Certified 100% Italian Atelier Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-4 h-4 text-[#a7c080]" />
                  <span>30-Day Complimentary Boutique Return Privilege</span>
                </div>
              </div>

              {/* Atelier Details Accordions */}
              <div className="pt-6 border-t border-[#1c1c1c] space-y-4 text-xs">
                <div>
                  <h4 className="text-sm text-[#a7c080] uppercase tracking-wider mb-2">
                    Description & Silhouette
                  </h4>
                  <p className="text-neutral-300 font-light leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {detailsList.length > 0 && (
                  <div className="pt-3 border-t border-[#191919]">
                    <h4 className="text-sm text-[#a7c080] uppercase tracking-wider mb-2">
                      Atelier Specifications
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-neutral-400 font-light">
                      {detailsList.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-3 border-t border-[#191919] space-y-1 text-neutral-400">
                  <p>
                    <span className="text-white font-medium">Composition:</span>{" "}
                    {product.composition || "Silk & Virgin Wool"}
                  </p>
                  <p>
                    <span className="text-white font-medium">Origin:</span>{" "}
                    {product.origin}
                  </p>
                  {product.careGuide && (
                    <p>
                      <span className="text-white font-medium">Preservation:</span>{" "}
                      {product.careGuide}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete The Look / Related Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 pt-16 border-t border-[#1c1c1c]">
            <span className="text-[#a7c080] text-xs uppercase tracking-ultra mb-2 block font-medium">
              Coordinated Styling
            </span>
            <h3 className="text-3xl text-white uppercase tracking-wider mb-10">
              Complete <span className="text-[#a7c080] italic font-normal">The Ensemble</span>
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
  );
}
