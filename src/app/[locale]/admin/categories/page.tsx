import { getTranslations } from "next-intl/server";
import { getCategories } from "@/lib/actions/categories";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryTable } from "@/components/admin/category-table";

export default async function AdminCategoriesPage() {
  const t = await getTranslations("Admin");
  const categories = await getCategories();

  // Filter out "all" for display
  const realCategories = categories.filter((c) => c.id !== "all");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-foreground">{t("categoriesTitle")}</h1>
      <CategoryForm />
      <CategoryTable categories={realCategories} />
    </div>
  );
}
