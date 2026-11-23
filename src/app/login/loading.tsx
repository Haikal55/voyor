import React from "react";

export default function LoginLoading() {
  return (
    <main className="min-h-screen bg-[#080808] text-white pt-28 pb-24 flex items-center justify-center animate-pulse">
      <div className="w-full max-w-md px-6 space-y-6">
        <div className="h-8 bg-[#222] rounded w-40 mx-auto" />
        <div className="h-4 bg-[#181818] rounded w-64 mx-auto" />
        <div className="space-y-4 pt-6">
          <div className="h-12 bg-[#141414] border border-[#222] rounded" />
          <div className="h-12 bg-[#141414] border border-[#222] rounded" />
          <div className="h-12 bg-[#222] rounded" />
        </div>
      </div>
    </main>
  );
}
