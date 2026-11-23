import React from "react";

export default function BookAppointmentLoading() {
  return (
    <main className="min-h-screen bg-[#080808] text-white pt-24 pb-24 animate-pulse">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="h-8 bg-[#222] rounded w-64 mb-8" />
        <div className="space-y-4">
          <div className="h-12 bg-[#141414] border border-[#222] rounded" />
          <div className="h-12 bg-[#141414] border border-[#222] rounded" />
          <div className="h-12 bg-[#141414] border border-[#222] rounded" />
        </div>
      </div>
    </main>
  );
}
