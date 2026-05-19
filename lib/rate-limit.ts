/**
 * Simple in-memory rate limiter for API routes.
 * Production-д Redis ашиглах нь зүйтэй.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Хуучин бүртгэлийг цэвэрлэх (5 минут тутамд)
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  store.forEach((entry, key) => {
    if (entry.resetAt < now) keysToDelete.push(key);
  });
  keysToDelete.forEach((key) => store.delete(key));
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /** Цонхны хугацаа (мс). Default: 60_000 (1 минут) */
  windowMs?: number;
  /** Цонхны дотор зөвшөөрөгдөх хүсэлтийн тоо. Default: 10 */
  max?: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * IP хаягаар rate limit шалгах.
 * @param ip  - Хэрэглэгчийн IP хаяг
 * @param key - Нэмэлт ялгах түлхүүр (жишээ: "login", "api")
 */
export function rateLimit(
  ip: string,
  key = "default",
  options: RateLimitOptions = {}
): RateLimitResult {
  const { windowMs = 60_000, max = 10 } = options;
  const storeKey = `${key}:${ip}`;
  const now = Date.now();

  const entry = store.get(storeKey);

  if (!entry || entry.resetAt < now) {
    // Шинэ цонх эхлүүлэх
    store.set(storeKey, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (entry.count >= max) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: max - entry.count, resetAt: entry.resetAt };
}
