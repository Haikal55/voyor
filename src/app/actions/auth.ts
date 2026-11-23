"use server";

import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";
import { users, userSessions } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  executeDummyHashComputation,
  generateSessionToken,
  hashSessionToken,
  checkAndIncrementRateLimit,
  resetRateLimit,
  validateAndNormalizeEmail,
  validatePasswordStrength,
} from "@/lib/auth/security";

const AUTH_COOKIE_NAME = "voyor_auth_token";
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return headerList.get("x-real-ip") || headerList.get("cf-connecting-ip") || "127.0.0.1";
}

export async function loginAction(formData: {
  email: unknown;
  password: unknown;
}) {
  const clientIp = await getClientIp();

  const ipLimit = checkAndIncrementRateLimit(`login_ip:${clientIp}`, 10, 15 * 60 * 1000);
  if (!ipLimit.allowed) {
    const minutes = Math.ceil(ipLimit.remainingSeconds / 60);
    return {
      success: false,
      error: `Too many login attempts from your network. Please wait ${minutes} minute${minutes > 1 ? "s" : ""} before trying again.`,
    };
  }

  const { valid: emailValid, normalized: email } = validateAndNormalizeEmail(formData.email);
  if (!emailValid || typeof formData.password !== "string" || formData.password.length === 0) {

    await executeDummyHashComputation(typeof formData.password === "string" ? formData.password : "dummy");
    return {
      success: false,
      error: "Invalid email address or password.",
    };
  }

  const emailLimit = checkAndIncrementRateLimit(`login_email:${email}`, 5, 15 * 60 * 1000);
  if (!emailLimit.allowed) {
    const minutes = Math.ceil(emailLimit.remainingSeconds / 60);
    return {
      success: false,
      error: `Too many failed attempts for this account. For security, please wait ${minutes} minute${minutes > 1 ? "s" : ""} before trying again.`,
    };
  }

  const user = db.select().from(users).where(eq(users.email, email)).get();

  if (!user) {

    await executeDummyHashComputation(formData.password);
    return {
      success: false,
      error: "Invalid email address or password.",
    };
  }

  const now = Date.now();
  if (user.lockoutUntil && user.lockoutUntil > now) {
    const minutes = Math.ceil((user.lockoutUntil - now) / 60000);
    return {
      success: false,
      error: `Account temporarily locked due to multiple failed login attempts. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`,
    };
  }

  const isMatch = await verifyPassword(formData.password, user.passwordHash);

  if (!isMatch) {
    const failedAttempts = (user.failedAttempts ?? 0) + 1;
    let lockoutUntil: number | null = null;

    if (failedAttempts >= 5) {
      lockoutUntil = now + 15 * 60 * 1000;
    }

    db.update(users)
      .set({
        failedAttempts,
        lockoutUntil,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .run();

    return {
      success: false,
      error: "Invalid email address or password.",
    };
  }

  db.update(users)
    .set({
      failedAttempts: 0,
      lockoutUntil: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .run();

  resetRateLimit(`login_email:${email}`);
  resetRateLimit(`login_ip:${clientIp}`);

  const { rawToken, tokenHash } = generateSessionToken();
  const expiresAt = new Date(now + SESSION_LIFETIME_MS);
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "unknown";

  db.insert(userSessions)
    .values({
      id: `sess_${Date.now()}_${rawToken.substring(0, 8)}`,
      userId: user.id,
      sessionTokenHash: tokenHash,
      ipAddress: clientIp,
      userAgent: userAgent.substring(0, 255),
      expiresAt,
      createdAt: new Date(),
    })
    .run();

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(SESSION_LIFETIME_MS / 1000),
  });

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.title,
      role: user.role,
    },
  };
}

