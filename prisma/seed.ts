import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT = 12;
const h = (p: string) => bcrypt.hash(p, SALT);

async function main() {
  console.log("🌱 Seed эхэлж байна...");

  // ══════════════════════════════════════════════════════
  // STUDENTS — 5 account
  // ══════════════════════════════════════════════════════
  const studentsData = [
    {
      userId: "B211930019", name: "Төртэмүүлэн", lastName: "Батбаяр",
      password: "student123", email: "tortemuulen@indra.edu.mn",
      phone: "9900-1122", major: "Програм хангамж",
      classGroup: "SE-2021", semester: "8", enrollmentYear: "2021", gender: "Эрэгтэй",
    },
    {
      userId: "B211930020", name: "Мөнхбат", lastName: "Дорж",
      password: "student123", email: "munkhbat@indra.edu.mn",
      phone: "9911-2233", major: "Сүлжээний технологи",
      classGroup: "NT-2021", semester: "8", enrollmentYear: "2021", gender: "Эрэгтэй",
    },
    {
      userId: "B221930001", name: "Анхбаяр", lastName: "Гантулга",
      password: "student123", email: "ankhbayar@indra.edu.mn",
      phone: "9922-3344", major: "Програм хангамж",
      classGroup: "SE-2022", semester: "6", enrollmentYear: "2022", gender: "Эрэгтэй",
    },
    {
      userId: "B221930002", name: "Номин", lastName: "Цэрэн",
      password: "student123", email: "nomin@indra.edu.mn",
      phone: "9933-4455", major: "Мэдээллийн аюулгүй байдал",
      classGroup: "IS-2022", semester: "6", enrollmentYear: "2022", gender: "Эмэгтэй",
    },
    {
      userId: "B231930001", name: "Энхжаргал", lastName: "Сүрэн",
      password: "student123", email: "enkhjargal@indra.edu.mn",
      phone: "9944-5566", major: "Мэдээлэл зүй",
      classGroup: "IT-2023", semester: "4", enrollmentYear: "2023", gender: "Эмэгтэй",
    },
  ];

  const studentUsers: Record<string, string> = {}; // userId -> student.id

  for (const s of studentsData) {
    const user = await prisma.user.upsert({
      where: { userId: s.userId },
      update: {},
      create: {
        userId: s.userId,
        passwordHash: await h(s.password),
        role: "student",
        name: s.name,
      },
    });
    const student = await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        firstName: s.name,
        lastName: s.lastName,
        email: s.email,
        phone: s.phone,
        major: s.major,
        classGroup: s.classGroup,
        semester: s.semester,
        enrollmentYear: s.enrollmentYear,
        gender: s.gender,
        scholarship: "Тэтгэлэгтэй",
      },
    });
    studentUsers[s.userId] = student.id;
    console.log(`  ✓ Оюутан: ${s.userId} (${s.name})`);
  }

  // ══════════════════════════════════════════════════════
  // TEACHERS — 5 account
  // ══════════════════════════════════════════════════════
  const teachersData = [
    {
      userId: "T001", name: "Батбаяр", lastName: "Ганбат",
      password: "teacher123", dept: "Програм хангамж", position: "Ахлах багш",
    },
    {
      userId: "T002", name: "Энхбаяр", lastName: "Цэнд",
      password: "teacher123", dept: "Сүлжээний технологи", position: "Багш",
    },
    {
      userId: "T003", name: "Наранцэцэг", lastName: "Дорж",
      password: "teacher123", dept: "Мэдээллийн аюулгүй байдал", position: "Багш",
    },
    {
      userId: "T004", name: "Ганзориг", lastName: "Лхагва",
      password: "teacher123", dept: "Мэдээлэл зүй", position: "Дэд профессор",
    },
    {
      userId: "T005", name: "Оюунцэцэг", lastName: "Бат",
      password: "teacher123", dept: "Програм хангамж", position: "Багш",
    },
  ];

  const teacherMap: Record<string, string> = {}; // userId -> teacher.id

  for (const t of teachersData) {
    const user = await prisma.user.upsert({
      where: { userId: t.userId },
      update: {},
      create: {
        userId: t.userId,
        passwordHash: await h(t.password),
        role: "teacher",
        name: t.name,
      },
    });
    const teacher = await prisma.teacher.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        firstName: t.name,
        lastName: t.lastName,
        department: t.dept,
        position: t.position,
      },
    });
    teacherMap[t.userId] = teacher.id;
    console.log(`  ✓ Багш: ${t.userId} (${t.name})`);
  }

  // ══════════════════════════════════════════════════════
  // PARENTS — 5 account (оюутан тус бүрд нэг)
  // ══════════════════════════════════════════════════════
  const parentsData = [
    { userId: "P211930019", name: "Батбаяр",   password: "parent123", studentUserId: "B211930019" },
    { userId: "P211930020", name: "Дорж",       password: "parent123", studentUserId: "B211930020" },
    { userId: "P221930001", name: "Гантулга",   password: "parent123", studentUserId: "B221930001" },
    { userId: "P221930002", name: "Цэрэн",      password: "parent123", studentUserId: "B221930002" },
    { userId: "P231930001", name: "Сүрэн",      password: "parent123", studentUserId: "B231930001" },
  ];

  for (const p of parentsData) {
    const user = await prisma.user.upsert({
      where: { userId: p.userId },
      update: {},
      create: {
        userId: p.userId,
        passwordHash: await h(p.password),
        role: "parent",
        name: p.name,
      },
    });
    const studentId = studentUsers[p.studentUserId];
    if (studentId) {
      await prisma.parentStudent.upsert({
        where: { parentId_studentId: { parentId: user.id, studentId } },
        update: {},
        create: { parentId: user.id, studentId },
      });
    }
    console.log(`  ✓ Эцэг/эх: ${p.userId} (${p.name}) → ${p.studentUserId}`);
  }

  // ══════════════════════════════════════════════════════
  // ADMINS — 1 бүрэн эрхт + 5 сургалтын + 5 санхүүгийн
  // ══════════════════════════════════════════════════════
  const adminsData = [
    // Бүрэн эрхт — 1 account
    {
      userId: "admin",
      name: "Системийн админ",
      password: "admin123",
      role: "admin" as const,
      adminType: "full-admin",
    },
    // Сургалтын алба — 5 account
    {
      userId: "training001",
      name: "Ганбаатар",
      password: "training123",
      role: "training" as const,
      adminType: "training-admin",
    },
    {
      userId: "training002",
      name: "Энхтуяа",
      password: "training123",
      role: "training" as const,
      adminType: "training-admin",
    },
    {
      userId: "training003",
      name: "Болормаа",
      password: "training123",
      role: "training" as const,
      adminType: "training-admin",
    },
    {
      userId: "training004",
      name: "Дэлгэрмаа",
      password: "training123",
      role: "training" as const,
      adminType: "training-admin",
    },
    {
      userId: "training005",
      name: "Нарантуяа",
      password: "training123",
      role: "training" as const,
      adminType: "training-admin",
    },
    // Санхүүгийн алба — 5 account
    {
      userId: "finance001",
      name: "Цэрэнпунцаг",
      password: "finance123",
      role: "finance" as const,
      adminType: "finance-admin",
    },
    {
      userId: "finance002",
      name: "Мөнхзул",
      password: "finance123",
      role: "finance" as const,
      adminType: "finance-admin",
    },
    {
      userId: "finance003",
      name: "Оюунбилэг",
      password: "finance123",
      role: "finance" as const,
      adminType: "finance-admin",
    },
    {
      userId: "finance004",
      name: "Сарантуяа",
      password: "finance123",
      role: "finance" as const,
      adminType: "finance-admin",
    },
    {
      userId: "finance005",
      name: "Энхбаяр",
      password: "finance123",
      role: "finance" as const,
      adminType: "finance-admin",
    },
  ];

  for (const a of adminsData) {
    await prisma.user.upsert({
      where: { userId: a.userId },
      update: {},
      create: {
        userId: a.userId,
        passwordHash: await h(a.password),
        role: a.role,
        name: a.name,
        adminType: a.adminType,
      },
    });
    console.log(`  ✓ ${a.role === "admin" ? "Бүрэн эрхт админ" : a.role === "training" ? "Сургалтын алба" : "Санхүүгийн алба"}: ${a.userId} (${a.name})`);
  }

  // ══════════════════════════════════════════════════════
  // COURSES
  // ══════════════════════════════════════════════════════
  const coursesData = [
    { code: "CS101", name: "Python үндэс",        credits: 3, teacherUserId: "T001", room: "A-201", schedule: "Даваа, Пүрэв 10:00-11:30",   semester: "2025 Spring" },
    { code: "CS202", name: "JavaScript",           credits: 4, teacherUserId: "T001", room: "B-105", schedule: "Мягмар, Баасан 14:00-15:30", semester: "2025 Spring" },
    { code: "CS303", name: "Networking",           credits: 3, teacherUserId: "T002", room: "C-302", schedule: "Лхагва 08:00-10:30",          semester: "2025 Spring" },
    { code: "CS404", name: "Database",             credits: 4, teacherUserId: "T001", room: "A-104", schedule: "Пүрэв, Баасан 16:00-17:30",  semester: "2025 Spring" },
    { code: "CS505", name: "UI/UX Design",         credits: 3, teacherUserId: "T003", room: "D-201", schedule: "Даваа, Лхагва 13:00-14:30",  semester: "2025 Spring" },
    { code: "CS606", name: "Cyber Security",       credits: 3, teacherUserId: "T003", room: "E-101", schedule: "Мягмар, Пүрэв 09:00-10:30",  semester: "2025 Spring" },
    { code: "CS707", name: "Java Fundamentals",    credits: 4, teacherUserId: "T002", room: "A-301", schedule: "Даваа, Баасан 11:00-12:30",  semester: "2025 Spring" },
    { code: "CS808", name: "React Development",    credits: 3, teacherUserId: "T005", room: "B-205", schedule: "Мягмар, Лхагва 15:00-16:30", semester: "2025 Spring" },
    { code: "CS909", name: "Linux Administration", credits: 3, teacherUserId: "T002", room: "C-101", schedule: "Пүрэв 14:00-16:30",          semester: "2025 Spring" },
    { code: "CS010", name: "Data Structures",      credits: 4, teacherUserId: "T004", room: "A-202", schedule: "Даваа, Мягмар 09:00-10:30",  semester: "2025 Spring" },
  ];

  const courseMap: Record<string, string> = {};

  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: {},
      create: {
        code: c.code,
        name: c.name,
        credits: c.credits,
        teacherId: teacherMap[c.teacherUserId],
        room: c.room,
        schedule: c.schedule,
        semester: c.semester,
      },
    });
    courseMap[c.code] = course.id;
    console.log(`  ✓ Хичээл: ${c.code} — ${c.name}`);
  }

  // ══════════════════════════════════════════════════════
  // ENROLLMENTS
  // ══════════════════════════════════════════════════════
  const enrollCodes = Object.keys(courseMap);
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

  // ══════════════════════════════════════════════════════
  // GRADES — оюутан тус бүрд арай өөр оноо
  // ══════════════════════════════════════════════════════
  const gradeVariants = [
    { quiz1: 9,   quiz2: 9.5, midterm: 27, assignment: 9,   attendance: 9,   final: 28 }, // ~91.5 A
    { quiz1: 7.5, quiz2: 7,   midterm: 22, assignment: 7.5, attendance: 8,   final: 23 }, // ~75   C
    { quiz1: 8.5, quiz2: 8,   midterm: 24, assignment: 8,   attendance: 9,   final: 25 }, // ~82.5 B
    { quiz1: 7,   quiz2: 6.5, midterm: 20, assignment: 7,   attendance: 7.5, final: 21 }, // ~69   D
    { quiz1: 10,  quiz2: 9.5, midterm: 28, assignment: 9.5, attendance: 9.5, final: 29 }, // ~95.5 A
  ];

  const studentIds = Object.values(studentUsers);
  for (let si = 0; si < studentIds.length; si++) {
    const studentId = studentIds[si];
    const variant = gradeVariants[si % gradeVariants.length];
    for (const code of enrollCodes) {
      const courseId = courseMap[code];
      if (!courseId) continue;
      // Хичээл тус бүрд арай өөр оноо
      const offset = (enrollCodes.indexOf(code) % 3) - 1; // -1, 0, 1
      const g = {
        quiz1:      Math.min(10, Math.max(0, variant.quiz1 + offset * 0.5)),
        quiz2:      Math.min(10, Math.max(0, variant.quiz2 + offset * 0.5)),
        midterm:    Math.min(30, Math.max(0, variant.midterm + offset * 1)),
        assignment: Math.min(10, Math.max(0, variant.assignment + offset * 0.5)),
        attendance: Math.min(10, Math.max(0, variant.attendance)),
        final:      Math.min(30, Math.max(0, variant.final + offset * 1)),
      };
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

  // ══════════════════════════════════════════════════════
  // ATTENDANCE
  // ══════════════════════════════════════════════════════
  const today = new Date();
  for (let si = 0; si < studentIds.length; si++) {
    const studentId = studentIds[si];
    for (const code of ["CS101", "CS202", "CS303", "CS404", "CS505"]) {
      const courseId = courseMap[code];
      if (!courseId) continue;
      for (let i = 1; i <= 8; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i * 7);
        // Оюутан тус бүрд өөр өөр ирцийн хэв маяг
        const absent = si === 3 ? [2, 5, 7] : si === 1 ? [4, 6] : [3];
        const status = absent.includes(i) ? "absent" : "present";
        await prisma.attendance.upsert({
          where: { studentId_courseId_date: { studentId, courseId, date } },
          update: {},
          create: { studentId, courseId, date, status },
        });
      }
    }
  }
  console.log("  ✓ Ирц бүртгэгдлээ");

  // ══════════════════════════════════════════════════════
  // PAYMENTS
  // ══════════════════════════════════════════════════════
  const paymentTerms = [
    { term: "2024 хавар", amount: 850000, status: "paid",    paidAt: new Date("2024-02-15") },
    { term: "2024 намар", amount: 850000, status: "paid",    paidAt: new Date("2024-09-10") },
    { term: "2025 хавар", amount: 900000, status: "paid",    paidAt: new Date("2025-02-20") },
    { term: "2025 намар", amount: 900000, status: "pending", paidAt: null },
  ];
  for (let si = 0; si < studentIds.length; si++) {
    const studentId = studentIds[si];
    for (const pt of paymentTerms) {
      // 3-р оюутан сүүлийн 2 улирлын төлбөрийг төлөөгүй
      const overrideStatus = si === 2 && pt.term === "2025 хавар" ? "overdue" : pt.status;
      const existing = await prisma.payment.findFirst({ where: { studentId, term: pt.term } });
      if (!existing) {
        await prisma.payment.create({
          data: { studentId, term: pt.term, amount: pt.amount, status: overrideStatus, paidAt: overrideStatus === "paid" ? pt.paidAt : null },
        });
      }
    }
  }
  console.log("  ✓ Төлбөр бүртгэгдлээ");

  // ══════════════════════════════════════════════════════
  // TIMETABLE
  // ══════════════════════════════════════════════════════
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
    { code: "CS606", dayOfWeek: 2, startTime: "09:00", endTime: "10:30", room: "E-101" },
    { code: "CS606", dayOfWeek: 4, startTime: "09:00", endTime: "10:30", room: "E-101" },
    { code: "CS010", dayOfWeek: 1, startTime: "09:00", endTime: "10:30", room: "A-202" },
    { code: "CS010", dayOfWeek: 2, startTime: "09:00", endTime: "10:30", room: "A-202" },
  ];
  for (const t of timetableData) {
    const courseId = courseMap[t.code];
    if (!courseId) continue;
    const existing = await prisma.timetable.findFirst({
      where: { courseId, dayOfWeek: t.dayOfWeek, startTime: t.startTime },
    });
    if (!existing) {
      await prisma.timetable.create({
        data: { courseId, dayOfWeek: t.dayOfWeek, startTime: t.startTime, endTime: t.endTime, room: t.room },
      });
    }
  }
  console.log("  ✓ Хуваарь бүртгэгдлээ");

  // ══════════════════════════════════════════════════════
  // SALARIES — 5 багш тус бүрд 3 сарын цалин
  // ══════════════════════════════════════════════════════
  const salaryBase: Record<string, number> = {
    T001: 2200000, // Ахлах багш
    T002: 1900000,
    T003: 1900000,
    T004: 2500000, // Дэд профессор
    T005: 1800000,
  };
  for (const [tUserId, teacherId] of Object.entries(teacherMap)) {
    const base = salaryBase[tUserId] ?? 1800000;
    for (const month of ["2025-03", "2025-04", "2025-05"]) {
      const existing = await prisma.salary.findFirst({ where: { teacherId, month } });
      if (!existing) {
        const bonus = month === "2025-05" ? 200000 : 0;
        const deduction = month === "2025-03" ? 50000 : 0;
        await prisma.salary.create({
          data: {
            teacherId,
            month,
            base,
            bonus,
            deduction,
            net: base + bonus - deduction,
            status: month === "2025-05" ? "pending" : "paid",
            paidAt: month !== "2025-05" ? new Date() : null,
          },
        });
      }
    }
  }
  console.log("  ✓ Цалин бүртгэгдлээ");

  // ══════════════════════════════════════════════════════
  // NOTIFICATIONS — оюутан тус бүрд
  // ══════════════════════════════════════════════════════
  for (const studentId of studentIds) {
    const existing = await prisma.notification.findFirst({ where: { studentId } });
    if (!existing) {
      await prisma.notification.createMany({
        data: [
          { studentId, title: "Шалгалтын хуваарь",   body: "2025 оны хавар улирлын шалгалт 6-р сарын 10-аас эхэлнэ.", type: "info"    },
          { studentId, title: "Төлбөрийн мэдэгдэл",  body: "2025 намрын улирлын төлбөр 9-р сарын 1-ний дотор төлнө үү.", type: "warning" },
          { studentId, title: "Тэтгэлэгийн мэдэгдэл", body: "Таны тэтгэлэгийн хүсэлт батлагдлаа.", type: "success" },
        ],
      });
    }
  }
  console.log("  ✓ Мэдэгдэл бүртгэгдлээ");

  // ══════════════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════════════
  console.log("\n✅ Seed амжилттай дууслаа!");
  console.log("─────────────────────────────────────────");
  console.log("📋 Нэвтрэх мэдээлэл:");
  console.log("");
  console.log("👑 Бүрэн эрхт админ (1):");
  console.log("   admin / admin123");
  console.log("");
  console.log("📚 Сургалтын алба (5):");
  console.log("   training001 ~ training005 / training123");
  console.log("");
  console.log("💰 Санхүүгийн алба (5):");
  console.log("   finance001 ~ finance005 / finance123");
  console.log("");
  console.log("🎓 Оюутан (5):");
  console.log("   B211930019, B211930020, B221930001, B221930002, B231930001 / student123");
  console.log("");
  console.log("🧑‍🏫 Багш (5):");
  console.log("   T001 ~ T005 / teacher123");
  console.log("");
  console.log("👨‍👩‍👧 Эцэг/эх (5):");
  console.log("   P211930019, P211930020, P221930001, P221930002, P231930001 / parent123");
  console.log("─────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed алдаа:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
