import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function calcLetter(total: number) {
  if (total >= 90) return "A";
  if (total >= 80) return "B";
  if (total >= 70) return "C";
  if (total >= 60) return "D";
  return "F";
}

// GET /api/grades?studentId=&courseId=&semester=
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const courseId  = searchParams.get("courseId");
  const semester  = searchParams.get("semester");

  // Оюутан өөрийн дүнг харах
  if (session.role === "student") {
    const student = await prisma.student.findFirst({
      where: { user: { userId: session.userId } },
    });
    if (!student) return NextResponse.json([], { status: 200 });

    const grades = await prisma.grade.findMany({
      where: { studentId: student.id, ...(semester && { semester }) },
      include: { course: true },
      orderBy: { course: { name: "asc" } },
    });
    return NextResponse.json(grades);
  }

  const grades = await prisma.grade.findMany({
    where: {
      ...(studentId && { studentId }),
      ...(courseId  && { courseId }),
      ...(semester  && { semester }),
    },
    include: {
      student: { include: { user: { select: { userId: true } } } },
      course: true,
    },
    orderBy: [{ student: { firstName: "asc" } }, { course: { name: "asc" } }],
  });

  return NextResponse.json(grades);
}

// POST /api/grades — дүн оруулах / шинэчлэх (upsert)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "training", "teacher"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { studentId, courseId, semester, quiz1, quiz2, midterm, assignment, attendance, final } = body;

  if (!studentId || !courseId || !semester) {
    return NextResponse.json({ error: "studentId, courseId, semester шаардлагатай" }, { status: 400 });
  }

  const total = (quiz1 ?? 0) + (quiz2 ?? 0) + (midterm ?? 0) + (assignment ?? 0) + (attendance ?? 0) + (final ?? 0);
  const letterGrade = calcLetter(total);

  const grade = await prisma.grade.upsert({
    where: { studentId_courseId_semester: { studentId, courseId, semester } },
    update: { quiz1, quiz2, midterm, assignment, attendance, final, totalScore: total, letterGrade },
    create: { studentId, courseId, semester, quiz1, quiz2, midterm, assignment, attendance, final, totalScore: total, letterGrade },
  });

  return NextResponse.json({ ok: true, grade });
}
