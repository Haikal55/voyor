"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLuxury } from "@/context/luxury-context";
import { X, ShieldCheck, Check, Cookie, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CookieSettings {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_SETTINGS: CookieSettings = {
  necessary: true,
  functional: true,
  analytics: false,
  marketing: false,
};

export function CookiePreferencesModal() {
  const { isCookieModalOpen, setIsCookieModalOpen } = useLuxury();
  const [settings, setSettings] = useState<CookieSettings>(DEFAULT_SETTINGS);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("voyor_cookie_preferences");
      if (saved) {
        setSettings(JSON.parse(saved));
        setShowBanner(false);
      } else {
        const timer = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (newSettings: CookieSettings) => {
    try {
      localStorage.setItem("voyor_cookie_preferences", JSON.stringify(newSettings));
    } catch {}
    setSettings(newSettings);
    setShowBanner(false);
    setIsCookieModalOpen(false);
  };

  const handleAcceptAll = () => {
    const allOn: CookieSettings = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allOn);
  };

  const handleRejectOptional = () => {
    const onlyEssential: CookieSettings = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyEssential);
  };

  const handleSaveCustom = () => {
    savePreferences(settings);
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && !isCookieModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#111111]/95 backdrop-blur-md border border-[#262626] p-5 rounded-lg shadow-2xl text-neutral-200"
          >
            <div className="flex items-start space-x-3 mb-3">
              <Cookie className="w-5 h-5 text-[#a7c080] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-sm text-white uppercase tracking-wider">
                  Cookie & Privacy Preferences
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  VOYOR uses cookies to ensure our digital boutique functions smoothly, maintain your shopping bag, and remember your currency preferences.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 text-xs font-serif">
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 bg-[#a7c080] hover:bg-[#8da866] text-black font-semibold uppercase tracking-wider transition-colors text-[11px]"
              >
                Accept All
              </button>
              <button
                onClick={handleRejectOptional}
                className="py-2 px-3 border border-[#333] hover:border-neutral-500 text-neutral-300 hover:text-white uppercase tracking-wider transition-colors text-[11px]"
              >
                Reject Optional
              </button>
              <button
                onClick={() => setIsCookieModalOpen(true)}
                className="py-2 px-2 text-[#a7c080] hover:underline uppercase tracking-wider text-[11px] text-center"
              >
                Customize
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCookieModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCookieModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl bg-[#0e0e0e] border border-[#2a2a2a] rounded-lg shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-neutral-200 z-10"
            >
              <div className="flex justify-between items-start border-b border-[#222222] pb-5">
                <div>
                  <span className="text-[10px] uppercase tracking-ultra text-[#a7c080] font-semibold block mb-1">
                    Privacy Governance
                  </span>
                  <h3 className="font-serif text-2xl text-white uppercase tracking-wider">
                    Cookie Preferences
                  </h3>
                </div>
                <button
                  onClick={() => setIsCookieModalOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors"
                  aria-label="Close preferences"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-400 mt-4 leading-relaxed font-light">
                When you visit VOYOR, we store data on your browser using cookies to deliver a tailored haute couture experience. You can choose which categories of cookies to allow below. Essential cookies cannot be switched off as they are required for security and order operations.
              </p>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-[#141414] border border-[#222] rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#a7c080]" />
                      <span className="font-serif text-sm font-medium text-white">
                        Strictly Necessary Cookies
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[#a7c080] font-mono px-2 py-0.5 bg-[#a7c080]/10 border border-[#a7c080]/20 rounded">
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    Required for core security, maintaining your authenticated session, keeping creations inside your shopping bag, and processing checkout authorizations.
                  </p>
                  <div className="text-[10px] text-neutral-500 font-mono pt-1">
                    Cookies: <span className="text-neutral-400">voyor_session</span>, <span className="text-neutral-400">voyor_cookie_preferences</span>
                  </div>
                </div>

                <div className="p-4 bg-[#141414] border border-[#222] rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-sm font-medium text-white">
                      Functional & Localization Cookies
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.functional}
                        onChange={(e) =>
                          setSettings({ ...settings, functional: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#a7c080]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    Preserves your selected currency (IDR, EUR, USD, GBP), geographic territory, and customized boutique appointment draft notes.
                  </p>
                  <div className="text-[10px] text-neutral-500 font-mono pt-1">
                    Cookies: <span className="text-neutral-400">voyor_currency</span>, <span className="text-neutral-400">voyor_country</span>
                  </div>
                </div>

                <div className="p-4 bg-[#141414] border border-[#222] rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-sm font-medium text-white">
                      Performance & Analytics Cookies
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.analytics}
                        onChange={(e) =>
                          setSettings({ ...settings, analytics: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#a7c080]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    Aggregates anonymous telemetry on runway presentation engagement and page performance to refine speed and reliability.
                  </p>
                </div>

                <div className="p-4 bg-[#141414] border border-[#222] rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-sm font-medium text-white">
                      Marketing & Runway Personalization
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.marketing}
                        onChange={(e) =>
                          setSettings({ ...settings, marketing: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#a7c080]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    Allows our maison to tailor private runway show alerts, atelier event invitations, and bespoke look suggestions.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1c1c1c] flex items-center justify-between text-[11px] text-neutral-500">
                <div className="flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Read our full technical ledger in the</span>
                </div>
                <Link
                  href="/privacy-policy#cookies"
                  onClick={() => setIsCookieModalOpen(false)}
                  className="text-[#a7c080] underline hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t border-[#222222] flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="w-full sm:w-1/3 py-3 border border-[#333] hover:border-neutral-500 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Reject Optional
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="w-full sm:w-1/3 py-3 bg-[#181818] border border-[#a7c080]/50 hover:border-[#a7c080] text-[#a7c080] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Save Choices
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-1/3 py-3 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#a7c080]/10"
                >
                  Accept All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
