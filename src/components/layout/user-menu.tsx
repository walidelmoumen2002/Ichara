"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaterialIcon } from "@/components/shared/material-icon";

export function UserMenu() {
  const { data: session, status } = useSession();
  const t = useTranslations("UserMenu");

  if (status === "loading") {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />;
  }

  if (!session?.user) {
    return (
      <>
        <Button
          variant="ghost"
          className="hidden sm:flex font-bold"
          asChild
        >
          <Link href="/login">{t("login")}</Link>
        </Button>
        <Button className="font-bold" asChild>
          <Link href="/signup">{t("startFree")}</Link>
        </Button>
      </>
    );
  }

  const initials =
    session.user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8 border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{session.user.name}</span>
            <span className="text-xs text-muted-foreground">
              {session.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer">
              <MaterialIcon name="dashboard" className="text-base me-2" />
              {t("dashboard")}
            </Link>
          </DropdownMenuItem>
          {session.user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <MaterialIcon name="admin_panel_settings" className="text-base me-2" />
                {t("admin")}
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: window.location.origin })}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <MaterialIcon name="logout" className="text-base me-2" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
