"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CurrencyCode,
  CartItemDetailed,
  CountryConfig,
  COUNTRIES,
  detectUserCountry,
} from "@/lib/types";
import {
  getCartAction,
  addToCartAction,
  updateCartItemQuantityAction,
  removeCartItemAction,
} from "@/app/actions/cart";

interface LuxuryContextType {
  country: CountryConfig;
  setCountry: (c: CountryConfig) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  cart: CartItemDetailed[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCookieModalOpen: boolean;
  setIsCookieModalOpen: (open: boolean) => void;
  isLoadingCart: boolean;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
  cartTotalUSD: number;
}

const LuxuryContext = createContext<LuxuryContextType | undefined>(undefined);

export function LuxuryProvider({
  children,
  initialCart = [],
}: {
  children: React.ReactNode;
  initialCart?: CartItemDetailed[];
}) {
  const [country, setCountryState] = useState<CountryConfig>(COUNTRIES.ID);
  const [currency, setCurrencyState] = useState<CurrencyCode>("IDR");
  const [cart, setCart] = useState<CartItemDetailed[]>(initialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  useEffect(() => {
    const detected = detectUserCountry();
    try {
      const savedCountryCode = localStorage.getItem("voyor_country");
      if (savedCountryCode && COUNTRIES[savedCountryCode]) {
        setCountryState(COUNTRIES[savedCountryCode]);
        setCurrencyState(COUNTRIES[savedCountryCode].currency);
      } else {
        setCountryState(detected);
        setCurrencyState(detected.currency);
      }
    } catch {
      setCountryState(detected);
      setCurrencyState(detected.currency);
    }
  }, []);

  const setCountry = (c: CountryConfig) => {
    setCountryState(c);
    setCurrencyState(c.currency);
    try {
      localStorage.setItem("voyor_country", c.code);
      localStorage.setItem("voyor_currency", c.currency);
    } catch {}
  };

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    const matched = Object.values(COUNTRIES).find((item) => item.currency === c);
    if (matched) {
      setCountryState(matched);
      try {
        localStorage.setItem("voyor_country", matched.code);
      } catch {}
    }
    try {
      localStorage.setItem("voyor_currency", c);
    } catch {}
  };

  const refreshCart = async () => {
    try {
      setIsLoadingCart(true);
      const res = await getCartAction();
      setCart(res.items);
    } catch (e) {
      console.error("Failed to refresh cart", e);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const addToCart = async (variantId: string, quantity = 1) => {
    try {
      setIsLoadingCart(true);
      const updated = await addToCartAction(variantId, quantity);
      setCart(updated);
      setIsCartOpen(true);
    } catch (e) {
      console.error("Failed to add to bag", e);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
      );
    }

    try {
      const updated = await updateCartItemQuantityAction(cartItemId, quantity);
      setCart(updated);
    } catch (e) {
      console.error("Failed to update quantity", e);
      refreshCart();
    }
  };

  const removeItem = async (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));

    try {
      const updated = await removeCartItemAction(cartItemId);
      setCart(updated);
    } catch (e) {
      console.error("Failed to remove item", e);
      refreshCart();
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotalUSD = cart.reduce(
    (total, item) => total + (item.product.basePrice + item.variant.priceDelta) * item.quantity,
    0
  );

  return (
    <LuxuryContext.Provider
      value={{
        country,
        setCountry,
        currency,
        setCurrency,
        cart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isMenuOpen,
        setIsMenuOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCookieModalOpen,
        setIsCookieModalOpen,
        isLoadingCart,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart,
        cartCount,
        cartTotalUSD,
      }}
    >
      {children}
    </LuxuryContext.Provider>
  );
}

export function useLuxury() {
  const context = useContext(LuxuryContext);
  if (!context) {
    throw new Error("useLuxury must be used within a LuxuryProvider");
  }
  return context;
}
