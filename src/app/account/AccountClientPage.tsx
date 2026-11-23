"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { logoutAction, updateUserProfileAction, updateUserPasswordAction } from "../actions/auth";
import {
  removeFromWishlistAction,
  addUserAddressAction,
  deleteUserAddressAction,
  setDefaultAddressAction,
  createFastAppointmentAction,
  cancelAppointmentAction,
} from "../actions/account";
import { formatPrice } from "@/lib/types";
import { useLuxury } from "@/context/luxury-context";
import { LuxuryInput, LuxurySelect, LuxuryTextarea } from "@/components/ui/LuxuryInput";

interface AccountUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string | null;
  country: string | null;
  phone?: string | null;
  role: string | null;
  createdAt: Date | null;
}

interface ClientOrder {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  currency: string | null;
  status: string | null;
  shippingAddress: string;
  itemsJson: string;
  createdAt: Date | null;
}

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: Date | null;
  product: {
    id: string;
    slug: string;
    name: string;
    subtitle: string | null;
    basePrice: number;
    compareAtPrice: number | null;
    composition: string | null;
    images: { url: string; alt: string }[];
    variants: { id: string; size: string; colorName: string; priceDelta: number | null }[];
  };
}

interface UserAddress {
  id: string;
  userId: string;
  label: string | null;
  recipientName: string;
  phone: string;
  streetAddress: string;
  suite: string | null;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean | null;
  createdAt: Date | null;
}

interface UserAppointment {
  id: string;
  userId: string;
  referenceCode: string;
  boutiqueName: string;
  boutiqueCity: string;
  boutiqueAddress: string;
  appointmentType: string;
  serviceType: string | null;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string | null;
  status: string | null;
  createdAt: Date | null;
}

type TabKey = "orders" | "wishlist" | "addresses" | "appointments" | "profile";

const BOUTIQUES = [
  {
    name: "Milan Flagship & Central Atelier",
    city: "Milano",
    address: "Via Montenapoleone 8, 20121 Milano, Italy",
  },
  {
    name: "Paris Haute Couture Salon",
    city: "Paris",
    address: "14 Place Vendôme, 75001 Paris, France",
  },
  {
    name: "London Mayfair Boutique",
    city: "London",
    address: "42 New Bond Street, W1S 2RY London, UK",
  },
  {
    name: "New York Madison Avenue Flagship",
    city: "New York",
    address: "720 Madison Avenue, NY 10065, USA",
  },
  {
    name: "Tokyo Ginza Salon",
    city: "Tokyo",
    address: "6-10-1 Ginza, Chuo-ku, 104-0061 Tokyo, Japan",
  },
];

