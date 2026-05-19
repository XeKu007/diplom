import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get("teacherId");

  if (session.role === "teacher") {
    const teacher = await prisma.teacher.findFirst({
      where: { user: { userId: session.userId } },
    });
    if (!teacher) return NextResponse.json([], { status: 200 });

    const salaries = await prisma.salary.findMany({
      where: { teacherId: teacher.id },
      orderBy: { month: "desc" },
    });
    return NextResponse.json(salaries);
  }

  const salaries = await prisma.salary.findMany({
    where: { ...(teacherId && { teacherId }) },
    include: { teacher: { include: { user: { select: { userId: true } } } } },
    orderBy: { month: "desc" },
  });

  return NextResponse.json(salaries);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "finance"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { teacherId, month, base, bonus, deduction } = body;

  if (!teacherId || !month || !base) {
    return NextResponse.json({ error: "Шаардлагатай талбарууд дутуу" }, { status: 400 });
  }

  const net = parseFloat(base) + parseFloat(bonus ?? 0) - parseFloat(deduction ?? 0);

  const salary = await prisma.salary.create({
    data: {
      teacherId, month,
      base: parseFloat(base),
      bonus: parseFloat(bonus ?? 0),
      deduction: parseFloat(deduction ?? 0),
      net,
      status: "pending",
    },
  });

  return NextResponse.json({ ok: true, salary }, { status: 201 });
}
