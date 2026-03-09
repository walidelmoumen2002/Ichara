import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSigns } from "@/lib/actions/signs";
import { SignTable } from "@/components/admin/sign-table";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/shared/material-icon";

export default async function AdminSignsPage() {
  const t = await getTranslations("Admin");
  const signs = await getSigns();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-foreground">{t("signsTitle")}</h1>
        <Button asChild>
          <Link href="/admin/signs/new">
            <MaterialIcon name="add" className="text-lg me-1" />
            {t("newSign")}
          </Link>
        </Button>
      </div>
      <SignTable signs={signs} />
    </div>
  );
}
