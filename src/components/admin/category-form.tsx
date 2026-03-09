"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createCategory } from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaterialIcon } from "@/components/shared/material-icon";

export function CategoryForm() {
  const t = useTranslations("Admin");

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await createCategory(formData);
      if ("error" in result) return result;
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <MaterialIcon name="add_circle" className="text-primary" />
        {t("addCategory")}
      </h3>
      {state?.error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
          {t(state.error)}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="id" className="text-xs">{t("categoryId")}</Label>
          <Input id="id" name="id" placeholder={t("categoryIdPlaceholder")} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="labelEn" className="text-xs">{t("labelEn")}</Label>
          <Input id="labelEn" name="labelEn" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="labelAr" className="text-xs">{t("labelAr")}</Label>
          <Input id="labelAr" name="labelAr" required dir="rtl" />
        </div>
      </div>
      <Button type="submit" size="sm" className="mt-3" disabled={isPending}>
        {isPending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
