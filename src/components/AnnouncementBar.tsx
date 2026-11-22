"use client";

import React from "react";
import { useLuxury } from "@/context/luxury-context";
import { CURRENCIES, COUNTRIES } from "@/lib/types";
import { Globe, ChevronDown } from "lucide-react";

export function AnnouncementBar() {
  const { country, setCountry } = useLuxury();

  return (
    <div className="bg-[#050505] text-[#b3b3b3] border-b border-[#1c1c1c] text-[10px] sm:text-[11px] uppercase tracking-luxury py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Globe className="w-3.5 h-3.5 text-[#a7c080] flex-shrink-0" />
          <span className="text-neutral-400">Shipping To:</span>
          <div className="relative inline-flex items-center">
            <select
              aria-label="Country and Currency"
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
  );
}
