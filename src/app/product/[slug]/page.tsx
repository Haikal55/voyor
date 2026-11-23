import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getAllProducts } from "@/lib/db/queries";
import { ProductCard } from "@/components/ProductCard";
import { ProductClientInteractive } from "./ProductClientInteractive";
import { ChevronRight } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-[#080808] text-white pt-24 sm:pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 text-[11px] uppercase tracking-luxury text-neutral-400 flex items-center space-x-2">
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
        <ProductClientInteractive product={product} />

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
