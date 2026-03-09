import { useTranslations } from "next-intl";
import { MaterialIcon } from "@/components/shared/material-icon";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const t = useTranslations("Dictionary");

  return (
    <div className="w-full sm:w-auto flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {t("sortBy")}
      </span>
      <div className="relative w-full sm:w-48">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none block w-full rounded-lg border-border bg-card py-2 pe-3 ps-8 text-sm font-medium text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="newest">{t("newest")}</option>
          <option value="popular">{t("popular")}</option>
          <option value="difficulty">{t("difficulty")}</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 inset-s-0 flex items-center ps-2 text-muted-foreground">
          <MaterialIcon name="expand_more" className="text-lg" />
        </div>
      </div>
    </div>
  );
}
