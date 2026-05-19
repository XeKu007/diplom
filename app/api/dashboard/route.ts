import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const [totalStudents, totalTeachers, totalCourses, pendingPayments] = await Promise.all([
    prisma.student.count({ where: { status: "active" } }),
    prisma.teacher.count(),
    prisma.course.count({ where: { isActive: true } }),
    prisma.payment.count({ where: { status: "pending" } }),
  ]);

  const recentStudents = await prisma.student.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { userId: true } } },
  });

  return NextResponse.json({
    stats: { totalStudents, totalTeachers, totalCourses, pendingPayments },
    recentStudents,
  });
}
