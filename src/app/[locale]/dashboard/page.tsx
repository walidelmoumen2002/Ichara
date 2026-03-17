import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { fetchDashboardData } from "@/lib/actions/progress";
import { fetchQuizHistory } from "@/lib/actions/quiz";
import { DashboardStatCards } from "@/components/dashboard/stat-cards";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { Achievements } from "@/components/dashboard/achievements";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuizHistory } from "@/components/dashboard/quiz-history";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MaterialIcon } from "@/components/shared/material-icon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("dashboard.title"),
    description: t("dashboard.description"),
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations("Dashboard");
  const [data, quizHistory] = await Promise.all([
    fetchDashboardData(),
    fetchQuizHistory(),
  ]);

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  const firstName = session?.user?.name?.split(" ")[0] ?? "";

  const streakText =
    data && data.currentStreak > 0
      ? t("streakInfo", { count: data.currentStreak })
      : t("noStreak");

  return (
    <div className="bg-zellige">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("welcomeBack", { name: firstName })}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <MaterialIcon
                name="local_fire_department"
                className="text-accent text-base"
              />
              {streakText}
            </p>
          </div>
        </div>

        <DashboardStatCards
          signsLearned={data?.signsLearned ?? 0}
          totalSigns={data?.totalSigns ?? 0}
          currentStreak={data?.currentStreak ?? 0}
          bestStreak={data?.bestStreak ?? 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <ProgressOverview categoryProgress={data?.categoryProgress ?? []} />
          <Achievements achievements={data?.achievements ?? []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <QuizHistory results={quizHistory} />
          <ActivityFeed activities={data?.recentActivities ?? []} />
        </div>
      </div>
    </div>
  );
}
