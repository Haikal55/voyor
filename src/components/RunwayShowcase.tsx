import React from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";

export function RunwayShowcase({ runwayProducts = [] }: { runwayProducts: Product[] }) {
  return (
    <section className="py-20 bg-[#060606] border-y border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Runway Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#1c1c1c] gap-6">
          <div>
            <span className="text-[#a7c080] text-[11px] uppercase tracking-luxury mb-2 block font-medium">
              Milan Fashion Week Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl text-white font-medium tracking-[0.04em] uppercase">
              Runway{" "}
              <span className="font-script text-[#a7c080] text-4xl sm:text-5xl font-normal tracking-normal ml-1">
                Couture
              </span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-lg font-light">
              Limited-edition atelier creations engineered in Milan and Rome, defined by dramatic boned silhouettes and liquid Barocco silk.
            </p>
          </div>

          <Link
            href="/category/runway-couture"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-luxury text-[#a7c080] hover:text-white transition-colors group"
          >
            <span>View All Runway Ensembles</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Runway Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {runwayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
