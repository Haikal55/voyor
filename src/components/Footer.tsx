"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Globe } from "lucide-react";
import { useLuxury } from "@/context/luxury-context";
import { CurrencyCode } from "@/lib/types";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { currency, setCurrency, setIsCookieModalOpen } = useLuxury();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#050505] text-neutral-400 border-t border-[#1a1a1a] pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-16 border-b border-[#1c1c1c] max-w-xl mx-auto text-center space-y-4">
          <span className="text-sm uppercase tracking-ultra text-[#a7c080]">
            <span className="font-radiant font-bold tracking-[0.2em]">VOYOR</span> Privé Salon
          </span>
          <h3 className="text-2xl sm:text-3xl text-white font-medium">
            Receive Private Runway Invitations
          </h3>
          <p className="text-neutral-400 text-xs font-light">
            Subscribe for priority access to limited atelier drops, private client styling appointments, and Milan fashion week preview digests.
          </p>

          <form onSubmit={handleSubscribe} className="pt-2 flex items-center max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-[#111] border border-[#282828] border-r-0 px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#a7c080] text-xs"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-[#a7c080] hover:bg-[#8da866] text-black font-bold uppercase tracking-wider transition-colors flex items-center justify-center"
              aria-label="Subscribe to newsletter"
            >
              {subscribed ? <Check className="w-4 h-4 text-black" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          {subscribed && (
            <p className="text-[#a7c080] text-[11px] uppercase tracking-wider">
              Grazie. Welcome to the VOYOR Privé Salon.
            </p>
          )}
        </div>

        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white uppercase tracking-luxury font-semibold text-[11px] mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <Link href="/login" className="hover:text-[#a7c080] transition-colors">
                  Sign In / My Account
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="hover:text-[#a7c080] transition-colors">
                  Book Boutique Appointment
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-[#a7c080] transition-colors">
                  White-Glove Delivery
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-[#a7c080] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-[#a7c080] transition-colors">
                  Authenticity Verification
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="hover:text-[#a7c080] transition-colors">
                  Garment Restoration & Care
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-luxury font-semibold text-[11px] mb-4">
              The Collections
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <Link href="/category/runway-couture" className="hover:text-[#a7c080] transition-colors">
                  Runway Fall/Winter 2026
                </Link>
              </li>
              <li>
                <Link href="/category/women" className="hover:text-[#a7c080] transition-colors">
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/category/men" className="hover:text-[#a7c080] transition-colors">
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/category/leather-goods" className="hover:text-[#a7c080] transition-colors">
                  Leather Goods & Bags
                </Link>
              </li>
              <li>
                <Link href="/category/shoes" className="hover:text-[#a7c080] transition-colors">
                  Shoes, Socks & Footwear
                </Link>
              </li>
              <li>
                <Link href="/category/jewelry" className="hover:text-[#a7c080] transition-colors">
                  Fashion Jewelry & Jewels
                </Link>
              </li>
              <li>
                <Link href="/category/haute-parfumerie" className="hover:text-[#a7c080] transition-colors">
                  Haute Parfumerie
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-luxury font-semibold text-[11px] mb-4">
              The Maison
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <Link href="/#section-legacy" className="hover:text-[#a7c080] transition-colors">
                  Atelier Heritage
                </Link>
              </li>
              <li>
                <Link href="/#section-legacy" className="hover:text-[#a7c080] transition-colors">
                  Sustainability & Silk Origins
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="hover:text-[#a7c080] transition-colors">
                  Global Flagship Stores
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#a7c080] transition-colors">
                  The Gazette & Runway News
                </Link>
              </li>
              <li>
                <Link href="/category/runway-couture" className="hover:text-[#a7c080] transition-colors">
                  Press & Editorial
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase tracking-luxury font-semibold text-[11px] mb-4">
              Flagship Boutiques
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">
              Via Montenapoleone 8, 20121 Milano, Italy <br />
              Avenue Montaigne 24, 75008 Paris, France <br />
              Madison Avenue 650, New York, NY
            </p>
            <span className="text-[#a7c080] text-[10px] uppercase tracking-wider block font-medium">
              Private Client Concierge: concierge@voyor.com
            </span>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1c1c1c] flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-luxury text-neutral-500 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div>
              © 2026 <span className="font-radiant font-bold tracking-[0.15em] text-neutral-300">VOYOR</span> S.P.A. MILANO • ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center space-x-2 pl-0 sm:pl-3 sm:border-l border-[#222]">
              <Globe className="w-3.5 h-3.5 text-[#a7c080]" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-[#111111] border border-[#2a2a2a] text-neutral-300 text-[10px] px-2 py-1 rounded outline-none focus:border-[#a7c080] cursor-pointer"
                aria-label="Select currency and region"
              >
                <option value="IDR">Indonesia — IDR (Rp)</option>
                <option value="EUR">Italy / Europe — EUR (€)</option>
                <option value="USD">United States — USD ($)</option>
                <option value="GBP">United Kingdom — GBP (£)</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Legal Terms</Link>
            <button
              type="button"
              onClick={() => setIsCookieModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
