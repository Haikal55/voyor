"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Product, formatPrice } from "@/lib/types";
import { useLuxury } from "@/context/luxury-context";

interface RunwayShowcaseProps {
  runwayProducts: Product[];
}

export function RunwayShowcase({ runwayProducts = [] }: RunwayShowcaseProps) {
  const { currency } = useLuxury();
  // Default to "men" to match the user's reference screenshot showcasing Men's runway accessories
  const [selectedGender, setSelectedGender] = useState<"women" | "men">("men");
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter products by selected gender
  const filteredProducts = runwayProducts.filter((p) => {
    if (selectedGender === "men") {
      return (
        p.categoryId === "cat_men" ||
        (p.categoryId === "cat_accessories" && !p.name.toLowerCase().includes("gown") && !p.name.toLowerCase().includes("sandals"))
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
    // Reset scroll to beginning when gender changes
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [selectedGender, filteredProducts.length]);

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 4;
      const scrollDistance = cardWidth * 2;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollDistance : scrollDistance,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white text-black border-y border-neutral-200 transition-colors">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Strip with Title & Gender Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-2 border-b border-neutral-200 gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#556b2f] font-semibold block mb-1">
              Milan Fashion Week Atelier
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-[0.03em] uppercase text-neutral-900">
              Runway <span className="text-[#556b2f]">Collection</span>
            </h2>
          </div>

          {/* Luxury Gender Toggle: WOMEN [ o ] MEN */}
          <div className="flex items-center space-x-3 select-none self-end sm:self-auto">
            <button
              onClick={() => setSelectedGender("women")}
              className={`text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                selectedGender === "women"
                  ? "text-neutral-900 font-semibold"
                  : "text-neutral-400 font-normal hover:text-neutral-600"
              }`}
            >
              WOMEN
            </button>

            {/* Pill Switch Slider */}
            <button
              onClick={() => setSelectedGender(selectedGender === "women" ? "men" : "women")}
              className="relative w-12 h-6 rounded-full border border-neutral-400 bg-neutral-100 p-0.5 flex items-center cursor-pointer transition-colors"
              aria-label="Toggle Women / Men runway collection"
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-black shadow-sm"
                animate={{ x: selectedGender === "men" ? 22 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>

            <button
              onClick={() => setSelectedGender("men")}
              className={`text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                selectedGender === "men"
                  ? "text-neutral-900 font-semibold"
                  : "text-neutral-400 font-normal hover:text-neutral-600"
              }`}
            >
              MEN
            </button>
          </div>
        </div>

        {/* Carousel Viewport with Flush Card Divider Layout */}
        <div className="relative group/carousel">
          {/* Left Arrow Button (Bordered square like Versace) */}
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`absolute -left-2 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white border border-neutral-900 flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all shadow-md cursor-pointer ${
              canScrollLeft ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            }`}
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Horizontal Track of Flush Cards */}
          <div
            ref={carouselRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory border-b border-neutral-200"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredProducts.map((product, idx) => {
              const primaryImg = product.images[0]?.url || "";

              return (
                <div
                  key={product.id}
                  className={`snap-start shrink-0 w-[80%] sm:w-1/2 md:w-1/3 lg:w-1/4 bg-[#fbfbfb] hover:bg-white transition-colors duration-300 flex flex-col justify-between border-r border-neutral-200 ${
                    idx === 0 ? "border-l border-neutral-200" : ""
                  }`}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className="block group h-full flex flex-col justify-between p-4 sm:p-6"
                  >
                    {/* Studio Product Image - Clean Studio Light Frame */}
                    <div className="relative aspect-[4/5] w-full bg-[#f5f5f5] flex items-center justify-center overflow-hidden mb-4">
                      {primaryImg && (
                        <Image
                          src={primaryImg}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-6 sm:p-8 transition-opacity duration-300 group-hover:opacity-95"
                          priority={idx < 4}
                        />
                      )}
                    </div>

                    {/* Bottom Metadata: Clean Title & Price */}
                    <div className="space-y-1 text-left pt-2 pb-1">
                      <h3 className="text-xs sm:text-[13px] font-normal text-neutral-900 tracking-tight leading-snug group-hover:text-black line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-500 font-normal">
                        {formatPrice(product.basePrice, currency)}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button (Bordered square like Versace) */}
          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`absolute -right-2 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white border border-neutral-900 flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all shadow-md cursor-pointer ${
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
