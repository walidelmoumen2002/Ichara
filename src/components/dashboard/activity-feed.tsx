import { useTranslations, useLocale } from "next-intl";
import { MaterialIcon } from "@/components/shared/material-icon";
import type { Activity } from "@/lib/progress";

interface ActivityFeedProps {
  activities: Activity[];
}

function formatTimeAgo(timestamp: string, t: ReturnType<typeof useTranslations>): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return t("justNow");
  if (diffMin < 60) return t("minutesAgo", { count: diffMin });
  if (diffHr < 24) return t("hoursAgo", { count: diffHr });
  return t("daysAgo", { count: diffDay });
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <MaterialIcon name="history" className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">{t("activityTitle")}</h2>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">{t("noActivity")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <MaterialIcon name="history" className="text-primary" />
        <h2 className="text-xl font-bold text-foreground">{t("activityTitle")}</h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const icon = activity.type === "learned_sign" ? "sign_language" : "local_fire_department";
          const word = locale === "ar" ? activity.signWordAr : activity.signWord;
          const text =
            activity.type === "learned_sign"
              ? t("activityLearnedSign", { word: word ?? "" })
              : t("activityStreakMilestone", { count: activity.milestone ?? 0 });
          const timeAgo = formatTimeAgo(activity.timestamp as unknown as string, t);

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MaterialIcon name={icon} className="text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
