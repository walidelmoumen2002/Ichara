import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { MaterialIcon } from "@/components/shared/material-icon";

interface CategoryProgress {
  categoryId: string;
  learned: number;
  total: number;
  progress: number;
}

interface ProgressOverviewProps {
  categoryProgress: CategoryProgress[];
}

export function ProgressOverview({ categoryProgress }: ProgressOverviewProps) {
  const t = useTranslations("Dashboard");
  const tCat = useTranslations("Categories");

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <MaterialIcon name="trending_up" className="text-primary" />
        <h2 className="text-xl font-bold text-foreground">{t("progressTitle")}</h2>
      </div>
      <div className="space-y-5">
        {categoryProgress.map((item) => (
          <div key={item.categoryId}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{tCat(item.categoryId)}</span>
              <span className="text-sm text-muted-foreground">
                {item.learned}/{item.total} {t("signUnit")}
              </span>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
