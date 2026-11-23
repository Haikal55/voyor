"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLuxury } from "@/context/luxury-context";
import { formatPrice } from "@/lib/types";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    cart,
    currency,
    updateQuantity,
    removeItem,
    cartTotalUSD,
    isLoadingCart,
  } = useLuxury();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] overflow-hidden" onWheel={(e) => e.stopPropagation()}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-md touch-none"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="w-screen max-w-md bg-[#0a0a0a] border-l border-[#1f1f1f] shadow-2xl flex flex-col text-neutral-100"
            >
              <div className="bg-[#111111] px-6 py-5 flex items-center justify-between border-b border-[#1c1c1c]">
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
                  Shopping Bag ({cart.length})
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-[#a7c080] transition-colors rounded-full hover:bg-white/[0.05]"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <p className="font-serif text-base text-neutral-400">
                      Your shopping bag is currently empty.
                    </p>
                    <Link
                      href="/category/runway-couture"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-block px-6 py-3 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold tracking-[0.2em] uppercase transition-colors"
                    >
                      Discover Runway FW26
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-6 border-b border-[#1c1c1c] last:border-b-0 last:pb-0"
                    >
                      <div className="relative w-20 h-24 bg-[#141414] border border-[#222222] flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={() => setIsCartOpen(false)}
                              className="font-serif text-[15px] text-white leading-snug line-clamp-2 hover:text-[#a7c080] transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={isLoadingCart}
                              className="text-neutral-500 hover:text-rose-400 transition-colors flex-shrink-0 p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4 stroke-[1.5]" />
                            </button>
                          </div>

                          <p className="font-serif text-xs text-neutral-400 mt-2">
                            Color: {item.variant.colorName}
                            {item.variant.size && item.variant.size !== "Standard" && (
                              <span className="ml-2 text-neutral-300">• Size: {item.variant.size}</span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2">
                          <div className="flex items-center border border-[#2a2a2a] bg-[#141414]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isLoadingCart}
                              className="px-2 py-1 text-neutral-400 hover:text-white disabled:opacity-30"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 stroke-[1.5]" />
                            </button>
                            <span className="px-2 font-serif text-xs font-medium text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoadingCart}
                              className="px-2 py-1 text-neutral-400 hover:text-white disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 stroke-[1.5]" />
                            </button>
                          </div>

                          <span className="font-serif text-sm font-semibold text-[#a7c080]">
                            {formatPrice(
                              (item.product.basePrice + item.variant.priceDelta) * item.quantity,
                              currency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-[#0e0e0e] border-t border-[#1c1c1c] space-y-4">
                  <div className="flex justify-between items-center text-sm font-serif">
                    <span className="text-neutral-400">Subtotal:</span>
                    <span className="text-[#a7c080] font-semibold text-base">
                      {formatPrice(cartTotalUSD, currency)}
                    </span>
                  </div>

                  <div className="border-t border-[#1c1c1c] pt-4 space-y-4">
                    <p className="font-serif text-[11px] leading-relaxed text-neutral-400">
                      By proceeding, you confirm you have read and accepted the{" "}
                      <Link
                        href="/terms-and-conditions"
                        onClick={() => setIsCartOpen(false)}
                        className="text-[#a7c080] underline hover:text-[#8da866]"
                      >
                        Terms and Conditions
                      </Link>
                    </p>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full py-4 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors shadow-lg shadow-[#a7c080]/10"
                    >
                      CHECKOUT
                    </button>

                    <Link
                      href="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="block text-center text-xs uppercase tracking-[0.2em] font-semibold text-white hover:text-[#a7c080] underline pt-1 pb-1 transition-colors"
                    >
                      VIEW SHOPPING BAG
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
