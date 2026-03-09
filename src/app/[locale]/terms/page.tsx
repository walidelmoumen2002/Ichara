import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("terms.title"),
    description: t("terms.description"),
  };
}

export default async function TermsPage() {
  const t = await getTranslations("Terms");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-foreground mb-2">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
      </div>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("acceptTitle")}</h2>
          <p>{t("acceptText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("accountTitle")}</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>{t("accountItem1")}</li>
            <li>{t("accountItem2")}</li>
            <li>{t("accountItem3")}</li>
            <li>{t("accountItem4")}</li>
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
          <h2 className="text-xl font-bold text-foreground mb-2">{t("contentTitle")}</h2>
          <p>{t("contentText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("disclaimerTitle")}</h2>
          <p>{t("disclaimerText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">{t("terminationTitle")}</h2>
          <p>{t("terminationText")}</p>
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
