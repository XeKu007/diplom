import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT = 12;
const h = (p: string) => bcrypt.hash(p, SALT);

async function main() {
  console.log("🌱 Seed эхэлж байна...");

  // ── Users + Students ──────────────────────────────────
  const studentsData = [
    { userId: "B211930019", name: "Төртэмүүлэн", lastName: "Батбаяр", password: "student123",
      email: "tortemuulen@indra.edu.mn", phone: "9900-1122", major: "Програм хангамж", classGroup: "SE-2021", semester: "8", enrollmentYear: "2021" },
    { userId: "B211930020", name: "Мөнхбат", lastName: "Дорж", password: "student123",
      email: "munkhbat@indra.edu.mn", phone: "9911-2233", major: "Сүлжээний технологи", classGroup: "NT-2021", semester: "8", enrollmentYear: "2021" },
    { userId: "B221930001", name: "Анхбаяр", lastName: "Гантулга", password: "student123",
      email: "ankhbayar@indra.edu.mn", phone: "9922-3344", major: "Програм хангамж", classGroup: "SE-2022", semester: "6", enrollmentYear: "2022" },
    { userId: "B221930002", name: "Номин", lastName: "Цэрэн", password: "student123",
      email: "nomin@indra.edu.mn", phone: "9933-4455", major: "Мэдээллийн аюулгүй байдал", classGroup: "IS-2022", semester: "6", enrollmentYear: "2022" },
  ];

  const studentUsers: Record<string, string> = {}; // userId -> student.id

  for (const s of studentsData) {
    const user = await prisma.user.upsert({
      where: { userId: s.userId },
      update: {},
      create: { userId: s.userId, passwordHash: await h(s.password), role: "student", name: s.name },
    });
    const student = await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id, firstName: s.name, lastName: s.lastName,
        email: s.email, phone: s.phone, major: s.major,
        classGroup: s.classGroup, semester: s.semester, enrollmentYear: s.enrollmentYear,
        gender: "Эрэгтэй", scholarship: "Тэтгэлэгтэй",
      },
    });
    studentUsers[s.userId] = student.id;
    console.log(`  ✓ Оюутан: ${s.userId}`);
  }

  // ── Teachers ──────────────────────────────────────────
  const teachersData = [
    { userId: "T001", name: "Батбаяр", lastName: "Ганбат", password: "teacher123", dept: "Програм хангамж" },
    { userId: "T002", name: "Энхбаяр", lastName: "Цэнд", password: "teacher123", dept: "Сүлжээний технологи" },
    { userId: "T003", name: "Наранцэцэг", lastName: "Дорж", password: "teacher123", dept: "Мэдээллийн аюулгүй байдал" },
  ];

  const teacherMap: Record<string, string> = {}; // userId -> teacher.id

  for (const t of teachersData) {
    const user = await prisma.user.upsert({
      where: { userId: t.userId },
      update: {},
      create: { userId: t.userId, passwordHash: await h(t.password), role: "teacher", name: t.name },
    });
    const teacher = await prisma.teacher.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, firstName: t.name, lastName: t.lastName, department: t.dept, position: "Багш" },
    });
    teacherMap[t.userId] = teacher.id;
    console.log(`  ✓ Багш: ${t.userId}`);
  }

  // ── Parents ───────────────────────────────────────────
  const parentsData = [
    { userId: "P211930019", name: "Батбаяр", password: "parent123", studentUserId: "B211930019" },
    { userId: "P211930020", name: "Дорж",    password: "parent123", studentUserId: "B211930020" },
  ];

  for (const p of parentsData) {
    const user = await prisma.user.upsert({
      where: { userId: p.userId },
      update: {},
      create: { userId: p.userId, passwordHash: await h(p.password), role: "parent", name: p.name },
    });
    const studentId = studentUsers[p.studentUserId];
    if (studentId) {
      await prisma.parentStudent.upsert({
        where: { parentId_studentId: { parentId: user.id, studentId } },
        update: {},
        create: { parentId: user.id, studentId },
      });
    }
    console.log(`  ✓ Эцэг/эх: ${p.userId}`);
  }

  // ── Admins ────────────────────────────────────────────
  const admins = [
    { userId: "admin",    name: "Системийн админ",  password: "admin123",    role: "admin"    as const, adminType: "full-admin"     },
    { userId: "training", name: "Сургалтын алба",   password: "training123", role: "training" as const, adminType: "training-admin" },
    { userId: "finance",  name: "Санхүүгийн алба",  password: "finance123",  role: "finance"  as const, adminType: "finance-admin"  },
  ];
  for (const a of admins) {
    await prisma.user.upsert({
      where: { userId: a.userId },
      update: {},
      create: { userId: a.userId, passwordHash: await h(a.password), role: a.role, name: a.name, adminType: a.adminType },
    });
    console.log(`  ✓ Админ: ${a.userId}`);
  }

  // ── Courses ───────────────────────────────────────────
  const coursesData = [
    { code: "CS101", name: "Python үндэс",          credits: 3, teacherUserId: "T001", room: "A-201", schedule: "Даваа, Пүрэв 10:00-11:30",    semester: "2025 Spring" },
    { code: "CS202", name: "JavaScript",             credits: 4, teacherUserId: "T001", room: "B-105", schedule: "Мягмар, Баасан 14:00-15:30",  semester: "2025 Spring" },
    { code: "CS303", name: "Networking",             credits: 3, teacherUserId: "T002", room: "C-302", schedule: "Лхагва 08:00-10:30",           semester: "2025 Spring" },
    { code: "CS404", name: "Database",               credits: 4, teacherUserId: "T001", room: "A-104", schedule: "Пүрэв, Баасан 16:00-17:30",   semester: "2025 Spring" },
    { code: "CS505", name: "UI/UX Design",           credits: 3, teacherUserId: "T003", room: "D-201", schedule: "Даваа, Лхагва 13:00-14:30",   semester: "2025 Spring" },
    { code: "CS606", name: "Cyber Security",         credits: 3, teacherUserId: "T003", room: "E-101", schedule: "Мягмар, Пүрэв 09:00-10:30",   semester: "2025 Spring" },
    { code: "CS707", name: "Java Fundamentals",      credits: 4, teacherUserId: "T002", room: "A-301", schedule: "Даваа, Баасан 11:00-12:30",   semester: "2025 Spring" },
    { code: "CS808", name: "React Development",      credits: 3, teacherUserId: "T001", room: "B-205", schedule: "Мягмар, Лхагва 15:00-16:30",  semester: "2025 Spring" },
    { code: "CS909", name: "Linux Administration",   credits: 3, teacherUserId: "T002", room: "C-101", schedule: "Пүрэв 14:00-16:30",           semester: "2025 Spring" },
  ];

  const courseMap: Record<string, string> = {}; // code -> course.id

  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: {},
      create: {
        code: c.code, name: c.name, credits: c.credits,
        teacherId: teacherMap[c.teacherUserId],
        room: c.room, schedule: c.schedule, semester: c.semester,
      },
    });
    courseMap[c.code] = course.id;
    console.log(`  ✓ Хичээл: ${c.code}`);
  }

  // ── Enrollments ───────────────────────────────────────
  const enrollCodes = ["CS101","CS202","CS303","CS404","CS505","CS606","CS707","CS808","CS909"];
  for (const [userId, studentId] of Object.entries(studentUsers)) {
    for (const code of enrollCodes) {
      const courseId = courseMap[code];
      if (!courseId) continue;
      await prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId, courseId } },
        update: {},
        create: { studentId, courseId },
      });
    }
    console.log(`  ✓ Бүртгэл: ${userId} (${enrollCodes.length} хичээл)`);
  }

  // ── Grades ────────────────────────────────────────────
  const gradeTemplates: Record<string, { quiz1: number; quiz2: number; midterm: number; assignment: number; attendance: number; final: number }> = {
    CS101: { quiz1: 9,   quiz2: 9.5, midterm: 27, assignment: 9,   attendance: 9,   final: 28 },
    CS202: { quiz1: 7.5, quiz2: 7,   midterm: 22, assignment: 7.5, attendance: 8,   final: 23 },
    CS303: { quiz1: 8.5, quiz2: 8,   midterm: 24, assignment: 8,   attendance: 9,   final: 25 },
    CS404: { quiz1: 7,   quiz2: 6.5, midterm: 20, assignment: 7,   attendance: 7.5, final: 21 },
    CS505: { quiz1: 10,  quiz2: 9.5, midterm: 28, assignment: 9.5, attendance: 9.5, final: 29 },
    CS606: { quiz1: 8,   quiz2: 8.5, midterm: 25, assignment: 8.5, attendance: 8,   final: 27 },
    CS707: { quiz1: 7,   quiz2: 7.5, midterm: 21, assignment: 7,   attendance: 7.5, final: 22 },
    CS808: { quiz1: 8.5, quiz2: 9,   midterm: 25, assignment: 8.5, attendance: 9,   final: 26 },
    CS909: { quiz1: 7.5, quiz2: 8,   midterm: 23, assignment: 7.5, attendance: 8,   final: 24 },
  };

  for (const [, studentId] of Object.entries(studentUsers)) {
    for (const [code, g] of Object.entries(gradeTemplates)) {
      const courseId = courseMap[code];
      if (!courseId) continue;
      const total = g.quiz1 + g.quiz2 + g.midterm + g.assignment + g.attendance + g.final;
      const letter = total >= 90 ? "A" : total >= 80 ? "B" : total >= 70 ? "C" : total >= 60 ? "D" : "F";
      await prisma.grade.upsert({
        where: { studentId_courseId_semester: { studentId, courseId, semester: "2025 Spring" } },
        update: {},
        create: { studentId, courseId, semester: "2025 Spring", ...g, totalScore: total, letterGrade: letter },
      });
    }
  }
  console.log("  ✓ Дүн бүртгэгдлээ");

  // ── Attendance ────────────────────────────────────────
  const today = new Date();
  for (const [, studentId] of Object.entries(studentUsers)) {
    for (const code of ["CS101","CS202","CS303"]) {
      const courseId = courseMap[code];
      if (!courseId) continue;
      for (let i = 1; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i * 7);
        const status = i === 3 ? "absent" : "present";
        await prisma.attendance.upsert({
          where: { studentId_courseId_date: { studentId, courseId, date } },
          update: {},
          create: { studentId, courseId, date, status },
        });
      }
    }
  }
  console.log("  ✓ Ирц бүртгэгдлээ");

  // ── Payments ──────────────────────────────────────────
  const paymentTerms = [
    { term: "2024 хавар", amount: 850000, status: "paid",    paidAt: new Date("2024-02-15") },
    { term: "2024 намар", amount: 850000, status: "paid",    paidAt: new Date("2024-09-10") },
    { term: "2025 хавар", amount: 900000, status: "paid",    paidAt: new Date("2025-02-20") },
    { term: "2025 намар", amount: 900000, status: "pending", paidAt: null },
  ];
  for (const [, studentId] of Object.entries(studentUsers)) {
    for (const pt of paymentTerms) {
      const existing = await prisma.payment.findFirst({ where: { studentId, term: pt.term } });
      if (!existing) {
        await prisma.payment.create({ data: { studentId, ...pt } });
      }
    }
  }
  console.log("  ✓ Төлбөр бүртгэгдлээ");

  // ── Timetable ─────────────────────────────────────────
  const timetableData = [
    { code: "CS101", dayOfWeek: 1, startTime: "10:00", endTime: "11:30", room: "A-201" },
    { code: "CS101", dayOfWeek: 4, startTime: "10:00", endTime: "11:30", room: "A-201" },
    { code: "CS202", dayOfWeek: 2, startTime: "14:00", endTime: "15:30", room: "B-105" },
    { code: "CS202", dayOfWeek: 5, startTime: "14:00", endTime: "15:30", room: "B-105" },
    { code: "CS303", dayOfWeek: 3, startTime: "08:00", endTime: "10:30", room: "C-302" },
    { code: "CS404", dayOfWeek: 4, startTime: "16:00", endTime: "17:30", room: "A-104" },
    { code: "CS404", dayOfWeek: 5, startTime: "16:00", endTime: "17:30", room: "A-104" },
    { code: "CS505", dayOfWeek: 1, startTime: "13:00", endTime: "14:30", room: "D-201" },
    { code: "CS505", dayOfWeek: 3, startTime: "13:00", endTime: "14:30", room: "D-201" },
  ];
  for (const t of timetableData) {
    const courseId = courseMap[t.code];
    if (!courseId) continue;
    const existing = await prisma.timetable.findFirst({ where: { courseId, dayOfWeek: t.dayOfWeek, startTime: t.startTime } });
    if (!existing) {
      await prisma.timetable.create({ data: { courseId, dayOfWeek: t.dayOfWeek, startTime: t.startTime, endTime: t.endTime, room: t.room } });
    }
  }
  console.log("  ✓ Хуваарь бүртгэгдлээ");

  // ── Salaries ──────────────────────────────────────────
  for (const [, teacherId] of Object.entries(teacherMap)) {
    for (const month of ["2025-03","2025-04","2025-05"]) {
      const existing = await prisma.salary.findFirst({ where: { teacherId, month } });
      if (!existing) {
        const base = 1800000;
        const bonus = month === "2025-05" ? 200000 : 0;
        await prisma.salary.create({ data: { teacherId, month, base, bonus, deduction: 0, net: base + bonus, status: month === "2025-05" ? "pending" : "paid", paidAt: month !== "2025-05" ? new Date() : null } });
      }
    }
  }
  console.log("  ✓ Цалин бүртгэгдлээ");

  // ── Notifications ─────────────────────────────────────
  for (const [, studentId] of Object.entries(studentUsers)) {
    const existing = await prisma.notification.findFirst({ where: { studentId } });
    if (!existing) {
      await prisma.notification.createMany({
        data: [
          { studentId, title: "Шалгалтын хуваарь", body: "2025 оны хавар улирлын шалгалт 6-р сарын 10-аас эхэлнэ.", type: "info" },
          { studentId, title: "Төлбөрийн мэдэгдэл", body: "2025 намрын улирлын төлбөр 9-р сарын 1-ний дотор төлнө үү.", type: "warning" },
          { studentId, title: "Тэтгэлэгийн мэдэгдэл", body: "Таны тэтгэлэгийн хүсэлт батлагдлаа.", type: "success" },
        ],
      });
    }
  }
  console.log("  ✓ Мэдэгдэл бүртгэгдлээ");

  console.log("\n✅ Seed амжилттай дууслаа!");
}

main().catch((e) => { console.error("❌", e); process.exit(1); }).finally(() => prisma.$disconnect());
