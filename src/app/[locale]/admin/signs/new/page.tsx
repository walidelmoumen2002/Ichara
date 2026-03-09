import { getTranslations } from "next-intl/server";
import { getCategories } from "@/lib/actions/categories";
import { SignForm } from "@/components/admin/sign-form";

export default async function NewSignPage() {
  const t = await getTranslations("Admin");
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-foreground">{t("newSign")}</h1>
      <SignForm categories={categories} />
    </div>
  );
}
