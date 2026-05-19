import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";

export interface AuthUser {
  id: string;
  userId: string;
  role: Role;
  name: string;
  adminType?: string | null;
  parentStudentId?: string | null;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isTimeout =
        err instanceof Error &&
        (err.message.includes("Timed out") || err.message.includes("connection pool"));
      if (isTimeout && i < retries - 1) {
        await new Promise((r) => setTimeout(r, delay * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded");
}

export async function findUser(
  userId: string,
  password: string,
  role: string
): Promise<AuthUser | null> {
  const user = await withRetry(() =>
    prisma.user.findFirst({
      where: {
        userId,
        isActive: true,
        role: role as Role,
      },
    })
  );

  if (!user) return null;

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) return null;

  let parentStudentId: string | null = null;
  if (user.role === "parent") {
    const link = await withRetry(() =>
      prisma.parentStudent.findFirst({ where: { parentId: user.id } })
    );
    parentStudentId = link?.studentId ?? null;
  }

  return {
    id:              user.id,
    userId:          user.userId,
    role:            user.role,
    name:            user.name,
    adminType:       user.adminType,
    parentStudentId,
  };
}
