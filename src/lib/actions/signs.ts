"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Sign } from "@/types/sign";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

const difficultyStarsMap: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

function toSign(row: {
  id: string;
  word: string;
  wordAr: string;
  wordFr: string;
  categoryId: string;
  difficulty: string;
  difficultyStars: number;
  thumbnail: string;
  videoUrl: string;
  videoDuration: string;
}): Sign {
  return {
    id: row.id,
    word: row.word,
    wordAr: row.wordAr,
    wordFr: row.wordFr,
    category: row.categoryId,
    difficulty: row.difficulty as Sign["difficulty"],
    difficultyStars: row.difficultyStars,
    thumbnail: row.thumbnail,
    videoUrl: row.videoUrl,
    videoDuration: row.videoDuration,
  };
}

export async function getSigns(): Promise<Sign[]> {
  const rows = await prisma.sign.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toSign);
}

export async function getSignById(id: string): Promise<Sign | null> {
  const row = await prisma.sign.findUnique({ where: { id } });
  return row ? toSign(row) : null;
}

export async function createSign(formData: FormData) {
  await requireAdmin();
  const difficulty = formData.get("difficulty") as string;
  const row = await prisma.sign.create({
    data: {
      word: formData.get("word") as string,
      wordAr: formData.get("wordAr") as string,
      wordFr: formData.get("wordFr") as string,
      categoryId: formData.get("category") as string,
      difficulty: difficulty as "beginner" | "intermediate" | "advanced",
      difficultyStars: difficultyStarsMap[difficulty] ?? 1,
      thumbnail: formData.get("thumbnail") as string,
      videoUrl: formData.get("videoUrl") as string,
      videoDuration: formData.get("videoDuration") as string,
    },
  });
  revalidatePath("/[locale]/dictionary");
  revalidatePath("/[locale]/admin/signs");
  return { success: true, id: row.id };
}

export async function updateSign(id: string, formData: FormData) {
  await requireAdmin();
  const difficulty = formData.get("difficulty") as string;
  try {
    await prisma.sign.update({
      where: { id },
      data: {
        word: formData.get("word") as string,
        wordAr: formData.get("wordAr") as string,
        wordFr: formData.get("wordFr") as string,
        categoryId: formData.get("category") as string,
        difficulty: difficulty as "beginner" | "intermediate" | "advanced",
        difficultyStars: difficultyStarsMap[difficulty] ?? 1,
        thumbnail: formData.get("thumbnail") as string,
        videoUrl: formData.get("videoUrl") as string,
        videoDuration: formData.get("videoDuration") as string,
      },
    });
  } catch {
    return { error: "notFound" };
  }
  revalidatePath("/[locale]/dictionary");
  revalidatePath("/[locale]/admin/signs");
  return { success: true };
}

export async function deleteSign(id: string) {
  await requireAdmin();
  try {
    await prisma.sign.delete({ where: { id } });
  } catch {
    return { error: "notFound" };
  }
  revalidatePath("/[locale]/dictionary");
  revalidatePath("/[locale]/admin/signs");
  return { success: true };
}
