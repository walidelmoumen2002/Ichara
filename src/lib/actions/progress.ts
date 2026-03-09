"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  markSignLearned,
  getDashboardData,
  getUserLearnedSignIds,
} from "@/lib/progress";
import type { Sign } from "@/types/sign";

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

export async function markSignAsLearned(signId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthorized" };

  const signRow = await prisma.sign.findUnique({ where: { id: signId } });
  if (!signRow) return { error: "notFound" };

  const sign = toSign(signRow);
  const result = await markSignLearned(session.user.id, sign);

  revalidatePath("/[locale]/dashboard");
  revalidatePath("/[locale]/lessons");

  return { success: true, alreadyLearned: result.alreadyLearned };
}

export async function fetchDashboardData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [signRows, categories] = await Promise.all([
    prisma.sign.findMany(),
    prisma.category.findMany(),
  ]);

  const allSigns: Sign[] = signRows.map(toSign);
  const categoryIds = categories.map((c) => c.id);

  return getDashboardData(session.user.id, allSigns, categoryIds);
}

export async function fetchLearnedSignIds() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return getUserLearnedSignIds(session.user.id);
}
