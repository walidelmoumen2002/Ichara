import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Badge } from "@/components/ui/badge";
import type { Sign } from "@/types/sign";
import { cn } from "@/lib/utils";

interface SignCardProps {
  sign: Sign;
  variant?: "home" | "dictionary";
}

const difficultyStyles = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
};

export function SignCard({ sign, variant = "home" }: SignCardProps) {
  const t = useTranslations("SignCard");
  const tCat = useTranslations("Categories");
  const tDict = useTranslations("Dictionary");
  const locale = useLocale();

  if (variant === "dictionary") {
    return (
      <SignCardDictionary
        sign={sign}
        categoryLabel={tCat(sign.category)}
        difficultyLabel={tDict("difficulty")}
        locale={locale}
      />
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/40 cursor-pointer">
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-10">
          <MaterialIcon name="play_circle" className="text-white text-4xl drop-shadow-md" />
        </div>
        <Image src={sign.thumbnail} alt={`${sign.wordAr} - ${sign.word}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
        <div className="absolute bottom-2 end-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
          {sign.videoDuration}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={difficultyStyles[sign.difficulty]}>
            {t(sign.difficulty)}
          </Badge>
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("h-2 w-2 rounded-full", i <= sign.difficultyStars ? "bg-accent" : "bg-muted")} />
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-foreground">{locale === "ar" ? sign.wordAr : sign.word}</h3>
          <span className="text-sm text-muted-foreground">{sign.wordFr}</span>
        </div>
      </div>
    </div>
  );
}

function SignCardDictionary({ sign, categoryLabel, locale, difficultyLabel }: { sign: Sign; categoryLabel: string; locale: string; difficultyLabel: string }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-sm border border-border transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image src={sign.thumbnail} alt={`${sign.wordAr} - ${sign.word}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
        <div className="absolute top-2 end-2 rounded bg-white/90 px-2 py-0.5 text-xs font-bold text-primary backdrop-blur">
          {categoryLabel}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <MaterialIcon name="play_circle" className="text-white text-5xl drop-shadow-lg" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {locale === "ar" ? sign.wordAr : sign.word}
            </h3>
            <span className="text-sm text-muted-foreground font-sans">{sign.wordFr}</span>
          </div>
          <div className="flex flex-col items-end gap-0.5" title={difficultyLabel}>
            <div className="flex gap-0.5 text-accent">
              {[1, 2, 3].map((i) => (
                <MaterialIcon key={i} name="star" className="text-sm" filled={i <= sign.difficultyStars} />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">{difficultyLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
