const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  console.log("🗑️  Бүх өгөгдлийг устгаж байна...");

  // Дарааллаар устгах (FK constraint-ийн дагуу)
  const r1 = await p.auditLog.deleteMany();
  console.log(`  ✓ AuditLog: ${r1.count}`);

  const r2 = await p.notification.deleteMany();
  console.log(`  ✓ Notification: ${r2.count}`);

  const r3 = await p.salary.deleteMany();
  console.log(`  ✓ Salary: ${r3.count}`);

  const r4 = await p.timetable.deleteMany();
  console.log(`  ✓ Timetable: ${r4.count}`);

  const r5 = await p.payment.deleteMany();
  console.log(`  ✓ Payment: ${r5.count}`);

  const r6 = await p.attendance.deleteMany();
  console.log(`  ✓ Attendance: ${r6.count}`);

  const r7 = await p.grade.deleteMany();
  console.log(`  ✓ Grade: ${r7.count}`);

  const r8 = await p.enrollment.deleteMany();
  console.log(`  ✓ Enrollment: ${r8.count}`);

  const r9 = await p.course.deleteMany();
  console.log(`  ✓ Course: ${r9.count}`);

  const r10 = await p.parentStudent.deleteMany();
  console.log(`  ✓ ParentStudent: ${r10.count}`);

  const r11 = await p.student.deleteMany();
  console.log(`  ✓ Student: ${r11.count}`);

  const r12 = await p.teacher.deleteMany();
  console.log(`  ✓ Teacher: ${r12.count}`);

  const r13 = await p.user.deleteMany();
  console.log(`  ✓ User: ${r13.count}`);

  console.log("\n✅ Бүх өгөгдөл устгагдлаа!");
}

main().catch(console.error).finally(() => p.$disconnect());
