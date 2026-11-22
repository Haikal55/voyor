"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative w-full min-h-[90vh] sm:min-h-[95vh] flex items-center justify-center overflow-hidden bg-black pt-28 sm:pt-36 pb-24 px-4 sm:px-6">
      {/* Background Hero Image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2200&auto=format&fit=crop"
          alt="VOYOR Fall/Winter 2026 Runway Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-60"
        />
        {/* Multilayered Editorial Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/90" />
      </div>

      {/* Floating Center Editorial Title */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <h1 className="font-script text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-white font-normal tracking-wide leading-[1.1] drop-shadow-2xl select-none">
          Fearless <span className="text-[#a7c080]">Opulence</span>
        </h1>

        <p className="max-w-xl mx-auto text-xs sm:text-sm text-neutral-300 font-light tracking-wide leading-relaxed px-2">
          The new chapter of the VOYOR Maison. Sculpted tailoring, liquid mulberry silks, and iconic 24-karat gold Barocco hardware.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
          <Link
            href="/category/runway-couture"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs uppercase tracking-luxury font-semibold transition-all shadow-lg text-center"
          >
            Explore The Runway
          </Link>
          <Link
            href="/category/women"
            className="w-full sm:w-auto px-8 py-3.5 bg-black/70 hover:bg-black/90 border border-white/20 hover:border-[#a7c080] text-white text-xs uppercase tracking-luxury font-normal transition-all text-center backdrop-blur-sm"
          >
            Discover Women
          </Link>
          <Link
            href="/category/men"
            className="w-full sm:w-auto px-8 py-3.5 bg-black/70 hover:bg-black/90 border border-white/20 hover:border-[#a7c080] text-white text-xs uppercase tracking-luxury font-normal transition-all text-center backdrop-blur-sm"
          >
            Discover Men
          </Link>
        </div>
      </div>

      {/* Scroll Down Prompt */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 text-neutral-400 text-[10px] uppercase tracking-luxury animate-bounce pointer-events-none">
        <span>Scroll Down</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#a7c080]" />
      </div>
    </section>
  );
}
