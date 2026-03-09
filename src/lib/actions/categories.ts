"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Category } from "@/types/category";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: { id: "asc" } });
  return [
    { id: "all", labelEn: "All", labelAr: "الكل" },
    ...rows.map((r) => ({ id: r.id, labelEn: r.labelEn, labelAr: r.labelAr })),
  ];
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  try {
    await prisma.category.create({
      data: {
        id,
        labelEn: formData.get("labelEn") as string,
        labelAr: formData.get("labelAr") as string,
      },
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { error: "errorCategoryExists" };
    }
    throw error;
  }
  revalidatePath("/[locale]/dictionary");
  revalidatePath("/[locale]/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  try {
    await prisma.category.update({
      where: { id },
      data: {
        labelEn: formData.get("labelEn") as string,
        labelAr: formData.get("labelAr") as string,
      },
    });
  } catch {
    return { error: "notFound" };
  }
  revalidatePath("/[locale]/dictionary");
  revalidatePath("/[locale]/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  if (id === "all") return { error: "errorCannotDeleteAll" };
  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    return { error: "notFound" };
  }
  revalidatePath("/[locale]/dictionary");
  revalidatePath("/[locale]/admin/categories");
  return { success: true };
}