export async function registerAction(data: {
  title?: unknown;
  firstName: unknown;
  lastName: unknown;
  email: unknown;
  password: unknown;
  confirmPassword: unknown;
  agreeTerms: unknown;
}) {
  const clientIp = await getClientIp();

  const regLimit = checkAndIncrementRateLimit(`reg_ip:${clientIp}`, 5, 60 * 60 * 1000);
  if (!regLimit.allowed) {
    return {
      success: false,
      error: "Registration request threshold reached. Please try again later.",
    };
  }

  if (data.agreeTerms !== true) {
    return {
      success: false,
      error: "You must accept the Terms and Conditions and Privacy Policy to create an account.",
    };
  }

  if (
    typeof data.firstName !== "string" ||
    data.firstName.trim().length < 2 ||
    data.firstName.trim().length > 50 ||
    typeof data.lastName !== "string" ||
    data.lastName.trim().length < 2 ||
    data.lastName.trim().length > 50
  ) {
    return {
      success: false,
      error: "Please enter a valid first and last name (between 2 and 50 characters).",
    };
  }

  const validTitles = ["Mr.", "Mrs.", "Prefer not to say"];
  const title = typeof data.title === "string" && validTitles.includes(data.title) ? data.title : "Mr.";

  const { valid: emailValid, normalized: email } = validateAndNormalizeEmail(data.email);
  if (!emailValid) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    };
  }

  const strength = validatePasswordStrength(data.password);
  if (!strength.valid) {
    return {
      success: false,
      error: strength.error || "Password does not meet security requirements.",
    };
  }

  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      error: "Passwords do not match.",
    };
  }

  const existingUser = db.select().from(users).where(eq(users.email, email)).get();
  if (existingUser) {
    return {
      success: false,
      error: "An account with this email address already exists. Please sign in or use another email.",
    };
  }

  const passwordHash = await hashPassword(data.password as string);
  const now = new Date();
  const userId = `usr_${Date.now()}_${generateSessionToken().rawToken.substring(0, 6)}`;

  db.insert(users)
    .values({
      id: userId,
      email,
      passwordHash,
      title,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      country: "Indonesia",
      role: "client",
      failedAttempts: 0,
      createdAt: now,
      updatedAt: now,
    })
    .run();

  const { rawToken, tokenHash } = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "unknown";

  db.insert(userSessions)
    .values({
      id: `sess_${Date.now()}_${rawToken.substring(0, 8)}`,
      userId,
      sessionTokenHash: tokenHash,
      ipAddress: clientIp,
      userAgent: userAgent.substring(0, 255),
      expiresAt,
      createdAt: now,
    })
    .run();

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(SESSION_LIFETIME_MS / 1000),
  });

  return {
    success: true,
    user: {
      id: userId,
      email,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      title,
      role: "client",
    },
  };
}

export async function getCurrentUserAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const now = new Date();

  const session = db
    .select()
    .from(userSessions)
    .where(
      and(
        eq(userSessions.sessionTokenHash, tokenHash),
        gt(userSessions.expiresAt, now)
      )
    )
    .get();

  if (!session) {

    cookieStore.delete(AUTH_COOKIE_NAME);
    return null;
  }

  const user = db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      title: users.title,
      country: users.country,
      phone: users.phone,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .get();

  if (!user) {
    cookieStore.delete(AUTH_COOKIE_NAME);
    return null;
  }

  return user;
}

export async function updateUserProfileAction(data: {
  title: string;
  firstName: string;
  lastName: string;
  country: string;
  phone?: string;
}) {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error: "Authentication required" };

  if (!data.firstName?.trim() || !data.lastName?.trim()) {
    return { success: false, error: "First and last name are required." };
  }

  const now = new Date();
  db.update(users)
    .set({
      title: data.title?.trim() || "Mr.",
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      country: data.country?.trim() || "Italy",
      phone: data.phone?.trim() || null,
      updatedAt: now,
    })
    .where(eq(users.id, user.id))
    .run();

  return {
    success: true,
    user: {
      ...user,
      title: data.title?.trim() || "Mr.",
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      country: data.country?.trim() || "Italy",
      phone: data.phone?.trim() || null,
    },
  };
}

export async function updateUserPasswordAction(data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error: "Authentication required" };

  if (!data.currentPassword || !data.newPassword || !data.confirmNewPassword) {
    return { success: false, error: "Please provide all password fields." };
  }

  if (data.newPassword !== data.confirmNewPassword) {
    return { success: false, error: "New passwords do not match." };
  }

  const strength = validatePasswordStrength(data.newPassword);
  if (!strength.valid) {
    return { success: false, error: strength.error };
  }

  const dbUser = db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, user.id))
    .get();

  if (!dbUser) return { success: false, error: "User not found" };

  const validCurrent = await verifyPassword(data.currentPassword, dbUser.passwordHash);
  if (!validCurrent) {
    return { success: false, error: "Current password is incorrect." };
  }

  const newHash = await hashPassword(data.newPassword);
  db.update(users)
    .set({
      passwordHash: newHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .run();

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = hashSessionToken(token);
    db.delete(userSessions).where(eq(userSessions.sessionTokenHash, tokenHash)).run();
    cookieStore.delete(AUTH_COOKIE_NAME);
  }

  return { success: true };
}
