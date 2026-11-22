import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductsByCategory, getAllCategories } from "@/lib/db/queries";
import { ProductCard } from "@/components/ProductCard";
import { ChevronRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { category } = getProductsByCategory(slug);
  if (!category) return { title: "Collection | VOYOR" };

  return {
    title: `${category.name} | VOYOR Collections`,
    description: category.description || "Discover the collection at VOYOR Official Boutique.",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { category, products } = getProductsByCategory(slug);

  if (!category) {
    notFound();
  }

  const allCategories = getAllCategories();

  return (
    <main className="min-h-screen bg-[#080808] text-white pb-24">
      {/* Category Hero Banner */}
      <section className="relative w-full h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden bg-black border-b border-[#1c1c1c] px-4 pt-24 sm:pt-32">
        {category.heroImage && (
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src={category.heroImage}
              alt={category.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/75" />
          </div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight uppercase">
            {category.name}
          </h1>

          {category.description && (
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-neutral-300 font-light tracking-wide leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Breadcrumb & Subnav Navigation */}
      <div className="bg-[#0b0b0b] border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-luxury text-neutral-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#555]" />
            <span className="text-[#a7c080]">{category.name}</span>
          </div>

          {/* Categories Pill Links */}
          <div className="flex items-center space-x-4 text-[10px] uppercase tracking-luxury overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`transition-colors whitespace-nowrap py-1 ${
                  cat.slug === category.slug
                    ? "text-[#a7c080] font-semibold border-b-2 border-[#a7c080]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <span className="text-[10px] uppercase tracking-widest text-neutral-500 whitespace-nowrap">
            {products.length} {products.length === 1 ? "Creation" : "Creations"}
          </span>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 space-y-4">
            <p className="text-neutral-400 text-xs tracking-wider uppercase">
              No bespoke pieces in this salon yet.
            </p>
            <Link
              href="/category/runway-couture"
              className="inline-block px-8 py-3 bg-[#a7c080] text-black text-xs uppercase tracking-luxury font-bold"
            >
              Explore Runway FW26
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
