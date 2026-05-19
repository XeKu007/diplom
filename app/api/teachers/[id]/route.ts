import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const teacher = await prisma.teacher.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { userId: true, isActive: true } },
      courses: {
        include: {
          _count: { select: { enrollments: true, attendances: true } },
          timetables: true,
        },
      },
      salaries: { orderBy: { month: "desc" } },
    },
  });

  if (!teacher) return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  return NextResponse.json(teacher);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !["admin"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const teacher = await prisma.teacher.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json({ ok: true, teacher });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }
  const teacher = await prisma.teacher.findUnique({ where: { id: params.id } });
  if (!teacher) return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  // User устгахад cascade-аар teacher ч устана
  await prisma.user.update({ where: { id: teacher.userId }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
