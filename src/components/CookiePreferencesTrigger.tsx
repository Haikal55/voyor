"use client";

import React from "react";
import { useLuxury } from "@/context/luxury-context";
import { Cookie } from "lucide-react";

export function CookiePreferencesTrigger({ className = "" }: { className?: string }) {
  const { setIsCookieModalOpen } = useLuxury();

  return (
    <button
      type="button"
      onClick={() => setIsCookieModalOpen(true)}
      className={`inline-flex items-center space-x-2 px-4 py-2.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#a7c080] text-xs font-semibold uppercase tracking-wider text-white transition-colors cursor-pointer rounded ${className}`}
    >
      <Cookie className="w-4 h-4 text-[#a7c080]" />
      <span>Manage Cookie Preferences</span>
    </button>
  );
}
