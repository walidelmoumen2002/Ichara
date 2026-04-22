import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/shared/material-icon";
import { AnimatedHand } from "@/components/shared/animated-hand";

const FLOATERS = [
  { word: "مرحبا", emoji: "👋", style: "top-[6%] start-[2%]", delay: "0s" },
  { word: "شكراً", emoji: "🤲", style: "top-[2%] end-[4%]", delay: "0.4s" },
  { word: "أحبك", emoji: "🤟", style: "bottom-[18%] start-[-2%]", delay: "0.8s" },
  { word: "نعم", emoji: "👍", style: "bottom-[14%] end-[0%]", delay: "0.2s" },
];

export function HeroSection() {
  const t = useTranslations("Hero");
  const tStats = useTranslations("Stats");

  const stats = [
    { value: "200+", label: tStats("signsAvailable"), icon: "sign_language" },
    { value: "1,500+", label: tStats("activeLearners"), icon: "groups" },
    { value: "4", label: tStats("supportedLanguages"), icon: "translate" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-linear-to-br from-[#0a1a10] via-[#1a3c2f] to-[#0f2d1f] py-20 lg:py-28">
      <div className="absolute inset-0 opacity-15 bg-zellige pointer-events-none" />
      <div className="absolute -top-24 -start-24 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(45,108,80,0.35)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-20 -end-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.2)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="ichara-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5">
              <MaterialIcon name="auto_awesome" className="text-sm text-accent" />
              <span className="text-[12px] font-bold uppercase tracking-widest text-accent">
                {t("badge")}
              </span>
            </div>

            <h1 className="mb-5 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("titlePart1")}{" "}
              <span className="bg-linear-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
              <br />
              <span className="text-white/80">{t("titlePart2")}</span>
            </h1>

            <p className="mb-9 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
              {t("description")}
            </p>

            <div className="flex flex-wrap gap-3.5">
              <Button
                size="lg"
                asChild
                className="group rounded-xl bg-linear-to-br from-amber-500 to-amber-600 px-8 text-[15px] font-extrabold text-slate-900 shadow-[0_4px_16px_rgba(245,158,11,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,158,11,0.55)]"
              >
                <Link href="/lessons">
                  <MaterialIcon name="play_circle" className="text-xl" />
                  {t("ctaPrimary")}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl border-2 border-white/25 bg-white/5 px-8 text-[15px] font-bold text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/10 hover:text-white"
              >
                <Link href="/dictionary">
                  <MaterialIcon name="menu_book" className="text-lg" />
                  {t("ctaSecondary")}
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/40">
                    <MaterialIcon name={s.icon} className="text-base text-accent" />
                  </div>
                  <div>
                    <div className="text-xl font-black leading-none text-white">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[11px] text-white/50">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative flex min-h-[380px] items-center justify-center ichara-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="absolute h-80 w-80 rounded-full border border-dashed border-accent/20 ichara-orbit" />
            <div className="absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(45,108,80,0.5)_0%,transparent_75%)]" />

            <div className="relative z-10 ichara-float">
              <AnimatedHand size={240} />
            </div>

            {FLOATERS.map((f) => (
              <div
                key={f.word}
                className={`absolute z-20 flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-md ichara-float ${f.style}`}
                style={{ animationDelay: f.delay }}
              >
                <span className="text-lg">{f.emoji}</span>
                <span className="text-sm font-bold text-white">{f.word}</span>
              </div>
            ))}

            <div className="absolute bottom-0 start-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-linear-to-br from-amber-500 to-amber-600 px-5 py-2 shadow-[0_4px_20px_rgba(245,158,11,0.5)] rtl:translate-x-1/2">
              <MaterialIcon name="verified" className="text-base text-[#0a1a10]" />
              <span className="text-[13px] font-extrabold text-[#0a1a10]">
                {t("heroPill")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-px start-0 end-0">
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block h-[60px] w-full fill-background"
        >
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
