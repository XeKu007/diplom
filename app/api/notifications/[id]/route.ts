import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// PATCH /api/notifications/:id — уншсан гэж тэмдэглэх
export async function PATCH(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  await prisma.notification.update({
    where: { id: params.id },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/notifications/:id
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !["admin", "training"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }
  await prisma.notification.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
