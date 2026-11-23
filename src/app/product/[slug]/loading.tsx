import React from "react";

export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-[#080808] text-white pt-20 sm:pt-24 pb-24 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-4 bg-[#181818] rounded w-64 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="aspect-[3/4] w-full bg-[#141414] border border-[#222]" />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="h-3 bg-[#1c1c1c] rounded w-32" />
            <div className="h-8 bg-[#222] rounded w-3/4" />
            <div className="h-6 bg-[#1a1a1a] rounded w-28" />

            <div className="pt-6 border-t border-[#1c1c1c] space-y-4">
              <div className="h-4 bg-[#181818] rounded w-full" />
              <div className="h-4 bg-[#181818] rounded w-5/6" />
            </div>

            <div className="pt-6 border-t border-[#1c1c1c] space-y-3">
              <div className="h-12 bg-[#1c1c1c] rounded w-full" />
              <div className="h-12 bg-[#222] rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
