"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Product, formatPrice } from "@/lib/types";
import { useLuxury } from "@/context/luxury-context";
import { toggleWishlistAction } from "@/app/actions/account";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import {
  ShoppingBag,
  Check,
  Calendar,
  Heart,
  Share2,
  ChevronDown,
  X,
  Sparkles,
  MapPin,
  Clock,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  RefreshCw,
  Minus,
  Plus,
} from "lucide-react";

interface SizeGuideTab {
  id: "apparel" | "footwear" | "accessories" | "tailoring";
  label: string;
}

export function ProductClientInteractive({ product }: { product: Product }) {
  const { currency, addToCart, isLoadingCart } = useLuxury();

  const uniqueColors = useMemo(() => {
    const map = new Map<string, { colorName: string; colorHex: string }>();
    product.variants.forEach((v) => {
      if (!map.has(v.colorName)) {
        map.set(v.colorName, { colorName: v.colorName, colorHex: v.colorHex });
      }
    });
    return Array.from(map.values());
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState<string>(
    uniqueColors[0]?.colorName || product.variants[0]?.colorName || ""
  );

  const variantsForCurrentColor = useMemo(() => {
    return product.variants.filter((v) => v.colorName === selectedColor);
  }, [product.variants, selectedColor]);

  const [selectedSize, setSelectedSize] = useState<string>(
    variantsForCurrentColor[0]?.size || product.variants[0]?.size || ""
  );

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const availableForColor = product.variants.filter((v) => v.colorName === colorName);
    const hasSameSize = availableForColor.some((v) => v.size === selectedSize);
    if (!hasSameSize && availableForColor.length > 0) {
      setSelectedSize(availableForColor[0].size);
    }
  };

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find(
        (v) => v.colorName === selectedColor && v.size === selectedSize
      ) ||
      variantsForCurrentColor[0] ||
      product.variants[0]
    );
  }, [product.variants, selectedColor, selectedSize, variantsForCurrentColor]);

  const activeImages = useMemo(() => {
    if (!product.images || product.images.length === 0) return [];
    const forColor = product.images.filter(
      (img) => img.colorName && img.colorName.toLowerCase() === selectedColor.toLowerCase()
    );
    if (forColor.length > 0) return forColor;
    const general = product.images.filter((img) => !img.colorName);
    return general.length > 0 ? general : product.images;
  }, [product.images, selectedColor]);

  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    specs: true,
    composition: false,
    care: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideTab, setSizeGuideTab] = useState<SizeGuideTab["id"]>("apparel");
  const [isGuaranteesModalOpen, setIsGuaranteesModalOpen] = useState(false);
  const [guaranteeInitialTab, setGuaranteeInitialTab] = useState<
    "delivery" | "authenticity" | "returns"
  >("delivery");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSizeGuideOpen(false);
        setIsGuaranteesModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSizeGuideOpen || isGuaranteesModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSizeGuideOpen, isGuaranteesModalOpen]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addToCart(selectedVariant.id, quantity);
    setJustAdded(true);
    showToast(`Added ${quantity}x "${product.name}" (${selectedVariant.colorName}, ${selectedVariant.size}) to shopping bag`);
    setTimeout(() => setJustAdded(false), 2500);
  };

  const handleWishlistToggle = async () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    showToast(
      next
        ? `Saved "${product.name}" to Atelier Wishlist`
        : `Removed "${product.name}" from Wishlist`
    );
    try {
      await toggleWishlistAction(product.id);
    } catch {}
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | VOYOR Haute Couture`,
          text: product.description,
          url,
        });
        return;
      } catch {

      }
    }
    await navigator.clipboard.writeText(url);
    showToast("Product link copied to clipboard");
  };

  const detailsList: string[] = product.detailsJson ? JSON.parse(product.detailsJson) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-7">
        <ProductImageGallery
          images={activeImages}
          productName={product.name}
          isRunway={Boolean(product.isRunway)}
        />
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-24 sm:top-28 transition-[top] duration-300 ease-out space-y-6">
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-[80] bg-[#141414] border border-[#a7c080]/50 text-white px-5 py-3 rounded shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Sparkles className="w-4 h-4 text-[#a7c080] shrink-0" />
              <span className="text-xs font-medium tracking-wide text-neutral-200">
                {toastMessage}
              </span>
            </div>
          )}

          <div>
            <div className="flex items-start justify-between gap-4 mb-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-medium tracking-[0.03em] uppercase leading-snug">
                {product.name}
              </h1>
          <div className="flex items-center space-x-2 shrink-0 pt-1.5">
            <button
              onClick={handleWishlistToggle}
              aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isWishlisted
                  ? "border-[#a7c080] bg-[#a7c080]/10 text-[#a7c080]"
                  : "border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
              }`}
              title={isWishlisted ? "In Atelier Wishlist" : "Save to Wishlist"}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#a7c080]" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              aria-label="Share this creation"
              className="p-2 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
              title="Share Creation"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

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
            White-Glove VAT & Duties Included
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-[#1c1c1c]">
        <div className="flex justify-between items-center text-xs">
          <span className="uppercase tracking-wider text-neutral-400">Color Variant:</span>
          <span className="text-[#a7c080] font-semibold tracking-wide">
            {selectedColor}
          </span>
        </div>

        {uniqueColors.length > 1 ? (
          <div className="flex flex-wrap items-center gap-3">
            {uniqueColors.map((c) => {
              const isSelected = c.colorName === selectedColor;
              return (
                <button
                  key={c.colorName}
                  onClick={() => handleColorChange(c.colorName)}
                  className={`group relative flex items-center p-1 rounded-full border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#a7c080] shadow-[0_0_12px_rgba(167,192,128,0.4)]"
                      : "border-neutral-700/70 hover:border-neutral-400 opacity-80 hover:opacity-100"
                  }`}
                  aria-label={`Select color ${c.colorName}`}
                  title={c.colorName}
                >
                  <span
                    className="block w-6 h-6 rounded-full border border-black/50 shadow-inner"
                    style={{ backgroundColor: c.colorHex }}
                  />
                  {isSelected && (
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#a7c080] border border-black rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs font-serif text-neutral-400 italic">
            Exclusive single edition in signature {selectedColor}.
          </p>
        )}
      </div>

      <div className="space-y-3 pt-3 border-t border-[#1c1c1c]">
        <div className="flex justify-between items-center text-xs">
          <span className="uppercase tracking-wider text-neutral-400">Size / Silhouette:</span>
          <button
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-[11px] text-[#a7c080] hover:text-white underline tracking-wider uppercase font-medium transition-colors cursor-pointer"
          >
            Size & Fit Guide
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {variantsForCurrentColor.map((v) => {
            const isSelected = v.size === selectedSize;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedSize(v.size)}
                className={`py-2.5 px-4 text-xs uppercase tracking-wider text-center border transition-all flex-1 min-w-[72px] cursor-pointer ${
                  isSelected
                    ? "bg-[#a7c080] text-black border-[#a7c080] font-bold shadow-md shadow-[#a7c080]/20"
                    : "bg-[#121212] text-neutral-300 border-[#2a2a2a] hover:border-neutral-500 hover:text-white"
                }`}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-[#1c1c1c]">
        <div className="flex items-center gap-3">

          <div className="flex items-center border border-[#2a2a2a] bg-[#121212] rounded h-[52px] px-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="p-2 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-medium text-sm text-white select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              disabled={quantity >= 10}
              aria-label="Increase quantity"
              className="p-2 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isLoadingCart || !selectedVariant}
            className="flex-1 py-4 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-luxury flex items-center justify-center space-x-2 transition-all shadow-xl shadow-[#a7c080]/15 disabled:opacity-50 cursor-pointer h-[52px]"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Reserved in Your Bag ({quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Shopping Bag</span>
              </>
            )}
          </button>
        </div>

        <Link
          href={`/book-appointment?product=${encodeURIComponent(product.name)}&slug=${product.slug}`}
          className="w-full py-3.5 bg-transparent hover:bg-white/5 border border-white/20 text-white text-xs uppercase tracking-luxury font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer group"
        >
          <Calendar className="w-3.5 h-3.5 text-[#a7c080]" />
          <span>Book Private Styling Appointment</span>
        </Link>
      </div>

      <div className="pt-4 border-t border-[#1c1c1c] space-y-2 text-xs">

        <div className="border border-[#1e1e1e] bg-[#0d0d0d]/60 rounded overflow-hidden">
          <button
            onClick={() => toggleAccordion("description")}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-xs uppercase tracking-wider font-semibold text-[#a7c080]">
              Description & Silhouette
            </span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                openAccordions.description ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordions.description && (
            <div className="px-4 pb-4 pt-1 text-neutral-300 font-light leading-relaxed border-t border-[#191919]">
              {product.description}
            </div>
          )}
        </div>

        {detailsList.length > 0 && (
          <div className="border border-[#1e1e1e] bg-[#0d0d0d]/60 rounded overflow-hidden">
            <button
              onClick={() => toggleAccordion("specs")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-xs uppercase tracking-wider font-semibold text-[#a7c080]">
                Atelier Specifications ({detailsList.length})
              </span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                  openAccordions.specs ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordions.specs && (
              <div className="px-4 pb-4 pt-2 text-neutral-400 font-light border-t border-[#191919]">
                <ul className="space-y-2">
                  {detailsList.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-[#a7c080] mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="border border-[#1e1e1e] bg-[#0d0d0d]/60 rounded overflow-hidden">
          <button
            onClick={() => toggleAccordion("composition")}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-xs uppercase tracking-wider font-semibold text-[#a7c080]">
              Material Composition & Origin
            </span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                openAccordions.composition ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordions.composition && (
            <div className="px-4 pb-4 pt-2 space-y-2 text-neutral-400 border-t border-[#191919]">
              <p>
                <span className="text-white font-medium">Composition:</span>{" "}
                {product.composition || "Silk & Virgin Wool"}
              </p>
              <p>
                <span className="text-white font-medium">Origin:</span> {product.origin}
              </p>
              {product.careGuide && (
                <p>
                  <span className="text-white font-medium">Care & Preservation:</span>{" "}
                  {product.careGuide}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#1c1c1c] space-y-2 text-[11px] text-neutral-400">
        <button
          onClick={() => {
            setGuaranteeInitialTab("delivery");
            setIsGuaranteesModalOpen(true);
          }}
          className="w-full flex items-center space-x-3 p-2 rounded hover:bg-white/[0.03] transition-colors text-left cursor-pointer group"
        >
          <Truck className="w-4 h-4 text-[#a7c080]" />
          <span className="group-hover:text-white transition-colors">
            Complimentary Global White-Glove Delivery
          </span>
        </button>

        <button
          onClick={() => {
            setGuaranteeInitialTab("authenticity");
            setIsGuaranteesModalOpen(true);
          }}
          className="w-full flex items-center space-x-3 p-2 rounded hover:bg-white/[0.03] transition-colors text-left cursor-pointer group"
        >
          <ShieldCheck className="w-4 h-4 text-[#a7c080]" />
          <span className="group-hover:text-white transition-colors">
            Certified 100% Italian Atelier Authenticity Guaranteed
          </span>
        </button>

        <button
          onClick={() => {
            setGuaranteeInitialTab("returns");
            setIsGuaranteesModalOpen(true);
          }}
          className="w-full flex items-center space-x-3 p-2 rounded hover:bg-white/[0.03] transition-colors text-left cursor-pointer group"
        >
          <RefreshCw className="w-4 h-4 text-[#a7c080]" />
          <span className="group-hover:text-white transition-colors">
            30-Day Complimentary Boutique Return Privilege
          </span>
        </button>
      </div>
        </div>
      </div>

      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl bg-[#0e0e0e] border border-[#2b2b2b] rounded-lg shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-700 hover:border-neutral-500 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-ultra text-[#a7c080] font-semibold block mb-1">
                Atelier Precision
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-wider">
                Size & Fit Guide
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Official Italian conversion chart and couture measurement standards for VOYOR creations.
              </p>
            </div>

            <div className="flex border-b border-neutral-800 mb-6 gap-2 sm:gap-4 overflow-x-auto text-xs">
              {(
                [
                  { id: "apparel", label: "Apparel" },
                  { id: "footwear", label: "Footwear" },
                  { id: "accessories", label: "Accessories & Bags" },
                  { id: "tailoring", label: "Atelier Tailoring" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSizeGuideTab(tab.id)}
                  className={`pb-2.5 px-1 uppercase tracking-wider font-medium cursor-pointer transition-colors whitespace-nowrap border-b-2 ${
                    sizeGuideTab === tab.id
                      ? "border-[#a7c080] text-[#a7c080]"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {sizeGuideTab === "apparel" && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-700 text-[#a7c080] uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">Italian (IT)</th>
                        <th className="py-2.5 px-3">International</th>
                        <th className="py-2.5 px-3">US / UK</th>
                        <th className="py-2.5 px-3">Bust / Chest (cm)</th>
                        <th className="py-2.5 px-3">Waist (cm)</th>
                        <th className="py-2.5 px-3">Hips (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">IT 38</td>
                        <td className="py-2.5 px-3">XS</td>
                        <td className="py-2.5 px-3">US 2 / UK 6</td>
                        <td className="py-2.5 px-3">82 - 85</td>
                        <td className="py-2.5 px-3">62 - 65</td>
                        <td className="py-2.5 px-3">88 - 91</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">IT 40</td>
                        <td className="py-2.5 px-3">S</td>
                        <td className="py-2.5 px-3">US 4 / UK 8</td>
                        <td className="py-2.5 px-3">86 - 89</td>
                        <td className="py-2.5 px-3">66 - 69</td>
                        <td className="py-2.5 px-3">92 - 95</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">IT 42 / 46M</td>
                        <td className="py-2.5 px-3">M</td>
                        <td className="py-2.5 px-3">US 6 / UK 10</td>
                        <td className="py-2.5 px-3">90 - 93</td>
                        <td className="py-2.5 px-3">70 - 73</td>
                        <td className="py-2.5 px-3">96 - 99</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">IT 44 / 48M</td>
                        <td className="py-2.5 px-3">L</td>
                        <td className="py-2.5 px-3">US 8 / UK 12</td>
                        <td className="py-2.5 px-3">94 - 98</td>
                        <td className="py-2.5 px-3">74 - 78</td>
                        <td className="py-2.5 px-3">100 - 104</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">IT 50 / 52M</td>
                        <td className="py-2.5 px-3">XL</td>
                        <td className="py-2.5 px-3">US 10 / UK 14</td>
                        <td className="py-2.5 px-3">99 - 104</td>
                        <td className="py-2.5 px-3">79 - 84</td>
                        <td className="py-2.5 px-3">105 - 110</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-neutral-400 italic">
                  * Note: Runway cuts are engineered with architectural drape. For an oversized silhouette, consider ordering your standard Italian size.
                </p>
              </div>
            )}

            {sizeGuideTab === "footwear" && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-700 text-[#a7c080] uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">IT / EU</th>
                        <th className="py-2.5 px-3">US Women</th>
                        <th className="py-2.5 px-3">UK</th>
                        <th className="py-2.5 px-3">Foot Length (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">36</td>
                        <td className="py-2.5 px-3">6.0</td>
                        <td className="py-2.5 px-3">3.5</td>
                        <td className="py-2.5 px-3">23.0 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">37</td>
                        <td className="py-2.5 px-3">6.5</td>
                        <td className="py-2.5 px-3">4.0</td>
                        <td className="py-2.5 px-3">23.7 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">38</td>
                        <td className="py-2.5 px-3">7.5</td>
                        <td className="py-2.5 px-3">5.0</td>
                        <td className="py-2.5 px-3">24.4 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">39</td>
                        <td className="py-2.5 px-3">8.5</td>
                        <td className="py-2.5 px-3">6.0</td>
                        <td className="py-2.5 px-3">25.0 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">40</td>
                        <td className="py-2.5 px-3">9.0</td>
                        <td className="py-2.5 px-3">6.5</td>
                        <td className="py-2.5 px-3">25.7 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {sizeGuideTab === "accessories" && (
              <div className="space-y-4 text-xs text-neutral-300">
                <div className="p-4 rounded bg-[#141414] border border-[#222] space-y-2">
                  <h4 className="font-semibold text-white text-sm">Leather Handbags & Totes</h4>
                  <p>Medium Handbag Dimensions: 26cm Width x 18cm Height x 11cm Depth.</p>
                  <p>Detachable Curb Chain Drop: 48cm - 56cm adjustable shoulder drop.</p>
                </div>
                <div className="p-4 rounded bg-[#141414] border border-[#222] space-y-2">
                  <h4 className="font-semibold text-white text-sm">Reversible Leather Belts</h4>
                  <p>Belt sizing represents the measurement from the inner buckle pin to the middle adjustment hole.</p>
                  <p>85 cm (Waist 75-85cm) • 90 cm (Waist 80-90cm) • 95 cm (Waist 85-95cm) • 100 cm (Waist 90-100cm).</p>
                </div>
              </div>
            )}

            {sizeGuideTab === "tailoring" && (
              <div className="space-y-4 text-xs text-neutral-300">
                <div className="p-4 rounded bg-[#141414] border border-[#a7c080]/30 space-y-3">
                  <div className="flex items-center space-x-2 text-[#a7c080] font-semibold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Complimentary In-Boutique Atelier Alterations</span>
                  </div>
                  <p className="leading-relaxed">
                    Every piece purchased from VOYOR includes lifetime complimentary bespoke alterations at any of our flagship boutiques in Milan, Paris, London, New York, and Tokyo.
                  </p>
                  <p className="leading-relaxed text-neutral-400">
                    If you require custom measurements or personal fitting prior to delivery, please contact our Styling Concierge or book an appointment.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="px-6 py-2.5 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {isGuaranteesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-[#0e0e0e] border border-[#2b2b2b] rounded-lg shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setIsGuaranteesModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-700 hover:border-neutral-500 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-ultra text-[#a7c080] font-semibold block mb-1">
                Client Privileges
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-wider">
                VOYOR Atelier Guarantees
              </h3>
            </div>

            <div className="flex border-b border-neutral-800 mb-6 gap-3 text-xs">
              <button
                onClick={() => setGuaranteeInitialTab("delivery")}
                className={`pb-2.5 font-medium uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
                  guaranteeInitialTab === "delivery"
                    ? "border-[#a7c080] text-[#a7c080]"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                White-Glove Delivery
              </button>
              <button
                onClick={() => setGuaranteeInitialTab("authenticity")}
                className={`pb-2.5 font-medium uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
                  guaranteeInitialTab === "authenticity"
                    ? "border-[#a7c080] text-[#a7c080]"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                100% Authenticity
              </button>
              <button
                onClick={() => setGuaranteeInitialTab("returns")}
                className={`pb-2.5 font-medium uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
                  guaranteeInitialTab === "returns"
                    ? "border-[#a7c080] text-[#a7c080]"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                Boutique Returns
              </button>
            </div>

            <div className="text-xs text-neutral-300 leading-relaxed space-y-3">
              {guaranteeInitialTab === "delivery" && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#a7c080] font-semibold text-sm">
                    <Truck className="w-5 h-5" />
                    <span>Complimentary Global White-Glove Delivery</span>
                  </div>
                  <p>
                    Every order is prepared at our Milan central atelier and shipped via dedicated insured courier service in our signature gold-embossed archival presentation boxes.
                  </p>
                  <p className="text-neutral-400">
                    Dispatches within 24 hours. Includes real-time concierge delivery tracking and discreet signature upon arrival.
                  </p>
                </div>
              )}

              {guaranteeInitialTab === "authenticity" && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#a7c080] font-semibold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Certified 100% Italian Atelier Authenticity</span>
                  </div>
                  <p>
                    All creations are handcrafted exclusively in Italy across historic artisan workshops in Milan, Rome, Florence, and Veneto.
                  </p>
                  <p className="text-neutral-400">
                    Each creation incorporates an encrypted NFC digital authenticity passport embedded inside the garment label, verifiable with any smartphone.
                  </p>
                </div>
              )}

              {guaranteeInitialTab === "returns" && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#a7c080] font-semibold text-sm">
                    <RefreshCw className="w-5 h-5" />
                    <span>30-Day Complimentary Boutique Return Privilege</span>
                  </div>
                  <p>
                    We offer a 30-day return or exchange privilege from the date of delivery. You may return unworn items with security seals intact via complimentary home courier pickup or at any VOYOR boutique globally.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setIsGuaranteesModalOpen(false)}
                className="px-6 py-2 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
