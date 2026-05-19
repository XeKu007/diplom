import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/parent/student — эцэг/эхийн холбоотой оюутны бүх мэдээлэл
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "parent") {
    return NextResponse.json({ error: "Эрх хүрэлцэхгүй" }, { status: 403 });
  }

  // Эцэг/эхийн user олох
  const parentUser = await prisma.user.findUnique({
    where: { userId: session.userId },
    include: {
      parentOf: {
        include: {
          student: {
            include: {
              user: { select: { userId: true } },
              enrollments: {
                include: {
                  course: {
                    include: { teacher: true },
                  },
                },
              },
              grades: {
                include: { course: true },
                orderBy: { createdAt: "desc" },
              },
              payments: { orderBy: { createdAt: "desc" } },
              attendances: {
                include: { course: true },
                orderBy: { date: "desc" },
                take: 100,
              },
              notifications: {
                orderBy: { createdAt: "desc" },
                take: 20,
              },
            },
          },
        },
      },
    },
  });

  if (!parentUser || parentUser.parentOf.length === 0) {
    return NextResponse.json({ error: "Холбоотой оюутан олдсонгүй" }, { status: 404 });
  }

  const student = parentUser.parentOf[0].student;

  // GPA тооцоолох
  const scores = student.grades.map((g) => g.totalScore ?? 0).filter((v) => v > 0);
  const gpa = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length / 25 : 0;

  // Ирцийн хувь тооцоолох
  const totalAtt = student.attendances.length;
  const presentAtt = student.attendances.filter((a) => a.status === "present").length;
  const attRate = totalAtt ? Math.round((presentAtt / totalAtt) * 100) : 0;

  return NextResponse.json({
    id: student.id,
    userId: student.user.userId,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    phone: student.phone,
    major: student.major,
    classGroup: student.classGroup,
    semester: student.semester,
    enrollmentYear: student.enrollmentYear,
    advisor: student.advisor,
    scholarship: student.scholarship,
    dormitory: student.dormitory,
    status: student.status,
    gpa: parseFloat(gpa.toFixed(2)),
    attendanceRate: attRate,
    courses: student.enrollments.map((e) => ({
      id: e.course.id,
      name: e.course.name,
      code: e.course.code,
      credits: e.course.credits,
      room: e.course.room,
      schedule: e.course.schedule,
      teacher: e.course.teacher
        ? `${e.course.teacher.lastName} ${e.course.teacher.firstName}`
        : null,
    })),
    grades: student.grades.map((g) => ({
      id: g.id,
      courseName: g.course.name,
      courseCode: g.course.code,
      semester: g.semester,
      quiz1: g.quiz1,
      quiz2: g.quiz2,
      midterm: g.midterm,
      assignment: g.assignment,
      attendance: g.attendance,
      final: g.final,
      totalScore: g.totalScore,
      letterGrade: g.letterGrade,
    })),
    payments: student.payments.map((p) => ({
      id: p.id,
      term: p.term,
      amount: p.amount,
      status: p.status,
      paidAt: p.paidAt,
      note: p.note,
    })),
    attendances: student.attendances.map((a) => ({
      id: a.id,
      date: a.date,
      status: a.status,
      courseName: a.course.name,
      courseCode: a.course.code,
    })),
    notifications: student.notifications,
  });
}
