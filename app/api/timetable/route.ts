import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  // Оюутан — бүртгэлтэй хичээлүүдийн хуваарь
  if (session.role === "student") {
    const student = await prisma.student.findFirst({
      where: { user: { userId: session.userId } },
      include: { enrollments: { select: { courseId: true } } },
    });
    if (!student) return NextResponse.json([], { status: 200 });

    const courseIds = student.enrollments.map((e) => e.courseId);
    const timetables = await prisma.timetable.findMany({
      where: { courseId: { in: courseIds } },
      include: { course: { include: { teacher: true } } },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    return NextResponse.json(timetables);
  }

  // Багш — өөрийн хичээлүүдийн хуваарь
  if (session.role === "teacher") {
    const teacher = await prisma.teacher.findFirst({
      where: { user: { userId: session.userId } },
      include: { courses: { select: { id: true } } },
    });
    if (!teacher) return NextResponse.json([], { status: 200 });

    const courseIds = teacher.courses.map((c) => c.id);
    const timetables = await prisma.timetable.findMany({
      where: { courseId: { in: courseIds } },
      include: { course: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    return NextResponse.json(timetables);
  }

  const timetables = await prisma.timetable.findMany({
    where: { ...(courseId && { courseId }) },
    include: { course: { include: { teacher: true } } },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(timetables);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "training"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { courseId, dayOfWeek, startTime, endTime, room } = body;

  if (!courseId || !dayOfWeek || !startTime || !endTime) {
    return NextResponse.json({ error: "Шаардлагатай талбарууд дутуу" }, { status: 400 });
  }

  const existing = await prisma.timetable.findFirst({
    where: { courseId, dayOfWeek, startTime },
  });
  if (existing) return NextResponse.json({ error: "Энэ цагт аль хэдийн хуваарь байна" }, { status: 409 });

  const entry = await prisma.timetable.create({
    data: { courseId, dayOfWeek, startTime, endTime, room },
  });

  return NextResponse.json({ ok: true, entry }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "training"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const { id } = await req.json();
  await prisma.timetable.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
