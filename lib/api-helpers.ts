/**
 * API route-д ашиглах utility функцүүд.
 * Input validation, error response, auth шалгалт.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession, SessionPayload, UserRole } from "@/lib/auth";

// ── Standard error responses ──────────────────────────────

export function unauthorized(message = "Нэвтрэх шаардлагатай.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Энэ үйлдлийг хийх эрх байхгүй.") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function badRequest(message = "Буруу хүсэлт.") {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Олдсонгүй.") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Серверийн алдаа гарлаа.") {
  return NextResponse.json({ error: message }, { status: 500 });
}

// ── Auth guard ────────────────────────────────────────────

/**
 * Session шалгаж, зөвшөөрөгдсөн роль эсэхийг баталгаажуулна.
 * @param allowedRoles - Зөвшөөрөгдсөн роль жагсаалт (хоосон бол бүх роль зөвшөөрнө)
 */
export async function requireAuth(
  allowedRoles: UserRole[] = []
): Promise<{ session: SessionPayload } | NextResponse> {
  const session = await getSession();

  if (!session) {
    return unauthorized();
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return forbidden();
  }

  return { session };
}

/**
 * requireAuth-ийн үр дүнг шалгах helper.
 * NextResponse бол алдаа, { session } бол амжилт.
 */
export function isAuthError(
  result: { session: SessionPayload } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}

// ── Input sanitization ────────────────────────────────────

/** String-ийг trim хийж, хамгийн их урттай шалгана */
export function sanitizeString(
  value: unknown,
  maxLength = 500
): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;
  return trimmed;
}

/** Тоог шалгана */
export function sanitizeNumber(value: unknown): number | null {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}

/** Pagination параметр уншина */
export function getPagination(req: NextRequest): {
  page: number;
  limit: number;
  skip: number;
} {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10) || 20)
  );
  return { page, limit, skip: (page - 1) * limit };
}
