import { useTranslations } from "next-intl";
import { MaterialIcon } from "@/components/shared/material-icon";

type Step = {
  n: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  hoverBorder: string;
  title: string;
  description: string;
};

export function HowItWorks() {
  const t = useTranslations("HowItWorks");

  const steps: Step[] = [
    {
      n: "01",
      icon: "menu_book",
      iconColor: "text-[#2d6c50]",
      iconBg: "bg-[#e8f5ef]",
      hoverBorder: "hover:border-[#2d6c50]/50",
      title: t("step1Title"),
      description: t("step1Description"),
    },
    {
      n: "02",
      icon: "school",
      iconColor: "text-[#d97706]",
      iconBg: "bg-[#fef3c7]",
      hoverBorder: "hover:border-[#d97706]/50",
      title: t("step2Title"),
      description: t("step2Description"),
    },
    {
      n: "03",
      icon: "sports_esports",
      iconColor: "text-[#7c3aed]",
      iconBg: "bg-[#ede9fe]",
      hoverBorder: "hover:border-[#7c3aed]/50",
      title: t("step3Title"),
      description: t("step3Description"),
    },
  ];

  return (
    <section className="relative bg-background bg-zellige py-24">
      <div className="absolute top-0 start-0 h-16 w-full bg-linear-to-b from-background to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[12px] font-bold uppercase tracking-widest text-primary">
            {t("eyebrow")}
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {t("titleTop")}
            <br />
            <span className="text-primary">{t("titleBottom")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(45,108,80,0.15)] ${step.hoverBorder}`}
            >
              <div
                className={`pointer-events-none absolute -top-2 end-4 select-none text-[80px] font-black leading-none tabular-nums opacity-[0.07] ${step.iconColor}`}
              >
                {step.n}
              </div>

              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${step.iconBg}`}
              >
                <MaterialIcon name={step.icon} className={`text-3xl ${step.iconColor}`} />
              </div>

              <div
                className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${step.iconBg} ${step.iconColor}`}
              >
                {t("stepLabel", { n: step.n })}
              </div>

              <h3 className="mb-2 text-xl font-black leading-tight text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 start-0 h-16 w-full bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
