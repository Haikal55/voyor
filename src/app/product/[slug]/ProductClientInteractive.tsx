"use client";

import React, { useState } from "react";
import { Product, formatPrice } from "@/lib/types";
import { useLuxury } from "@/context/luxury-context";
import { ShoppingBag, Check, Calendar } from "lucide-react";

export function ProductClientInteractive({ product }: { product: Product }) {
  const { currency, addToCart, isLoadingCart } = useLuxury();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Subtitle & Title */}
      <div>
        {product.subtitle && (
          <span className="text-[11px] uppercase tracking-luxury text-[#a7c080] block font-medium mb-1">
            {product.subtitle}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-medium tracking-[0.03em] uppercase leading-snug">
          {product.name}
        </h1>

        {/* Price */}
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-semibold text-[#a7c080]">
            {formatPrice(product.basePrice + (selectedVariant?.priceDelta || 0), currency)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-neutral-500 line-through">
              {formatPrice(product.compareAtPrice, currency)}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">
            VAT & Duties Included
          </span>
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-2 pt-2 border-t border-[#1c1c1c]">
        <div className="flex justify-between text-xs">
          <span className="uppercase tracking-wider text-neutral-400">Color Variant:</span>
          <span className="text-white font-medium">{selectedVariant?.colorName}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const isSelected = v.id === selectedVariantId;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                  isSelected ? "border-[#a7c080] scale-110" : "border-[#333] opacity-70 hover:opacity-100"
                }`}
                aria-label={v.colorName}
                title={v.colorName}
              >
                <span
                  className="block w-full h-full rounded-full border border-black/50"
                  style={{ backgroundColor: v.colorHex }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-2 pt-2 border-t border-[#1c1c1c]">
        <div className="flex justify-between text-xs">
          <span className="uppercase tracking-wider text-neutral-400">Size / Dimension:</span>
          <button
            onClick={() => alert("Size Advice: Fits true to Italian runway tailoring. Order your standard Italian size.")}
            className="text-[10px] text-[#a7c080] underline tracking-widest uppercase hover:text-white"
          >
            Size Guide
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const isSelected = v.id === selectedVariantId;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`py-2.5 px-3.5 text-xs uppercase tracking-wider text-center border transition-all flex-1 min-w-[70px] ${
                  isSelected
                    ? "bg-[#a7c080] text-black border-[#a7c080] font-bold shadow-md shadow-[#a7c080]/20"
                    : "bg-[#121212] text-neutral-300 border-[#2a2a2a] hover:border-neutral-500"
                }`}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary CTAs */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={isLoadingCart || !selectedVariant}
          className="w-full py-4 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-luxury flex items-center justify-center space-x-2 transition-all shadow-xl shadow-[#a7c080]/15 disabled:opacity-50"
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 text-black" />
              <span>Reserved in Your Bag</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add To Shopping Bag</span>
            </>
          )}
        </button>

        <button
          onClick={() =>
            alert(
              "Private Styling Concierge: An atelier advisor from our Via Montenapoleone boutique will contact you via email."
            )
          }
          className="w-full py-3.5 bg-transparent hover:bg-white/5 border border-white/20 text-white text-xs uppercase tracking-luxury font-medium flex items-center justify-center space-x-2 transition-all"
        >
          <Calendar className="w-3.5 h-3.5 text-[#a7c080]" />
          <span>Book Private Styling Appointment</span>
        </button>
      </div>
    </div>
  );
}
