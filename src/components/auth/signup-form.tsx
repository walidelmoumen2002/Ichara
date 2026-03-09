"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { signupAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MaterialIcon } from "@/components/shared/material-icon";

export function SignupForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      const result = await signupAction(formData);
      if (result?.success) {
        router.push("/dashboard");
        router.refresh();
        return undefined;
      }
      return result;
    },
    undefined
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white mb-2">
          <MaterialIcon name="sign_language" className="text-2xl" />
        </div>
        <CardTitle className="text-2xl">{t("signupTitle")}</CardTitle>
        <CardDescription>{t("signupDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {t(state.error)}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">{t("fullName")}</Label>
            <Input id="name" name="name" type="text" placeholder={t("fullNamePlaceholder")} required autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" name="password" type="password" placeholder={t("minCharsPlaceholder")} required minLength={6} autoComplete="new-password" />
          </div>
          <Button type="submit" className="w-full font-bold" disabled={isPending}>
            {isPending ? t("signupPending") : t("signupButton")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            {t("loginLink")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
