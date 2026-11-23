import type { Metadata } from "next";
import { getCurrentUserAction } from "../actions/auth";
import {
  getUserWishlistAction,
  getUserAddressesAction,
  getUserAppointmentsAction,
} from "../actions/account";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { AccountClientPage } from "./AccountClientPage";

export const metadata: Metadata = {
  title: "My Account | VOYOR Official Online Boutique",
  description: "View your orders, wishlist, saved addresses, and appointments at VOYOR Milano.",
};

export default async function AccountPage() {
  const user = await getCurrentUserAction();

  if (!user) {
    redirect("/login");
  }

  const clientOrders = db
    .select()
    .from(orders)
    .where(sql`lower(${orders.customerEmail}) = lower(${user.email})`)
    .orderBy(desc(orders.createdAt))
    .all();

  const [wishlist, addresses, appointments] = await Promise.all([
    getUserWishlistAction(),
    getUserAddressesAction(),
    getUserAppointmentsAction(),
  ]);

  return (
    <AccountClientPage
      user={user}
      orders={clientOrders}
      initialWishlist={wishlist}
      initialAddresses={addresses}
      initialAppointments={appointments}
    />
  );
}
