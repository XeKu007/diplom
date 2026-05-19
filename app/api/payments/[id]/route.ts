import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// PATCH /api/payments/:id — төлбөрийн төлөв шинэчлэх
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !["admin", "finance"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { status, note } = body;

  const payment = await prisma.payment.update({
    where: { id: params.id },
    data: {
      status,
      note,
      paidAt: status === "paid" ? new Date() : null,
    },
  });

  return NextResponse.json({ ok: true, payment });
}

// DELETE /api/payments/:id
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  await prisma.payment.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
