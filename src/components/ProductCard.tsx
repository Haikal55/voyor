"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice } from "@/lib/types";
import { useLuxury } from "@/context/luxury-context";
import { ShoppingBag, Check } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { currency, addToCart, isLoadingCart } = useLuxury();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const secondaryImage = product.images.find((img) => !img.isPrimary) || product.images[1] || primaryImage;
  const hasSecondary = Boolean(secondaryImage && secondaryImage.url !== primaryImage?.url);

  const handleQuickAdd = async (variantId: string) => {
    await addToCart(variantId, 1);
    setShowQuickSelect(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div
      className="group relative flex flex-col luxury-card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSelect(false);
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#121212] overflow-hidden border border-[#1f1f1f] group-hover:border-[#a7c080]/40 transition-colors duration-300">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          {/* Primary Product Image (Instant swap, no fade) */}
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover object-top ${hasSecondary ? "group-hover:hidden" : ""}`}
            />
          )}

          {/* Secondary Product Image (Instant on hover, no fade) */}
          {hasSecondary && (
            <Image
              src={secondaryImage.url}
              alt={`${product.name} - Alternate Angle`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top hidden group-hover:block"
            />
          )}
        </Link>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.isRunway && (
            <span className="bg-black/90 backdrop-blur-sm border border-[#a7c080]/70 text-[#a7c080] text-[9px] uppercase tracking-luxury px-2 py-0.5 font-medium shadow-md">
              Runway FW26
            </span>
          )}
          {product.isNew && !product.isRunway && (
            <span className="bg-white/95 text-black text-[9px] uppercase tracking-luxury px-2 py-0.5 font-semibold shadow-md">
              New Arrival
            </span>
          )}
        </div>

        {/* Quick Add Button & Drawer */}
        <div className="absolute bottom-3 inset-x-3 transition-all duration-300 z-20 opacity-90 sm:opacity-0 sm:translate-y-2 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          {showQuickSelect ? (
            <div className="bg-black/95 border border-[#a7c080] p-2 text-center backdrop-blur-md shadow-2xl animate-fadeIn">
              <span className="text-[10px] uppercase tracking-wider text-[#a7c080] block mb-1.5 font-medium">
                Select Tailored Size:
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleQuickAdd(v.id)}
                    disabled={isLoadingCart}
                    className="px-2 py-1 bg-[#1a1a1a] hover:bg-[#a7c080] hover:text-black text-white text-[10px] uppercase tracking-wider border border-[#333] transition-colors"
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (product.variants.length === 1) {
                  handleQuickAdd(product.variants[0].id);
                } else {
                  setShowQuickSelect(true);
                }
              }}
              disabled={isLoadingCart}
              className="w-full py-2.5 bg-black/90 hover:bg-[#a7c080] text-white hover:text-black border border-[#a7c080]/60 text-[10px] uppercase tracking-luxury font-bold flex items-center justify-center space-x-1.5 transition-all backdrop-blur-sm shadow-lg"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#a7c080]" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-4 flex flex-col flex-1 justify-between space-y-1.5">
        <div>
          {product.subtitle && (
            <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block truncate">
              {product.subtitle}
            </span>
          )}
          <h3 className="text-[13px] sm:text-sm font-normal text-white hover:text-[#a7c080] transition-colors line-clamp-1 mt-0.5">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5 font-light">
            {product.composition || product.origin}
          </p>
        </div>

        <div className="pt-1 flex items-baseline justify-between border-t border-[#1a1a1a]">
          <span className="text-sm font-semibold text-[#a7c080]">
            {formatPrice(product.basePrice, currency)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-neutral-500 line-through">
              {formatPrice(product.compareAtPrice, currency)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
