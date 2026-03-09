import { useTranslations } from "next-intl";
import { MaterialIcon } from "@/components/shared/material-icon";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const t = useTranslations("Dictionary");

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 inset-e-0 flex items-center pe-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
        <MaterialIcon name="search" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full h-12 rounded-xl border-border bg-card py-3 pe-10 ps-4 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all"
        placeholder={t("searchPlaceholder")}
      />
    </div>
  );
}
