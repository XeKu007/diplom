import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/students/:id
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { userId: true, isActive: true } },
      enrollments: { include: { course: { include: { teacher: true } } } },
      grades: { include: { course: true } },
      payments: true,
      attendances: { include: { course: true }, orderBy: { date: "desc" }, take: 30 },
      notifications: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!student) return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  return NextResponse.json(student);
}

// PATCH /api/students/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !["admin", "training"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { firstName, lastName, email, phone, major, classGroup, semester, advisor, scholarship, dormitory, status } = body;

  const student = await prisma.student.update({
    where: { id: params.id },
    data: { firstName, lastName, email, phone, major, classGroup, semester, advisor, scholarship, dormitory, status },
  });

  return NextResponse.json({ ok: true, student });
}

// DELETE /api/students/:id
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const student = await prisma.student.findUnique({ where: { id: params.id } });
  if (!student) return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });

  // User устгахад cascade-аар student ч устана
  await prisma.user.delete({ where: { id: student.userId } });
  return NextResponse.json({ ok: true });
}
