import crypto from "crypto";

const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "your-32-character-key"; // Must be 32 characters
if (ENCRYPTION_KEY.length !== 32) {
  throw new Error("Encryption key must be 32 characters long.");
}
const keyBuffer = Buffer.from(ENCRYPTION_KEY, "utf-8");
const IV_LENGTH = 16;
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  //@ts-ignore
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
  const encrypted = Buffer.concat([
    //@ts-ignore
    cipher.update(text, "utf8"),
    //@ts-ignore
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encryptedData: string): string {
  const [ivHex, encryptedHex] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  //@ts-ignore
  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
  const decrypted = Buffer.concat([
    //@ts-ignore
    decipher.update(encryptedText),
    //@ts-ignore
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
