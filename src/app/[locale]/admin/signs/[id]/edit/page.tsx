import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSignById } from "@/lib/actions/signs";
import { getCategories } from "@/lib/actions/categories";
import { SignForm } from "@/components/admin/sign-form";

export default async function EditSignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("Admin");
  const [sign, categories] = await Promise.all([
    getSignById(id),
    getCategories(),
  ]);

  if (!sign) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-foreground">{t("editSign")}</h1>
      <SignForm sign={sign} categories={categories} />
    </div>
  );
}
