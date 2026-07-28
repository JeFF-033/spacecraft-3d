import crypto from "crypto";

// Base32 Alphabet used by Google Authenticator
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Decode(base32: string): Buffer {
  const cleaned = base32.toUpperCase().replace(/=+$/, "");
  let bits = "";
  for (let i = 0; i < cleaned.length; i++) {
    const idx = ALPHABET.indexOf(cleaned[i]);
    if (idx === -1) {
      throw new Error("Geçərsiz Base32 simvolu.");
    }
    bits += idx.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

/**
 * Google Authenticator üçün təsadüfi 16 simvollu Base32 gizli açar yaradır.
 */
export function generateTOTPSecret(): string {
  let secret = "";
  const bytes = crypto.randomBytes(10); // 80 bits of security
  for (let i = 0; i < bytes.length; i++) {
    secret += ALPHABET[bytes[i] % 32];
  }
  return secret;
}

/**
 * Gizli açar və vaxt offsetinə görə 6 rəqəmli TOTP kodu yaradır (RFC 6238).
 */
export function getTOTPToken(secret: string, timeOffset = 0): string {
  const key = base32Decode(secret);
  
  // 30 saniyəlik zaman addımı
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / 30) + timeOffset;
  
  // 8-baytlıq buffer sayğac
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(0, 0); // Yüksək 4 bayt
  buffer.writeUInt32BE(counter, 4); // Aşağı 4 bayt
  
  // HMAC-SHA1
  const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
  
  // Dinamik kəsinti (Dynamic truncation)
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = (
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  ) % 1000000;
  
  return code.toString().padStart(6, "0");
}

/**
 * Google Authenticator tərəfindən verilən 6 rəqəmli kodu yoxlayır.
 * Zaman sürüşməsini (Time drift) nəzərə alaraq ±30 saniyəlik pəncərəni də yoxlayır.
 */
export function verifyTOTPToken(secret: string, token: string): boolean {
  const cleanToken = token.trim();
  for (let offset = -1; offset <= 1; offset++) {
    if (getTOTPToken(secret, offset) === cleanToken) {
      return true;
    }
  }
  return false;
}
