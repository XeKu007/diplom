import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type UserRole = "student" | "teacher" | "parent" | "admin" | "training" | "finance";

export interface SessionPayload {
  userId: string;
  role: UserRole;
  adminType?: string;
  parentStudentId?: string;
  name: string;
}

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

const COOKIE_NAME = "indra_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ── JWT sign ──────────────────────────────────────────────
export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

// ── JWT verify ────────────────────────────────────────────
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ── Set session cookie (server-side) ─────────────────────
export async function createSession(data: SessionPayload) {
  const token = await signToken(data);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

// ── Delete session cookie (server-side) ──────────────────
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ── Read & verify session (server-side) ──────────────────
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── Read raw token from cookie (for middleware) ───────────
export function getTokenFromCookieHeader(cookieHeader: string): string | null {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}
