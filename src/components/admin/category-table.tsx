"use client";

import { useTranslations } from "next-intl";
import { deleteCategory } from "@/lib/actions/categories";
import { MaterialIcon } from "@/components/shared/material-icon";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import type { Category } from "@/types/category";

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const t = useTranslations("Admin");

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MaterialIcon name="category" className="text-4xl mb-2" />
        <p>{t("noCategories")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("categoryId")}</th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("labelEn")}</th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("labelAr")}</th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{cat.id}</td>
                <td className="px-4 py-3 text-foreground">{cat.labelEn}</td>
                <td className="px-4 py-3 text-foreground" dir="rtl">{cat.labelAr}</td>
                <td className="px-4 py-3">
                  <DeleteDialog
                    description={t("deleteCategoryConfirm")}
                    onConfirm={() => deleteCategory(cat.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
