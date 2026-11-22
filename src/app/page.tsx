import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllCategories, getAllProducts, getRunwayProducts } from "@/lib/db/queries";
import { HeroBanner } from "@/components/HeroBanner";
import { RunwayShowcase } from "@/components/RunwayShowcase";
import { MaisonHeritage } from "@/components/MaisonHeritage";
import { ProductCard } from "@/components/ProductCard";
import { SearchModal } from "@/components/SearchModal";
import { Sparkles, ArrowRight } from "lucide-react";

// Revalidate statically every hour or on-demand
export const revalidate = 3600;

export default function HomePage() {
  const categories = getAllCategories();
  const allProducts = getAllProducts();
  const runwayProducts = getRunwayProducts();

  // Selected iconic products for the editorial catalog grid
  const iconProducts = allProducts.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* Cinematic Full-Bleed Runway Hero */}
      <HeroBanner />

      {/* Featured Categories Carousel / Grid */}
      <section className="py-16 bg-[#0a0a0a] border-b border-[#1c1c1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-luxury text-[#a7c080] block font-medium mb-1">
              Curated Universes
            </span>
            <h2 className="text-2xl sm:text-3xl uppercase tracking-[0.04em] font-medium text-white">
              The VOYOR Collections
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[3/4] bg-[#141414] overflow-hidden border border-[#222] hover:border-[#a7c080]/50 transition-all duration-500"
              >
                {cat.heroImage && (
                  <Image
                    src={cat.heroImage}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="text-sm sm:text-base text-white uppercase tracking-wider group-hover:text-[#a7c080] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[9px] uppercase tracking-ultra text-neutral-400 group-hover:text-white transition-colors mt-1 inline-block">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Runway Fall/Winter Couture Showcase */}
      <RunwayShowcase runwayProducts={runwayProducts} />

      {/* The Icons Collection Grid */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#1c1c1c] gap-4">
            <div>
              <span className="text-[#a7c080] text-[11px] uppercase tracking-luxury mb-2 block font-medium">
                The Permanent Archive
              </span>
              <h2 className="text-3xl sm:text-4xl text-white font-medium tracking-[0.04em] uppercase">
                Iconic{" "}
                <span className="font-script text-[#a7c080] text-4xl sm:text-5xl font-normal tracking-normal ml-1">
                  Silhouettes
                </span>
              </h2>
            </div>
            <Link
              href="/category/women"
              className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-luxury text-[#a7c080] hover:text-white transition-colors"
            >
              <span>Explore All Creations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {iconProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Heritage & Atelier Storytelling */}
      <MaisonHeritage />

      {/* Interactive Global Search Modal */}
      <SearchModal allProducts={allProducts} />
    </main>
  );
}
