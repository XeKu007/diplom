import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      teacher: { include: { user: { select: { userId: true, name: true } } } },
      enrollments: { include: { student: true } },
      grades: { include: { student: true } },
      timetables: true,
    },
  });

  if (!course) return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  return NextResponse.json(course);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !["admin", "training"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const course = await prisma.course.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json({ ok: true, course });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  await prisma.course.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
