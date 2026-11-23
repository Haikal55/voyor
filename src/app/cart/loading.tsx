import React from "react";

export default function CartLoading() {
  return (
    <main className="min-h-screen bg-[#080808] text-white pt-24 pb-24 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="h-8 bg-[#222] rounded w-48 mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-[#141414] border border-[#222] rounded p-4" />
          ))}
        </div>
      </div>
    </main>
  );
}
