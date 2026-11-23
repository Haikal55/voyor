"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setMounted(true);

    const hasSeenSplash = sessionStorage.getItem("voyor_splash_seen");
    if (hasSeenSplash) {
      setVisible(false);
      return;
    }

    let isCancelled = false;

    const timer = setTimeout(() => {
      if (isCancelled) return;
      setFading(true);
      sessionStorage.setItem("voyor_splash_seen", "true");

      setTimeout(() => {
        if (!isCancelled) {
          setVisible(false);
        }
      }, 400);
    }, 450);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080808] transition-opacity duration-800 ease-out select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(167,192,128,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-4 rounded-full bg-[#a7c080]/15 blur-2xl animate-pulse pointer-events-none" />

        <div className="relative w-28 h-28 sm:w-36 sm:h-36 animate-evergreen-breathe">
          <Image
            src="/brand/medallion-evergreen.svg"
            alt="VOYOR Sovereign Medallion"
            width={144}
            height={144}
            className="w-full h-full object-contain drop-shadow-[0_0_24px_rgba(167,192,128,0.4)]"
            priority
          />
        </div>

        <div className="mt-7 flex flex-col items-center space-y-1.5 text-center">
          <span className="font-radiant text-2xl sm:text-3xl tracking-[0.28em] text-[#d3c6aa] uppercase drop-shadow-sm">
            VOYOR
          </span>
          <span className="text-[10px] sm:text-[11px] tracking-[0.38em] text-[#a7c080]/80 uppercase font-light">
            Milano • Haute Couture
          </span>
        </div>

        <div className="mt-8 w-36 h-[1.5px] bg-[#1a1a1a] rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a7c080] to-transparent animate-luxury-shimmer" />
        </div>
      </div>
    </div>
  );
}
