import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllCategories, getAllProducts, getRunwayProducts } from "@/lib/db/queries";
import { HeroBanner } from "@/components/HeroBanner";
import { RunwayShowcase } from "@/components/RunwayShowcase";
import { MaisonHeritage } from "@/components/MaisonHeritage";
import { ProductCard } from "@/components/ProductCard";
import { HomepageNavRails } from "@/components/HomepageNavRails";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

export default function HomePage() {
  const categories = getAllCategories();
  const allProducts = getAllProducts();
  const runwayProducts = getRunwayProducts();

  const runwayIds = new Set(runwayProducts.map((p) => p.id));
  const iconProducts = allProducts.filter((p) => !runwayIds.has(p.id)).slice(0, 12);

  return (
    <main className="min-h-screen bg-[#080808] text-white relative">
      <HomepageNavRails />

      <div id="section-hero">
        <HeroBanner />
      </div>

      <section id="section-collections" className="py-20 bg-[#0a0a0a] border-b border-[#1c1c1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl uppercase tracking-[0.04em] font-medium text-white">
              The <span className="font-radiant font-bold tracking-[0.16em]">VOYOR</span> Collections
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {categories
              .filter((c) => c.slug === "women" || c.slug === "men")
              .sort((a, b) => (a.slug === "women" ? -1 : 1))
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  prefetch={true}
                  className="group relative aspect-[3/4] w-full bg-[#141414] overflow-hidden border border-[#222] hover:border-[#a7c080]/60 transition-colors duration-300"
                >
                  {cat.heroImage && (
                    <Image
                      src={cat.heroImage}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-center">
                    <h3 className="text-lg sm:text-2xl text-white uppercase tracking-wider font-serif group-hover:text-[#a7c080] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories
              .filter(
                (c) =>
                  c.slug !== "runway-couture" &&
                  c.slug !== "women" &&
                  c.slug !== "men"
              )
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  prefetch={true}
                  className="group relative aspect-[3/4] bg-[#141414] overflow-hidden border border-[#222] hover:border-[#a7c080]/50 transition-colors duration-300"
                >
                  {cat.heroImage && (
                    <Image
                      src={cat.heroImage}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <h3 className="text-xs sm:text-sm text-white uppercase tracking-wider group-hover:text-[#a7c080] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <div id="section-runway">
        <RunwayShowcase runwayProducts={runwayProducts} />
      </div>

      <section id="section-silhouettes" className="py-20 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#1c1c1c] gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl text-white font-medium tracking-[0.04em] uppercase">
                Iconic <span className="text-[#a7c080]">Silhouettes</span>
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

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
            {iconProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <div id="section-legacy">
        <MaisonHeritage />
      </div>
    </main>
  );
}
