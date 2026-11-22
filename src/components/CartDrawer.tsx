"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLuxury } from "@/context/luxury-context";
import { formatPrice } from "@/lib/types";
import { X, Plus, Minus, Trash2, ArrowRight, Gift, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { checkoutOrderAction } from "@/app/actions/cart";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    currency,
    updateQuantity,
    removeItem,
    cartTotalUSD,
    isLoadingCart,
    refreshCart,
  } = useLuxury();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{
    orderNumber: string;
    totalAmount: number;
    currency: string;
    customerName: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "Contessa D'Amico",
    email: "vip.client@voyor.com",
    address: "Via Condotti 12, Roma, 00187, Italy",
  });

  const freeShippingThreshold = 500;
  const progressPercent = Math.min(100, Math.round((cartTotalUSD / freeShippingThreshold) * 100));

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await checkoutOrderAction({
        customerName: formData.name,
        customerEmail: formData.email,
        shippingAddress: formData.address,
        currency,
      });
      setOrderComplete(res);
      await refreshCart();
    } catch (err) {
      console.error(err);
      alert("Checkout simulation encountered an error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckingOut(false);
              setOrderComplete(null);
            }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="w-screen max-w-md bg-[#0a0a0a] border-l border-[#222] shadow-2xl flex flex-col text-neutral-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#1c1c1c] flex items-center justify-between">
                <div>
                  <h2 className="text-xl tracking-luxury text-[#a7c080] uppercase">
                    {orderComplete ? "Atelier Order Confirmed" : "Your Shopping Bag"}
                  </h2>
                  <span className="text-[10px] uppercase tracking-widest text-[#888]">
                    {cart.length} {cart.length === 1 ? "Creation" : "Creations"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckingOut(false);
                    setOrderComplete(null);
                  }}
                  className="p-2 text-neutral-400 hover:text-white transition-colors border border-[#2a2a2a] rounded-full hover:border-[#a7c080]"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Complimentary Delivery Progress */}
              {!orderComplete && (
                <div className="bg-[#121212] px-6 py-3 border-b border-[#1c1c1c] text-[11px] text-neutral-300">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="truncate pr-2">
                      {progressPercent >= 100
                        ? "✨ Unlocked Complimentary VIP Courier"
                        : `Add ${formatPrice(freeShippingThreshold - cartTotalUSD, currency)} for Free VIP Courier`}
                    </span>
                    <span className="text-[#a7c080] font-semibold flex-shrink-0">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#a7c080] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {orderComplete ? (
                  /* Order Success View */
                  <div className="py-8 text-center space-y-5 animate-fadeIn">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#a7c080]/10 border border-[#a7c080] flex items-center justify-center text-[#a7c080]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl text-white tracking-wider">
                        Grazie, {orderComplete.customerName}
                      </h3>
                      <p className="text-xs text-[#a7c080] uppercase tracking-widest mt-1">
                        Order Reference: {orderComplete.orderNumber}
                      </p>
                    </div>
                    <div className="bg-[#141414] border border-[#262626] p-4 rounded text-left text-xs space-y-2 text-neutral-300">
                      <div className="flex justify-between border-b border-[#222] pb-2">
                        <span className="text-[#888]">Status</span>
                        <span className="text-emerald-400 uppercase font-medium">Bespoke Preparation</span>
                      </div>
                      <div className="flex justify-between border-b border-[#222] pb-2">
                        <span className="text-[#888]">Total Settled</span>
                        <span className="text-white font-medium">
                          {formatPrice(orderComplete.totalAmount, currency)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#888] pt-1 leading-relaxed">
                        Your concierge dispatch confirmation and provenance certificate have been generated.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setOrderComplete(null);
                        setIsCartOpen(false);
                      }}
                      className="w-full py-3.5 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs uppercase tracking-luxury font-bold transition-all"
                    >
                      Continue Exploring Collections
                    </button>
                  </div>
                ) : isCheckingOut ? (
                  /* Instant Checkout Form */
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="pb-2 border-b border-[#222]">
                      <h3 className="text-xs uppercase tracking-widest text-[#a7c080]">
                        VIP Client Dispatch Details
                      </h3>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-neutral-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#141414] border border-[#282828] px-3 py-2 text-white focus:outline-none focus:border-[#a7c080]"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">VIP Email (Order Tracking)</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#141414] border border-[#282828] px-3 py-2 text-white focus:outline-none focus:border-[#a7c080]"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Destination Address</label>
                        <textarea
                          required
                          rows={2}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full bg-[#141414] border border-[#282828] px-3 py-2 text-white focus:outline-none focus:border-[#a7c080]"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#222] space-y-2">
                      <div className="flex justify-between text-xs text-neutral-400">
                        <span>Payment Method</span>
                        <span className="text-[#a7c080]">VIP Direct Invoice / Black Card</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold text-white">
                        <span>Final Amount:</span>
                        <span className="text-[#a7c080]">{formatPrice(cartTotalUSD, currency)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCheckingOut(false)}
                        className="w-1/3 py-3 border border-[#333] text-xs uppercase tracking-wider text-neutral-300 hover:text-white"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-2/3 py-3 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs uppercase tracking-luxury font-bold transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? "Authorizing..." : "Confirm & Reserve"}
                      </button>
                    </div>
                  </form>
                ) : cart.length === 0 ? (
                  /* Empty Bag */
                  <div className="text-center py-16 space-y-4">
                    <div className="w-12 h-12 mx-auto text-[#444] border border-[#333] rounded-full flex items-center justify-center">
                      <Gift className="w-5 h-5 text-[#888]" />
                    </div>
                    <p className="text-neutral-400 text-xs tracking-wider uppercase">
                      Your VOYOR shopping bag is empty.
                    </p>
                    <Link
                      href="/category/runway-couture"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-block px-6 py-2.5 bg-[#161616] border border-[#a7c080]/40 text-[#a7c080] hover:bg-[#a7c080] hover:text-black transition-colors text-[11px] uppercase tracking-luxury font-medium"
                    >
                      Discover Runway FW26
                    </Link>
                  </div>
                ) : (
                  /* Items List */
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex space-x-4 pb-6 border-b border-[#1c1c1c] text-xs relative group"
                    >
                      <div className="relative w-20 h-24 bg-[#141414] overflow-hidden flex-shrink-0 border border-[#222]">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <Link
                              href={`/product/${item.product.slug}`}
                              onClick={() => setIsCartOpen(false)}
                              className="font-medium text-white hover:text-[#a7c080] transition-colors leading-snug line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={isLoadingCart}
                              className="text-[#666] hover:text-rose-400 flex-shrink-0"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-[10px] text-[#888] mt-0.5 truncate">
                            {item.variant.size} • {item.variant.colorName}
                          </p>

                          <p className="text-[#a7c080] font-semibold mt-1">
                            {formatPrice(item.product.basePrice + item.variant.priceDelta, currency)}
                          </p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center border border-[#2a2a2a] bg-[#141414]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isLoadingCart}
                              className="px-2 py-1 text-neutral-400 hover:text-white disabled:opacity-30"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-[11px] font-medium text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoadingCart}
                              className="px-2 py-1 text-neutral-400 hover:text-white disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              {!orderComplete && cart.length > 0 && !isCheckingOut && (
                <div className="p-6 border-t border-[#1c1c1c] bg-[#0c0c0c] space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span className="text-white font-medium">
                        {formatPrice(cartTotalUSD, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>VIP White-Glove Delivery</span>
                      <span className="text-[#a7c080] uppercase">
                        {cartTotalUSD >= freeShippingThreshold ? "Complimentary" : formatPrice(45, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-[#222]">
                      <span className="text-white">Estimated Total</span>
                      <span className="text-[#a7c080]">
                        {formatPrice(
                          cartTotalUSD >= freeShippingThreshold ? cartTotalUSD : cartTotalUSD + 45,
                          currency
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] text-[#888]">
                    <Gift className="w-3.5 h-3.5 text-[#a7c080] flex-shrink-0" />
                    <span className="truncate">Includes signature gilded gift box & certificate</span>
                  </div>

                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-4 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-luxury flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#a7c080]/10"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
