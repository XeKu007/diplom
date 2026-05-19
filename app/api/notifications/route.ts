import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/notifications
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  if (session.role === "student") {
    const student = await prisma.student.findFirst({
      where: { user: { userId: session.userId } },
    });
    if (!student) return NextResponse.json([], { status: 200 });

    const notifications = await prisma.notification.findMany({
      where: { OR: [{ studentId: student.id }, { studentId: null }] },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notifications);
  }

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(notifications);
}

// POST /api/notifications — мэдэгдэл илгээх
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "training"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { studentId, title, body: msgBody, type } = body;

  if (!title || !msgBody) {
    return NextResponse.json({ error: "Гарчиг болон агуулга шаардлагатай" }, { status: 400 });
  }

  const notification = await prisma.notification.create({
    data: { studentId: studentId ?? null, title, body: msgBody, type: type ?? "info" },
  });

  return NextResponse.json({ ok: true, notification }, { status: 201 });
}
