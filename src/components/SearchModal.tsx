"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLuxury } from "@/context/luxury-context";
import { formatPrice, Product } from "@/lib/types";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SearchModal({ allProducts = [] }: { allProducts: Product[] }) {
  const { isSearchOpen, setIsSearchOpen, currency } = useLuxury();
  const [query, setQuery] = useState("");

  // Lock scroll when search modal is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(query.toLowerCase())) ||
          (p.composition && p.composition.toLowerCase().includes(query.toLowerCase()))
      )
    : allProducts.slice(0, 4);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Dialog Content */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 z-10"
        >
          <div className="flex justify-between items-center pb-6 border-b border-[#282828]">
            <span className="text-sm uppercase tracking-ultra text-[#a7c080]">
              VOYOR Maison Search
            </span>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-neutral-400 hover:text-white border border-[#222] rounded-full hover:border-[#a7c080] transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mt-8">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-[#a7c080]" />
            <input
              type="text"
              autoFocus
              placeholder="Search Silk, Gowns, Leather Bags, Perfumes, FW26..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent pl-10 pr-4 py-3 text-xl sm:text-2xl text-white placeholder-neutral-600 border-b border-[#333] focus:outline-none focus:border-[#a7c080] font-light"
            />
          </div>

          {/* Quick Collections suggestions */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-wider text-neutral-400">
            <span className="text-[#888] py-1">Popular:</span>
            {["Barocco Silk", "Runway FW26", "Atelier Evening Gown", "Palazzo Bags", "Extrait De Parfum"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 bg-[#141414] hover:bg-[#222] hover:text-[#a7c080] border border-[#222] transition-colors"
                >
                  {tag}
                </button>
              )
            )}
          </div>

          {/* Results */}
          <div className="mt-12">
            <h3 className="text-xs uppercase tracking-widest text-[#888] mb-6">
              {query.trim() ? `Search Results (${filtered.length})` : "Curated Highlights"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filtered.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/product/${prod.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="group block bg-[#111] border border-[#222] p-3 hover:border-[#a7c080]/50 transition-colors"
                >
                  <div className="relative aspect-[3/4] bg-[#181818] overflow-hidden mb-3">
                    {prod.images[0] && (
                      <Image
                        src={prod.images[0].url}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                    )}
                    {prod.isRunway && (
                      <span className="absolute top-2 left-2 bg-black/80 border border-[#a7c080]/60 text-[#a7c080] text-[8px] uppercase tracking-widest px-1.5 py-0.5">
                        Runway
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-white group-hover:text-[#a7c080] transition-colors line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-[#a7c080] font-semibold">
                      {formatPrice(prod.basePrice, currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {query.trim() && filtered.length === 0 && (
              <div className="text-center py-12 text-neutral-500 text-sm">
                No bespoke creations match your inquiry. Try searching for &quot;Silk&quot; or &quot;Runway&quot;.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
