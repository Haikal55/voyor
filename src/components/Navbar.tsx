"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLuxury } from "@/context/luxury-context";
import {
  Search,
  ShoppingBag,
  X,
  Heart,
  ChevronRight,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES } from "@/lib/types";

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
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background body scroll when mobile drawer is open
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
    { name: "Runway FW26", href: "/category/runway-couture", highlight: true, badge: "COUTURE" },
    { name: "Women", href: "/category/women" },
    { name: "Men", href: "/category/men" },
    { name: "Accessories", href: "/category/accessories" },
    { name: "Haute Parfumerie", href: "/category/haute-parfumerie" },
  ];

  return (
    <>
      {/* 
        NEW REDESIGNED LUXURY HEADER:
        - 100% Invariant, non-collapsing height (h-16 on mobile, h-20 on desktop)
        - Dead-center brandmark using absolute positioning to avoid any layout shifting
        - Clean, modern editorial styling inspired by Italian luxury fashion houses
      */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#070707]/95 backdrop-blur-xl border-b border-[#222] shadow-[0_8px_30px_rgb(0,0,0,0.85)]"
            : "bg-[#080808]/75 backdrop-blur-md border-b border-white/[0.07]"
        }`}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* LEFT: Menu button & Desktop quick navigation */}
          <div className="flex items-center space-x-3 sm:space-x-6 z-10">
            {/* Minimalist 2-line Luxury Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="group flex items-center space-x-2.5 py-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <div className="w-5 flex flex-col space-y-1.5 items-start justify-center">
                <span className="w-5 h-[1.5px] bg-neutral-200 group-hover:bg-[#a7c080] transition-colors rounded-full" />
                <span className="w-3.5 h-[1.5px] bg-neutral-200 group-hover:bg-[#a7c080] group-hover:w-5 transition-all duration-300 rounded-full" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-300 group-hover:text-white hidden xs:inline">
                Menu
              </span>
            </button>

            {/* Desktop Editorial Category Links */}
            <nav className="hidden lg:flex items-center space-x-6 ml-2 text-[11px] uppercase tracking-[0.18em] font-medium">
              <Link
                href="/category/runway-couture"
                className="text-[#a7c080] hover:text-[#d3c6aa] transition-colors flex items-center space-x-1.5 font-semibold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7c080] inline-block animate-pulse" />
                <span>Runway FW26</span>
              </Link>
              <Link
                href="/category/women"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                Women
              </Link>
              <Link
                href="/category/men"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                Men
              </Link>
              <Link
                href="/category/accessories"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                Accessories
              </Link>
            </nav>
          </div>

          {/* CENTER: Dead-Center Brandmark (Mathematically centered, zero clipping, zero shift) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-auto text-center">
            <Link
              href="/"
              className="inline-flex flex-col items-center justify-center group select-none py-1"
            >
              <span className="text-xl sm:text-2xl md:text-[28px] font-serif tracking-[0.26em] font-normal text-white uppercase group-hover:text-[#a7c080] transition-colors duration-300 leading-none">
                VOYOR
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.35em] text-[#a7c080] font-medium mt-1 leading-none">
                MILANO
              </span>
            </Link>
          </div>

          {/* RIGHT: Currency, Search, Wishlist, Bag */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-5 z-10">
            {/* Currency / Destination Pill (Desktop) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full border border-white/10 hover:border-[#a7c080]/50 bg-white/[0.03] text-[10px] tracking-wider uppercase text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Change shipping destination & currency"
            >
              <span>{country.flag}</span>
              <span className="font-semibold text-neutral-200">{country.currency}</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-neutral-300 hover:text-[#a7c080] transition-colors cursor-pointer"
              aria-label="Search collections"
              title="Search"
            >
              <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Wishlist Trigger (Tablet/Desktop) */}
            <button
              onClick={() => alert("Wishlist: Sign in to your VIP account to save private selections.")}
              className="hidden sm:block p-2 text-neutral-300 hover:text-[#a7c080] transition-colors cursor-pointer"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-100 hover:text-[#a7c080] transition-colors flex items-center space-x-1.5 group cursor-pointer"
              aria-label="Shopping bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-[#a7c080] transition-transform group-hover:scale-105" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-0.5 sm:right-0.5 bg-[#a7c080] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.16em] font-medium text-neutral-300 group-hover:text-[#a7c080]">
                Bag {cartCount > 0 ? `(${cartCount})` : ""}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* FULL LUXURY EDITORIAL SLIDE-IN DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="absolute inset-y-0 left-0 w-full max-w-md bg-[#0a0a0a] border-r border-[#1f1f1f] shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between">
                <div>
                  <span className="text-2xl font-serif tracking-[0.24em] text-white uppercase block leading-none font-normal">
                    VOYOR
                  </span>
                  <span className="text-[8.5px] uppercase tracking-[0.32em] text-[#a7c080] block mt-1">
                    Atelier Milano
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white transition-colors border border-white/10 rounded-full hover:border-[#a7c080]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Search Bar inside Drawer */}
                <div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-[#121212] border border-[#222] hover:border-[#a7c080]/50 rounded text-neutral-400 hover:text-white transition-colors text-xs uppercase tracking-wider"
                  >
                    <Search className="w-4 h-4 text-[#a7c080]" />
                    <span>Search Collections, Bags, Silk...</span>
                  </button>
                </div>

                {/* Primary Category Links */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 block font-medium">
                    Maison Collections
                  </span>
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * idx, duration: 0.25 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-2.5 text-base tracking-[0.15em] uppercase transition-colors group ${
                          link.highlight
                            ? "text-[#a7c080] font-semibold"
                            : "text-neutral-200 hover:text-white"
                        }`}
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                        {link.badge ? (
                          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-[#a7c080]/40 text-[#a7c080] bg-[#a7c080]/10">
                            {link.badge}
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Shipping Destination & Currency Selector */}
                <div className="pt-6 border-t border-[#1a1a1a] space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-medium">
                    <Globe className="w-3.5 h-3.5 text-[#a7c080]" />
                    <span>Shipping Country & Currency</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(COUNTRIES).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCountry(c)}
                        className={`py-2 px-3 text-xs uppercase tracking-wider border text-left transition-all rounded ${
                          country.code === c.code
                            ? "bg-[#a7c080] text-black border-[#a7c080] font-bold shadow-md shadow-[#a7c080]/20"
                            : "bg-[#141414] text-neutral-300 border-[#222] hover:border-neutral-500"
                        }`}
                      >
                        <span className="mr-1">{c.flag}</span> {c.name.split("/")[0]} ({c.currency})
                      </button>
                    ))}
                  </div>
                </div>

                {/* VIP Services */}
                <div className="pt-6 border-t border-[#1a1a1a] space-y-2.5">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 block font-medium">
                    Private Client Services
                  </span>
                  <div className="space-y-2 text-xs text-neutral-400">
                    <p className="hover:text-white cursor-pointer transition-colors">
                      • VIP Client Concierge & Personal Stylist
                    </p>
                    <p className="hover:text-white cursor-pointer transition-colors">
                      • Book Private Salon Appointment (Milano)
                    </p>
                    <p className="hover:text-white cursor-pointer transition-colors">
                      • Complimentary White-Glove Worldwide Delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-[#1a1a1a] bg-[#070707] text-center">
                <span className="text-[9.5px] uppercase tracking-[0.25em] text-neutral-500 block">
                  VOYOR Official Online Boutique • Via Montenapoleone 8, Milano
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
