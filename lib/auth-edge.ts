/**
 * Edge Runtime-д ажиллах auth utility.
 * jose-г шууд import хийхгүй — зөвхөн Web Crypto API ашиглана.
 */

const COOKIE_NAME = "indra_session";

export function getTokenFromCookieHeader(cookieHeader: string): string | null {
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );
  return match ? match[1] : null;
}

interface JWTPayload {
  userId: string;
  role: string;
  name: string;
  adminType?: string;
  parentStudentId?: string;
  exp?: number;
}

/**
 * Edge-compatible JWT verify — Web Crypto API ашиглана (jose шаардлагагүй)
 */
export async function verifyTokenEdge(
  token: string
): Promise<JWTPayload | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    // Signature шалгах
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = Uint8Array.from(
      atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!valid) return null;

    // Payload decode
    const payload = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    ) as JWTPayload;

    // Expiry шалгах
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
