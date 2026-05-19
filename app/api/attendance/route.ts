import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/attendance?studentId=&courseId=&from=&to=
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const courseId  = searchParams.get("courseId");
  const from      = searchParams.get("from");
  const to        = searchParams.get("to");

  // Оюутан өөрийн ирцийг харах
  if (session.role === "student") {
    const student = await prisma.student.findFirst({
      where: { user: { userId: session.userId } },
    });
    if (!student) return NextResponse.json([], { status: 200 });

    const records = await prisma.attendance.findMany({
      where: {
        studentId: student.id,
        ...(courseId && { courseId }),
        ...(from && to && { date: { gte: new Date(from), lte: new Date(to) } }),
      },
      include: { course: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(records);
  }

  const records = await prisma.attendance.findMany({
    where: {
      ...(studentId && { studentId }),
      ...(courseId  && { courseId }),
      ...(from && to && { date: { gte: new Date(from), lte: new Date(to) } }),
    },
    include: {
      student: { include: { user: { select: { userId: true } } } },
      course: true,
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(records);
}

// POST /api/attendance — ирц бүртгэх
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "training", "teacher"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();

  // Олон оюутны ирц нэг дор бүртгэх
  if (Array.isArray(body)) {
    const results = await Promise.all(
      body.map(({ studentId, courseId, date, status, note }) =>
        prisma.attendance.upsert({
          where: { studentId_courseId_date: { studentId, courseId, date: new Date(date) } },
          update: { status, note },
          create: { studentId, courseId, date: new Date(date), status, note },
        })
      )
    );
    return NextResponse.json({ ok: true, count: results.length });
  }

  const { studentId, courseId, date, status, note } = body;
  if (!studentId || !courseId || !date || !status) {
    return NextResponse.json({ error: "Шаардлагатай талбарууд дутуу" }, { status: 400 });
  }

  const record = await prisma.attendance.upsert({
    where: { studentId_courseId_date: { studentId, courseId, date: new Date(date) } },
    update: { status, note },
    create: { studentId, courseId, date: new Date(date), status, note },
  });

  return NextResponse.json({ ok: true, record });
}
