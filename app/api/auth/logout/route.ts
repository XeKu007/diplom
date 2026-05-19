import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  await deleteSession();

  // Logout audit log — session-аас userId авах боломжгүй тул зөвхөн cookie устгана
  return NextResponse.json({ ok: true });
}
