import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM recommended

// Derive a 32-byte key from an arbitrary-length secret using SHA-256
function deriveKey(secret: string): Buffer {
  return createHash('sha256').update(secret).digest();
}

export function encryptToken(token: string, secret: string): string {
  const key = deriveKey(secret);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Encode as base64url: iv|tag|ciphertext
  return Buffer.concat([iv, tag, ciphertext]).toString('base64url');
}

export function decryptToken(payload: string, secret: string): string {
  const buf = Buffer.from(payload, 'base64url');
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = buf.subarray(IV_LENGTH + 16);
  const key = deriveKey(secret);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

export const AUTH_COOKIE_NAME = '__Host-customer';

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: true, // required by __Host-
    sameSite: 'strict' as const,
    path: '/', // required by __Host-
    // no Domain attribute for __Host-
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}

// Server-side helper: returns decrypted Magento token or null
export function getCustomerToken(): string | null {
  const store = cookies();
  const enc = store.get(AUTH_COOKIE_NAME)?.value;
  if (!enc) return null;
  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret) return null;
  try {
    return decryptToken(enc, secret);
  } catch (_) {
    return null;
  }
}

// Helper to clear the auth cookie on a response
export function clearAuthCookie(res: NextResponse) {
  const opts = getAuthCookieOptions();
  res.cookies.set(AUTH_COOKIE_NAME, '', { ...opts, maxAge: 0 });
}
