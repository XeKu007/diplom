import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const teachers = await prisma.teacher.findMany({
    include: {
      user: { select: { userId: true, isActive: true } },
      courses: { select: { id: true, name: true, code: true, _count: { select: { enrollments: true } } } },
      salaries: { orderBy: { month: "desc" }, take: 1 },
    },
    orderBy: { firstName: "asc" },
  });

  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, password, firstName, lastName, email, phone, department, position } = body;

  if (!userId || !password || !firstName || !lastName) {
    return NextResponse.json({ error: "Заавал талбарууд дутуу" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { userId } });
  if (existing) return NextResponse.json({ error: "Энэ ID аль хэдийн бүртгэлтэй" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { userId, passwordHash, role: "teacher", name: firstName },
  });

  const teacher = await prisma.teacher.create({
    data: { userId: user.id, firstName, lastName, email, phone, department, position },
  });

  return NextResponse.json({ ok: true, id: teacher.id }, { status: 201 });
}
