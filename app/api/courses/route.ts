import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get("teacherId");

  const courses = await prisma.course.findMany({
    where: {
      isActive: true,
      ...(teacherId && { teacher: { user: { userId: teacherId } } }),
    },
    include: {
      teacher: { include: { user: { select: { userId: true } } } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "training"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { code, name, description, credits, semester, teacherId, room, schedule, maxStudents } = body;

  if (!code || !name) return NextResponse.json({ error: "Код болон нэр шаардлагатай" }, { status: 400 });

  const existing = await prisma.course.findUnique({ where: { code } });
  if (existing) return NextResponse.json({ error: "Энэ код аль хэдийн бүртгэлтэй" }, { status: 409 });

  const course = await prisma.course.create({
    data: { code, name, description, credits: credits ?? 3, semester, teacherId, room, schedule, maxStudents: maxStudents ?? 30 },
  });

  return NextResponse.json({ ok: true, course }, { status: 201 });
}
