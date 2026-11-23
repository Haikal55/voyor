"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLuxury } from "@/context/luxury-context";
import { formatPrice } from "@/lib/types";
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { checkoutOrderAction, getCheckoutInitialDataAction } from "@/app/actions/cart";
import { LuxuryInput, LuxurySelect } from "@/components/ui/LuxuryInput";

interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  country: string;
}

interface SavedAddress {
  id: string;
  label: string | null;
  recipientName: string;
  phone: string;
  streetAddress: string;
  suite: string | null;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean | null;
}

export function CheckoutSidebar() {
  const router = useRouter();
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    currency,
    cartTotalUSD,
    refreshCart,
  } = useLuxury();

  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("custom");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{
    orderNumber: string;
    totalAmount: number;
    currency: string;
    customerName: string;
    customerEmail: string;
    shippingAddress?: string;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "private">("card");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Indonesia",
    cardNumber: "4000 1234 5678 9010",
    cardExpiry: "12/28",
    cardCvc: "888",
  });

  useEffect(() => {
    if (isCheckoutOpen) {
      getCheckoutInitialDataAction().then((data) => {
        if (data.isLoggedIn && data.user) {
          setCurrentUser(data.user as AuthenticatedUser);
          const addrs = (data.savedAddresses || []) as SavedAddress[];
          setSavedAddresses(addrs);

          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setFormData({
              fullName: defaultAddr.recipientName || data.user.fullName,
              email: data.user.email,
              phone: defaultAddr.phone || data.user.phone || "",
              address: defaultAddr.streetAddress + (defaultAddr.suite ? ` ${defaultAddr.suite}` : ""),
              city: defaultAddr.city,
              postalCode: defaultAddr.postalCode,
              country: defaultAddr.country || data.user.country || "Indonesia",
              cardNumber: "4000 1234 5678 9010",
              cardExpiry: "12/28",
              cardCvc: "888",
            });
          } else {
            setSelectedAddressId("custom");
            setFormData({
              fullName: data.user.fullName,
              email: data.user.email,
              phone: data.user.phone || "",
              address: "",
              city: "",
              postalCode: "",
              country: data.user.country || "Indonesia",
              cardNumber: "4000 1234 5678 9010",
              cardExpiry: "12/28",
              cardCvc: "888",
            });
          }
        } else {
          setCurrentUser(null);
          setSavedAddresses([]);
          setSelectedAddressId("custom");
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
            country: "Indonesia",
            cardNumber: "4000 1234 5678 9010",
            cardExpiry: "12/28",
            cardCvc: "888",
          });
        }
      });
    }
  }, [isCheckoutOpen]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const fullShippingAddress = `${formData.address}, ${formData.city} ${formData.postalCode}, ${formData.country} (Tel: ${formData.phone})`;
      const res = await checkoutOrderAction({
        customerName: formData.fullName,
        customerEmail: currentUser ? currentUser.email : formData.email,
        shippingAddress: fullShippingAddress,
        currency,
      });

      setOrderComplete({
        orderNumber: res.orderNumber,
        totalAmount: res.totalAmount,
        currency: res.currency,
        customerName: res.customerName,
        customerEmail: res.customerEmail,
        shippingAddress: res.shippingAddress,
      });

      await refreshCart();
      router.refresh();
    } catch (err) {
      console.error("Order placement failed", err);
      alert("Checkout encountered an issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderComplete(null);
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[80] overflow-hidden" onWheel={(e) => e.stopPropagation()}>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 will-change-[opacity] touch-none"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ transform: "translateZ(0)", willChange: "transform", backfaceVisibility: "hidden" }}
              className="w-screen max-w-lg bg-[#0a0a0a] border-l border-[#1f1f1f] shadow-[-12px_0_36px_rgba(0,0,0,0.85)] flex flex-col text-neutral-100"
            >

              <div className="bg-[#111111] px-6 py-5 flex items-center justify-between border-b border-[#1c1c1c]">
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
                  {orderComplete ? "Order Confirmed" : "Checkout"}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1.5 text-neutral-400 hover:text-[#a7c080] transition-colors rounded-full hover:bg-white/[0.05]"
                  aria-label="Close checkout"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-8 space-y-8">
                {orderComplete ? (

                  <div className="py-6 text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#a7c080]/15 border-2 border-[#a7c080] flex items-center justify-center text-[#a7c080] shadow-[0_0_24px_rgba(167,192,128,0.25)]">
                      <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-2xl text-white">
                        Grazie, {orderComplete.customerName}
                      </h3>
                      <p className="font-serif text-sm text-neutral-400">
                        Order Reference:{" "}
                        <span className="font-mono font-semibold text-[#a7c080]">
                          {orderComplete.orderNumber}
                        </span>
                      </p>
                    </div>

                    <div className="py-5 border-t border-b border-[#1c1c1c] text-left text-xs space-y-3 font-serif">
                      <div className="flex justify-between border-b border-[#1c1c1c] pb-2">
                        <span className="text-neutral-500">Status</span>
                        <span className="text-[#a7c080] font-medium uppercase tracking-wider">
                          Atelier Processing &bull; Confirmed
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#1c1c1c] pb-2">
                        <span className="text-neutral-500">Total Paid</span>
                        <span className="text-white font-medium">
                          {formatPrice(orderComplete.totalAmount, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#1c1c1c] pb-2">
                        <span className="text-neutral-500">Account Linked</span>
                        <span className="text-white font-medium">{orderComplete.customerEmail}</span>
                      </div>
                      {orderComplete.shippingAddress && (
                        <div className="flex justify-between border-b border-[#1c1c1c] pb-2">
                          <span className="text-neutral-500">Delivery Residence</span>
                          <span className="text-neutral-300 font-light text-right max-w-[60%] truncate">
                            {orderComplete.shippingAddress}
                          </span>
                        </div>
                      )}
                      <p className="text-[11px] text-neutral-400 pt-1 leading-relaxed font-light">
                        Your bespoke packaging has been initiated at our Milano central atelier. This order is now recorded in your private client portal.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <Link
                        href="/account?tab=orders"
                        prefetch={false}
                        onClick={handleClose}
                        className="block w-full py-4 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold tracking-[0.2em] uppercase transition-colors shadow-lg shadow-[#a7c080]/10 text-center cursor-pointer"
                      >
                        VIEW IN ORDER HISTORY
                      </Link>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="w-full py-3.5 border border-[#333] hover:border-neutral-400 text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer"
                      >
                        CONTINUE EXPLORING
                      </button>
                    </div>
                  </div>
                ) : cart.length === 0 ? (

                  <div className="py-16 text-center space-y-4">
                    <p className="font-serif text-base text-neutral-400">
                      Your shopping bag is currently empty.
                    </p>
                    <Link
                      href="/category/runway-couture"
                      onClick={handleClose}
                      className="inline-block px-6 py-3 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold tracking-[0.2em] uppercase transition-colors"
                    >
                      Discover Collections
                    </Link>
                  </div>
                ) : (

                  <form id="checkout-sidebar-form" onSubmit={handleCheckoutSubmit} className="space-y-6">

                    {currentUser ? (
                      <div className="py-2.5 border-b border-[#1c1c1c] text-xs font-serif flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#a7c080]"></span>
                          <span className="text-neutral-300 text-[11px]">
                            VOYOR Privé: <strong className="text-white">{currentUser.fullName}</strong> ({currentUser.email})
                          </span>
                        </div>
                        <span className="text-[10px] text-[#a7c080] uppercase tracking-wider font-semibold font-mono">
                          AUTHENTICATED
                        </span>
                      </div>
                    ) : (
                      <div className="py-2.5 border-b border-[#1c1c1c] text-xs font-serif flex items-center justify-between">
                        <span className="text-neutral-400 text-[11px]">Hold a client account?</span>
                        <Link
                          href="/login"
                          onClick={handleClose}
                          className="text-[#a7c080] hover:underline font-semibold uppercase tracking-wider text-[11px]"
                        >
                          Sign In to link order &rarr;
                        </Link>
                      </div>
                    )}

                    <div className="py-3 border-b border-[#1c1c1c] space-y-3">
                      <div className="flex justify-between items-center text-xs font-serif text-neutral-400 border-b border-[#1c1c1c] pb-2">
                        <span>Items ({cart.length})</span>
                        <span className="text-[#a7c080] font-medium">{formatPrice(cartTotalUSD, currency)}</span>
                      </div>
                      <div className="flex gap-3 overflow-x-auto py-1">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="relative w-14 h-16 flex-shrink-0 flex items-center justify-center overflow-hidden"
                            title={`${item.product.name} (${item.quantity}x)`}
                          >
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              sizes="56px"
                              className="object-contain"
                            />
                            {item.quantity > 1 && (
                              <span className="absolute -top-1 -right-1 bg-[#a7c080] text-black text-[9px] font-bold px-1 font-mono rounded-full">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-serif text-sm uppercase tracking-wider text-[#a7c080] border-b border-[#1c1c1c] pb-2">
                        1. Client Contact
                      </h3>
                      <div className="space-y-5 text-xs">
                        <LuxuryInput
                          id="checkout-fullname"
                          label="Full Name"
                          required
                          bgClass="bg-[#0e0e0e]"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <LuxuryInput
                            id="checkout-email"
                            label="Email Address"
                            type="email"
                            required
                            disabled={!!currentUser}
                            bgClass="bg-[#0e0e0e]"
                            value={currentUser ? currentUser.email : formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                          <LuxuryInput
                            id="checkout-phone"
                            label="Phone Number"
                            type="tel"
                            required
                            bgClass="bg-[#0e0e0e]"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-serif text-sm uppercase tracking-wider text-[#a7c080] border-b border-[#1c1c1c] pb-2">
                        2. Shipping Destination
                      </h3>

                      {savedAddresses.length > 0 && (
                        <div>
                          <LuxurySelect
                            id="checkout-saved-address"
                            label="Saved Address Book"
                            bgClass="bg-[#0e0e0e]"
                            value={selectedAddressId}
                            onChange={(e) => {
                              const addrId = e.target.value;
                              setSelectedAddressId(addrId);
                              if (addrId === "custom") {
                                setFormData((prev) => ({
                                  ...prev,
                                  address: "",
                                  city: "",
                                  postalCode: "",
                                  country: currentUser?.country || "Indonesia",
                                }));
                              } else {
                                const chosen = savedAddresses.find((a) => a.id === addrId);
                                if (chosen) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    fullName: chosen.recipientName || prev.fullName,
                                    phone: chosen.phone || prev.phone,
                                    address: chosen.streetAddress + (chosen.suite ? ` ${chosen.suite}` : ""),
                                    city: chosen.city,
                                    postalCode: chosen.postalCode,
                                    country: chosen.country,
                                  }));
                                }
                              }
                            }}
                            options={[
                              ...savedAddresses.map((a) => ({
                                value: a.id,
                                label: `${a.label || "Residence"}: ${a.streetAddress}, ${a.city} (${a.recipientName})${a.isDefault ? " [Default]" : ""}`,
                              })),
                              { value: "custom", label: "+ Enter a different delivery destination" },
                            ]}
                          />
                        </div>
                      )}

                      <div className="space-y-5 text-xs">
                        <LuxuryInput
                          id="checkout-address"
                          label="Street Address"
                          required
                          bgClass="bg-[#0e0e0e]"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-5">
                          <LuxuryInput
                            id="checkout-city"
                            label="City"
                            required
                            bgClass="bg-[#0e0e0e]"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          />
                          <LuxuryInput
                            id="checkout-postal"
                            label="Postal Code"
                            required
                            bgClass="bg-[#0e0e0e]"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          />
                        </div>
                        <LuxurySelect
                          id="checkout-country"
                          label="Country / Territory"
                          required
                          bgClass="bg-[#0e0e0e]"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          options={[
                            { value: "Indonesia", label: "Indonesia" },
                            { value: "Italy", label: "Italy" },
                            { value: "United States", label: "United States" },
                            { value: "United Kingdom", label: "United Kingdom" },
                            { value: "France", label: "France" },
                            { value: "Japan", label: "Japan" },
                            { value: "United Arab Emirates", label: "United Arab Emirates" },
                            { value: "Singapore", label: "Singapore" },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-serif text-sm uppercase tracking-wider text-[#a7c080] border-b border-[#1c1c1c] pb-2">
                        3. Delivery Method
                      </h3>
                      <div className="py-3 flex items-start gap-3 border-b border-[#1c1c1c]">
                        <Truck className="w-5 h-5 text-[#a7c080] flex-shrink-0 mt-0.5" />
                        <div className="text-xs font-serif">
                          <div className="flex justify-between items-center font-medium text-white">
                            <span>White-Glove Courier</span>
                            <span className="uppercase text-[#a7c080]">Complimentary</span>
                          </div>
                          <p className="text-neutral-400 mt-1">
                            Direct dispatch from atelier in secured signature packaging. Tamper-evident seal and tracked transit.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-serif text-sm uppercase tracking-wider text-[#a7c080] border-b border-[#1c1c1c] pb-2">
                        4. Payment
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-xs font-serif">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("card")}
                          className={`p-3 border text-left transition-colors flex items-center gap-2 cursor-pointer ${
                            paymentMethod === "card"
                              ? "border-[#a7c080] text-[#a7c080] font-medium bg-transparent"
                              : "border-[#262626] text-neutral-400 hover:border-[#3a3a3a] bg-transparent"
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Credit / Black Card</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("private")}
                          className={`p-3 border text-left transition-colors flex items-center gap-2 cursor-pointer ${
                            paymentMethod === "private"
                              ? "border-[#a7c080] text-[#a7c080] font-medium bg-transparent"
                              : "border-[#262626] text-neutral-400 hover:border-[#3a3a3a] bg-transparent"
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Concierge Invoice</span>
                        </button>
                      </div>

                      {paymentMethod === "card" && (
                        <div className="pt-4 border-t border-[#1c1c1c] space-y-5 text-xs font-serif">
                          <LuxuryInput
                            id="checkout-card-number"
                            label="Card Number"
                            bgClass="bg-[#0a0a0a]"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          />
                          <div className="grid grid-cols-2 gap-5">
                            <LuxuryInput
                              id="checkout-card-expiry"
                              label="Expires (MM/YY)"
                              bgClass="bg-[#0a0a0a]"
                              value={formData.cardExpiry}
                              onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                            />
                            <LuxuryInput
                              id="checkout-card-cvc"
                              label="Security CVC"
                              bgClass="bg-[#0a0a0a]"
                              value={formData.cardCvc}
                              onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {!orderComplete && cart.length > 0 && (
                <div className="p-6 bg-[#0e0e0e] border-t border-[#1c1c1c] space-y-4">
                  <div className="space-y-1.5 text-xs font-serif">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span className="text-white">{formatPrice(cartTotalUSD, currency)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Delivery</span>
                      <span className="uppercase text-[#a7c080]">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Duties & Taxes</span>
                      <span className="uppercase text-[#a7c080]">Included</span>
                    </div>
                    <div className="flex justify-between text-base font-normal pt-2 border-t border-[#1c1c1c] text-white">
                      <span>Estimated Total</span>
                      <span className="font-semibold text-[#a7c080]">{formatPrice(cartTotalUSD, currency)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    form="checkout-sidebar-form"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#a7c080] hover:bg-[#8da866] text-black text-xs font-bold tracking-[0.2em] uppercase transition-colors disabled:opacity-50 shadow-lg shadow-[#a7c080]/10"
                  >
                    {isSubmitting ? "TRANSMITTING TO ATELIER..." : "PLACE ORDER"}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
