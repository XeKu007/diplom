const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  await p.parentStudent.deleteMany();
  await p.user.deleteMany();
  console.log("DB cleared");
}

main().catch(console.error).finally(() => p.$disconnect());
