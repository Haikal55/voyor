import React from "react";

export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[#080808] text-white pb-24 animate-pulse">
      <section className="relative w-full h-[45vh] min-h-[320px] flex items-center justify-center bg-[#111] border-b border-[#1c1c1c] px-4 pt-24 sm:pt-32">
        <div className="max-w-xl mx-auto text-center space-y-4 w-full">
          <div className="h-10 sm:h-14 bg-[#1f1f1f] rounded w-2/3 mx-auto" />
          <div className="h-4 bg-[#181818] rounded w-1/2 mx-auto" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <div className="aspect-[3/4] w-full bg-[#141414] border border-[#222] rounded-none" />
              <div className="h-3 bg-[#1c1c1c] rounded w-1/3" />
              <div className="h-4 bg-[#222] rounded w-3/4" />
              <div className="h-3 bg-[#181818] rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
