import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

interface CategoryFiltersProps {
  categories: Category[];
  activeCategory: string;
  onChange: (categoryId: string) => void;
}

export function CategoryFilters({
  categories,
  activeCategory,
  onChange,
}: CategoryFiltersProps) {
  const locale = useLocale();

  return (
    <div className="flex gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all",
            activeCategory === cat.id
              ? "bg-primary text-white font-bold shadow-sm hover:bg-primary/90"
              : "bg-card border border-border text-foreground hover:border-primary hover:text-primary"
          )}
        >
          {locale === "ar" ? cat.labelAr : cat.labelEn}
        </button>
      ))}
    </div>
  );
}
