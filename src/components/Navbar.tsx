"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLuxury } from "@/context/luxury-context";
import { Menu, ShoppingBag } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    setIsMenuOpen,
    setIsCartOpen,
    cartCount,
  } = useLuxury();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 ease-out pt-[env(safe-area-inset-top,0px)] ${
        isScrolled
          ? "bg-[#080808]/95 backdrop-blur-md border-b border-[#1c1c1c] shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent backdrop-blur-none border-b-0 border-transparent shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 grid grid-cols-3 items-center">
          <div className="flex items-center justify-start">
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open navigation menu"
              className="group flex items-center space-x-2 py-2 -ml-2 sm:ml-0 text-neutral-200 hover:text-[#a7c080] transition-colors cursor-pointer select-none"
            >
              <Menu className="w-5 h-5 stroke-[1.5] transition-transform group-hover:scale-105" />
              <span className="text-[11px] sm:text-xs uppercase tracking-ultra font-medium text-neutral-300 group-hover:text-white">
                Menu
              </span>
            </button>
          </div>

          <div className="flex justify-center text-center">
            <Link
              href="/"
              prefetch={true}
              className="inline-flex flex-col items-center justify-center group py-1 select-none"
              aria-label="VOYOR Home"
            >
              <span className="font-radiant text-2xl sm:text-3xl md:text-4xl tracking-[0.22em] font-bold text-white uppercase group-hover:text-[#a7c080] transition-colors leading-none">
                VOYOR
              </span>
              <span className="text-[8px] sm:text-[9.5px] tracking-[0.28em] text-[#a7c080] uppercase block font-medium mt-1 leading-none">
                Atelier Milano
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open shopping bag"
              className="relative p-2 -mr-2 sm:mr-0 text-white hover:text-[#a7c080] transition-colors flex items-center group cursor-pointer select-none"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5] text-white group-hover:text-[#a7c080] transition-all group-hover:scale-105" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-0.5 sm:right-0.5 bg-[#a7c080] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
