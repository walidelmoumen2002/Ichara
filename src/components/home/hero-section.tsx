import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/shared/material-icon";
import { StatCard } from "@/components/shared/stat-card";

export function HeroSection() {
  const t = useTranslations("Hero");
  const tStats = useTranslations("Stats");

  const landingStats = [
    { value: "+200", label: tStats("signsAvailable"), icon: "sign_language" },
    { value: "+1,500", label: tStats("activeLearners"), icon: "groups" },
    { value: "4", label: tStats("supportedLanguages"), icon: "translate" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-[#1a3c2f] to-[#1e4a36] py-20 lg:py-28">
      <div className="absolute inset-0 opacity-10 bg-zellige mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 start-0 -ms-20 -mt-20 h-[500px] w-[500px] rounded-full bg-primary blur-3xl opacity-20" />
      <div className="absolute bottom-0 end-0 -me-20 -mb-20 h-[400px] w-[400px] rounded-full bg-accent blur-3xl opacity-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center lg:text-start lg:flex-row lg:items-start lg:justify-between gap-12">
          <div className="flex flex-col gap-6 max-w-2xl lg:pt-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-accent border border-white/10 backdrop-blur-sm w-fit mx-auto lg:mx-0">
              <MaterialIcon name="auto_awesome" className="text-sm" />
              <span>{t("badge")}</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              {t("titlePart1")}{" "}
              <span className="text-accent">{t("titleHighlight")}</span>
              <br />
              {t("titlePart2")}
            </h1>

            <p className="max-w-lg text-lg text-slate-300 mx-auto lg:mx-0 leading-relaxed">
              {t("description")}
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="group bg-accent hover:bg-[oklch(0.72_0.17_75)] text-slate-900 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-all rounded-xl px-8"
              >
                <span>{t("ctaPrimary")}</span>
                <MaterialIcon
                  name="arrow_forward"
                  className="text-lg transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/40 font-bold rounded-xl px-8"
              >
                <span>{t("ctaSecondary")}</span>
                <MaterialIcon name="menu_book" className="text-sm" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-sm lg:max-w-xs relative z-10 lg:mt-12">
            {landingStats.map((stat, i) => (
              <div
                key={stat.label}
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <StatCard
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
