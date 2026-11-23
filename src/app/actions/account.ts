"use server";

import { db } from "@/lib/db";
import {
  userWishlists,
  userAddresses,
  userAppointments,
  products,
  productImages,
  productVariants,
} from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentUserAction } from "./auth";
import { revalidatePath } from "next/cache";

export async function getUserWishlistAction() {
  const user = await getCurrentUserAction();
  if (!user) return [];

  const wishlistRows = db
    .select({
      id: userWishlists.id,
      productId: userWishlists.productId,
      createdAt: userWishlists.createdAt,
      product: products,
    })
    .from(userWishlists)
    .innerJoin(products, eq(userWishlists.productId, products.id))
    .where(eq(userWishlists.userId, user.id))
    .orderBy(desc(userWishlists.createdAt))
    .all();

  return wishlistRows.map((row) => {
    const images = db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, row.product.id))
      .orderBy(productImages.displayOrder)
      .all();

    const variants = db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, row.product.id))
      .all();

    return {
      id: row.id,
      productId: row.productId,
      createdAt: row.createdAt,
      product: {
        ...row.product,
        images,
        variants,
      },
    };
  });
}

export async function toggleWishlistAction(productId: string) {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error: "Authentication required" };

  const existing = db
    .select()
    .from(userWishlists)
    .where(and(eq(userWishlists.userId, user.id), eq(userWishlists.productId, productId)))
    .get();

  if (existing) {
    db.delete(userWishlists)
      .where(eq(userWishlists.id, existing.id))
      .run();
    revalidatePath("/account");
    return { success: true, wishlisted: false };
  } else {
    const id = `wsh_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    db.insert(userWishlists)
      .values({
        id,
        userId: user.id,
        productId,
        createdAt: new Date(),
      })
      .run();
    revalidatePath("/account");
    return { success: true, wishlisted: true };
  }
}

export async function removeFromWishlistAction(productId: string) {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error: "Authentication required" };

  db.delete(userWishlists)
    .where(and(eq(userWishlists.userId, user.id), eq(userWishlists.productId, productId)))
    .run();

  revalidatePath("/account");
  return { success: true };
}

export async function getUserAddressesAction() {
  const user = await getCurrentUserAction();
  if (!user) return [];

  return db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.userId, user.id))
    .orderBy(desc(userAddresses.isDefault), desc(userAddresses.createdAt))
    .all();
}

export interface AddressInput {
  label?: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  suite?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export async function addUserAddressAction(data: AddressInput) {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error: "Authentication required" };

  if (!data.recipientName || !data.streetAddress || !data.city || !data.country) {
    return { success: false, error: "Please fill in all mandatory address fields." };
  }

  if (data.isDefault) {
    db.update(userAddresses)
      .set({ isDefault: false })
      .where(eq(userAddresses.userId, user.id))
      .run();
  }

  const id = `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  db.insert(userAddresses)
    .values({
      id,
      userId: user.id,
      label: data.label?.trim() || "Residence",
      recipientName: data.recipientName.trim(),
      phone: data.phone.trim(),
      streetAddress: data.streetAddress.trim(),
      suite: data.suite?.trim() || null,
      city: data.city.trim(),
      postalCode: data.postalCode.trim(),
      country: data.country.trim(),
      isDefault: !!data.isDefault,
      createdAt: new Date(),
    })
    .run();

  revalidatePath("/account");
  return { success: true, id };
}

export async function deleteUserAddressAction(addressId: string) {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error: "Authentication required" };

  db.delete(userAddresses)
    .where(and(eq(userAddresses.id, addressId), eq(userAddresses.userId, user.id)))
    .run();

  revalidatePath("/account");
  return { success: true };
}

export async function setDefaultAddressAction(addressId: string) {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error: "Authentication required" };

  db.update(userAddresses)
    .set({ isDefault: false })
    .where(eq(userAddresses.userId, user.id))
    .run();

  db.update(userAddresses)
    .set({ isDefault: true })
    .where(and(eq(userAddresses.id, addressId), eq(userAddresses.userId, user.id)))
    .run();

  revalidatePath("/account");
  return { success: true };
}

export async function getUserAppointmentsAction() {
  const user = await getCurrentUserAction();
  if (!user) return [];

  return db
    .select()
    .from(userAppointments)
    .where(eq(userAppointments.userId, user.id))
    .orderBy(desc(userAppointments.createdAt))
    .all();
}

export interface AppointmentInput {
  boutiqueName: string;
  boutiqueCity: string;
  boutiqueAddress: string;
  appointmentType: "in_boutique" | "video_call" | "phone_call";
  serviceType?: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
}

export async function createFastAppointmentAction(data: AppointmentInput) {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error: "Authentication required" };

  if (!data.boutiqueName || !data.date || !data.timeSlot) {
    return { success: false, error: "Please select boutique, date, and preferred time slot." };
  }

  const id = `appt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const referenceCode = `APPT-VYR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  db.insert(userAppointments)
    .values({
      id,
      userId: user.id,
      referenceCode,
      boutiqueName: data.boutiqueName,
      boutiqueCity: data.boutiqueCity,
      boutiqueAddress: data.boutiqueAddress,
      appointmentType: data.appointmentType,
      serviceType: data.serviceType || "Haute Couture Salon Styling",
      date: data.date,
      timeSlot: data.timeSlot,
      clientName: data.clientName || `${user.title || "Mr."} ${user.firstName} ${user.lastName}`,
      clientEmail: data.clientEmail || user.email,
      clientPhone: data.clientPhone,
      notes: data.notes?.trim() || null,
      status: "Confirmed",
      createdAt: new Date(),
    })
    .run();

  revalidatePath("/account");
  return { success: true, referenceCode };
}

export async function cancelAppointmentAction(appointmentId: string) {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error: "Authentication required" };

  db.update(userAppointments)
    .set({ status: "Cancelled" })
    .where(and(eq(userAppointments.id, appointmentId), eq(userAppointments.userId, user.id)))
    .run();

  revalidatePath("/account");
  return { success: true };
}
