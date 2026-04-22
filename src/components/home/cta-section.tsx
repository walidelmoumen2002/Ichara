import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/shared/material-icon";

export function CTASection() {
  const t = useTranslations("CTA");

  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-linear-to-br from-[#1a3c2f] via-[#2d6c50] to-[#1e4a36]">
        <div className="absolute inset-0 bg-zellige opacity-20 pointer-events-none" />
        <div className="pointer-events-none absolute -top-10 -end-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.25)_0%,transparent_70%)]" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-8 px-10 py-14 sm:px-14 sm:py-16">
          <div className="max-w-xl">
            <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-[38px]">
              {t("titlePart1")}
              <br />
              <span className="text-amber-300">{t("titleHighlight")}</span>
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-white/70">
              {t("description")}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3.5">
            <Button
              size="lg"
              asChild
              className="rounded-xl bg-linear-to-br from-amber-500 to-amber-600 px-9 text-base font-extrabold text-slate-900 shadow-[0_4px_16px_rgba(245,158,11,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,158,11,0.55)]"
            >
              <Link href="/lessons">
                <MaterialIcon name="rocket_launch" className="text-xl" />
                {t("button")}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="justify-center rounded-xl border-2 border-white/25 bg-white/5 text-[15px] font-bold text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              <Link href="/dictionary">
                <MaterialIcon name="menu_book" className="text-base" />
                {t("secondaryButton")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
