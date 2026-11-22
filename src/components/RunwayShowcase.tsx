"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Product, formatPrice } from "@/lib/types";
import { useLuxury } from "@/context/luxury-context";

interface RunwayShowcaseProps {
  runwayProducts: Product[];
}

export function RunwayShowcase({ runwayProducts = [] }: RunwayShowcaseProps) {
  const { currency } = useLuxury();
  const [selectedGender, setSelectedGender] = useState<"women" | "men">("men");
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter products by selected gender
  const filteredProducts = runwayProducts.filter((p) => {
    if (selectedGender === "men") {
      return (
        p.categoryId === "cat_men" ||
        (p.categoryId === "cat_accessories" &&
          !p.name.toLowerCase().includes("gown") &&
          !p.name.toLowerCase().includes("sandals"))
      );
    } else {
      return (
        p.categoryId === "cat_women" ||
        p.categoryId === "cat_accessories"
      );
    }
  });

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [selectedGender, filteredProducts.length]);

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollDistance = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollDistance : scrollDistance,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="py-20 bg-[#080808] text-white border-y border-[#1c1c1c] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header with Title & Gender Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 mb-6 border-b border-[#1c1c1c] gap-6">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-luxury text-[#a7c080] font-medium block mb-2">
              Milan Fashion Week Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl text-white font-medium tracking-[0.04em] uppercase">
              Runway <span className="text-[#a7c080]">Couture</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-lg font-light leading-relaxed">
              Limited-edition atelier creations engineered in Milan and Rome, defined by dramatic silhouettes and liquid Barocco silk.
            </p>
          </div>

          {/* Luxury Gender Toggle: WOMEN [ o ] MEN */}
          <div className="flex items-center space-x-3 select-none self-end sm:self-auto pt-2 sm:pt-0">
            <button
              onClick={() => setSelectedGender("women")}
              className={`text-[11px] sm:text-xs uppercase tracking-luxury transition-colors cursor-pointer ${
                selectedGender === "women"
                  ? "text-white font-semibold"
                  : "text-neutral-500 font-normal hover:text-neutral-300"
              }`}
            >
              WOMEN
            </button>

            {/* Pill Switch Slider */}
            <button
              onClick={() => setSelectedGender(selectedGender === "women" ? "men" : "women")}
              className="relative w-12 h-6 rounded-full border border-neutral-700 bg-[#161616] p-0.5 flex items-center cursor-pointer transition-colors"
              aria-label="Toggle Women / Men runway collection"
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-[#a7c080] shadow-sm"
                animate={{ x: selectedGender === "men" ? 22 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>

            <button
              onClick={() => setSelectedGender("men")}
              className={`text-[11px] sm:text-xs uppercase tracking-luxury transition-colors cursor-pointer ${
                selectedGender === "men"
                  ? "text-white font-semibold"
                  : "text-neutral-500 font-normal hover:text-neutral-300"
              }`}
            >
              MEN
            </button>
          </div>
        </div>

        {/* Carousel Viewport with Full-Bleed Editorial Cards */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 bg-black/90 border border-neutral-700 hover:border-[#a7c080] hover:bg-[#a7c080] hover:text-black flex items-center justify-center text-white transition-all shadow-2xl backdrop-blur-md cursor-pointer ${
              canScrollLeft ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            }`}
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Horizontal Track of Full-Bleed Cards */}
          <div
            ref={carouselRef}
            onScroll={checkScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredProducts.map((product) => {
              const primaryImg = product.images.find((img) => img.isPrimary) || product.images[0];
              const secondaryImg = product.images.find((img) => !img.isPrimary) || product.images[1] || primaryImg;
              const hasSecondary = Boolean(secondaryImg && secondaryImg.url !== primaryImg?.url);

              return (
                <div
                  key={product.id}
                  className="snap-start shrink-0 w-[82%] sm:w-[48%] md:w-[32%] lg:w-[23.5%]"
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className="group relative block aspect-[3/4] w-full bg-[#121212] overflow-hidden border border-[#222] hover:border-[#a7c080]/60 transition-colors duration-300 shadow-xl"
                  >
                    {/* Primary Full-Bleed Image (Instant switch, no fade animation) */}
                    {primaryImg && (
                      <Image
                        src={primaryImg.url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 33vw, 25vw"
                        className={`object-cover object-top opacity-90 ${
                          hasSecondary ? "group-hover:hidden" : ""
                        }`}
                      />
                    )}

                    {/* Secondary Full-Bleed Image (Instant display on hover, no fade animation) */}
                    {hasSecondary && (
                      <Image
                        src={secondaryImg.url}
                        alt={`${product.name} - Alternate View`}
                        fill
                        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-top opacity-95 hidden group-hover:block"
                      />
                    )}

                    {/* Multilayered Editorial Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />

                    {/* Top Pill: Look Number / New Badge */}
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <span className="bg-black/80 backdrop-blur-sm border border-white/15 text-[#a7c080] text-[9px] uppercase tracking-luxury px-2 py-0.5 font-medium">
                        {product.subtitle || "Runway FW26"}
                      </span>
                    </div>

                    {/* Bottom Metadata Overlay (Aligned like reference screenshot) */}
                    <div className="absolute bottom-4 left-4 right-4 text-center z-10 space-y-1.5 pointer-events-none">
                      <h3 className="text-sm sm:text-base text-white uppercase tracking-wider font-medium line-clamp-1 group-hover:text-[#a7c080] transition-colors leading-tight">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-center space-x-2 text-[10px] uppercase tracking-ultra text-neutral-300">
                        <span className="text-[#a7c080] font-medium">
                          {formatPrice(product.basePrice, currency)}
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-400 group-hover:text-white transition-colors">
                          Explore &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 bg-black/90 border border-neutral-700 hover:border-[#a7c080] hover:bg-[#a7c080] hover:text-black flex items-center justify-center text-white transition-all shadow-2xl backdrop-blur-md cursor-pointer ${
              canScrollRight ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            }`}
          >
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
