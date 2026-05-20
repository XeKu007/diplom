import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Нэвтрэх шаардлагатай." }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Одоогийн болон шинэ нууц үг шаардлагатай." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Шинэ нууц үг дор хаяж 8 тэмдэгт байх ёстой." },
        { status: 400 }
      );
    }

    // Хэрэглэгчийг DB-аас олох
    const user = await prisma.user.findFirst({
      where: { userId: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Хэрэглэгч олдсонгүй." }, { status: 404 });
    }

    // Одоогийн нууц үг шалгах
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Одоогийн нууц үг буруу байна." },
        { status: 401 }
      );
    }

    // Шинэ нууц үг hash хийх
    const newHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    // Audit log
    try {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PASSWORD_CHANGED",
          detail: "Нууц үг амжилттай солигдлоо",
          ip,
        },
      });
    } catch {
      /* ignore */
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[change-password]", err);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа." },
      { status: 500 }
    );
  }
}
