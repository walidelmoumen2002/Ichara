"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createSign, updateSign } from "@/lib/actions/signs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Sign } from "@/types/sign";
import type { Category } from "@/types/category";

interface SignFormProps {
  sign?: Sign;
  categories: Category[];
}

export function SignForm({ sign, categories }: SignFormProps) {
  const t = useTranslations("Admin");
  const router = useRouter();

  const [, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = sign
        ? await updateSign(sign.id, formData)
        : await createSign(formData);

      if ("success" in result && result.success) {
        router.push("/admin/signs");
        return null;
      }
      return result;
    },
    null
  );

  const realCategories = categories.filter((c) => c.id !== "all");

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="word">{t("word")}</Label>
          <Input id="word" name="word" defaultValue={sign?.word} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wordAr">{t("wordAr")}</Label>
          <Input id="wordAr" name="wordAr" defaultValue={sign?.wordAr} required dir="rtl" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="wordFr">{t("wordFr")}</Label>
          <Input id="wordFr" name="wordFr" defaultValue={sign?.wordFr} required />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">{t("category")}</Label>
          <select
            id="category"
            name="category"
            defaultValue={sign?.category ?? ""}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>{t("selectCategory")}</option>
            {realCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.labelEn} / {cat.labelAr}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">{t("difficulty")}</Label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={sign?.difficulty ?? ""}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>{t("selectDifficulty")}</option>
            <option value="beginner">{t("beginner")}</option>
            <option value="intermediate">{t("intermediate")}</option>
            <option value="advanced">{t("advanced")}</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">{t("thumbnail")}</Label>
        <Input id="thumbnail" name="thumbnail" type="url" defaultValue={sign?.thumbnail} placeholder={t("thumbnailPlaceholder")} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="videoUrl">{t("videoUrl")}</Label>
          <Input id="videoUrl" name="videoUrl" type="url" defaultValue={sign?.videoUrl} placeholder={t("videoUrlPlaceholder")} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoDuration">{t("videoDuration")}</Label>
          <Input id="videoDuration" name="videoDuration" defaultValue={sign?.videoDuration} placeholder={t("videoDurationPlaceholder")} required />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? t("saving") : t("save")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/signs")}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
