"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { cartItems, orders, productVariants, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getCartItemsDetailed } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";
import { getCurrentUserAction } from "@/app/actions/auth";
import { getUserAddressesAction } from "@/app/actions/account";

const SESSION_COOKIE_NAME = "voyor_cart_session";

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (existing) return existing;

  const newId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  cookieStore.set(SESSION_COOKIE_NAME, newId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return newId;
}

export async function getCartAction() {
  const sessionId = await getOrCreateSessionId();
  const items = getCartItemsDetailed(sessionId);
  return { sessionId, items };
}

export async function addToCartAction(variantId: string, quantity = 1) {
  const sessionId = await getOrCreateSessionId();

  const existing = db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.sessionId, sessionId), eq(cartItems.variantId, variantId)))
    .get();

  if (existing) {
    db.update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id))
      .run();
  } else {
    const newId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    db.insert(cartItems)
      .values({
        id: newId,
        sessionId,
        variantId,
        quantity,
      })
      .run();
  }

  revalidatePath("/");
  return getCartItemsDetailed(sessionId);
}

export async function updateCartItemQuantityAction(cartItemId: string, quantity: number) {
  const sessionId = await getOrCreateSessionId();

  if (quantity <= 0) {
    db.delete(cartItems).where(eq(cartItems.id, cartItemId)).run();
  } else {
    db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, cartItemId))
      .run();
  }

  revalidatePath("/");
  return getCartItemsDetailed(sessionId);
}

export async function removeCartItemAction(cartItemId: string) {
  const sessionId = await getOrCreateSessionId();
  db.delete(cartItems).where(eq(cartItems.id, cartItemId)).run();
  revalidatePath("/");
  return getCartItemsDetailed(sessionId);
}

export async function getCheckoutInitialDataAction() {
  const user = await getCurrentUserAction();
  if (!user) {
    return {
      isLoggedIn: false,
      user: null,
      savedAddresses: [],
    };
  }

  const addresses = await getUserAddressesAction();

  return {
    isLoggedIn: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.title ? user.title + " " : ""}${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone || "",
      country: user.country || "Indonesia",
    },
    savedAddresses: addresses || [],
  };
}

export async function checkoutOrderAction(data: {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  currency: string;
}) {
  const sessionId = await getOrCreateSessionId();
  const items = getCartItemsDetailed(sessionId);

  if (items.length === 0) {
    throw new Error("Bag is empty");
  }

  const currentUser = await getCurrentUserAction();
  const resolvedEmail = currentUser
    ? currentUser.email.toLowerCase().trim()
    : (data.customerEmail ? data.customerEmail.toLowerCase().trim() : "client@voyor.com");

  const resolvedName = (data.customerName && data.customerName.trim().length > 0)
    ? data.customerName.trim()
    : (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Client");

  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.product.basePrice + item.variant.priceDelta) * item.quantity;
  }, 0);

  const orderNumber = `VY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  db.insert(orders)
    .values({
      id: `ord_${Date.now()}`,
      orderNumber,
      customerEmail: resolvedEmail,
      customerName: resolvedName,
      totalAmount,
      currency: data.currency,
      status: "confirmed",
      shippingAddress: data.shippingAddress,
      itemsJson: JSON.stringify(items),
    })
    .run();

  db.delete(cartItems).where(eq(cartItems.sessionId, sessionId)).run();

  revalidatePath("/");
  revalidatePath("/cart");
  revalidatePath("/account");

  return {
    success: true,
    orderNumber,
    totalAmount,
    currency: data.currency,
    customerName: resolvedName,
    customerEmail: resolvedEmail,
    shippingAddress: data.shippingAddress,
  };
}
