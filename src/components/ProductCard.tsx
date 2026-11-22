"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice } from "@/lib/types";
import { useLuxury } from "@/context/luxury-context";

export function ProductCard({ product }: { product: Product }) {
  const { currency } = useLuxury();

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const secondaryImage = product.images.find((img) => !img.isPrimary) || product.images[1] || primaryImage;
  const hasSecondary = Boolean(secondaryImage && secondaryImage.url !== primaryImage?.url);

  return (
    <div className="group relative flex flex-col luxury-card-hover">
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

        <div className="pt-2 flex items-baseline justify-between border-t border-[#1a1a1a]">
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
