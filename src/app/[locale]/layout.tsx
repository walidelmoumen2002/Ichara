import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { plusJakartaSans, notoSansArabic } from "@/lib/fonts";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { auth } from "@/lib/auth";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("home.title"),
    description: t("home.description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const session = await auth();
  const isRtl = locale === "ar";

  return (
    <div
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${plusJakartaSans.variable} ${notoSansArabic.variable} ${isRtl ? "font-arabic" : "font-sans"} antialiased flex min-h-screen flex-col`}
    >
      <AuthSessionProvider session={session}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main className="grow flex flex-col">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </AuthSessionProvider>
    </div>
  );
}
