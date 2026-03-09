"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { markSignAsLearned, fetchLearnedSignIds } from "@/lib/actions/progress";
import type { Sign } from "@/types/sign";
import type { Category } from "@/types/category";

const difficultyStyles = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
};

interface LessonDetailClientProps {
  categoryId: string;
  allSigns: Sign[];
  categories: Category[];
}

export function LessonDetailClient({
  categoryId,
  allSigns,
  categories,
}: LessonDetailClientProps) {
  const t = useTranslations("Lessons");
  const tCard = useTranslations("SignCard");
  const locale = useLocale();

  const category = categories.find((c) => c.id === categoryId);
  const signs = allSigns.filter((s) => s.category === categoryId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchLearnedSignIds().then((ids) => setLearnedIds(new Set(ids)));
  }, []);

  function handleMarkLearned(signId: string) {
    startTransition(async () => {
      const result = await markSignAsLearned(signId);
      if (result?.success) {
        setLearnedIds((prev) => new Set(prev).add(signId));
      }
    });
  }

  if (!category || signs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <MaterialIcon name="search_off" className="text-5xl text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">{t("noSignsInCategory")}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/lessons">
            <MaterialIcon name="arrow_back" className="text-base me-1 rtl:rotate-180" />
            {t("backToLessons")}
          </Link>
        </Button>
      </div>
    );
  }

  const activeSign = signs[activeIndex];
  const categoryLabel = locale === "ar" ? category.labelAr : category.labelEn;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/lessons">
            <MaterialIcon name="arrow_back" className="text-xl rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">{categoryLabel}</h1>
          <p className="text-sm text-muted-foreground">
            {t("lessonProgress", { current: activeIndex + 1, total: signs.length })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content — active sign */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video / Thumbnail area */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted border border-border">
            <Image
              src={activeSign.thumbnail}
              alt={activeSign.word}
              fill
              className="object-cover"
              unoptimized
            />
            {activeSign.videoUrl && activeSign.videoUrl !== "#" && (
              <a
                href={activeSign.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              >
                <div className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 font-bold text-primary shadow-lg">
                  <MaterialIcon name="play_arrow" className="text-2xl" />
                  {t("watchVideo")}
                </div>
              </a>
            )}
            <div className="absolute bottom-3 end-3 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
              {activeSign.videoDuration}
            </div>
          </div>

          {/* Sign details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {locale === "ar" ? activeSign.wordAr : activeSign.word}
                </h2>
                <p className="text-muted-foreground">
                  {locale === "ar" ? activeSign.word : activeSign.wordAr} · {activeSign.wordFr}
                </p>
              </div>
              <Badge className={difficultyStyles[activeSign.difficulty]}>
                {tCard(activeSign.difficulty)}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 w-8 rounded-full",
                      i <= activeSign.difficultyStars ? "bg-accent" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              {learnedIds.has(activeSign.id) ? (
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <MaterialIcon name="check_circle" className="text-base" />
                  {t("learned")}
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleMarkLearned(activeSign.id)}
                  disabled={isPending}
                >
                  <MaterialIcon name="school" className="text-base me-1" />
                  {isPending ? t("markingLearned") : t("markLearned")}
                </Button>
              )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
            >
              <MaterialIcon name="arrow_back" className="text-base me-1 rtl:rotate-180" />
              {t("previousSign")}
            </Button>
            <Button
              onClick={() => setActiveIndex(Math.min(signs.length - 1, activeIndex + 1))}
              disabled={activeIndex === signs.length - 1}
            >
              {t("nextSign")}
              <MaterialIcon name="arrow_forward" className="text-base ms-1 rtl:rotate-180" />
            </Button>
          </div>
        </div>

        {/* Sidebar — sign list */}
        <div className="space-y-2">
          {signs.map((sign, i) => (
            <button
              key={sign.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg p-3 text-start transition-colors",
                i === activeIndex
                  ? "bg-primary/10 border border-primary/30"
                  : "border border-transparent hover:bg-muted"
              )}
            >
              <div className="relative h-12 w-16 rounded overflow-hidden bg-muted shrink-0">
                <Image src={sign.thumbnail} alt={sign.word} fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0">
                <p className={cn("text-sm font-medium truncate", i === activeIndex ? "text-primary" : "text-foreground")}>
                  {locale === "ar" ? sign.wordAr : sign.word}
                </p>
                <p className="text-xs text-muted-foreground">{sign.videoDuration}</p>
              </div>
              {learnedIds.has(sign.id) && (
                <MaterialIcon name="check_circle" className="text-green-600 text-lg ms-auto shrink-0" />
              )}
              {i === activeIndex && !learnedIds.has(sign.id) && (
                <MaterialIcon name="play_circle" className="text-primary text-lg ms-auto shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
