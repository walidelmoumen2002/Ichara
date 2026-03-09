import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const t = useTranslations("CTA");

  return (
    <section className="py-16 px-4 bg-primary text-white relative overflow-hidden">
      <div className="absolute start-0 top-0 h-full w-1/3 bg-zellige opacity-10 mix-blend-soft-light" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          {t("description")}
        </p>
        <Button
          size="lg"
          className="bg-accent hover:bg-[oklch(0.72_0.17_75)] text-slate-900 font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1 px-8"
        >
          {t("button")}
        </Button>
      </div>
    </section>
  );
}
