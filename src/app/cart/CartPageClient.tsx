"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLuxury } from "@/context/luxury-context";
import { formatPrice } from "@/lib/types";
import { Trash2, Plus, Minus, Gift, Phone, Mail, ShieldCheck, ArrowRight } from "lucide-react";

export function CartPageClient() {
  const {
    cart,
    currency,
    updateQuantity,
    removeItem,
    cartTotalUSD,
    isLoadingCart,
    setIsCheckoutOpen,
  } = useLuxury();

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.18em] text-neutral-400 font-sans">
            <li>
              <Link href="/" className="hover:text-[#a7c080] transition-colors">
                Home
              </Link>
            </li>
            <li className="text-neutral-600">/</li>
            <li className="text-[#a7c080] font-semibold">Shopping Bag</li>
          </ol>
        </nav>

        <div className="border-b border-[#1c1c1c] pb-6 mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Shopping Bag ({cart.length})
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#121212] border border-[#222222] flex items-center justify-center text-[#a7c080]">
              <Gift className="w-8 h-8 stroke-[1.2]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-white">
                Your shopping bag is currently empty.
              </h2>
              <p className="font-serif text-sm text-neutral-400 leading-relaxed">
                Explore our latest runway presentations, iconic silk shirts, and sovereign leather goods to begin curating your collection.
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/category/runway-couture"
                className="inline-block px-8 py-4 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold tracking-[0.2em] uppercase transition-colors shadow-lg shadow-[#a7c080]/10"
              >
                Discover Runway FW26
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="divide-y divide-[#1c1c1c] border-b border-[#1c1c1c]">
                {cart.map((item) => (
                  <div key={item.id} className="py-8 first:pt-0 flex flex-col sm:flex-row gap-6">
                    <div className="relative w-full sm:w-36 h-48 bg-[#121212] border border-[#222222] flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 144px"
                        className="object-contain p-3"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <Link
                              href={`/product/${item.product.slug}`}
                              className="font-serif text-lg text-white hover:text-[#a7c080] transition-colors leading-snug"
                            >
                              {item.product.name}
                            </Link>
                            <p className="font-mono text-[11px] text-neutral-500 mt-1 uppercase tracking-wider">
                              Art. VY-{item.variant.id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                          <span className="font-serif text-base font-semibold text-[#a7c080]">
                            {formatPrice(
                              (item.product.basePrice + item.variant.priceDelta) * item.quantity,
                              currency
                            )}
                          </span>
                        </div>

                        <div className="space-y-1 font-serif text-xs text-neutral-400">
                          <p>
                            <span className="text-neutral-500">Color:</span> {item.variant.colorName}
                          </p>
                          {item.variant.size && item.variant.size !== "Standard" && (
                            <p>
                              <span className="text-neutral-500">Size:</span> {item.variant.size}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-[#181818] mt-6">
                        <div className="flex items-center space-x-3">
                          <span className="font-serif text-xs text-neutral-400">Quantity:</span>
                          <div className="flex items-center border border-[#2a2a2a] bg-[#141414]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isLoadingCart}
                              className="px-2.5 py-1.5 text-neutral-400 hover:text-white disabled:opacity-30"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
                            </button>
                            <span className="px-3 font-serif text-xs font-medium text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoadingCart}
                              className="px-2.5 py-1.5 text-neutral-400 hover:text-white disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isLoadingCart}
                          className="flex items-center space-x-1.5 text-neutral-500 hover:text-rose-400 transition-colors text-xs font-serif"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-[#111111] border border-[#222222] flex items-start gap-4 rounded-sm">
                <Gift className="w-5 h-5 text-[#a7c080] flex-shrink-0 mt-0.5" />
                <div className="text-xs font-serif space-y-1">
                  <p className="font-medium text-white uppercase tracking-wider">
                    Complimentary Signature Packaging
                  </p>
                  <p className="text-neutral-400 leading-relaxed">
                    Every order is enclosed in signature VOYOR rigid boxes, tied with woven Italian ribbon, accompanied by an atelier certificate of authenticity.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-[#111111] border border-[#222222] p-6 sm:p-8 space-y-6 rounded-sm">
                <h2 className="font-serif text-xl text-white font-normal border-b border-[#222222] pb-4">
                  Summary
                </h2>

                <div className="space-y-3 text-xs font-serif">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(cartTotalUSD, currency)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Estimated Delivery</span>
                    <span className="uppercase text-[#a7c080] font-medium">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Duties & Taxes</span>
                    <span className="uppercase text-[#a7c080] font-medium">Included</span>
                  </div>
                  <div className="flex justify-between text-base font-normal pt-4 border-t border-[#222222] text-white">
                    <span>Estimated Total</span>
                    <span className="font-semibold text-[#a7c080]">{formatPrice(cartTotalUSD, currency)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-[#a7c080]/10"
                  >
                    <span>CHECKOUT</span>
                    <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>

                <div className="pt-4 border-t border-[#222222] space-y-2">
                  <p className="font-serif text-[11px] text-neutral-400 uppercase tracking-wider">
                    Accepted Payment Methods
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-neutral-300 uppercase">
                    <span className="px-2.5 py-1 bg-[#181818] border border-[#2c2c2c]">Visa</span>
                    <span className="px-2.5 py-1 bg-[#181818] border border-[#2c2c2c]">Mastercard</span>
                    <span className="px-2.5 py-1 bg-[#181818] border border-[#2c2c2c]">Amex</span>
                    <span className="px-2.5 py-1 bg-[#181818] border border-[#2c2c2c]">Apple Pay</span>
                    <span className="px-2.5 py-1 bg-[#181818] border border-[#2c2c2c]">Wire</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-[#222222] bg-[#111111] space-y-3 font-serif text-xs rounded-sm">
                <div className="flex items-center gap-2 text-white font-medium uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#a7c080]" />
                  <span>Need Assistance?</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Our private client advisors are at your service for sizing consultation, styling guidance, and bespoke orders.
                </p>
                <div className="space-y-1.5 pt-1 text-neutral-300">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#a7c080]" />
                    <span>+39 02 7600 1234 (Mon – Sat, 9am – 8pm CET)</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#a7c080]" />
                    <a href="mailto:concierge@voyor.com" className="hover:text-[#a7c080] transition-colors">
                      concierge@voyor.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
