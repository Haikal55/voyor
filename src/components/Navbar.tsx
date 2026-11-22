"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-colors duration-300 ${
        isScrolled
          ? "bg-[#080808]/95 backdrop-blur-md border-b border-[#222] shadow-2xl shadow-black/80"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center group py-2 select-none"
          aria-label="VOYOR Home"
        >
          <span className="text-2xl sm:text-3xl tracking-[0.28em] font-medium text-white uppercase group-hover:text-[#a7c080] transition-colors leading-none">
            VOYOR
          </span>
        </Link>
      </div>
    </header>
  );
}
