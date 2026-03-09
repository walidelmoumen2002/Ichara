import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex grow items-center justify-center px-4 py-20">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-6">
          <MaterialIcon name="search_off" className="text-5xl" />
        </div>
        <p className="text-7xl font-black text-foreground mb-2">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("title")}</h1>
        <p className="text-muted-foreground mb-8 max-w-md">{t("description")}</p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <MaterialIcon name="home" className="text-lg me-1" />
              {t("backHome")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
