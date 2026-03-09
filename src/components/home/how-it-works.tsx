import { useTranslations } from "next-intl";
import { StepCard } from "@/components/shared/step-card";

export function HowItWorks() {
  const t = useTranslations("HowItWorks");

  const steps = [
    { icon: "play_circle", title: t("step1Title"), description: t("step1Description") },
    { icon: "model_training", title: t("step2Title"), description: t("step2Description") },
    { icon: "verified", title: t("step3Title"), description: t("step3Description") },
  ];

  return (
    <section className="bg-background py-20 bg-zellige relative">
      <div className="absolute top-0 start-0 w-full h-24 bg-gradient-to-b from-background to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <StepCard
              key={step.title}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 start-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
