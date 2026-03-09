import { useTranslations } from "next-intl";
import { SignCard } from "@/components/shared/sign-card";
import type { Sign } from "@/types/sign";

interface SignGridProps {
  signs: Sign[];
}

export function SignGrid({ signs }: SignGridProps) {
  const t = useTranslations("Dictionary");

  if (signs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">
          {t("noResults")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {signs.map((sign) => (
        <SignCard key={sign.id} sign={sign} variant="dictionary" />
      ))}
    </div>
  );
}
