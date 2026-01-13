/// <reference types="node" />
import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

const ALGORITHM = process.env.ENCRYPTION_ALGO as string;
const IV_LENGTH = 12;
const MASTER_KEY_HEX = process.env.MASTER_KEY;

// --- validate key ---
if (!MASTER_KEY_HEX) {
  throw new Error("MASTER_KEY env variable must be set");
}

if (!ALGORITHM) {
  throw new Error("ENCRYPTION_ALGO env variable must be set");
}

const MASTER_KEY = Buffer.from(MASTER_KEY_HEX, "hex");

if (MASTER_KEY.length !== 32) {
  throw new Error("MASTER_KEY must be greater than 32 bytes");
}

/**
 * Encrypts plaintext using ALGO
 * @param plaintext - The text to encrypt
 * @returns Encrypted payload in format: iv.tag.ciphertext
 */
export function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, MASTER_KEY, iv) as any;

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  // format: iv | tag | ciphertext
  return [
    iv.toString("base64"),
    tag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(".");
}

/**
 * Decrypts an encrypted payload
 * @param payload - Encrypted string in format: iv.tag.ciphertext
 * @returns Decrypted plaintext
 */
export function decrypt(payload: string): string {
  const [ivB64, tagB64, ctB64] = payload.split(".");

  if (!ivB64 || !tagB64 || !ctB64) {
    throw new Error("Invalid encrypted payload format");
  }

  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(ctB64, "base64");

  const decipher = createDecipheriv(ALGORITHM, MASTER_KEY, iv) as any;
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
