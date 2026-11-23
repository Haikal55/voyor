import React, { Suspense } from "react";
import { Metadata } from "next";
import { BookingPageClient } from "./BookingPageClient";
import { getCurrentUserAction } from "../actions/auth";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Book An Appointment | VOYOR Haute Couture Salon",
  description:
    "Schedule a private in-store styling appointment or virtual couture consultation with a dedicated VOYOR Senior Client Advisor across our global flagship salons in Milan, Paris, London, and New York.",
  alternates: {
    canonical: "/book-appointment",
  },
  openGraph: {
    title: `Book An Appointment | ${SITE_NAME} Haute Couture Salon`,
    description:
      "Schedule a private in-store styling appointment or virtual couture consultation with a dedicated VOYOR Senior Client Advisor in Milan, Paris, London, or New York.",
    url: `${SITE_URL}/book-appointment`,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "VOYOR Haute Couture Private Styling Salon",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Book An Appointment | ${SITE_NAME}`,
    description:
      "Schedule a private styling appointment with a dedicated VOYOR Senior Client Advisor.",
    images: [DEFAULT_OG_IMAGE],
  },
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
