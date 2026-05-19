import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookieHeader, verifyTokenEdge } from "@/lib/auth-edge";

// ── Нийтийн хуудсууд (auth шаардлагагүй) ─────────────────
const PUBLIC_PATHS = ["/", "/landing", "/login", "/register", "/admin/login"];

// ── Роль тус бүрийн зөвшөөрөгдсөн prefix ─────────────────
const ROLE_PREFIXES: Record<string, string[]> = {
  student:  ["/home", "/student", "/course", "/course-info"],
  teacher:  ["/teacher"],
  parent:   ["/parent"],
  admin:    ["/admin"],
  training: ["/admin"],
  finance:  ["/admin"],
};

// ── Redirect map ──────────────────────────────────────────
const ROLE_HOME: Record<string, string> = {
  student:  "/home",
  teacher:  "/teacher/home",
  parent:   "/parent",
  admin:    "/admin/dashboard",
  training: "/admin/training-dashboard",
  finance:  "/admin/finance-dashboard",
};

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function isAllowed(pathname: string, role: string): boolean {
  const allowed = ROLE_PREFIXES[role] ?? [];
  return allowed.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Static файл, API route алгасах ───────────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ── Нийтийн хуудас ────────────────────────────────────────
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // ── Cookie-с token унших ──────────────────────────────────
  const cookieHeader = req.headers.get("cookie") ?? "";
  const token = getTokenFromCookieHeader(cookieHeader);

  if (!token) {
    const loginUrl = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    return NextResponse.redirect(new URL(loginUrl, req.url));
  }

  const session = await verifyTokenEdge(token);

  if (!session) {
    const loginUrl = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    const res = NextResponse.redirect(new URL(loginUrl, req.url));
    // Хүчингүй cookie устгах
    res.cookies.set("indra_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return res;
  }

  // ── Роль шалгах ───────────────────────────────────────────
  if (!isAllowed(pathname, session.role)) {
    return NextResponse.redirect(
      new URL(ROLE_HOME[session.role] ?? "/login", req.url)
    );
  }

  // ── Security headers request-д нэмэх ─────────────────────
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", session.userId);
  requestHeaders.set("x-user-role", session.role);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
