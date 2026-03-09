"use client";

import { useTranslations } from "next-intl";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Badge } from "@/components/ui/badge";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

interface UserTableProps {
  users: UserRow[];
}

export function UserTable({ users }: UserTableProps) {
  const t = useTranslations("Admin");

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MaterialIcon name="group" className="text-4xl mb-2" />
        <p>{t("noUsers")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                {t("userName")}
              </th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                {t("userEmail")}
              </th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                {t("userRole")}
              </th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                {t("userJoined")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">
                  {user.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role === "admin" ? t("roleAdmin") : t("roleUser")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
