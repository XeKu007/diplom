import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/audit-logs — аудит логийн жагсаалт (зөвхөн admin)
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "training", "finance"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "";
  const limit = parseInt(searchParams.get("limit") ?? "100");
  const userId = searchParams.get("userId") ?? "";

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(action && { action }),
      ...(userId && { user: { userId: { contains: userId, mode: "insensitive" } } }),
    },
    include: {
      user: {
        select: { userId: true, name: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(logs);
}
