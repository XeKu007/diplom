import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET /api/admin/users — admin хэрэглэгчдийн жагсаалт
export async function GET() {
  const session = await getSession();
  // Бүх admin role харж болно
  if (!session || !["admin", "training", "finance"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { role: { in: ["admin", "training", "finance"] } },
    select: {
      id: true, userId: true, name: true,
      role: true, adminType: true, isActive: true, createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(users);
}

// POST /api/admin/users — шинэ admin нэмэх
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Зөвхөн бүрэн эрхт админ нэмж болно" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, password, name, adminType } = body;

  if (!userId || !password || !name || !adminType) {
    return NextResponse.json({ error: "Бүх талбар шаардлагатай" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { userId } });
  if (existing) {
    return NextResponse.json({ error: "Энэ ID аль хэдийн бүртгэлтэй" }, { status: 409 });
  }

  const roleMap: Record<string, "admin" | "training" | "finance"> = {
    "full-admin":     "admin",
    "training-admin": "training",
    "finance-admin":  "finance",
  };

  const role = roleMap[adminType];
  if (!role) {
    return NextResponse.json({ error: "Буруу adminType" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      userId,
      passwordHash: await bcrypt.hash(password, 12),
      role,
      name,
      adminType,
    },
  });

  return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
}
