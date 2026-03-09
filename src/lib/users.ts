import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import type { User } from "@/types/user";

function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  return !!adminEmail && email.toLowerCase() === adminEmail.toLowerCase();
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    hashedPassword: user.hashedPassword,
    role: user.role,
  };
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        hashedPassword,
        role: isAdminEmail(email) ? "admin" : "user",
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      hashedPassword: user.hashedPassword,
      role: user.role,
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      throw new Error("User with this email already exists");
    }
    throw error;
  }
}

export async function getUsers(): Promise<
  { id: string; name: string; email: string; role: "user" | "admin"; createdAt: Date }[]
> {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.hashedPassword);
  return isValid ? user : null;
}
