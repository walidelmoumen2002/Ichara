import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  icon: string;
}

export function ComingSoon({ icon }: ComingSoonProps) {
  const t = useTranslations("ComingSoon");

  return (
    <div className="flex grow items-center justify-center px-4 py-20">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
          <MaterialIcon name={icon} className="text-5xl" />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-2">{t("title")}</h1>
        <p className="text-muted-foreground mb-8 max-w-md">{t("description")}</p>
        <Button asChild>
          <Link href="/">
            <MaterialIcon name="home" className="text-lg me-1" />
            {t("backHome")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
