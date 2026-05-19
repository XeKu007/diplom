import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

// PATCH /api/admin/users/:id — нууц үг солих / идэвхгүй болгох
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const updateData: Record<string, unknown> = {};

  if (body.password) {
    updateData.passwordHash = await bcrypt.hash(body.password, 12);
  }
  if (body.name) updateData.name = body.name;
  if (typeof body.isActive === "boolean") updateData.isActive = body.isActive;

  const user = await prisma.user.update({
    where: { id: params.id },
    data: updateData,
  });

  return NextResponse.json({ ok: true, userId: user.userId });
}

// DELETE /api/admin/users/:id — устгах
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  // Өөрийгөө устгахаас хамгаалах
  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (target?.userId === session.userId) {
    return NextResponse.json({ error: "Өөрийгөө устгах боломжгүй" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
