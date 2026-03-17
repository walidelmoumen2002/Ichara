"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
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

export async function fetchQuizSigns(
  category: string | null,
  count: number
): Promise<Sign[]> {
  const where =
    category && category !== "all" ? { categoryId: category } : undefined;

  const total = await prisma.sign.count({ where });
  if (total === 0) return [];

  // Fetch all matching signs and shuffle client-side for true randomness
  const rows = await prisma.sign.findMany({ where });
  const signs = rows.map(toSign);

  // Fisher-Yates shuffle
  for (let i = signs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [signs[i], signs[j]] = [signs[j], signs[i]];
  }

  return signs.slice(0, count);
}

export interface QuizResultData {
  category: string | null;
  totalRounds: number;
  totalQuestions: number;
  totalCorrect: number;
  score: number;
  timeSpent: number;
}

export interface QuizResultRow {
  id: string;
  category: string | null;
  totalRounds: number;
  totalQuestions: number;
  totalCorrect: number;
  score: number;
  timeSpent: number;
  completedAt: Date;
}

export async function saveQuizResult(data: QuizResultData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthorized" };

  await prisma.$transaction(async (tx) => {
    await tx.quizResult.create({
      data: {
        userId: session.user!.id!,
        category: data.category,
        totalRounds: data.totalRounds,
        totalQuestions: data.totalQuestions,
        totalCorrect: data.totalCorrect,
        score: data.score,
        timeSpent: data.timeSpent,
      },
    });

    await tx.activity.create({
      data: {
        userId: session.user!.id!,
        type: "quiz_completed",
        signWord: `${data.score}%`,
        signWordAr: `${data.score}٪`,
        milestone: data.totalCorrect,
      },
    });
  });

  revalidatePath("/[locale]/dashboard");
  return { success: true };
}

export async function fetchQuizHistory(): Promise<QuizResultRow[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await prisma.quizResult.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    totalRounds: r.totalRounds,
    totalQuestions: r.totalQuestions,
    totalCorrect: r.totalCorrect,
    score: r.score,
    timeSpent: r.timeSpent,
    completedAt: r.completedAt,
  }));
}
