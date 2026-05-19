import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !["admin", "finance"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { status, base, bonus, deduction } = body;

  const updateData: Record<string, unknown> = { status };
  if (base !== undefined) {
    const net = parseFloat(base) + parseFloat(bonus ?? 0) - parseFloat(deduction ?? 0);
    Object.assign(updateData, { base: parseFloat(base), bonus: parseFloat(bonus ?? 0), deduction: parseFloat(deduction ?? 0), net });
  }
  if (status === "paid") updateData.paidAt = new Date();

  const salary = await prisma.salary.update({ where: { id: params.id }, data: updateData });
  return NextResponse.json({ ok: true, salary });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !["admin", "finance"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }
  await prisma.salary.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
