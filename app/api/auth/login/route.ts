import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { findUser } from "@/lib/users";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // ── Rate limiting: 5 оролдлого / минут ───────────────────
  const limit = rateLimit(ip, "login", { windowMs: 60_000, max: 5 });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Хэт олон оролдлого хийлээ. 1 минутын дараа дахин оролдоно уу." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { id, password, role } = body ?? {};

    // ── Input validation ──────────────────────────────────
    if (
      typeof id !== "string" ||
      typeof password !== "string" ||
      typeof role !== "string" ||
      !id.trim() ||
      !password.trim() ||
      !role.trim()
    ) {
      return NextResponse.json(
        { error: "ID, нууц үг болон роль шаардлагатай." },
        { status: 400 }
      );
    }

    // Input урт хязгаарлах (injection хамгаалалт)
    if (id.length > 100 || password.length > 200 || role.length > 50) {
      return NextResponse.json(
        { error: "Оруулсан мэдээлэл хэт урт байна." },
        { status: 400 }
      );
    }

    const user = await findUser(id.trim(), password, role.trim());

    if (!user) {
      // Амжилтгүй нэвтрэлтийг бүртгэх
      try {
        const existingUser = await prisma.user.findFirst({
          where: { userId: id.trim() },
        });
        if (existingUser) {
          await prisma.auditLog.create({
            data: {
              userId: existingUser.id,
              action: "LOGIN_FAILED",
              detail: `Буруу нууц үг эсвэл роль: ${role}`,
              ip,
            },
          });
        }
      } catch {
        /* audit log алдаа нь login-г зогсоохгүй */
      }

      // Timing attack хамгаалалт — нэгдсэн хариу
      return NextResponse.json(
        { error: "ID эсвэл нууц үг буруу байна." },
        { status: 401 }
      );
    }

    await createSession({
      userId: user.userId,
      role: user.role,
      name: user.name,
      adminType: user.adminType ?? undefined,
      parentStudentId: user.parentStudentId ?? undefined,
    });

    // Амжилттай нэвтрэлтийг бүртгэх
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "LOGIN",
          detail: `Роль: ${user.role}`,
          ip,
        },
      });
    } catch {
      /* audit log алдаа нь login-г зогсоохгүй */
    }

    const redirectMap: Record<string, string> = {
      student: "/home",
      teacher: "/teacher/home",
      parent: "/parent",
      admin: "/admin/dashboard",
      training: "/admin/training-dashboard",
      finance: "/admin/finance-dashboard",
    };

    return NextResponse.json({
      ok: true,
      redirect: redirectMap[user.role] ?? "/home",
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа." },
      { status: 500 }
    );
  }
}
