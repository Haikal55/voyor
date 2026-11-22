"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { cartItems, orders, productVariants, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getCartItemsDetailed } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

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
    maxAge: 60 * 60 * 24 * 30, // 30 days
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

  // Check if variant already in cart for this session
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

  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.product.basePrice + item.variant.priceDelta) * item.quantity;
  }, 0);

  const orderNumber = `VY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  db.insert(orders)
    .values({
      id: `ord_${Date.now()}`,
      orderNumber,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      totalAmount,
      currency: data.currency,
      status: "confirmed",
      shippingAddress: data.shippingAddress,
      itemsJson: JSON.stringify(items),
    })
    .run();

  // Clear cart
  db.delete(cartItems).where(eq(cartItems.sessionId, sessionId)).run();

  revalidatePath("/");
  return {
    success: true,
    orderNumber,
    totalAmount,
    currency: data.currency,
    customerName: data.customerName,
  };
}
