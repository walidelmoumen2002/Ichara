"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { MaterialIcon } from "@/components/shared/material-icon";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: "dashboard", labelKey: "overview" as const },
  { href: "/admin/signs", icon: "sign_language", labelKey: "signs" as const },
  { href: "/admin/categories", icon: "category", labelKey: "categories" as const },
  { href: "/admin/users", icon: "group", labelKey: "users" as const },
];

export function AdminSidebar() {
  const t = useTranslations("Admin");
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-e border-border bg-card p-4 gap-1">
      <div className="flex items-center gap-2 px-3 py-2 mb-4">
        <MaterialIcon name="admin_panel_settings" className="text-primary text-xl" />
        <h2 className="font-bold text-foreground">{t("sidebarTitle")}</h2>
      </div>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <MaterialIcon name={item.icon} className="text-lg" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </aside>
  );
}
