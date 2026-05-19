const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const p = new PrismaClient();

async function main() {
  const admins = [
    { userId: "admin",    password: "admin123",    role: "admin",    name: "Системийн админ",  adminType: "full-admin"     },
    { userId: "training", password: "training123", role: "training", name: "Сургалтын алба",   adminType: "training-admin" },
    { userId: "finance",  password: "finance123",  role: "finance",  name: "Санхүүгийн алба",  adminType: "finance-admin"  },
  ];

  for (const a of admins) {
    const existing = await p.user.findUnique({ where: { userId: a.userId } });
    if (existing) {
      console.log(`  ⚠️  Аль хэдийн байна: ${a.userId}`);
      continue;
    }
    await p.user.create({
      data: {
        userId:       a.userId,
        passwordHash: await bcrypt.hash(a.password, 12),
        role:         a.role,
        name:         a.name,
        adminType:    a.adminType,
      },
    });
    console.log(`  ✓ Үүсгэлээ: ${a.userId} / ${a.password}`);
  }

  console.log("\n✅ Дууслаа!");
}

main().catch(console.error).finally(() => p.$disconnect());
