import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function MaisonHeritage() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase */}
          <div className="relative aspect-[4/5] w-full bg-[#141414] border border-[#222] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop"
              alt="VOYOR Atelier Craftsmanship in Florence"
              fill
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/80 backdrop-blur-md border border-[#a7c080]/30">
              <span className="text-[10px] uppercase tracking-ultra text-[#a7c080] block font-semibold">
                Atelier di Firenze
              </span>
              <p className="text-xs text-white mt-1">
                Every Sovereign leather bag undergoes 48 hours of artisanal hand-burnishing and 24K gold hardware precision mounting.
              </p>
            </div>
          </div>

          {/* Editorial Story */}
          <div className="space-y-6">
            <span className="text-[#a7c080] text-[11px] uppercase tracking-luxury block font-medium">
              The VOYOR Legacy
            </span>

            <h2 className="text-3xl sm:text-4xl text-white font-medium tracking-[0.04em] uppercase leading-snug">
              Artisanal Devotion, <br />
              <span className="font-script text-[#a7c080] text-4xl sm:text-5xl font-normal tracking-normal">
                Unapologetic Power
              </span>
            </h2>

            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              Founded on the belief that true luxury is visceral, VOYOR merges classical Greco-Roman symmetry with high-octane modern Italian couture. From mulberry silk farms in Lake Como to master leather guilders in Tuscany, our artisans preserve heritage methods without compromise.
            </p>

            {/* Pillar Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#222]">
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-[#a7c080] block">
                  100%
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                  Made in Italy
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-[#a7c080] block">
                  24K
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                  Gold Hardware
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-[#a7c080] block">
                  Couture
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                  Limited Editions
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/category/runway-couture"
                className="inline-block px-8 py-3.5 bg-transparent border border-[#a7c080] text-[#a7c080] hover:bg-[#a7c080] hover:text-black text-xs uppercase tracking-luxury font-bold transition-all"
              >
                Discover The Maison
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
