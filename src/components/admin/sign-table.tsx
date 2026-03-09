"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { deleteSign } from "@/lib/actions/signs";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/shared/material-icon";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Badge } from "@/components/ui/badge";
import type { Sign } from "@/types/sign";

interface SignTableProps {
  signs: Sign[];
}

export function SignTable({ signs }: SignTableProps) {
  const t = useTranslations("Admin");

  if (signs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MaterialIcon name="sign_language" className="text-4xl mb-2" />
        <p>{t("noSigns")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thumbnail")}</th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("word")}</th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("wordAr")}</th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("category")}</th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("difficulty")}</th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {signs.map((sign) => (
              <tr key={sign.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative h-10 w-16 rounded overflow-hidden bg-muted">
                    <Image src={sign.thumbnail} alt={sign.word} fill className="object-cover" unoptimized />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{sign.word}</td>
                <td className="px-4 py-3 text-foreground" dir="rtl">{sign.wordAr}</td>
                <td className="px-4 py-3 text-muted-foreground">{sign.category}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{sign.difficulty}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/signs/${sign.id}/edit`}>
                        <MaterialIcon name="edit" className="text-lg" />
                      </Link>
                    </Button>
                    <DeleteDialog
                      description={t("deleteSignConfirm")}
                      onConfirm={() => deleteSign(sign.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
