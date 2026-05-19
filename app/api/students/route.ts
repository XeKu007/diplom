import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET /api/students — жагсаалт
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Нэвтрээгүй" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const major = searchParams.get("major") ?? "";

  const students = await prisma.student.findMany({
    where: {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName:  { contains: search, mode: "insensitive" } },
          { user: { userId: { contains: search, mode: "insensitive" } } },
          { email:     { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(major && { major: { contains: major, mode: "insensitive" } }),
    },
    include: {
      user: { select: { userId: true, isActive: true } },
      grades: { select: { totalScore: true } },
      payments: { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = students.map((s) => {
    const scores = s.grades.map((g) => g.totalScore ?? 0).filter((v) => v > 0);
    const gpa = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length / 25 : 0;
    return {
      id:          s.id,
      userId:      s.user.userId,
      name:        `${s.firstName}`,
      lastName:    s.lastName,
      fullName:    `${s.lastName} ${s.firstName}`,
      email:       s.email,
      phone:       s.phone,
      major:       s.major,
      classGroup:  s.classGroup,
      semester:    s.semester,
      enrollmentYear: s.enrollmentYear,
      advisor:     s.advisor,
      scholarship: s.scholarship,
      dormitory:   s.dormitory,
      status:      s.status,
      isActive:    s.user.isActive,
      gpa:         parseFloat(gpa.toFixed(2)),
    };
  });

  return NextResponse.json(result);
}

// POST /api/students — шинэ оюутан нэмэх
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !["admin", "training"].includes(session.role)) {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, password, firstName, lastName, email, phone, major, classGroup, semester, enrollmentYear, advisor, scholarship, dormitory } = body;

  if (!userId || !password || !firstName || !lastName) {
    return NextResponse.json({ error: "Заавал талбарууд дутуу байна" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { userId } });
  if (existing) return NextResponse.json({ error: "Энэ ID аль хэдийн бүртгэлтэй" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { userId, passwordHash, role: "student", name: firstName },
  });

  const student = await prisma.student.create({
    data: { userId: user.id, firstName, lastName, email, phone, major, classGroup, semester, enrollmentYear, advisor, scholarship, dormitory },
  });

  return NextResponse.json({ ok: true, id: student.id }, { status: 201 });
}
