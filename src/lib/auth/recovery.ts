import "server-only";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

// 12 random words = 128 bits of entropy
export function generateRecoveryPhrase() {
  return generateMnemonic(wordlist, 128);
}

/* Makes casing and spacing differences irrelevant when the user is typing it back */
export function normalizeRecoveryPhrase(phrase: string) {
  return phrase.trim().toLowerCase().split(/\s+/).join(" ");
}

function getRecoverySecretKey() {
  const rawRecoveryKey = process.env.RECOVERY_ENCRYPTION_KEY!;
  if (!rawRecoveryKey) throw new Error("RECOVERY_ENCRYPTION_KEY is not set");

  const key = Buffer.from(rawRecoveryKey, "base64");

  if (key.length !== 32)
    throw new Error(
      "RECOVERY_ENCRYPTION_KEY must be 32 bytes, base-64 encoded",
    );

  return key;
}

/* AES-256-GCM. The user id is bound in as additional data,
 * so a ciphertext copied onto another user's row fails to decrypt.
 * Output: base64(iv[12] | authTag[16] | ciphertext)
 */

export function encryptRecoveryPhrase(phrase: string, userId: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getRecoverySecretKey(), iv);

  cipher.setAAD(Buffer.from(userId));
  const cipherText = Buffer.concat([
    cipher.update(normalizeRecoveryPhrase(phrase), "utf-8"),
    cipher.final(),
  ]);

  return Buffer.concat([iv, cipher.getAuthTag(), cipherText]).toString(
    "base64",
  );
}

export function decryptRecoveryPhrase(payload: string, userId: string) {
  const buff = Buffer.from(payload, "base64");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    getRecoverySecretKey(),
    buff.subarray(0, 12),
  );
  decipher.setAAD(Buffer.from(userId));
  decipher.setAuthTag(buff.subarray(12, 28));

  return Buffer.concat([
    decipher.update(buff.subarray(28)),
    decipher.final(),
  ]).toString("utf-8");
}

/* For the password reset flow: constant time comparison against the phrase */

export function verifyRecoverPhrase(
  input: string,
  payload: string,
  userId: string,
) {
  const a = Buffer.from(normalizeRecoveryPhrase(input));
  const b = Buffer.from(decryptRecoveryPhrase(payload, userId));

  return a.length === b.length && timingSafeEqual(a, b);
}
