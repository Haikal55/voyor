import crypto from "crypto";
import { db } from "../db";
import { authRateLimits } from "../db/schema";
import { eq } from "drizzle-orm";

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;

const DUMMY_SALT = "a7c080f5f4f008080811111122222233";
let DUMMY_HASH_HEX = "";
crypto.scrypt("VoyorMaisonDummyTimingPassword2026!", DUMMY_SALT, SCRYPT_KEYLEN, {
  N: SCRYPT_N,
  r: SCRYPT_R,
  p: SCRYPT_P,
}, (err, derivedKey) => {
  if (!err && derivedKey) {
    DUMMY_HASH_HEX = derivedKey.toString("hex");
  }
});

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(
      password,
      salt,
      SCRYPT_KEYLEN,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${derivedKey.toString("hex")}`);
      }
    );
  });
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parts = storedHash.split("$");
      if (parts.length !== 6 || parts[0] !== "scrypt") {
        return resolve(false);
      }

      const N = parseInt(parts[1], 10);
      const r = parseInt(parts[2], 10);
      const p = parseInt(parts[3], 10);
      const salt = parts[4];
      const expectedKeyHex = parts[5];
      const expectedBuffer = Buffer.from(expectedKeyHex, "hex");

      crypto.scrypt(
        password,
        salt,
        expectedBuffer.length,
        { N, r, p },
        (err, derivedKey) => {
          if (err || !derivedKey) {
            return resolve(false);
          }
          if (derivedKey.length !== expectedBuffer.length) {
            return resolve(false);
          }
          const matches = crypto.timingSafeEqual(derivedKey, expectedBuffer);
          resolve(matches);
        }
      );
    } catch {
      resolve(false);
    }
  });
}

export async function executeDummyHashComputation(password: string): Promise<void> {
  return new Promise((resolve) => {
    crypto.scrypt(
      password,
      DUMMY_SALT,
      SCRYPT_KEYLEN,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
      () => resolve()
    );
  });
}

export function generateSessionToken(): { rawToken: string; tokenHash: string } {

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, tokenHash };
}

export function hashSessionToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function checkAndIncrementRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remainingSeconds: number } {
  const now = Date.now();
  const existing = db
    .select()
    .from(authRateLimits)
    .where(eq(authRateLimits.key, key))
    .get();

  if (!existing) {
    db.insert(authRateLimits)
      .values({
        id: `rl_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
        key,
        attempts: 1,
        firstAttemptAt: now,
        lastAttemptAt: now,
      })
      .run();
    return { allowed: true, remainingSeconds: 0 };
  }

  if (now - existing.firstAttemptAt > windowMs) {
    db.update(authRateLimits)
      .set({
        attempts: 1,
        firstAttemptAt: now,
        lastAttemptAt: now,
      })
      .where(eq(authRateLimits.key, key))
      .run();
    return { allowed: true, remainingSeconds: 0 };
  }

  const updatedAttempts = (existing.attempts ?? 0) + 1;
  db.update(authRateLimits)
    .set({
      attempts: updatedAttempts,
      lastAttemptAt: now,
    })
    .where(eq(authRateLimits.key, key))
    .run();

  if (updatedAttempts > maxAttempts) {
    const remainingMs = windowMs - (now - existing.firstAttemptAt);
    return {
      allowed: false,
      remainingSeconds: Math.ceil(remainingMs / 1000),
    };
  }

  return { allowed: true, remainingSeconds: 0 };
}

export function resetRateLimit(key: string): void {
  db.delete(authRateLimits).where(eq(authRateLimits.key, key)).run();
}

export function validateAndNormalizeEmail(email: unknown): { valid: boolean; normalized: string } {
  if (typeof email !== "string") return { valid: false, normalized: "" };
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length > 128 || trimmed.length < 5) return { valid: false, normalized: "" };

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return {
    valid: emailRegex.test(trimmed),
    normalized: trimmed,
  };
}

export function validatePasswordStrength(password: unknown): { valid: boolean; error?: string } {
  if (typeof password !== "string") {
    return { valid: false, error: "Password must be provided." };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must contain at least 8 characters." };
  }
  if (password.length > 128) {
    return { valid: false, error: "Password must not exceed 128 characters." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must include at least one lowercase letter." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must include at least one uppercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must include at least one numerical digit." };
  }
  return { valid: true };
}
