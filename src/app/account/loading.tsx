import React from "react";

export default function AccountLoading() {
  return (
    <main className="min-h-screen bg-[#080808] text-white pt-24 pb-24 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="h-8 bg-[#222] rounded w-52 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-48 bg-[#141414] border border-[#222] rounded" />
          <div className="md:col-span-3 h-96 bg-[#141414] border border-[#222] rounded" />
        </div>
      </div>
    </main>
  );
}
