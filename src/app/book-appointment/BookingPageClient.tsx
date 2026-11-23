"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Video,
  PhoneCall,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Check,
  Sparkles,
  ShieldCheck,
  Download,
  Printer,
} from "lucide-react";
import { createFastAppointmentAction } from "@/app/actions/account";
import { LuxuryInput, LuxurySelect, LuxuryTextarea } from "@/components/ui/LuxuryInput";

type AppointmentType = "in_boutique" | "video_call" | "phone_call";

interface Boutique {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  postalCode: string;
  phone: string;
  hours: string;
  image: string;
}

const BOUTIQUES: Boutique[] = [
  {
    id: "milan",
    name: "Milan Flagship & Central Atelier",
    city: "Milano",
    country: "Italy",
    address: "Via Montenapoleone 8",
    postalCode: "20121 Milano",
    phone: "+39 02 7600 1234",
    hours: "Mon – Sat: 10:00 – 19:30 | Sun: 11:00 – 19:00",
    image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "paris",
    name: "Paris Haute Couture Salon",
    city: "Paris",
    country: "France",
    address: "14 Place Vendôme",
    postalCode: "75001 Paris",
    phone: "+33 1 42 68 5000",
    hours: "Mon – Sat: 10:30 – 19:30 | Sun: Closed",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "london",
    name: "London Mayfair Boutique",
    city: "London",
    country: "United Kingdom",
    address: "42 New Bond Street",
    postalCode: "W1S 2RY London",
    phone: "+44 20 7499 8899",
    hours: "Mon – Sat: 10:00 – 19:00 | Sun: 12:00 – 18:00",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "new_york",
    name: "New York Madison Avenue Flagship",
    city: "New York",
    country: "United States",
    address: "720 Madison Avenue",
    postalCode: "NY 10065",
    phone: "+1 212 555 0199",
    hours: "Mon – Sat: 10:00 – 19:00 | Sun: 12:00 – 18:00",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "tokyo",
    name: "Tokyo Ginza Salon",
    city: "Tokyo",
    country: "Japan",
    address: "6-10-1 Ginza, Chuo-ku",
    postalCode: "104-0061 Tokyo",
    phone: "+81 3 3571 8800",
    hours: "Mon – Sun: 11:00 – 20:00",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dubai",
    name: "Dubai Mall Fashion Avenue",
    city: "Dubai",
    country: "United Arab Emirates",
    address: "Level 1, Fashion Avenue, Downtown Dubai",
    postalCode: "Dubai Mall",
    phone: "+971 4 330 8899",
    hours: "Mon – Sun: 10:00 – 23:00",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  },
];

const TIME_WINDOWS = [
  "10:30 – 12:00 (Morning Salon)",
  "12:00 – 13:30 (Midday Fitting)",
  "14:30 – 16:00 (Afternoon Viewing)",
  "16:30 – 18:00 (Late Afternoon)",
  "18:00 – 19:30 (Evening Champagne)",
];