export function AccountClientPage({
  user,
  orders = [],
  initialWishlist = [],
  initialAddresses = [],
  initialAppointments = [],
}: {
  user: AccountUser;
  orders: ClientOrder[];
  initialWishlist: WishlistItem[];
  initialAddresses: UserAddress[];
  initialAppointments: UserAppointment[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = (searchParams.get("tab") as TabKey) || null;

  const { currency, addToCart } = useLuxury();
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam || "orders");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [orderList, setOrderList] = useState<ClientOrder[]>(orders);
  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  const [currentUser, setCurrentUser] = useState<AccountUser>(user);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    title: user.title || "Mr.",
    firstName: user.firstName,
    lastName: user.lastName,
    country: user.country || "Italy",
    phone: user.phone || "+39 02 7600 5544",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const [addresses, setAddresses] = useState<UserAddress[]>(initialAddresses);
  const [appointments, setAppointments] = useState<UserAppointment[]>(initialAppointments);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "Milano Residence",
    recipientName: `${user.title || "Mr."} ${user.firstName} ${user.lastName}`,
    phone: "+39 02 7600 5544",
    streetAddress: "",
    suite: "",
    city: "",
    postalCode: "",
    country: user.country || "Italy",
    isDefault: false,
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    boutiqueIndex: 0,
    appointmentType: "in_boutique" as "in_boutique" | "video_call" | "phone_call",
    serviceType: "Haute Couture Salon Styling",
    date: "2026-12-10",
    timeSlot: "14:00 - 15:30",
    clientPhone: "+39 02 7600 5544",
    notes: "Requesting private viewing of latest runway silhouettes and silk tailoring.",
  });

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await updateUserProfileAction(profileForm);
    setSavingProfile(false);
    if (res.success && res.user) {
      setCurrentUser(res.user as AccountUser);
      setIsEditingProfile(false);
      showNotification("Your profile details have been successfully updated.");
    } else {
      showNotification(res.error || "Failed to update profile.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setSavingPassword(true);
    const res = await updateUserPasswordAction(passwordForm);
    setSavingPassword(false);
    if (res.success) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsChangingPassword(false);
      showNotification("Your account password has been updated securely.");
    } else {
      setPasswordError(res.error || "Failed to update password.");
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutAction();
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string, productName: string) => {
    const res = await removeFromWishlistAction(productId);
    if (res.success) {
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      showNotification(`Removed "${productName}" from your Atelier Wishlist.`);
    }
  };

  const handleAddWishlistToBag = async (item: WishlistItem) => {
    const variantId = item.product.variants[0]?.id;
    if (variantId) {
      await addToCart(variantId, 1);
      showNotification(`Added "${item.product.name}" to your shopping bag.`);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressLoading(true);

    const res = await addUserAddressAction(addressForm);
    setAddressLoading(false);

    if (res.success && res.id) {
      const newAddr: UserAddress = {
        id: res.id,
        userId: user.id,
        label: addressForm.label,
        recipientName: addressForm.recipientName,
        phone: addressForm.phone,
        streetAddress: addressForm.streetAddress,
        suite: addressForm.suite || null,
        city: addressForm.city,
        postalCode: addressForm.postalCode,
        country: addressForm.country,
        isDefault: addressForm.isDefault,
        createdAt: new Date(),
      };

      setAddresses((prev) => {
        if (addressForm.isDefault) {
          return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
        }
        return [...prev, newAddr];
      });

      setIsAddingAddress(false);
      setAddressForm({
        label: "Residence",
        recipientName: `${user.title || "Mr."} ${user.firstName} ${user.lastName}`,
        phone: "+39 02 7600 5544",
        streetAddress: "",
        suite: "",
        city: "",
        postalCode: "",
        country: user.country || "Italy",
        isDefault: false,
      });
      showNotification("New destination address saved to your address book.");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const res = await deleteUserAddressAction(addressId);
    if (res.success) {
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      showNotification("Address removed from your address book.");
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    const res = await setDefaultAddressAction(addressId);
    if (res.success) {
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        }))
      );
      showNotification("Default delivery destination updated.");
    }
  };

  const handleFastBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);

    const targetBoutique = BOUTIQUES[bookingForm.boutiqueIndex];

    const res = await createFastAppointmentAction({
      boutiqueName: targetBoutique.name,
      boutiqueCity: targetBoutique.city,
      boutiqueAddress: targetBoutique.address,
      appointmentType: bookingForm.appointmentType,
      serviceType: bookingForm.serviceType,
      date: bookingForm.date,
      timeSlot: bookingForm.timeSlot,
      clientName: `${user.title || "Mr."} ${user.firstName} ${user.lastName}`,
      clientEmail: user.email,
      clientPhone: bookingForm.clientPhone,
      notes: bookingForm.notes,
    });

    setBookingLoading(false);

    if (res.success && res.referenceCode) {
      const newAppt: UserAppointment = {
        id: `appt_${Date.now()}`,
        userId: user.id,
        referenceCode: res.referenceCode,
        boutiqueName: targetBoutique.name,
        boutiqueCity: targetBoutique.city,
        boutiqueAddress: targetBoutique.address,
        appointmentType: bookingForm.appointmentType,
        serviceType: bookingForm.serviceType,
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        clientName: `${user.title || "Mr."} ${user.firstName} ${user.lastName}`,
        clientEmail: user.email,
        clientPhone: bookingForm.clientPhone,
        notes: bookingForm.notes,
        status: "Confirmed",
        createdAt: new Date(),
      };

      setAppointments((prev) => [newAppt, ...prev]);
      showNotification(`Bespoke appointment ${res.referenceCode} confirmed with saved profile!`);
    }
  };

  const handleCancelAppointment = async (apptId: string) => {
    const res = await cancelAppointmentAction(apptId);
    if (res.success) {
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === apptId ? { ...appt, status: "Cancelled" } : appt))
      );
      showNotification("Appointment has been cancelled.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-28 sm:pt-32 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-8 font-sans">
          <Link href="/" className="hover:text-[#a7c080] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-neutral-700">/</span>
          <span className="text-[#a7c080] font-semibold">My Account</span>
        </nav>

        {feedbackMessage && (
          <div className="mb-6 p-4 bg-[#141b12] border border-[#a7c080]/60 text-[#a7c080] text-xs uppercase tracking-wider text-center animate-in fade-in duration-300">
            {feedbackMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#1c1c1c] pb-8 mb-8 gap-6">
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal uppercase tracking-wider">
            {currentUser.title || "Mr."} {currentUser.firstName} {currentUser.lastName}
          </h1>

          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="px-6 py-3 border border-[#333] hover:border-neutral-400 text-xs uppercase tracking-[0.2em] font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
          >
            {loggingOut ? "SIGNING OUT..." : "SIGN OUT"}
          </button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-4 mb-10 border-b border-[#1c1c1c] scrollbar-none text-[11px] uppercase tracking-[0.16em]">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 transition-all cursor-pointer whitespace-nowrap border-b-2 font-medium ${
              activeTab === "orders"
                ? "border-[#a7c080] text-[#a7c080] bg-[#121212]"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            Order History ({orderList.length})
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2.5 transition-all cursor-pointer whitespace-nowrap border-b-2 font-medium ${
              activeTab === "wishlist"
                ? "border-[#a7c080] text-[#a7c080] bg-[#121212]"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            Atelier Wishlist ({wishlist.length})
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`px-4 py-2.5 transition-all cursor-pointer whitespace-nowrap border-b-2 font-medium ${
              activeTab === "addresses"
                ? "border-[#a7c080] text-[#a7c080] bg-[#121212]"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            Address Book ({addresses.length})
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-4 py-2.5 transition-all cursor-pointer whitespace-nowrap border-b-2 font-medium ${
              activeTab === "appointments"
                ? "border-[#a7c080] text-[#a7c080] bg-[#121212]"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            Salon Appointments ({appointments.length})
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2.5 transition-all cursor-pointer whitespace-nowrap border-b-2 font-medium ${
              activeTab === "profile"
                ? "border-[#a7c080] text-[#a7c080] bg-[#121212]"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            Profile Details
          </button>
        </div>

        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1c1c1c] pb-4 gap-2">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider font-normal">
                  Order History & Atelier Dispatches
                </h2>
                <p className="font-serif text-xs text-neutral-400 leading-relaxed font-light mt-1">
                  Track your bespoke commissions, white-glove couriers, and atelier deliveries.
                </p>
              </div>
            </div>

            {orderList.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="font-serif text-sm text-neutral-400">
                  You have not placed any orders yet.
                </p>
                <Link
                  href="/category/runway-couture"
                  className="inline-block px-8 py-3.5 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors shadow-lg shadow-[#a7c080]/10"
                >
                  DISCOVER THE RUNWAY
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#1c1c1c]">
                {orderList.map((ord) => {
                  let items: Array<{
                    id: string;
                    title: string;
                    color: string;
                    size: string;
                    price: number;
                    quantity: number;
                    image: string;
                  }> = [];
                  try {
                    items = JSON.parse(ord.itemsJson);
                  } catch {}

                  return (
                    <div
                      key={ord.id}
                      className="py-8 space-y-5 text-xs font-serif"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222] pb-4 gap-3">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                            Order Reference
                          </span>
                          <span className="font-mono font-semibold text-white text-sm">
                            {ord.orderNumber}
                          </span>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                            Atelier Status
                          </span>
                          <span className="text-[#a7c080] uppercase tracking-wider font-medium text-xs">
                            {ord.status || "Confirmed"}
                          </span>
                        </div>
                      </div>

                      {items.length > 0 && (
                        <div className="space-y-3 pt-2">
                          {items.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-4">
                              {item.image && (
                                <div className="relative w-14 h-16 overflow-hidden shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="text-white text-xs uppercase tracking-wide font-medium">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                                  {item.color} &bull; Size: {item.size} &bull; Qty: {item.quantity}
                                </p>
                              </div>
                              <span className="text-neutral-200 font-mono text-xs">
                                {formatPrice(item.price * item.quantity, currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-400 pt-3 border-t border-[#1c1c1c]">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                            White-Glove Delivery Destination
                          </span>
                          <p className="text-neutral-300 leading-relaxed">{ord.shippingAddress}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                            Total Valuation
                          </span>
                          <p className="text-[#a7c080] font-medium text-sm font-mono">
                            {formatPrice(ord.totalAmount, currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <div className="border-b border-[#1c1c1c] pb-4">
              <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider font-normal">
                Curated Atelier Wishlist
              </h2>
              <p className="font-serif text-xs text-neutral-400 leading-relaxed font-light mt-1">
                Your personally saved runway silhouettes and atelier creations across all devices.
              </p>
            </div>

            {wishlist.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="font-serif text-sm text-neutral-400">
                  Your Atelier Wishlist is currently empty.
                </p>
                <Link
                  href="/category/runway-couture"
                  className="inline-block px-8 py-3.5 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors"
                >
                  EXPLORE THE RUNWAY
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlist.map((item) => {
                  const primaryImg =
                    item.product.images[0]?.url ||
                    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop";

                  return (
                    <div
                      key={item.id}
                      className="border-b border-[#1c1c1c] pb-6 flex flex-col justify-between group"
                    >
                      <Link href={`/product/${item.product.slug}`} className="block relative aspect-[3/4] bg-[#141414] overflow-hidden">
                        <Image
                          src={primaryImg}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </Link>

                      <div className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.16em] text-[#a7c080] font-medium block mb-1">
                            {item.product.composition || "Haute Couture"}
                          </span>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="font-serif text-sm text-white uppercase tracking-wider block hover:text-[#a7c080] transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="font-mono text-xs text-neutral-300 mt-2">
                            {formatPrice(item.product.basePrice, currency)}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-[#1c1c1c]">
                          <button
                            type="button"
                            onClick={() => handleAddWishlistToBag(item)}
                            className="w-full py-2.5 bg-[#a7c080] hover:bg-[#8da866] text-black text-[10px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                          >
                            ADD TO SHOPPING BAG
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromWishlist(item.productId, item.product.name)}
                            className="w-full py-2 border border-[#2a2a2a] hover:border-neutral-500 text-neutral-400 hover:text-white text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer"
                          >
                            REMOVE FROM WISHLIST
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1c1c1c] pb-4 gap-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider font-normal">
                  Global Address Book
                </h2>
                <p className="font-serif text-xs text-neutral-400 leading-relaxed font-light mt-1">
                  Store and manage residences for expedited atelier white-glove dispatches.
                </p>
              </div>

              {!isAddingAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="px-5 py-2.5 bg-[#181818] border border-[#a7c080]/70 hover:border-[#a7c080] text-[#a7c080] hover:text-white text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  + ADD NEW ADDRESS
                </button>
              )}
            </div>

            {isAddingAddress && (
              <form
                onSubmit={handleSaveAddress}
                className="py-6 border-b border-[#1c1c1c] space-y-6 animate-in fade-in duration-300"
              >
                <div className="flex items-center justify-between border-b border-[#222] pb-3">
                  <h3 className="font-serif text-base text-white uppercase tracking-wider">
                    Add New Delivery Residence
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="text-neutral-500 hover:text-white text-xs uppercase tracking-wider cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-serif">
                  <LuxuryInput
                    id="address-label"
                    label="Residence Label"
                    required
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  />

                  <LuxuryInput
                    id="address-recipient"
                    label="Recipient Full Name"
                    required
                    value={addressForm.recipientName}
                    onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                  />

                  <div className="sm:col-span-2">
                    <LuxuryInput
                      id="address-street"
                      label="Street Address"
                      required
                      value={addressForm.streetAddress}
                      onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                    />
                  </div>

                  <LuxuryInput
                    id="address-suite"
                    label="Apartment / Suite / Unit (Optional)"
                    value={addressForm.suite}
                    onChange={(e) => setAddressForm({ ...addressForm, suite: e.target.value })}
                  />

                  <LuxuryInput
                    id="address-city"
                    label="City"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  />

                  <LuxuryInput
                    id="address-postal"
                    label="Postal Code"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  />

                  <LuxuryInput
                    id="address-country"
                    label="Country / Region"
                    required
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  />

                  <div className="sm:col-span-2">
                    <LuxuryInput
                      id="address-phone"
                      label="Direct Contact Phone"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefaultCheckbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded border-[#333] bg-[#181818] text-[#a7c080] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="isDefaultCheckbox" className="text-xs text-neutral-300 font-serif cursor-pointer">
                    Set as my primary delivery destination
                  </label>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={addressLoading}
                    className="px-6 py-3 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                  >
                    {addressLoading ? "SAVING..." : "SAVE DESTINATION"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-6 py-3 border border-[#333] text-neutral-400 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            )}

            {addresses.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="font-serif text-sm text-neutral-400">
                  No delivery addresses saved in your address book yet.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="px-8 py-3.5 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                >
                  ADD FIRST ADDRESS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="py-6 border-b border-[#1c1c1c] flex flex-col justify-between space-y-5"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#222] pb-3 mb-4">
                        <span className="font-serif text-sm text-white uppercase tracking-wider font-medium">
                          {addr.label || "Residence"}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 text-[#a7c080] border border-[#a7c080]/40 font-semibold">
                            PRIMARY DEFAULT
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs font-serif text-neutral-300">
                        <p className="text-white font-medium">{addr.recipientName}</p>
                        <p className="text-neutral-400">{addr.streetAddress}</p>
                        {addr.suite && <p className="text-neutral-400">{addr.suite}</p>}
                        <p className="text-neutral-400">
                          {addr.city}, {addr.postalCode}
                        </p>
                        <p className="text-neutral-400">{addr.country}</p>
                        <p className="text-neutral-500 pt-2 font-mono text-[11px]">Phone: {addr.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-3 border-t border-[#1e1e1e] text-[10px] uppercase tracking-[0.18em]">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[#a7c080] hover:underline cursor-pointer font-medium"
                        >
                          SET AS DEFAULT
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-neutral-500 hover:text-red-400 cursor-pointer ml-auto transition-colors"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="space-y-10">
            <div className="border-b border-[#1c1c1c] pb-4">
              <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider font-normal">
                Boutique Appointments & Fast Booking
              </h2>
              <p className="font-serif text-xs text-neutral-400 leading-relaxed font-light mt-1">
                Versace-inspired expedited appointment booking with your saved VOYOR client credentials.
              </p>
            </div>

            <div className="py-6 border-b border-[#1c1c1c] space-y-6">
              <div className="border-b border-[#222] pb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#a7c080] font-bold block mb-1">
                  1-Click Fast Salon Reservation
                </span>
                <h3 className="font-serif text-lg text-white uppercase tracking-wider">
                  Reserve Boutique Stylist & Haute Couture Salon
                </h3>
                <p className="font-serif text-xs text-neutral-400 mt-1 font-light">
                  Client Profile Pre-filled: <span className="text-white font-medium">{user.title || "Mr."} {user.firstName} {user.lastName} ({user.email})</span>
                </p>
              </div>

              <form onSubmit={handleFastBooking} className="space-y-6 text-xs font-serif">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                  <div className="lg:col-span-2">
                    <LuxurySelect
                      id="booking-boutique"
                      label="Select Flagship Boutique"
                      value={String(bookingForm.boutiqueIndex)}
                      onChange={(e) => setBookingForm({ ...bookingForm, boutiqueIndex: parseInt(e.target.value, 10) })}
                      options={BOUTIQUES.map((b, idx) => ({
                        value: String(idx),
                        label: `${b.name} (${b.city}) — ${b.address}`,
                      }))}
                    />
                  </div>

                  <div>
                    <LuxurySelect
                      id="booking-format"
                      label="Appointment Format"
                      value={bookingForm.appointmentType}
                      onChange={(e) => setBookingForm({ ...bookingForm, appointmentType: e.target.value as any })}
                      options={[
                        { value: "in_boutique", label: "In-Boutique Private Salon" },
                        { value: "video_call", label: "Virtual Couture Video Call" },
                        { value: "phone_call", label: "Private Client Phone Consultation" },
                      ]}
                    />
                  </div>

                  <div>
                    <LuxurySelect
                      id="booking-service"
                      label="Styling Service"
                      value={bookingForm.serviceType}
                      onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}
                      options={[
                        { value: "Haute Couture Salon Styling", label: "Runway Fall/Winter 2026 Private Fitting" },
                        { value: "Bespoke Silk Tailoring", label: "Bespoke Silk Tailoring & Suiting" },
                        { value: "High Perfumery & Leather Curation", label: "High Perfumery & Sovereign Leather Curation" },
                        { value: "Bridal & Red Carpet Atelier", label: "Bridal & Red Carpet Evening Atelier" },
                      ]}
                    />
                  </div>

                  <div>
                    <LuxuryInput
                      id="booking-date"
                      label="Preferred Date"
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <LuxurySelect
                      id="booking-timeslot"
                      label="Preferred Time Slot"
                      value={bookingForm.timeSlot}
                      onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                      options={[
                        { value: "10:30 - 12:00", label: "10:30 – 12:00 (Morning Salon)" },
                        { value: "12:00 - 13:30", label: "12:00 – 13:30 (Midday Salon)" },
                        { value: "14:00 - 15:30", label: "14:00 – 15:30 (Afternoon Viewing)" },
                        { value: "16:00 - 17:30", label: "16:00 – 17:30 (Atelier Hours)" },
                        { value: "18:00 - 19:30", label: "18:00 – 19:30 (Evening Privé)" },
                      ]}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <LuxuryInput
                      id="booking-phone"
                      label="Advisor Direct Contact Phone (Saved in Profile)"
                      required
                      value={bookingForm.clientPhone}
                      onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <LuxuryTextarea
                      id="booking-notes"
                      label="Special Styling Requests & Sizing Requirements (Optional)"
                      rows={3}
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-8 py-3.5 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                >
                  {bookingLoading ? "SECURING SALON RESERVATION..." : "CONFIRM PRIORITY BOOKING"}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-lg text-white uppercase tracking-wider border-b border-[#1c1c1c] pb-3">
                Scheduled Appointments ({appointments.length})
              </h3>

              {appointments.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400 font-serif">
                  You have no upcoming boutique appointments. Use the fast booking form above to schedule a private fitting.
                </div>
              ) : (
                <div className="divide-y divide-[#1c1c1c]">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="py-6 space-y-4 text-xs font-serif"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222] pb-3 gap-2">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                            Appointment Code
                          </span>
                          <span className="font-mono font-semibold text-white text-sm">
                            {appt.referenceCode}
                          </span>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                            Booking Status
                          </span>
                          <span
                            className={`uppercase tracking-wider font-semibold text-xs ${
                              appt.status === "Cancelled" ? "text-neutral-500" : "text-[#a7c080]"
                            }`}
                          >
                            {appt.status || "Confirmed"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-neutral-300">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                            Boutique & Salon
                          </span>
                          <p className="text-white font-medium">{appt.boutiqueName}</p>
                          <p className="text-neutral-400 text-[11px] mt-0.5">{appt.boutiqueAddress}</p>
                        </div>

                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                            Date & Session
                          </span>
                          <p className="text-white font-medium">{appt.date}</p>
                          <p className="text-[#a7c080] font-mono text-[11px] mt-0.5">{appt.timeSlot}</p>
                        </div>

                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">
                            Format & Service
                          </span>
                          <p className="text-white font-medium">
                            {appt.appointmentType === "in_boutique"
                              ? "In-Boutique Salon"
                              : appt.appointmentType === "video_call"
                              ? "Virtual Video Call"
                              : "Phone Consultation"}
                          </p>
                          <p className="text-neutral-400 text-[11px] mt-0.5">{appt.serviceType}</p>
                        </div>
                      </div>

                      {appt.notes && (
                        <div className="pt-2 border-t border-[#1a1a1a] text-neutral-400 text-[11px]">
                          <span className="text-neutral-500 uppercase tracking-wider block text-[9px] mb-0.5">
                            Client Advisor Notes
                          </span>
                          {appt.notes}
                        </div>
                      )}

                      {appt.status !== "Cancelled" && (
                        <div className="pt-2 border-t border-[#1e1e1e] flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            CANCEL APPOINTMENT
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-8">
            <div className="border-b border-[#1c1c1c] pb-4">
              <h2 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider font-normal">
                Client Profile Details
              </h2>
              <p className="font-serif text-xs text-neutral-400 leading-relaxed font-light mt-1">
                View and manage your registered credentials, jurisdiction, and boutique preferences.
              </p>
            </div>

            <div className="py-6 border-b border-[#1c1c1c] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222] pb-4 gap-4">
                <h3 className="font-serif text-lg text-white uppercase tracking-wider">
                  {currentUser.title || "Mr."} {currentUser.firstName} {currentUser.lastName}
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(!isEditingProfile);
                      setIsChangingPassword(false);
                    }}
                    className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-semibold transition-colors cursor-pointer border ${
                      isEditingProfile
                        ? "bg-[#181818] border-neutral-500 text-white"
                        : "bg-[#a7c080] hover:bg-[#8da866] text-black border-[#a7c080]"
                    }`}
                  >
                    {isEditingProfile ? "CLOSE CUSTOMIZE MODE" : "CUSTOMIZE PROFILE"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(!isChangingPassword);
                      setIsEditingProfile(false);
                    }}
                    className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-semibold transition-colors cursor-pointer border ${
                      isChangingPassword
                        ? "bg-[#181818] border-neutral-500 text-white"
                        : "border-[#333] hover:border-neutral-300 text-neutral-300 hover:text-white"
                    }`}
                  >
                    {isChangingPassword ? "CLOSE PASSWORD FORM" : "CHANGE PASSWORD"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-serif text-neutral-300 pt-2">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase tracking-wider mb-1">
                    Honorific & Full Name
                  </span>
                  <span className="text-white font-medium text-sm">
                    {currentUser.title || "Mr."} {currentUser.firstName} {currentUser.lastName}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase tracking-wider mb-1">
                    Registered Email
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono text-xs">{currentUser.email}</span>
                    <span className="text-[9px] text-[#a7c080] uppercase tracking-wider font-semibold border border-[#a7c080]/30 px-1.5 py-0.5">
                      VERIFIED
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase tracking-wider mb-1">
                    Jurisdiction / Country
                  </span>
                  <span className="text-white">{currentUser.country || "Italy"}</span>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase tracking-wider mb-1">
                    Direct Contact Phone
                  </span>
                  <span className="text-white font-mono">{currentUser.phone || "+39 02 7600 5544"}</span>
                </div>
              </div>
            </div>

            {isEditingProfile && (
              <div className="py-6 border-b border-[#1c1c1c] space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-[#222] pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#a7c080] font-bold block mb-1">
                      Customize Mode Active
                    </span>
                    <h3 className="font-serif text-lg text-white uppercase tracking-wider">
                      Edit Profile Credentials
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="text-neutral-500 hover:text-white text-xs uppercase tracking-wider cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5 text-xs font-serif">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <LuxurySelect
                      id="profile-title"
                      label="Title / Honorific"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      options={[
                        { value: "Mr.", label: "Mr." },
                        { value: "Mrs.", label: "Mrs." },
                        { value: "Ms.", label: "Ms." },
                        { value: "Prefer not to say", label: "Prefer not to say" },
                      ]}
                    />

                    <LuxuryInput
                      id="profile-first-name"
                      label="First Name"
                      required
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    />

                    <LuxuryInput
                      id="profile-last-name"
                      label="Last Name"
                      required
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <LuxuryInput
                      id="profile-country"
                      label="Jurisdiction / Country"
                      required
                      value={profileForm.country}
                      onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    />

                    <LuxuryInput
                      id="profile-phone"
                      label="Direct Contact Phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-8 py-3 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                    >
                      {savingProfile ? "SAVING PROFILE..." : "SAVE PROFILE CHANGES"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-6 py-3 border border-[#333] hover:border-neutral-300 text-neutral-400 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            )}

            {isChangingPassword && (
              <div className="py-6 border-b border-[#1c1c1c] space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-[#222] pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#a7c080] font-bold block mb-1">
                      Credentials Update
                    </span>
                    <h3 className="font-serif text-lg text-white uppercase tracking-wider">
                      Change Account Password
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="text-neutral-500 hover:text-white text-xs uppercase tracking-wider cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>

                {passwordError && (
                  <div className="p-3 bg-[#1a1111] border border-rose-900/60 text-rose-300 text-xs font-serif leading-relaxed">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-5 text-xs font-serif max-w-xl">
                  <LuxuryInput
                    id="password-current"
                    label="Current Password"
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />

                  <LuxuryInput
                    id="password-new"
                    label="New Password"
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />

                  <LuxuryInput
                    id="password-confirm"
                    label="Confirm New Password"
                    type="password"
                    required
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                  />

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="px-8 py-3 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                    >
                      {savingPassword ? "UPDATING..." : "UPDATE PASSWORD"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="px-6 py-3 border border-[#333] hover:border-neutral-300 text-neutral-400 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
