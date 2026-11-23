"use client";

import React, { useState, useEffect } from "react";

interface SectionItem {
  id: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: "section-hero", label: "Fearless Opulence" },
  { id: "section-collections", label: "The VOYOR Collections" },
  { id: "section-runway", label: "Runway FW26 Couture" },
  { id: "section-silhouettes", label: "Iconic Silhouettes" },
  { id: "section-legacy", label: "Maison Heritage" },
];

export function HomepageNavRails() {
  const [activeSection, setActiveSection] = useState<string>("section-hero");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = SECTIONS[i];
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside
      aria-label="Homepage Section Navigation"
      className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-[35] items-center justify-end group select-none pointer-events-none"
    >
      <div className="flex flex-col items-end space-y-4 py-3 pl-8 pr-4 sm:pr-6 opacity-20 hover:opacity-100 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-auto">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          const isHovered = hoveredSection === sec.id;

          return (
            <div
              key={sec.id}
              className="relative flex items-center justify-end"
              onMouseEnter={() => setHoveredSection(sec.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div
                className={`absolute right-full mr-3.5 transition-all duration-200 pointer-events-none ${
                  isHovered
                    ? "opacity-100 translate-x-0 scale-100"
                    : "opacity-0 translate-x-2 scale-95"
                }`}
              >
                <div className="px-3 py-1.5 rounded bg-[#0d0d0d]/95 backdrop-blur-md border border-[#2a2a2a] shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center whitespace-nowrap">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#d3c6aa]">
                    {sec.label}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleScrollTo(sec.id)}
                aria-label={`Scroll to ${sec.label}`}
                className="py-1 flex items-center justify-end cursor-pointer focus:outline-none"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-300 ease-out ${
                    isActive
                      ? "w-7 bg-[#a7c080] shadow-[0_0_12px_rgba(167,192,128,0.7)]"
                      : isHovered
                      ? "w-8 bg-white"
                      : "w-4 bg-white/35 group-hover:bg-white/50"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
