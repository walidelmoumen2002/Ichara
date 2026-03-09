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
    title: t("dictionary.title"),
    description: t("dictionary.description"),
  };
}

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full bg-zellige">{children}</div>;
}
