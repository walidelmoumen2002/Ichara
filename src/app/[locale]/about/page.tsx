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
    title: t("about.title"),
    description: t("about.description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("About");

  const features = [
    { icon: "school", titleKey: "feature1Title" as const, textKey: "feature1Text" as const },
    { icon: "videocam", titleKey: "feature2Title" as const, textKey: "feature2Text" as const },
    { icon: "trending_up", titleKey: "feature3Title" as const, textKey: "feature3Text" as const },
    { icon: "translate", titleKey: "feature4Title" as const, textKey: "feature4Text" as const },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <MaterialIcon name="sign_language" className="text-4xl" />
        </div>
        <h1 className="text-4xl font-black text-foreground mb-3">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">{t("missionTitle")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("missionText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">{t("whyTitle")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("whyText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">{t("featuresTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.icon} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MaterialIcon name={f.icon} className="text-xl" />
                  </div>
                  <h3 className="font-bold text-foreground">{t(f.titleKey)}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t(f.textKey)}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">{t("openSourceTitle")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("openSourceText")}</p>
          <p className="text-muted-foreground mt-2">
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
