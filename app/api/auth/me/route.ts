import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Нэвтрээгүй байна." }, { status: 401 });
  }
  return NextResponse.json({
    userId: session.userId,
    role: session.role,
    name: session.name,
    adminType: session.adminType,
    parentStudentId: session.parentStudentId,
  });
}
