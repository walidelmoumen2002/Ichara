import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSigns } from "@/lib/actions/signs";
import { getCategories } from "@/lib/actions/categories";
import { getUsers } from "@/lib/users";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Button } from "@/components/ui/button";

export default async function AdminOverviewPage() {
  const t = await getTranslations("Admin");
  const [signs, categories, users] = await Promise.all([getSigns(), getCategories(), getUsers()]);

  // Exclude "all" from category count
  const realCategories = categories.filter((c) => c.id !== "all");

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-foreground">{t("overviewTitle")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MaterialIcon name="sign_language" className="text-xl" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{t("totalSigns")}</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{signs.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <MaterialIcon name="category" className="text-xl" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{t("totalCategories")}</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{realCategories.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MaterialIcon name="group" className="text-xl" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{t("totalUsers")}</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{users.length}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">{t("quickActions")}</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/signs/new">
              <MaterialIcon name="add" className="text-lg me-1" />
              {t("addNewSign")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/categories">
              <MaterialIcon name="category" className="text-lg me-1" />
              {t("manageCategories")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              <MaterialIcon name="group" className="text-lg me-1" />
              {t("manageUsers")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
