import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MaterialIcon } from "@/components/shared/material-icon";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("privacy.title"),
    description: t("privacy.description"),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-foreground mb-2">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
      </div>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("introTitle")}</h2>
          <p>{t("introText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("collectTitle")}</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>{t("collectItem1")}</li>
            <li>{t("collectItem2")}</li>
            <li>{t("collectItem3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("useTitle")}</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>{t("useItem1")}</li>
            <li>{t("useItem2")}</li>
            <li>{t("useItem3")}</li>
            <li>{t("useItem4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("storageTitle")}</h2>
          <p>{t("storageText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("cookiesTitle")}</h2>
          <p>{t("cookiesText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("rightsTitle")}</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>{t("rightsItem1")}</li>
            <li>{t("rightsItem2")}</li>
            <li>{t("rightsItem3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("changesTitle")}</h2>
          <p>{t("changesText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("contactTitle")}</h2>
          <p>
            {t("contactText")}{" "}
            <a href="mailto:contact@ichara.ma" className="text-primary font-medium hover:underline">
              contact@ichara.ma
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
