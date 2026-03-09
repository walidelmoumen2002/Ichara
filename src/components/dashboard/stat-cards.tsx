import { useTranslations } from "next-intl";
import { MaterialIcon } from "@/components/shared/material-icon";

interface StatCardsProps {
  signsLearned: number;
  totalSigns: number;
  currentStreak: number;
  bestStreak: number;
}

export function DashboardStatCards({ signsLearned, totalSigns, currentStreak, bestStreak }: StatCardsProps) {
  const t = useTranslations("Dashboard");

  const progress = totalSigns > 0 ? Math.round((signsLearned / totalSigns) * 100) : 0;

  const stats = [
    {
      label: t("signsLearnedLabel"),
      value: t("signsLearnedOf", { learned: signsLearned, total: totalSigns }),
      icon: "sign_language",
      change: t("progressPercent", { percent: progress }),
      changePositive: signsLearned > 0,
    },
    {
      label: t("streakLabel"),
      value: t("streakDays", { count: currentStreak }),
      icon: "local_fire_department",
      change: t("bestStreak", { count: bestStreak }),
      changePositive: currentStreak > 0,
    },
    {
      label: t("totalSignsLabel"),
      value: String(totalSigns),
      icon: "dictionary",
      change: "",
      changePositive: false,
    },
    {
      label: t("progressLabel"),
      value: t("progressPercent", { percent: progress }),
      icon: "trending_up",
      change: "",
      changePositive: progress > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MaterialIcon name={stat.icon} className="text-xl" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          {stat.change && (
            <p className={`text-xs mt-2 font-medium ${stat.changePositive ? "text-green-600" : "text-muted-foreground"}`}>
              {stat.change}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