export function BookingPageClient({ initialUser }: { initialUser?: any }) {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") || "";
  const initialSlug = searchParams.get("slug") || "";

  const [appointmentType, setAppointmentType] = useState<AppointmentType>("in_boutique");
  const [selectedBoutiqueId, setSelectedBoutiqueId] = useState<string>("milan");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>(TIME_WINDOWS[2]);

  const [title, setTitle] = useState<string>(initialUser?.title || "Mr.");
  const [firstName, setFirstName] = useState<string>(initialUser?.firstName || "");
  const [lastName, setLastName] = useState<string>(initialUser?.lastName || "");
  const [email, setEmail] = useState<string>(initialUser?.email || "");
  const [countryCode, setCountryCode] = useState<string>("+39");
  const [phone, setPhone] = useState<string>("");
  const [productInterest, setProductInterest] = useState<string>(initialProduct);
  const [notes, setNotes] = useState<string>("");
  const [agreedToPrivacy, setAgreedToPrivacy] = useState<boolean>(true);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [referenceCode, setReferenceCode] = useState<string>("");

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setAppointmentDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  useEffect(() => {
    if (initialProduct) {
      setProductInterest(initialProduct);
    }
  }, [initialProduct]);

  const selectedBoutique =
    BOUTIQUES.find((b) => b.id === selectedBoutiqueId) || BOUTIQUES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = `VY-APPT-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceCode(code);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (initialUser) {
      try {
        await createFastAppointmentAction({
          boutiqueName: selectedBoutique.name,
          boutiqueCity: selectedBoutique.city,
          boutiqueAddress: selectedBoutique.address,
          appointmentType,
          serviceType: "Haute Couture Salon Styling",
          date: appointmentDate,
          timeSlot,
          clientName: `${title} ${firstName} ${lastName}`,
          clientEmail: email,
          clientPhone: `${countryCode} ${phone}`,
          notes,
        });
      } catch {}
    }
  };

  const handleDownloadCalendar = () => {
    const dateFormatted = appointmentDate.replace(/-/g, "");
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//VOYOR Haute Couture//Boutique Appointment//EN",
      "BEGIN:VEVENT",
      `UID:${referenceCode}@voyor.com`,
      `DTSTAMP:${dateFormatted}T120000Z`,
      `DTSTART:${dateFormatted}T143000Z`,
      `DTEND:${dateFormatted}T160000Z`,
      `SUMMARY:VOYOR Private Appointment (${appointmentType === "in_boutique" ? "In Boutique" : appointmentType === "video_call" ? "Video Call" : "Phone Call"})`,
      `DESCRIPTION:Private appointment with VOYOR Client Advisor. Reference: ${referenceCode}. Location: ${appointmentType === "in_boutique" ? selectedBoutique.name : "Digital Consultation"}. Product: ${productInterest || "Curated Haute Couture"}.`,
      `LOCATION:${appointmentType === "in_boutique" ? `${selectedBoutique.name}, ${selectedBoutique.address}, ${selectedBoutique.city}` : "Virtual Video Consultation"}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `VOYOR_Appointment_${referenceCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white pt-24 sm:pt-28 pb-28">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSubmitted ? (

          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 py-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#a7c080]/15 border-2 border-[#a7c080] flex items-center justify-center shadow-[0_0_24px_rgba(167,192,128,0.3)]">
                <Check className="w-8 h-8 text-[#a7c080] stroke-[2.5]" />
              </div>
              <span className="text-xs uppercase tracking-ultra text-[#a7c080] font-bold block">
                Appointment Request Received
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white uppercase tracking-wider">
                We Look Forward To Welcoming You
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto font-light leading-relaxed">
                Thank you, <span className="text-white font-medium">{title} {firstName} {lastName}</span>. A Client Advisor from our {selectedBoutique.city} boutique will review your request and contact you via {email} or {countryCode} {phone} to confirm your appointment.
              </p>
            </div>

            <div className="border border-[#262626] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-luxury text-[#a7c080] font-bold block">
                    Appointment Reference
                  </span>
                  <span className="text-sm font-mono text-white font-semibold">
                    {referenceCode}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-[#a7c080]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    Appointment Confirmed
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 text-xs divide-y divide-[#1e1e1e]">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                      Appointment Format
                    </span>
                    <p className="text-sm font-serif text-white uppercase tracking-wide">
                      {appointmentType === "in_boutique"
                        ? "In Boutique Appointment"
                        : appointmentType === "video_call"
                        ? "Via Video Call"
                        : "Via Phone Call"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                      Selected Boutique
                    </span>
                    <p className="text-sm font-serif text-white uppercase tracking-wide">
                      {selectedBoutique.name}
                    </p>
                    <p className="text-neutral-400 text-[11px] mt-0.5">
                      {selectedBoutique.address}, {selectedBoutique.city}
                    </p>
                  </div>
                </div>

                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                      Date
                    </span>
                    <p className="text-sm font-medium text-white flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-[#a7c080]" />
                      <span>
                        {new Date(appointmentDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                      Time Slot
                    </span>
                    <p className="text-sm font-medium text-white flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#a7c080]" />
                      <span>{timeSlot}</span>
                    </p>
                  </div>
                </div>

                {(productInterest || notes) && (
                  <div className="pt-6 space-y-2">
                    {productInterest && (
                      <p className="text-neutral-300">
                        <strong className="text-[#a7c080]">Creation of Interest:</strong>{" "}
                        {productInterest}
                      </p>
                    )}
                    {notes && (
                      <p className="text-neutral-400 italic text-[11px]">
                        &ldquo;{notes}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 bg-black/50 border-t border-[#1e1e1e] flex flex-wrap gap-3 items-center justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadCalendar}
                    className="px-4 py-2.5 border border-neutral-700 hover:border-[#a7c080] text-xs text-neutral-200 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#a7c080]" />
                    <span>Add to Calendar (.ics)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-200 hover:text-white transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
                  >
                    Book Another Appointment
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-2.5 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Return to Boutique
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-[calc(var(--header-offset,4.75rem)+1.25rem)] transition-[top] duration-300 ease-out">
                <div className="space-y-4">

                  <div className="relative h-56 sm:h-64 w-full bg-neutral-900 overflow-hidden">
                    <Image
                      src={selectedBoutique.image}
                      alt={selectedBoutique.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase tracking-luxury text-[#a7c080] font-medium block">
                        {selectedBoutique.city}, {selectedBoutique.country}
                      </span>
                      <h3 className="text-xl font-serif text-white uppercase tracking-wider">
                        {selectedBoutique.name}
                      </h3>
                    </div>
                  </div>

                  <div className="py-4 space-y-4 text-xs text-neutral-300 border-b border-[#1c1c1c]">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-[#a7c080] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">{selectedBoutique.address}</p>
                        <p className="text-neutral-500 text-[11px]">{selectedBoutique.postalCode}, {selectedBoutique.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-neutral-400">
                      <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span>{selectedBoutique.hours}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-neutral-400">
                      <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span className="font-mono text-neutral-200">{selectedBoutique.phone}</span>
                    </div>

                    <div className="pt-4 border-t border-[#1e1e1e] text-[11px] text-neutral-400 font-light leading-relaxed">
                      Our Client Advisors are at your disposal to offer personalized styling advice and assist you with your purchases.
                    </div>
                  </div>
                </div>

                {productInterest && (
                  <div className="py-3.5 border-b border-[#1c1c1c] flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2.5">
                      <Sparkles className="w-4 h-4 text-[#a7c080] shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#a7c080] font-semibold block">
                          Styling Request For
                        </span>
                        <span className="text-white font-medium">{productInterest}</span>
                      </div>
                    </div>
                    {initialSlug && (
                      <Link
                        href={`/product/${initialSlug}`}
                        target="_blank"
                        className="text-[10px] text-neutral-400 hover:text-white underline uppercase shrink-0"
                      >
                        View Piece &rarr;
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 space-y-10">

                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm uppercase tracking-luxury text-[#a7c080] font-semibold">
                      1. Choose Appointment Type
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Select how you would like to meet with our Client Advisor.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    <button
                      type="button"
                      onClick={() => setAppointmentType("in_boutique")}
                      className={`p-4 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        appointmentType === "in_boutique"
                          ? "bg-transparent border-[#a7c080] text-white"
                          : "bg-transparent border-[#222] text-neutral-400 hover:border-neutral-600 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Building2
                          className={`w-5 h-5 ${
                            appointmentType === "in_boutique"
                              ? "text-[#a7c080]"
                              : "text-neutral-500"
                          }`}
                        />
                        <div
                          className={`w-4 h-4 border flex items-center justify-center ${
                            appointmentType === "in_boutique"
                              ? "border-[#a7c080] bg-[#a7c080] text-black"
                              : "border-neutral-700"
                          }`}
                        >
                          {appointmentType === "in_boutique" && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider">
                          In Boutique
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-1">
                          Private salon suite fitting
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAppointmentType("video_call")}
                      className={`p-4 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        appointmentType === "video_call"
                          ? "bg-transparent border-[#a7c080] text-white"
                          : "bg-transparent border-[#222] text-neutral-400 hover:border-neutral-600 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Video
                          className={`w-5 h-5 ${
                            appointmentType === "video_call"
                              ? "text-[#a7c080]"
                              : "text-neutral-500"
                          }`}
                        />
                        <div
                          className={`w-4 h-4 border flex items-center justify-center ${
                            appointmentType === "video_call"
                              ? "border-[#a7c080] bg-[#a7c080] text-black"
                              : "border-neutral-700"
                          }`}
                        >
                          {appointmentType === "video_call" && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider">
                          Via Video Call
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-1">
                          Remote live curation
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAppointmentType("phone_call")}
                      className={`p-4 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        appointmentType === "phone_call"
                          ? "bg-transparent border-[#a7c080] text-white"
                          : "bg-transparent border-[#222] text-neutral-400 hover:border-neutral-600 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <PhoneCall
                          className={`w-5 h-5 ${
                            appointmentType === "phone_call"
                              ? "text-[#a7c080]"
                              : "text-neutral-500"
                          }`}
                        />
                        <div
                          className={`w-4 h-4 border flex items-center justify-center ${
                            appointmentType === "phone_call"
                              ? "border-[#a7c080] bg-[#a7c080] text-black"
                              : "border-neutral-700"
                          }`}
                        >
                          {appointmentType === "phone_call" && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider">
                          Via Phone Call
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-1">
                          Styling advisory call
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#1c1c1c]">
                  <div>
                    <h2 className="text-sm uppercase tracking-luxury text-[#a7c080] font-semibold">
                      2. Select Boutique
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {appointmentType === "in_boutique"
                        ? "Select the boutique you wish to visit."
                        : "Select the flagship salon that will host your digital consultation."}
                    </p>
                  </div>

                  <div>
                    <LuxurySelect
                      id="booking-page-boutique"
                      label="Select Boutique"
                      required
                      value={selectedBoutiqueId}
                      onChange={(e) => setSelectedBoutiqueId(e.target.value)}
                      options={BOUTIQUES.map((b) => ({
                        value: b.id,
                        label: `${b.name} — ${b.city}, ${b.country} (${b.address})`,
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#1c1c1c]">
                  <div>
                    <h2 className="text-sm uppercase tracking-luxury text-[#a7c080] font-semibold">
                      3. Select Date & Time
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Choose your preferred date and appointment time slot.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <LuxuryInput
                      id="booking-page-date"
                      label="Preferred Date"
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                    />

                    <LuxurySelect
                      id="booking-page-timeslot"
                      label="Preferred Time Slot"
                      required
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      options={TIME_WINDOWS.map((tw) => ({
                        value: tw,
                        label: tw,
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#1c1c1c]">
                  <div>
                    <h2 className="text-sm uppercase tracking-luxury text-[#a7c080] font-semibold">
                      4. Personal Details
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Please enter your contact details so we can confirm your booking.
                    </p>
                  </div>

                  <div className="space-y-5">

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                      <div className="sm:col-span-3">
                        <LuxurySelect
                          id="booking-page-title"
                          label="Title"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          options={[
                            { value: "Mr.", label: "Mr." },
                            { value: "Mrs.", label: "Mrs." },
                            { value: "Prefer not to say", label: "Prefer not to say" },
                          ]}
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <LuxuryInput
                          id="booking-page-first-name"
                          label="First Name"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <LuxuryInput
                          id="booking-page-last-name"
                          label="Last Name"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <LuxuryInput
                        id="booking-page-email"
                        label="Email Address"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <div className="flex gap-2">
                        <div className="w-32">
                          <LuxurySelect
                            id="booking-page-phone-code"
                            label="Code"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            options={[
                              { value: "+39", label: "+39 IT" },
                              { value: "+33", label: "+33 FR" },
                              { value: "+44", label: "+44 UK" },
                              { value: "+1", label: "+1 US" },
                              { value: "+81", label: "+81 JP" },
                              { value: "+971", label: "+971 AE" },
                              { value: "+62", label: "+62 ID" },
                            ]}
                          />
                        </div>
                        <div className="flex-1">
                          <LuxuryInput
                            id="booking-page-phone"
                            label="Phone Number"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <LuxuryInput
                      id="booking-page-interest"
                      label="Product or Collection of Interest (Optional)"
                      value={productInterest}
                      onChange={(e) => setProductInterest(e.target.value)}
                    />

                    <LuxuryTextarea
                      id="booking-page-notes"
                      label="Additional Requests / Notes (Optional)"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-[#1c1c1c]">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreedToPrivacy}
                      onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                      className="mt-0.5 accent-[#a7c080] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[11px] text-neutral-400 leading-relaxed">
                      I have read and understood the{" "}
                      <Link href="/privacy-policy" target="_blank" className="text-white underline hover:text-[#a7c080]">
                        Privacy Policy
                      </Link>{" "}
                      and consent to VOYOR processing my data for managing my appointment.
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-luxury flex items-center justify-center space-x-2 transition-all shadow-xl shadow-[#a7c080]/20 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>

                  <p className="text-center text-[10px] text-neutral-500 uppercase tracking-wider mt-3">
                    A Client Advisor will contact you to confirm your appointment.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
