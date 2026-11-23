"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useLuxury } from "@/context/luxury-context";
import { Category, CurrencyCode } from "@/lib/types";
import { X, Search, ChevronRight, Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileMenu({ categories = [] }: { categories?: Category[] }) {
  const {
    isMenuOpen,
    setIsMenuOpen,
    setIsCartOpen,
    setIsSearchOpen,
    cartCount,
    currency,
    setCurrency,
  } = useLuxury();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const close = () => setIsMenuOpen(false);

  const currencies: { code: CurrencyCode; label: string; symbol: string; country: string }[] = [
    { code: "IDR", label: "IDR (Rp)", symbol: "Rp", country: "Indonesia" },
    { code: "EUR", label: "EUR (€)", symbol: "€", country: "Italy / Europe" },
    { code: "USD", label: "USD ($)", symbol: "$", country: "United States" },
    { code: "GBP", label: "GBP (£)", symbol: "£", country: "United Kingdom" },
  ];

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="w-screen max-w-sm bg-[#0a0a0a] border-r border-[#222] shadow-2xl flex flex-col text-neutral-100"
            >
              <div className="p-6 border-b border-[#1c1c1c] flex items-center justify-between">
                <Link
                  href="/"
                  onClick={close}
                  className="font-radiant text-2xl tracking-[0.22em] font-bold text-white uppercase hover:text-[#a7c080] transition-colors"
                >
                  VOYOR
                </Link>
                <button
                  onClick={close}
                  className="p-2 text-neutral-400 hover:text-white transition-colors border border-[#2a2a2a] rounded-full hover:border-[#a7c080] cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-4 border-b border-[#1c1c1c]">
                <button
                  onClick={() => {
                    close();
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between bg-[#141414] border border-[#282828] px-4 py-3 text-xs uppercase tracking-wider text-neutral-300 hover:border-[#a7c080] transition-colors cursor-pointer"
                >
                  <span>Search creations</span>
                  <Search className="w-4 h-4 text-[#a7c080]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <nav className="space-y-1">
                  <p className="text-[10px] uppercase tracking-luxury text-[#888] mb-3">
                    Navigation
                  </p>
                  <Link
                    href="/"
                    onClick={close}
                    className="flex items-center justify-between py-2.5 border-b border-[#1c1c1c] text-sm uppercase tracking-wider text-white hover:text-[#a7c080] transition-colors"
                  >
                    <span>Home</span>
                    <ChevronRight className="w-4 h-4 text-[#555]" />
                  </Link>
                  <Link
                    href="/news"
                    onClick={close}
                    className="flex items-center justify-between py-2.5 border-b border-[#1c1c1c] text-sm uppercase tracking-wider text-white hover:text-[#a7c080] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>The Gazette & News</span>
                      <span className="text-[9px] bg-[#a7c080]/10 text-[#a7c080] border border-[#a7c080]/30 px-1.5 py-0.2 uppercase font-medium">New</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#555]" />
                  </Link>
                </nav>

                <nav className="space-y-1">
                  <p className="text-[10px] uppercase tracking-luxury text-[#888] mb-3">
                    Collections
                  </p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={close}
                      className="flex items-center justify-between py-2.5 border-b border-[#1c1c1c] text-sm uppercase tracking-wider text-neutral-200 hover:text-[#a7c080] transition-colors"
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className="w-4 h-4 text-[#555]" />
                    </Link>
                  ))}
                </nav>

                <nav className="space-y-1">
                  <p className="text-[10px] uppercase tracking-luxury text-[#888] mb-3">
                    Client Services
                  </p>
                  <Link
                    href="/book-appointment"
                    onClick={close}
                    className="flex items-center justify-between py-2.5 border-b border-[#1c1c1c] text-sm uppercase tracking-wider text-neutral-200 hover:text-[#a7c080] transition-colors"
                  >
                    <span>Book An Appointment</span>
                    <ChevronRight className="w-4 h-4 text-[#555]" />
                  </Link>
                  <button
                    onClick={() => {
                      close();
                      setIsCartOpen(true);
                    }}
                    className="flex items-center justify-between w-full py-2.5 border-b border-[#1c1c1c] text-sm uppercase tracking-wider text-neutral-200 hover:text-[#a7c080] transition-colors cursor-pointer"
                  >
                    <span>Shopping Bag {cartCount > 0 ? `(${cartCount})` : ""}</span>
                    <ChevronRight className="w-4 h-4 text-[#555]" />
                  </button>
                </nav>

                <div className="space-y-3 pt-2">
                  <p className="text-[10px] uppercase tracking-luxury text-[#888] flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#a7c080]" />
                    <span>Currency & Region</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {currencies.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => setCurrency(item.code)}
                        className={`p-2.5 border text-left transition-colors flex flex-col justify-between rounded cursor-pointer ${
                          currency === item.code
                            ? "border-[#a7c080] bg-[#141414] text-[#a7c080]"
                            : "border-[#222222] bg-[#0f0f0f] text-neutral-400 hover:border-neutral-700 hover:text-white"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="font-semibold text-xs font-serif">{item.label}</span>
                          {currency === item.code && (
                            <Check className="w-3 h-3 text-[#a7c080]" />
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-500 font-sans mt-0.5">{item.country}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#1c1c1c] text-[10px] uppercase tracking-luxury text-[#666]">
                VOYOR Milano — Fall/Winter 2026
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
