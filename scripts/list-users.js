const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const users = await p.user.findMany({
    select: { userId: true, role: true, name: true, adminType: true, isActive: true },
    orderBy: { role: "asc" },
  });

  console.log("\n=== DB-д байгаа хэрэглэгчид ===\n");
  console.log("Роль       | ID                   | Нэр                  | AdminType");
  console.log("-".repeat(75));
  users.forEach((u) => {
    const active = u.isActive ? "" : " [INACTIVE]";
    console.log(
      u.role.padEnd(10) + " | " +
      u.userId.padEnd(20) + " | " +
      u.name.padEnd(20) + " | " +
      (u.adminType ?? "—") + active
    );
  });
  console.log("\nНийт:", users.length, "хэрэглэгч");
}

main().catch(console.error).finally(() => p.$disconnect());
