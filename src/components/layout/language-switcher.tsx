"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/shared/material-icon";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === "ar" ? "en" : "ar";
  const label = locale === "ar" ? "EN" : "عربي";

  function switchLocale() {
    router.replace({ pathname }, { locale: otherLocale });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLocale}
      className="gap-1.5 font-medium"
    >
      <MaterialIcon name="translate" className="text-base" />
      <span>{label}</span>
    </Button>
  );
}
