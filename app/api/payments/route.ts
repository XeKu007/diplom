import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/payments?studentId=
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (session.role === "student") {
    const student = await prisma.student.findFirst({
      where: { user: { userId: session.userId } },
    });
    if (!student) return NextResponse.json([], { status: 200 });

    const payments = await prisma.payment.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(payments);
  }

  const payments = await prisma.payment.findMany({
    where: { ...(studentId && { studentId }) },
    include: { student: { include: { user: { select: { userId: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(payments);
}

// POST /api/payments — төлбөр нэмэх
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "finance"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { studentId, term, amount, status, note } = body;

  if (!studentId || !term || !amount) {
    return NextResponse.json({ error: "Шаардлагатай талбарууд дутуу" }, { status: 400 });
  }

  const payment = await prisma.payment.create({
    data: {
      studentId, term, amount: parseFloat(amount),
      status: status ?? "pending",
      note,
      paidAt: status === "paid" ? new Date() : null,
    },
  });

  return NextResponse.json({ ok: true, payment }, { status: 201 });
}
