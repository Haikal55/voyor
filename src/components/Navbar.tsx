"use client";

import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#080808] border-b border-[#1c1c1c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center group py-1 select-none"
          aria-label="VOYOR Home"
        >
          <span className="text-xl sm:text-2xl md:text-3xl tracking-[0.28em] font-medium text-white uppercase group-hover:text-[#a7c080] transition-colors leading-none">
            VOYOR
          </span>
        </Link>
      </div>
    </header>
  );
}
