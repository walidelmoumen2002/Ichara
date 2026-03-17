"use server";

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
