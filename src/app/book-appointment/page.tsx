import React, { Suspense } from "react";
import { Metadata } from "next";
import { BookingPageClient } from "./BookingPageClient";
import { getCurrentUserAction } from "../actions/auth";

export const metadata: Metadata = {
  title: "Book An Appointment | VOYOR Official Boutique & Haute Couture Salon",
  description:
    "Schedule a private in-store styling appointment or virtual couture video consultation with a dedicated VOYOR Senior Client Advisor across our global flagship salons in Milan, Paris, London, and New York.",
};

export default async function BookAppointmentPage() {
  const user = await getCurrentUserAction();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] flex items-center justify-center text-[#a7c080] text-xs uppercase tracking-luxury">
          Preparing Atelier Salon...
        </div>
      }
    >
      <BookingPageClient initialUser={user} />
    </Suspense>
  );
}
