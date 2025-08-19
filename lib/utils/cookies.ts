import "server-only";

import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto';
import { ALGO, IV_LENGTH } from '@/lib/auth/token';

// 32-byte key from an arbitrary-length secret using SHA-256
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

export function decryptToken(encryptedCookie: string, secret: string): string {
  const buf = Buffer.from(encryptedCookie, 'base64url');
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = buf.subarray(IV_LENGTH + 16);
  const key = deriveKey(secret);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}