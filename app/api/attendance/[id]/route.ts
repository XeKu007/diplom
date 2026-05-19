import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !["admin", "training", "teacher"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }
  const body = await req.json();
  const record = await prisma.attendance.update({
    where: { id: params.id },
    data: { status: body.status, note: body.note },
  });
  return NextResponse.json({ ok: true, record });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !["admin", "training", "teacher"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }
  await prisma.attendance.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
