import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSigns } from "@/lib/actions/signs";
import { getCategories } from "@/lib/actions/categories";
import { DictionaryClient } from "@/components/dictionary/dictionary-client";

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

export default async function DictionaryPage() {
  const [signs, categories] = await Promise.all([
    getSigns(),
    getCategories(),
  ]);

  return <DictionaryClient signs={signs} categories={categories} />;
}
