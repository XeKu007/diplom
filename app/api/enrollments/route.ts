import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/enrollments?studentId=&courseId=
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const courseId  = searchParams.get("courseId");

  const enrollments = await prisma.enrollment.findMany({
    where: {
      ...(studentId && { studentId }),
      ...(courseId  && { courseId }),
    },
    include: {
      student: { include: { user: { select: { userId: true } } } },
      course:  { include: { teacher: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(enrollments);
}

// POST /api/enrollments — оюутан хичээлд бүртгэх
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "training"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { studentId, courseId } = body;

  if (!studentId || !courseId) {
    return NextResponse.json({ error: "studentId болон courseId шаардлагатай" }, { status: 400 });
  }

  const existing = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Аль хэдийн бүртгэлтэй байна" }, { status: 409 });
  }

  // Course-ийн дээд хязгаар шалгах
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { _count: { select: { enrollments: true } } },
  });
  if (!course) return NextResponse.json({ error: "Хичээл олдсонгүй" }, { status: 404 });
  if (course._count.enrollments >= course.maxStudents) {
    return NextResponse.json({ error: "Хичээлийн дээд хязгаарт хүрсэн байна" }, { status: 400 });
  }

  const enrollment = await prisma.enrollment.create({
    data: { studentId, courseId },
    include: {
      student: { include: { user: { select: { userId: true } } } },
      course: true,
    },
  });

  return NextResponse.json({ ok: true, enrollment }, { status: 201 });
}
