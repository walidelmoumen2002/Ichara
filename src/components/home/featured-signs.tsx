import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MaterialIcon } from "@/components/shared/material-icon";
import { SignCard } from "@/components/shared/sign-card";
import type { Sign } from "@/types/sign";

interface FeaturedSignsProps {
  signs: Sign[];
}

export function FeaturedSigns({ signs }: FeaturedSignsProps) {
  const t = useTranslations("FeaturedSigns");

  return (
    <section className="bg-card py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/dictionary"
            className="group flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
          >
            {t("viewAll")}
            <MaterialIcon
              name="arrow_forward"
              className="text-lg transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {signs.map((sign) => (
            <SignCard key={sign.id} sign={sign} variant="home" />
          ))}
        </div>
      </div>
    </section>
  );
}
