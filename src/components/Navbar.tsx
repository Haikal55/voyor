"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLuxury } from "@/context/luxury-context";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Heart,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CURRENCIES, COUNTRIES } from "@/lib/types";

export function Navbar() {
  const {
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    country,
    setCountry,
  } = useLuxury();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Runway FW26", href: "/category/runway-couture", highlight: true },
    { name: "Women", href: "/category/women" },
    { name: "Men", href: "/category/men" },
    { name: "Accessories", href: "/category/accessories" },
    { name: "Haute Parfumerie", href: "/category/haute-parfumerie" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ease-in-out pt-[env(safe-area-inset-top,0px)] ${
          isScrolled
            ? "bg-[#080808]/98 backdrop-blur-md border-b border-[#222] shadow-2xl shadow-black/80"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Top Region & Currency Strip (Automatically Detected by Country, No Globe Icon) */}
        <div
          className={`transition-all duration-300 overflow-hidden text-[10px] sm:text-[11px] uppercase tracking-luxury px-4 sm:px-8 ${
            isScrolled
              ? "max-h-0 opacity-0 pointer-events-none py-0"
              : "max-h-12 opacity-100 py-2 bg-black/60 backdrop-blur-sm border-b border-white/5 text-[#b8b8b8]"
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Automatic Country & Currency Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-neutral-400 hidden xs:inline">Shipping To:</span>
              <div className="relative inline-flex items-center">
                <select
                  aria-label="Shipping destination and currency"
                  value={country.code}
                  onChange={(e) => {
                    const selected = COUNTRIES[e.target.value];
                    if (selected) setCountry(selected);
                  }}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer tracking-wider text-[10px] sm:text-[11px] appearance-none pr-3 hover:text-[#a7c080] transition-colors"
                >
                  {Object.values(COUNTRIES).map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#121212] text-white">
                      {c.flag} {c.name.toUpperCase()} • {c.currency} ({CURRENCIES[c.currency].symbol})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-2.5 h-2.5 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Right: Clean Luxury Concierge Indicator */}
            <div className="hidden sm:flex items-center space-x-3 text-[10px] text-neutral-400">
              <span>Client Concierge</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-300">Milano</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-300">Paris</span>
              <span className="text-neutral-600">•</span>
              <span className="text-[#a7c080]">Boutiques</span>
            </div>
          </div>
        </div>

        {/* Primary Luxury Navigation Bar (Consistent, Stable Luxury Dimensions) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 grid grid-cols-3 items-center">
            {/* Left Column: Menu Button & Search */}
            <div className="flex items-center space-x-3 sm:space-x-5 justify-start">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="group flex items-center space-x-2 py-2 text-neutral-200 hover:text-[#a7c080] transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="text-[11px] sm:text-xs uppercase tracking-ultra font-medium text-neutral-300 group-hover:text-white">
                  Menu
                </span>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 text-neutral-300 hover:text-[#a7c080] transition-colors py-2 cursor-pointer"
                aria-label="Search collections"
              >
                <Search className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 hover:text-white hidden md:inline">
                  Search
                </span>
              </button>
            </div>

            {/* Center Column: Iconic VOYOR Brandmark (Centered, Never Cut Off or Overlapping) */}
            <div className="flex justify-center text-center">
              <Link href="/" className="inline-flex flex-col items-center justify-center group py-1">
                <span className="text-xl sm:text-2xl md:text-3xl tracking-[0.22em] font-medium text-white block uppercase group-hover:text-[#a7c080] transition-colors leading-none">
                  VOYOR
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.25em] text-[#a7c080] uppercase block font-medium mt-1">
                  Atelier Milano
                </span>
              </Link>
            </div>

            {/* Right Column: Mobile Search, Wishlist & Shopping Bag */}
            <div className="flex items-center justify-end space-x-3 sm:space-x-5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-1.5 text-neutral-200 hover:text-[#a7c080] transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => alert("Wishlist: Sign in to your VIP account to save private selections.")}
                className="hidden sm:block p-1.5 text-neutral-300 hover:text-[#a7c080] transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Shopping Bag Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-neutral-100 hover:text-[#a7c080] transition-colors flex items-center space-x-1.5 group"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5 text-[#a7c080] transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#a7c080] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-luxury font-semibold text-[#a7c080]">
                  Bag {cartCount > 0 ? `(${cartCount})` : ""}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Luxury Animated Slide-In Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="absolute inset-y-0 left-0 w-full max-w-md bg-[#0a0a0a] border-r border-[#222] shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#1c1c1c] flex items-center justify-between">
                <div>
                  <span className="text-2xl tracking-ultra text-white uppercase block font-medium">
                    VOYOR
                  </span>
                  <span className="text-[9px] uppercase tracking-luxury text-[#a7c080]">
                    Haute Couture Milano
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white transition-colors border border-[#2a2a2a] rounded-full hover:border-[#a7c080]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-ultra text-[#888] block">
                    Collections & Runway
                  </span>
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-2 text-xl uppercase tracking-wider group transition-colors ${
                          link.highlight
                            ? "text-[#a7c080] hover:text-[#d3c6aa]"
                            : "text-neutral-200 hover:text-[#a7c080]"
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronRight className="w-4 h-4 text-[#555] group-hover:text-[#a7c080] transform group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Country & Currency Selector in Drawer */}
                <div className="pt-6 border-t border-[#1c1c1c] space-y-2">
                  <span className="text-[10px] uppercase tracking-ultra text-[#888] block">
                    Shipping Country & Currency
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(COUNTRIES).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCountry(c)}
                        className={`py-2 px-3 text-xs uppercase tracking-wider border text-left transition-all ${
                          country.code === c.code
                            ? "bg-[#a7c080] text-black border-[#a7c080] font-bold"
                            : "bg-[#141414] text-neutral-300 border-[#262626] hover:border-neutral-500"
                        }`}
                      >
                        <span className="mr-1">{c.flag}</span> {c.name.split("/")[0]} ({c.currency})
                      </button>
                    ))}
                  </div>
                </div>

                {/* VIP Services Links */}
                <div className="pt-6 border-t border-[#1c1c1c] space-y-3 text-xs text-neutral-400">
                  <span className="text-[10px] uppercase tracking-ultra text-[#888] block">
                    Client Services
                  </span>
                  <div className="space-y-2">
                    <p className="hover:text-white cursor-pointer transition-colors">
                      Book Private Boutique Appointment
                    </p>
                    <p className="hover:text-white cursor-pointer transition-colors">
                      Complimentary White-Glove Courier
                    </p>
                    <p className="hover:text-white cursor-pointer transition-colors">
                      Garment Authenticity Certificate
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-[#1c1c1c] bg-[#070707] text-[10px] uppercase tracking-luxury text-[#777] space-y-1">
                <p className="text-[#a7c080] font-medium">Via Montenapoleone 8, Milano</p>
                <p>Private Concierge: VIP@VOYOR.COM</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
