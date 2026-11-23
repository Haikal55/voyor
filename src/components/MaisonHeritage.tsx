import React from "react";
import Image from "next/image";
import Link from "next/link";

export function MaisonHeritage() {
  return (
    <section id="section-legacy" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-b border-[#1c1c1c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] w-full bg-[#141414] overflow-hidden group">
            <Image
              src="/images/maison-heritage-versace.jpg"
              alt="VOYOR Sartorial Atelier Craftsmanship in Milan"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top opacity-95"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 border-l-2 border-[#a7c080] pl-4">
              <span className="text-[10px] uppercase tracking-ultra text-[#a7c080] block font-semibold">
                Sartoria Milanese
              </span>
              <p className="text-xs text-neutral-200 mt-1 font-light leading-relaxed">
                Sculptural double-wool tailoring, fluid silk-satin lapels, and fearless architectural silhouettes crafted in the heart of Milan.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl text-white font-medium tracking-[0.04em] uppercase leading-snug">
              Sartorial Mastery, <br />
              <span className="text-[#a7c080]">Unapologetic Power</span>
            </h2>

            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              Embodying the uncompromising spirit of modern Italian tailoring, VOYOR redefines luxury power dressing with sculpted wool-cashmere silhouettes, fluid pure silk separates, and Milanese sartorial heritage. Each creation balances classical precision with high-octane runway energy.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#1c1c1c]">
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
                  Milano
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                  Haute Sartoria
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-[#a7c080] block">
                  FW26
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                  Runway Edition
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/category/men"
                className="inline-block px-8 py-3.5 bg-[#a7c080] text-black hover:bg-[#8da866] text-xs uppercase tracking-luxury font-bold transition-all shadow-lg shadow-[#a7c080]/10"
              >
                Explore Men&apos;s Collection
              </Link>
              <Link
                href="/category/runway-couture"
                className="inline-block px-8 py-3.5 bg-transparent border border-[#a7c080]/60 text-[#a7c080] hover:border-[#a7c080] hover:text-white text-xs uppercase tracking-luxury font-bold transition-all"
              >
                Discover The Runway
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
