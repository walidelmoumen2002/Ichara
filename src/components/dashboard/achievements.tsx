import { useTranslations } from "next-intl";
import { MaterialIcon } from "@/components/shared/material-icon";
import { cn } from "@/lib/utils";

interface AchievementData {
  id: string;
  unlocked: boolean;
}

interface AchievementsProps {
  achievements: AchievementData[];
}

const achievementMeta: Record<string, { icon: string; titleKey: string; descKey: string }> = {
  "first-sign": { icon: "emoji_events", titleKey: "achFirstSign", descKey: "achFirstSignDesc" },
  "streak-7": { icon: "local_fire_department", titleKey: "achStreak7", descKey: "achStreak7Desc" },
  "five-signs": { icon: "school", titleKey: "achFiveSigns", descKey: "achFiveSignsDesc" },
  "category-complete": { icon: "workspace_premium", titleKey: "achCategoryExpert", descKey: "achCategoryExpertDesc" },
  "streak-30": { icon: "bolt", titleKey: "achStreak30", descKey: "achStreak30Desc" },
  "all-signs": { icon: "military_tech", titleKey: "achAllSigns", descKey: "achAllSignsDesc" },
};

export function Achievements({ achievements }: AchievementsProps) {
  const t = useTranslations("Dashboard");

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <MaterialIcon name="emoji_events" className="text-accent" />
        <h2 className="text-xl font-bold text-foreground">{t("achievementsTitle")}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {achievements.map((a) => {
          const meta = achievementMeta[a.id];
          if (!meta) return null;
          return (
            <div
              key={a.id}
              className={cn(
                "flex flex-col items-center rounded-lg p-4 text-center transition-all",
                a.unlocked
                  ? "bg-accent/10 border border-accent/20"
                  : "bg-muted/50 border border-border opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full mb-2",
                  a.unlocked ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                )}
              >
                <MaterialIcon name={meta.icon} className="text-2xl" />
              </div>
              <p className="text-sm font-bold text-foreground">{t(meta.titleKey)}</p>
              <p className="text-xs text-muted-foreground mt-1">{t(meta.descKey)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
