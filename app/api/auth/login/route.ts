import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { findUser } from "@/lib/users";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

  try {
    const { id, password, role } = await req.json();

    if (!id || !password || !role) {
      return NextResponse.json(
        { error: "ID, нууц үг болон роль шаардлагатай." },
        { status: 400 }
      );
    }

    const user = await findUser(id, password, role);

    if (!user) {
      // Амжилтгүй нэвтрэлтийг бүртгэх
      try {
        const existingUser = await prisma.user.findFirst({ where: { userId: id } });
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
      } catch { /* audit log алдаа нь login-г зогсоохгүй */ }

      return NextResponse.json(
        { error: "ID эсвэл нууц үг буруу байна." },
        { status: 401 }
      );
    }

    await createSession({
      userId:          user.userId,
      role:            user.role,
      name:            user.name,
      adminType:       user.adminType ?? undefined,
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
    } catch { /* audit log алдаа нь login-г зогсоохгүй */ }

    const redirectMap: Record<string, string> = {
      student:  "/home",
      teacher:  "/teacher/home",
      parent:   "/parent",
      admin:    "/admin/dashboard",
      training: "/admin/training-dashboard",
      finance:  "/admin/finance-dashboard",
    };

    return NextResponse.json({
      ok:       true,
      redirect: redirectMap[user.role] ?? "/home",
      role:     user.role,
      name:     user.name,
    });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа." },
      { status: 500 }
    );
  }
}
