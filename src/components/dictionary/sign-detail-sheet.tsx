"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Category } from "@/types/category";
import type { Sign } from "@/types/sign";

interface SignDetailSheetProps {
  sign: Sign | null;
  categories: Category[];
  onOpenChange: (open: boolean) => void;
}

const difficultyStyles = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
};

function canPreviewInline(url: string): boolean {
  return url.startsWith("/");
}

export function SignDetailSheet({
  sign,
  categories,
  onOpenChange,
}: SignDetailSheetProps) {
  const locale = useLocale();
  const tLessons = useTranslations("Lessons");
  const tCard = useTranslations("SignCard");

  if (!sign) {
    return <Sheet open={false} onOpenChange={onOpenChange} />;
  }

  const category = categories.find((item) => item.id === sign.category);
  const categoryLabel = category
    ? locale === "ar"
      ? category.labelAr
      : category.labelEn
    : sign.category;
  const inlinePreview = canPreviewInline(sign.videoUrl);

  return (
    <Sheet open={!!sign} onOpenChange={onOpenChange}>
      <SheetContent
        side={locale === "ar" ? "left" : "right"}
        className="w-full overflow-y-auto sm:max-w-2xl"
      >
        <SheetHeader className="pe-12">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {categoryLabel}
            </Badge>
            <Badge className={difficultyStyles[sign.difficulty]}>
              {tCard(sign.difficulty)}
            </Badge>
          </div>
          <SheetTitle className="text-2xl font-black">
            {locale === "ar" ? sign.wordAr : sign.word}
          </SheetTitle>
          <SheetDescription className="text-base">
            {locale === "ar" ? sign.word : sign.wordAr} - {sign.wordFr}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-muted">
            <div className="relative aspect-video w-full">
              <Image
                src={inlinePreview ? sign.videoUrl : sign.thumbnail}
                alt={`${sign.wordAr} - ${sign.word}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MaterialIcon
                name="schedule"
                className="text-base text-primary"
              />
              <span>{sign.videoDuration}</span>
            </div>
            <div className="flex items-center gap-1 text-accent">
              {[1, 2, 3].map((value) => (
                <MaterialIcon
                  key={value}
                  name="star"
                  className="text-base"
                  filled={value <= sign.difficultyStars}
                />
              ))}
            </div>
          </div>

          {!inlinePreview && sign.videoUrl && sign.videoUrl !== "#" && (
            <Button asChild className="w-full font-bold">
              <a href={sign.videoUrl} target="_blank" rel="noopener noreferrer">
                <MaterialIcon name="play_arrow" className="me-1 text-lg" />
                {tLessons("watchVideo")}
              </a>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
