import { getTranslations } from "next-intl/server";
import { getUsers } from "@/lib/users";
import { UserTable } from "@/components/admin/user-table";

export default async function AdminUsersPage() {
  const t = await getTranslations("Admin");
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-foreground">{t("usersTitle")}</h1>
      <UserTable
        users={users.map((u) => ({
          ...u,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
