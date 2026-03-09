import { prisma } from "@/lib/db";
import type { Sign } from "@/types/sign";

export interface Activity {
  id: string;
  type: "learned_sign" | "streak_milestone";
  signId?: string;
  signWord?: string;
  signWordAr?: string;
  milestone?: number;
  timestamp: Date;
}

export interface DashboardData {
  signsLearned: number;
  totalSigns: number;
  currentStreak: number;
  bestStreak: number;
  categoryProgress: {
    categoryId: string;
    learned: number;
    total: number;
    progress: number;
  }[];
  achievements: {
    id: string;
    unlocked: boolean;
  }[];
  recentActivities: Activity[];
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export async function markSignLearned(
  userId: string,
  sign: Sign
): Promise<{ alreadyLearned: boolean }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { alreadyLearned: false };

  const existing = await prisma.learnedSign.findUnique({
    where: { userId_signId: { userId, signId: sign.id } },
  });
  if (existing) return { alreadyLearned: true };

  await prisma.$transaction(async (tx) => {
    await tx.learnedSign.create({
      data: { userId, signId: sign.id },
    });

    const progress = await tx.userProgress.upsert({
      where: { userId },
      update: {},
      create: { userId, lastActiveDate: "", currentStreak: 0, bestStreak: 0 },
    });

    const today = todayStr();
    let { currentStreak, bestStreak, lastActiveDate } = progress;

    if (lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastActiveDate === yesterdayStr) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
      lastActiveDate = today;
      if (currentStreak > bestStreak) bestStreak = currentStreak;

      await tx.userProgress.update({
        where: { userId },
        data: { currentStreak, bestStreak, lastActiveDate },
      });
    }

    await tx.activity.create({
      data: {
        userId,
        type: "learned_sign",
        signId: sign.id,
        signWord: sign.word,
        signWordAr: sign.wordAr,
      },
    });

    if (currentStreak === 7 || currentStreak === 30) {
      await tx.activity.create({
        data: {
          userId,
          type: "streak_milestone",
          milestone: currentStreak,
        },
      });
    }
  });

  return { alreadyLearned: false };
}

export async function getUserLearnedSignIds(userId: string): Promise<string[]> {
  const rows = await prisma.learnedSign.findMany({
    where: { userId },
    select: { signId: true },
  });
  return rows.map((r) => r.signId);
}

export async function getDashboardData(
  userId: string,
  allSigns: Sign[],
  categoryIds: string[]
): Promise<DashboardData> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return {
      signsLearned: 0,
      totalSigns: allSigns.length,
      currentStreak: 0,
      bestStreak: 0,
      categoryProgress: categoryIds
        .filter((id) => id !== "all")
        .map((categoryId) => {
          const catSigns = allSigns.filter((s) => s.category === categoryId);
          return { categoryId, learned: 0, total: catSigns.length, progress: 0 };
        }),
      achievements: [
        { id: "first-sign", unlocked: false },
        { id: "streak-7", unlocked: false },
        { id: "five-signs", unlocked: false },
        { id: "category-complete", unlocked: false },
        { id: "streak-30", unlocked: false },
        { id: "all-signs", unlocked: false },
      ],
      recentActivities: [],
    };
  }

  const [progressRow, learnedRows, recentActivities] = await Promise.all([
    prisma.userProgress.findUnique({ where: { userId } }),
    prisma.learnedSign.findMany({
      where: { userId },
      select: { signId: true },
    }),
    prisma.activity.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 10,
    }),
  ]);

  const progress = progressRow ?? {
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: "",
  };

  const learned = new Set(learnedRows.map((r) => r.signId));

  const categoryProgress = categoryIds
    .filter((id) => id !== "all")
    .map((categoryId) => {
      const catSigns = allSigns.filter((s) => s.category === categoryId);
      const catLearned = catSigns.filter((s) => learned.has(s.id)).length;
      return {
        categoryId,
        learned: catLearned,
        total: catSigns.length,
        progress:
          catSigns.length > 0
            ? Math.round((catLearned / catSigns.length) * 100)
            : 0,
      };
    });

  const completedCategories = categoryProgress.filter(
    (c) => c.total > 0 && c.learned === c.total
  ).length;

  const achievements = [
    { id: "first-sign", unlocked: learned.size >= 1 },
    { id: "streak-7", unlocked: progress.bestStreak >= 7 },
    { id: "five-signs", unlocked: learned.size >= 5 },
    { id: "category-complete", unlocked: completedCategories >= 1 },
    { id: "streak-30", unlocked: progress.bestStreak >= 30 },
    {
      id: "all-signs",
      unlocked: learned.size === allSigns.length && allSigns.length > 0,
    },
  ];

  return {
    signsLearned: learned.size,
    totalSigns: allSigns.length,
    currentStreak: progress.currentStreak,
    bestStreak: progress.bestStreak,
    categoryProgress,
    achievements,
    recentActivities: recentActivities.map((a) => ({
      id: a.id,
      type: a.type as Activity["type"],
      signId: a.signId ?? undefined,
      signWord: a.signWord ?? undefined,
      signWordAr: a.signWordAr ?? undefined,
      milestone: a.milestone ?? undefined,
      timestamp: a.timestamp,
    })),
  };
}
